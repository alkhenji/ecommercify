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

    module: {
        rules: [
            {
                test: /\.(jpg|png|svg|woff|woff2|eot|ttf|svg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]-[hash].[ext]',
                            hash: 'sha512',
                            digest: 'hex'
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            optipng: {
                                optimizationLevel: 7,
                            },
                            pngquant: {
                                quality: '80-85',
                                speed: 1
                            },
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            },
                            gifsicle: {
                                interlaced: true,
                                optimizationLevel: 3
                            },
                        }
                    }
                ]
            },
        ]
    }
});
