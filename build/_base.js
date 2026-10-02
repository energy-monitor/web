const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader')
const { DefinePlugin } = require('webpack');

const path = require('path')
const resolve = (dir) => path.join(__dirname, '..', dir)

const { charts } = require('./charts.js');

module.exports = {
    entry: {
        code: './src/main.js',
    },
    // the names change with the content, so the bundles can be cached for long,
    // the markdown parsers are a chunk of their own, see src/lazy.js
    output: {
        filename: 'code.[contenthash].js',
        chunkFilename: 'chunk.[name].[contenthash].js',
    },
    module: {
        rules: [{
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
        }, {
            test: /\.scss$/i,
            use: ['style-loader', 'css-loader', "sass-loader"],
        }, {
            test: /\.vue$/i,
            use: 'vue-loader'
        }]
    },
    resolve: {
        alias: {
            '@': resolve('src'),
            'A': resolve('assets'),
        },
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'data', to: 'data' },
                { from: 'assets/logos', to: 'assets' },
                { from: "assets/.htaccess", to: "" },
                { from: "assets/geo", to: "geo" },
            ]
        }),
        new HtmlWebpackPlugin({
            template: 'index.html',
            favicon: 'assets/icon.png',
        }),
        new VueLoaderPlugin(),
        // updated with new or changed definitions, also in the dev server
        new DefinePlugin({
            CHARTS: DefinePlugin.runtimeValue(() => JSON.stringify(charts()), { contextDependencies: [resolve('data')] }),
        }),

        // new MiniCssExtractPlugin({
        //     filename: 'style.[fullhash].css'
        // })
    ]
};
