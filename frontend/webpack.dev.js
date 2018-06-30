var WebpackMerge = require('webpack-merge');
var BundleTracker = require('webpack-bundle-tracker');


var common = require('./webpack.common.js');

module.exports = WebpackMerge(common, {
    mode: 'development',
    plugins: [
        new BundleTracker({filename: "../webpack-dev-stats.json"}),
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
                                optimizationLevel: 3,
                            },
                            pngquant: {
                                quality: '90-100',
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
