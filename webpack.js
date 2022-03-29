const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const baseManifest = require("./chrome/manifest.json");
const WebpackExtensionManifestPlugin = require("webpack-extension-manifest-plugin");
const config = {
    mode: "development",
    devtool: "cheap-module-source-map",
    entry: {
        app: path.join(__dirname, "./static/index.js"),
    },
    output: {
        path: path.resolve(__dirname, "./build"),
        filename: "[name].js"
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".jsx", "*"]
    },
    plugins: [
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
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: ["ts-loader"],
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ["file-loader"]
            }
        ]
    }
};
module.exports = config;