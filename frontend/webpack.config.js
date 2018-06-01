const path = require('path');
var BundleTracker = require('webpack-bundle-tracker');

module.exports = {
    mode: 'development',
    entry: {
        store: './js/StoreApp'
    },
    output: {
        path: path.resolve("./bundles"),
        filename: "[name]-[hash].js",
    },
    plugins: [
        new BundleTracker({filename: "../webpack-dev-stats.json"}),
    ],
    module: {
        rules: [
            {
                test: /\.js?/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: ["env", "react"]
                }
            }
        ]
    }
};
