const { merge } = require('webpack-merge');
const createCommonConfig = require('./webpack.common.js');
const path = require("path");

const baseConfig = createCommonConfig({
    target: process.env.TARGET_BROWSER || process.env.BROWSER
});

const config = merge(baseConfig, {
    mode: "development",
    devtool: "source-map",
    entry: {
        config: path.join(__dirname, "./src/config/config.develop.js")
    },
    resolve: {
        alias: {
            config: path.join(__dirname, "./src/config/config.develop.js")
        }
    }
});

module.exports = config;
