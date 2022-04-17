/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env, argv) => {
  const isDevelopment = argv.mode !== "production";
  const isFastRefresh = argv.fast === "true";

  const devServerSettings = {
    hot: true,
    port: 8000,
  };

  // By default, the webpack-dev-server is not exposed outside of localhost.
  // When running in a container we need it accessible externally.
  if (env.runInContainer) {
    devServerSettings.disableHostCheck = true;
    devServerSettings.host = "0.0.0.0";
    devServerSettings.watchOptions = {
      poll: true,
    };
  }

  // Get the current commit hash to inject into the app
  // https://stackoverflow.com/a/38401256
  const commitHash = require("child_process").execSync("git rev-parse --short HEAD").toString().trim();

  return {
    context: __dirname,
    devServer: devServerSettings,
    devtool: isDevelopment ? false : "source-map",
    entry: "./src/index.tsx",
    mode: "development",
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              plugins: isFastRefresh ? [require.resolve("react-refresh/babel")] : [],
            },
          },
        },
        {
          test: /\.s?css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        },
        {
          test: /\.(png|jpe?g|gif|jp2|webp)$/,
          type: "asset",
        },
      ],
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          // Disable the output of *.LICENSE.txt files.
          extractComments: false,
        }),
      ],
    },
    output: {
      assetModuleFilename: "images/[hash][ext][query]",
      hashDigestLength: 32, // for compatibility
      filename: "main.bundle.js",
    },
    performance: {
      // Stop webpack complaining about file size.
      hints: false,
    },
    plugins: [
      new webpack.DefinePlugin({
        __COMMIT_HASH__: JSON.stringify(commitHash || "DEV"),
      }),
      new HtmlWebpackPlugin({
        title: "Bitburner",
        template: "src/index.html",
        filename: isDevelopment ? "index.html" : "../index.html",
        favicon: "favicon.ico",
        googleAnalytics: {
          trackingId: "UA-100157497-1",
        },
        minify: !isDevelopment && {
          collapseBooleanAttributes: true,
          includeAutoGeneratedTags: false,
          keepClosingSlash: true,
          quoteCharacter: '"',
        },
      }),
      new MiniCssExtractPlugin(),
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          diagnosticOptions: {
            semantic: true,
            syntactic: true,
          },
        },
      }),
      // In dev mode, use a faster method of create sourcemaps
      // while keeping lines/columns accurate
      isDevelopment &&
        new webpack.EvalSourceMapDevToolPlugin({
          // Exclude vendor files from sourcemaps
          // This is a huge speed improvement for not much loss
          exclude: /[\\/]node_modules[\\/]/,
        }),
      isFastRefresh && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean),
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js"],
      fallback: {
        crypto: path.resolve(__dirname, "src/bcryptjs-crypto-fallback.js"),
      },
    },
    target: "web",
  };
};
