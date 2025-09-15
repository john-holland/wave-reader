const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const baseManifest = require("./chrome/manifest.json");
const WebpackExtensionManifestPlugin = require("webpack-extension-manifest-plugin");
// const ESLintPlugin = require('eslint-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

//config: path.join(__dirname, "./src/config/config.common.js")
const config = {
    mode: "development",
    devtool: "source-map",
    entry: {
        app: path.join(__dirname, "./static/index.js"),
        background: path.join(__dirname, "./static/background.js"),
        content: path.join(__dirname, "./static/content.js"),
        shadowContent: path.join(__dirname, "./static/shadow-content.js")
    },
    output: {
        path: path.resolve(__dirname, "./build"),
        filename: "[name].js"
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".jsx", ".*"],
        alias: {
            // Real log-view-machine integration - using local package
            // "log-view-machine": path.resolve(__dirname, "../log-view-machine/dist")
        },
        fallback: {
            "path": require.resolve("path-browserify"),
            "tty": require.resolve("tty-browserify"),
            "util": require.resolve("util/"),
            "fs": false,
            "net": false,
            "stream": require.resolve("stream-browserify"),
            "zlib": require.resolve("browserify-zlib"),
            "querystring": require.resolve("querystring-es3"),
            "url": require.resolve("url/"),
            "http": require.resolve("stream-http"),
            "crypto": require.resolve("crypto-browserify"),
            "vm": require.resolve("vm-browserify"),
            "assert": require.resolve("assert/"),
            "events": require.resolve("events/"),
            "buffer": require.resolve("buffer/"),
            "string_decoder": require.resolve("string_decoder/"),
            "async_hooks": false
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            'config': 'config',
            'process': 'process/browser'
        }),
        new webpack.DefinePlugin({
            'regeneratorRuntime': 'regeneratorRuntime'
        }),
        new HtmlWebpackPlugin({
            title: "boilerplate", // change this to your app title
            meta: {
                charset: "utf-8",
                viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
                "theme-color": "#000000"
            },
            manifest: "manifest.json",
            filename: "index.html",
            template: "./static/index.html",
            hash: true
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].css'
        }),
        new CleanWebpackPlugin(),
        new ForkTsCheckerWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "./chrome/icons"),
                    to: path.resolve(__dirname, "./build/icons")
                },
                {
                    from: path.resolve(__dirname, "./static/receive_eth.jpg"),
                    to: path.resolve(__dirname, "./build/receive_eth.jpg")
                }
            ]
        }),
        new WebpackExtensionManifestPlugin({
            config: {
                base: baseManifest
            }
        })
        // new ESLintPlugin({
        //     extensions: ['.tsx', '.ts', '.js'],
        //     exclude: 'node_modules'
        // })
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ["file-loader"]
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        // disable type checker - we will use it in fork plugin
                        transpileOnly: true
                    }
                }
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    process.env.NODE_ENV !== 'production'
                        ? 'style-loader'
                        : MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    }
};

module.exports = config;
