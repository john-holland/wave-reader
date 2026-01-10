const { merge } = require('webpack-merge');
const createCommonConfig = require('./webpack.common.js');
const path = require("path");
const TerserPlugin = require('terser-webpack-plugin');

// Check if this is a publish build (strip console.log) or just production (keep console.log)
const isPublishBuild = process.env.PUBLISH === 'true' || process.env.npm_lifecycle_event === 'publish';

const baseConfig = createCommonConfig({
    target: process.env.TARGET_BROWSER || process.env.BROWSER
});

const filteredPlugins = (baseConfig.plugins || []).filter(plugin => {
    if (plugin.constructor?.name === 'NormalModuleReplacementPlugin' &&
        plugin.resourceRegExp &&
        plugin.resourceRegExp.toString() === '/log-view-machine/') {
        console.log('🌊 Production build: Removing mock replacement plugin for log-view-machine');
        return false;
    }
    return true;
});

const config = merge(baseConfig, {
    mode: "production",
    devtool: undefined,
    // entry: {
    //     config: path.join(__dirname, "./src/config/config.production.js")
    // },
    resolve: {
        alias: {
            extensions: [".tsx", ".ts", ".js", ".jsx", "*"],
            config: path.join(__dirname, "./src/config/config.production.js")
            // Using npm package now - no alias needed
        }
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        // Only remove console.log, console.info, console.debug, console.trace in publish builds
                        // but keep console.error and console.warn always
                        ...(isPublishBuild ? {
                            pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace']
                        } : {})
                    },
                    format: {
                        comments: false,
                        // In Terser 5.x, ascii_only defaults to false (preserves Unicode), but explicitly set it
                        // to ensure emojis are never escaped to \uXXXX sequences
                        ascii_only: false
                    }
                },
                extractComments: false
            })
        ]
    },
    // Override plugins to remove mock replacement in production
    plugins: filteredPlugins
});

module.exports = config;
