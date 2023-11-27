const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

const PATHS = {
    src: path.resolve(__dirname, "src"),
    dist: path.resolve(__dirname, "public"),
    static: "static"
}

module.exports = {
    name: "Development build config",
    mode: "development",
    devtool: "cheap-module-eval-source-map",
    externals: {
        paths: PATHS
    },
    context: PATHS.src,
    entry: {
        landing: "./landing/index.js"
    },
    output: {
        filename: `${PATHS.static}/js/[name].bundle.js`,
        asyncChunks: true,
        path: path.resolve(PATHS.dist),
        publicPath: "/dist"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: "/node_modules/"
            },
            {
                test: /\.s[ac]ss/,
                use: [
                    "style-loader",
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {sourcemap: true}
                    },
                    {loader: "sass-loader", options: {sourcemap: true}},
                    {loader: "postcss-loader", options: {sourcemap: true, config: {path: './postcss.config.js'}}}
                ]
            },
            {
                test: /\.(png|jpeg|jpg|gif|svg)$/,
                loader: "file-loader",
                options: {
                    name: "[name].[ext]"
                }
            }
        ]
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: "[file.map]"
        }),
        new MiniCssExtractPlugin({
            filename: `${PATHS.static}/css/[name].css`
        }),
        new HtmlWebpackPlugin({
            hash: true,
            template: "",
            filename: "index.html",
        }),
        new CopyPlugin([
            {from: `${PATHS.src}/img`, to: `${PATHS.static}/img`},
            {from: `${PATHS.src}/static`, to: ''}
        ])
    ],
    devServer: {
        static: {
            directory: path.resolve(__dirname, "public")
        },
        compress: true,
        port: 9000,
        client: {
            progress: true,
            overlay: {
                errors: true,
                warnings: true,
                runtimeErrors: true
            }
        }
    }
}