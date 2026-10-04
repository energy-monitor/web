const baseConfig = require('./_base.js');
const { merge } = require('webpack-merge');
const { PagesPlugin } = require('./pages.js');

module.exports = merge(baseConfig({ extractCss: true }), {
    mode: 'production',
    output: {
        publicPath: '/'
    },
    // the html files of the pages, the dev server serves index.html for all
    plugins: [new PagesPlugin()],
});
