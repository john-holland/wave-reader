const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require("path");

const config = merge(common, {
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
