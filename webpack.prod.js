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
            extensions: [".tsx", ".ts", ".js", ".jsx", "*"],
            config: path.join(__dirname, "./src/config/config.production.js")
            // Using npm package now - no alias needed
        }
    },
    // Override plugins to remove mock replacement in production
    plugins: [
        ...common.plugins.filter(plugin => {
            // Remove the NormalModuleReplacementPlugin for log-view-machine in production
            if (plugin.constructor.name === 'NormalModuleReplacementPlugin' && 
                plugin.resourceRegExp && 
                plugin.resourceRegExp.toString() === '/log-view-machine/') {
                console.log('🌊 Production build: Removing mock replacement plugin for log-view-machine');
                return false;
            }
            return true;
        })
    ]
});

module.exports = config;
