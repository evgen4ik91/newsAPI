const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'source-map',
	devServer: {
        hot: true,
		port: 8081,
		publicPath: '/',
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
	]
});