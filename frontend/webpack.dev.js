var WebpackMerge = require('webpack-merge');
var BundleTracker = require('webpack-bundle-tracker');


var common = require('./webpack.common.js');

module.exports = WebpackMerge(common, {
    mode: 'development',
    plugins: [
        new BundleTracker({filename: "../webpack-dev-stats.json"}),
    ],
})
