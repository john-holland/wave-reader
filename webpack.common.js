const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const WebpackExtensionManifestPlugin = require("webpack-extension-manifest-plugin");
// const ESLintPlugin = require('eslint-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const createCommonConfig = (options = {}) => {
    const target = options.target || process.env.TARGET_BROWSER || process.env.BROWSER || 'chrome';
    const isFirefox = target === 'firefox';
    const outputDir = isFirefox ? 'build-firefox' : 'build';
    const manifestPath = path.resolve(__dirname, isFirefox ? './firefox/manifest.json' : './chrome/manifest.json');
    const iconsDir = path.resolve(__dirname, isFirefox ? './firefox/icons' : './chrome/icons');
    const baseManifest = require(manifestPath);
    console.log('🌊 Webpack: Target browser:', target, '- Output directory:', outputDir);

    return {
        mode: "development",
        devtool: "source-map",
        entry: {
            app: path.join(__dirname, "./static/index.js"),
            background: path.join(__dirname, "./static/background.js"),
            content: path.join(__dirname, "./static/content.js"),
            shadowContent: path.join(__dirname, "./static/shadow-content.js")
        },
        output: {
            path: path.resolve(__dirname, `./${outputDir}`),
            filename: "[name].js"
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js", ".jsx", ".*"],
            alias: {
                "log-view-machine$": path.resolve(__dirname, "../log-view-machine/dist/index.esm.js"),
                "log-view-machine/src": path.resolve(__dirname, "../log-view-machine/src"),
                "process/browser": require.resolve("process/browser")
            },
            fallback: {
                "path": require.resolve("path-browserify"),
                "tty": require.resolve("tty-browserify"),
                "util": require.resolve("util/"),
                "util-deprecate": path.resolve(__dirname, "src/polyfills/util-deprecate-browser.js"),
                "fs": false,
                "net": false,
                "stream": require.resolve("stream-browserify"),
                "zlib": require.resolve("browserify-zlib"),
                "querystring": require.resolve("querystring-es3"),
                "url": require.resolve("url/"),
                "http": false,
                "crypto": require.resolve("crypto-browserify"),
                "vm": require.resolve("vm-browserify"),
                "assert": require.resolve("assert/"),
                "events": require.resolve("events/"),
                "buffer": require.resolve("buffer/"),
                "string_decoder": require.resolve("string_decoder/"),
                "async_hooks": false,
                "process": require.resolve("process/browser"),
                // Additional fallbacks for stream dependencies
                "readable-stream": require.resolve("readable-stream"),
                "stream-browserify": require.resolve("stream-browserify"),
                // Prevent Express-related modules from being bundled
                "express": false,
                "send": false,
                "destroy": false,
                "morgan": false
            }
        },
        plugins: [
            new webpack.ProvidePlugin({
                'config': 'config',
                'process': 'process/browser',
                'Buffer': ['buffer', 'Buffer'],
                'util-deprecate': path.resolve(__dirname, "src/polyfills/util-deprecate-browser.js"),
            }),
            new webpack.DefinePlugin({
                'regeneratorRuntime': 'regeneratorRuntime'
            }),
            new webpack.IgnorePlugin({
                resourceRegExp: /^\.\/locale$/,
                contextRegExp: /moment$/
            }),
            // Block the real util-deprecate package to force use of our CSP-compliant polyfill
            new webpack.IgnorePlugin({
                resourceRegExp: /^util-deprecate$/,
                contextRegExp: /node_modules/
            }),
            // Block util-deprecate from nested node_modules (like in stream-browserify)
            new webpack.IgnorePlugin({
                resourceRegExp: /^\.\.\/util-deprecate$/,
                contextRegExp: /node_modules/
            }),
            // Block any util-deprecate references in nested readable-stream
            new webpack.IgnorePlugin({
                resourceRegExp: /^util-deprecate$/,
                contextRegExp: /readable-stream/
            }),
            // Replace all util-deprecate references with our polyfill
            new webpack.NormalModuleReplacementPlugin(
                /^util-deprecate$/,
                path.resolve(__dirname, 'src/polyfills/util-deprecate-browser.js')
            ),
            // TEMPORARILY DISABLED: Mock replacement plugin
            // TODO: Re-enable with proper configuration after testing
            /*
            new webpack.NormalModuleReplacementPlugin(
                /log-view-machine/,
                path.resolve(__dirname, 'src/mocks/log-view-machine-mock.js'),
                function(resource) {
                    // Check if this is being imported in the popup/app context
                    const isPopupApp = resource.context.includes('app.tsx') || 
                                     resource.context.includes('static/') ||
                                     resource.context.includes('index.html');
                    
                    // In production, always use real package
                    const isProduction = process.env.NODE_ENV === 'production';
                    
                    const useMock = isPopupApp && !isProduction;
                    
                    console.log(`🌊 Webpack: ${useMock ? 'Using MOCK' : 'Using REAL'} log-view-machine for:`, resource.context, `(NODE_ENV: ${process.env.NODE_ENV})`);
                    return useMock;
                }
            ),
            */
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
                'global': 'globalThis'
            }),
            new webpack.ProvidePlugin({
                'global': 'globalThis'
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
                filename: '[name].[contenthash].css',
                chunkFilename: '[id].css'
            }),
            new CleanWebpackPlugin(),
            new ForkTsCheckerWebpackPlugin(),
            new CopyPlugin({
                patterns: [
                    {
                        from: iconsDir,
                        to: path.resolve(__dirname, `./${outputDir}/icons`)
                    },
                    {
                        from: path.resolve(__dirname, "./static/receive_eth.jpg"),
                        to: path.resolve(__dirname, `./${outputDir}/receive_eth.jpg`)
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
                            transpileOnly: true,
                            compilerOptions: {
                                sourceMap: true
                            }
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
};

module.exports = createCommonConfig;
