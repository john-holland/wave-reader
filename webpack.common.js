const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const baseManifest = require("./chrome/manifest.json");
const WebpackExtensionManifestPlugin = require("webpack-extension-manifest-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

//config: path.join(__dirname, "./src/config/config.common.js")
const config = {
    mode: "development",
    devtool: "cheap-module-source-map",
    entry: {
        app: path.join(__dirname, "./static/index.js"),
        background: path.join(__dirname, "./static/background.js"),
        content: path.join(__dirname, "./static/content.js")
    },
    output: {
        path: path.resolve(__dirname, "./build"),
        filename: "[name].js",
        chunkFilename: '[name].chunk.js'
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".jsx", ".*"],
        alias: {
            config: path.join(__dirname, "./src/config/config.common.js"),
            robotcopy: path.join(__dirname, "./src/config/robotcopy.ts")
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            'config': 'config'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
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
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                configFile: path.resolve(__dirname, 'tsconfig.json'),
                mode: 'write-references'
            }
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "./chrome/icons"),
                    to: path.resolve(__dirname, "./build/icons")
                }
            ]
        }),
        new WebpackExtensionManifestPlugin({
            config: {
                base: baseManifest
            }
        }),
        new ESLintPlugin({
            extensions: ['.tsx', '.ts', '.js'],
            exclude: 'node_modules'
        }),
        // Add progress bar
        new ProgressBarPlugin({
            format: '  build [:bar] :percent (:elapsed seconds)',
            clear: false
        }),
        // Detect circular dependencies
        new CircularDependencyPlugin({
            exclude: /node_modules/,
            failOnError: true,
            allowAsyncCycles: false,
            cwd: process.cwd()
        }),
        // Only add these plugins in production
        ...(process.env.NODE_ENV === 'production' ? [
            // Analyze bundle size
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                reportFilename: 'bundle-report.html',
                openAnalyzer: false
            }),
            // Compress assets
            new CompressionPlugin({
                test: /\.(js|css|html|svg)$/,
                algorithm: 'gzip',
                threshold: 10240,
                minRatio: 0.8
            })
        ] : [])
    ],
    optimization: {
        usedExports: true,
        sideEffects: true,
        minimize: true,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
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
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            configFile: path.resolve(__dirname, 'tsconfig.json')
                        }
                    }
                ]
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    process.env.NODE_ENV !== 'production'
                        ? 'style-loader'
                        : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            importLoaders: 1
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            sassOptions: {
                                outputStyle: 'compressed'
                            }
                        }
                    }
                ]
            }
        ]
    }
};

module.exports = config;
