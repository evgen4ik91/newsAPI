const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = merge(common, {
	mode: 'production',
	optimization: {
		minimize: true,
		minimizer: [
			new UglifyJsPlugin({}),
			new OptimizeCSSAssetsPlugin({})
		]
	}
});