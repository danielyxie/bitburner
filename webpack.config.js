var path = require('path');
var webpack = require('webpack');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => ({
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': argv.mode === 'development' ? "\"development\"" : "\"production\""
        }),
        // http://stackoverflow.com/questions/29080148/expose-jquery-to-real-window-object-with-webpack
        new webpack.ProvidePlugin({
            // Automtically detect jQuery and $ as free var in modules
            // and inject the jquery library
            // This is required by many jquery plugins
            jquery: "jquery",
            jQuery: "jquery",
            $: "jquery"
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ],
    target: "web",
    entry: {
        "dist/engine": "./src/engine.js",
        "tests/tests": "./tests/index.js",
    },
    devtool: "source-map",
    output: {
        path: path.resolve(__dirname, "./"),
        filename: "[name].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ]
            },
        ]
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
        minimize: argv.mode !== 'development',
        portableRecords: true,
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'dist/vendor',
                    chunks: 'all'
                }
            }
        }
    },
    devServer: {
        publicPath: "/dist",
    },
    resolve: {
        extensions: [
            ".tsx",
            ".ts",
            ".js"
        ]
    }
});
