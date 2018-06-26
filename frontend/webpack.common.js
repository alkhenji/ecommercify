const path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    context: __dirname,
    entry: {
        index: './js/IndexApp'
    },
    output: {
        path: path.resolve('./bundles'),
        filename: '[name]-[hash].js',
        publicPath: '/static/bundles/'
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
                    presets: ['env', 'react', 'stage-2']
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            }
        ]
    }
};
