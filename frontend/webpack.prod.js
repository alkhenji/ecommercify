var WebpackMerge = require('webpack-merge');
var BundleTracker = require('webpack-bundle-tracker');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');

var common = require('./webpack.common.js');

module.exports = WebpackMerge(common, {
    mode: 'production',
    plugins: [
        new BundleTracker({filename: "../webpack-prod-stats.json"}),
        new UglifyJSPlugin(),
        new CompressionPlugin({
            asset: "[path].jgz[query]",
            algorithm: "gzip",
            test: /\.js$/,
            threshold: 10240,
            minRatio: 0.8
        }),
    ],
})
