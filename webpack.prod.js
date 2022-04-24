const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require("path");

const config = merge(common, {
    mode: "production",
    devtool: undefined,
    // entry: {
    //     config: path.join(__dirname, "./src/config/config.production.js")
    // },
    resolve: {
        alias: {
            config: path.join(__dirname, "./src/config/config.production.js")
        }
    }
});

module.exports = config;
