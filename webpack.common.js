const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');
const distPath = '/dist';

module.exports = {
    entry: {
        main: [
            'whatwg-fetch',
            '@babel/polyfill',
            './src/main.js'
        ]
    },
    output: {
        path: path.resolve(__dirname + distPath),
        filename: '[name].bundle.js'
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
                    ],
                    plugins: ['@babel/syntax-dynamic-import']
                }
            },
            {
                test: /\.css$/,
                use: [
                  {
                    loader: MiniCssExtractPlugin.loader,
                  },
                  'css-loader'
                ]
            },
            {
                test: /\.(jpg|png)$/,
                loader: 'url-loader?limit=100000'
            },
            {
                test: /\.svg$/,
                loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
            },
            {
                test: /\.json$/,
                use: [
                    {
                        loader: path.resolve('./src/loaders/jsonLoader.js'),
                        options: {
                            invertBool: true,
                            toUppercase: true,
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
          inject: false,
          hash: true,
          template: './src/index.html',
          filename: 'index.html'
        }),
        new MiniCssExtractPlugin({
            filename: "[name].min.css",
        }),
        new CopyWebpackPlugin([
          {from:'./src/img',to:'img'}
        ])
    ],
    stats: {
        colors: true
    },
 };