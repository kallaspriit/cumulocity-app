const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	// devtool: 'cheap-module-eval-source-map',
	devtool: 'source-map',
	entry: [
		'webpack-dev-server/client?http://10.220.20.140:3000',
		'webpack/hot/only-dev-server',
		'./app',
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/static/',
	},
	module: {
		loaders: [{
			test: /\.js$/,
			loaders: ['react-hot', 'babel'],
			exclude: /node_modules/,
			include: __dirname,
		}, {
			test: /\.scss$/,
			// loader: ExtractTextPlugin.extract('style', 'css?sourceMap', 'sass?sourceMap'),
			loaders: ['style', 'css?sourceMap', 'sass?sourceMap'],
			exclude: /node_modules/,
			include: __dirname,
		}],
	},
	sassLoader: {
		// includePaths: [path.resolve(__dirname, './gfx')],
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new ExtractTextPlugin('styles.css'),
	],
};
