/**
 * Webpack configuration for building unit tests
 */
/* eslint-disable @typescript-eslint/no-var-requires */
var path = require("path");
var webpack = require("webpack");

module.exports = () => {
  const statsConfig = {
    builtAt: true,
    children: false,
    chunks: false,
    chunkGroups: false,
    chunkModules: false,
    chunkOrigins: false,
    colors: true,
    entrypoints: true,
  };

  return {
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": '"development"',
      }),
      new webpack.ProvidePlugin({
        // Automtically detect jQuery and $ as free var in modules
        // and inject the jquery library
        // This is required by many jquery plugins
        // http://stackoverflow.com/questions/29080148/expose-jquery-to-real-window-object-with-webpack
        jquery: "jquery",
        jQuery: "jquery",
        $: "jquery",
      }),
    ],
    entry: "./test/index.js",
    target: "web",
    devtool: "source-map",
    output: {
      path: path.resolve(__dirname, "./"),
      filename: "test/test.bundle.js",
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.(jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.s?css$/,
          loader: "null-loader",
        },
      ],
    },
    optimization: {
      removeAvailableModules: true,
      removeEmptyChunks: true,
      mergeDuplicateChunks: true,
      flagIncludedChunks: true,
      occurrenceOrder: true,
      sideEffects: true,
      providedExports: true,
      usedExports: true,
      concatenateModules: false,
      namedModules: false,
      namedChunks: false,
      minimize: false,
      portableRecords: true,
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: `tests/vendor`,
            chunks: "all",
          },
        },
      },
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".jsx"],
    },
    stats: statsConfig,
  };
};
