const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader')
const { DefinePlugin } = require('webpack');

const fs = require('fs');
const path = require('path')
const resolve = (dir) => path.join(__dirname, '..', dir)

// all charts of data/ by their id, e.g. { "gas/price": "genVis" }, the maps
// are the definitions with `types`, files starting with `_` are parents
const charts = () => Object.fromEntries(fs.readdirSync(resolve('data'), { recursive: true })
    .filter(f => f.endsWith('.json') && !path.basename(f).startsWith('_'))
    .map(f => f.split(path.sep).join('/'))
    .sort()
    .map(f => [f.slice(0, -'.json'.length), 'types' in JSON.parse(fs.readFileSync(resolve(`data/${f}`))) ? 'europeMap' : 'genVis']));

module.exports = {
    entry: {
        code: './src/main.js',
    },
    output: {
        filename: 'code.[fullhash].js',
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
