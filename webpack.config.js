var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        main: [
            'whatwg-fetch',
            '@babel/polyfill',
            './js/main.js',
        ]
    },
    output: {
        path: path.resolve(__dirname, 'js'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                targets: {
                                    chrome: 58,
                                    ie: 11
                                }
                            }
                        ]
                    ]
                }
            }
        ]
    },
    optimization: {
        minimize: true
    },
    mode: 'production',
    stats: {
        colors: true
    },
    devtool: 'source-map'
 };