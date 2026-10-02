const baseConfig = require('./_base.js');
const { merge } = require('webpack-merge');

module.exports = merge(baseConfig({ extractCss: true }), {
    mode: 'production',
    output: {
        publicPath: '/'
    },
});
