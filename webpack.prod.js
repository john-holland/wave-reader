const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require("path");
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

const config = merge(common, {
    mode: "production",
    devtool: undefined,
    entry: {
        app: path.join(__dirname, "./static/index.js"),
        background: path.join(__dirname, "./static/background.js"),
        content: path.join(__dirname, "./static/content.js"),
        config: path.join(__dirname, "./src/config/config.production.js")
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".jsx", ".*"],
        alias: {
            config: path.join(__dirname, "./src/config/config.production.js"),
            robotcopy: path.join(__dirname, "./src/config/robotcopy.ts")
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'robotcopy': JSON.stringify(require('./src/config/robotcopy.ts'))
        })
    ],
    optimization: {
        usedExports: true,
        sideEffects: true,
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                    compress: {
                        drop_console: true,
                    },
                },
                extractComments: false,
            }),
        ],
        splitChunks: {
            chunks: 'all',
            minSize: 20000,
            minRemainingSize: 0,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            enforceSizeThreshold: 50000,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        // get the name. E.g. node_modules/packageName/not/this/part.js
                        // or node_modules/packageName
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                        // npm package names are URL-safe, but some servers don't like @ symbols
                        return `vendor.${packageName.replace('@', '')}`;
                    },
                },
            },
        }
    },
    output: {
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].chunk.js',
        path: path.resolve(__dirname, 'build'),
        clean: true
    }
});

module.exports = config;
