var path = require('path');
var webpack = require('webpack');

module.exports = (env, argv) => ({
    //mode: "development",
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
        rules: []
    },
    optimization: {
        removeAvailableModules: true,
        removeEmptyChunks: true,
        mergeDuplicateChunks: true,
        flagIncludedChunks: true,
        occurrenceOrder: true,
        sideEffects: true,
        providedExports: false,
        usedExports: false,
        concatenateModules: false,
        namedModules: false,
        namedChunks: false,
        minimize: false,
        portableRecords: true
    },
    devServer: {
        publicPath: "/dist",
    }
});
