const path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        store: './js/StoreApp'
    },
    output: {
        path: path.resolve('./bundles'),
        filename: '[name]-[hash].js',
    },
    plugins: [
        new CleanWebpackPlugin(['bundles/*.*'], {watch: false}),
    ],
    module: {
        rules: [
            {
                test: /\.js?/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['env', 'react']
                }
            }
        ]
    }
};
