const path = require('path');
const webpack = require('webpack');

module.exports = {
	// devtool: 'cheap-module-eval-source-map',
	devtool: 'source-map',
	entry: [
		'webpack-dev-server/client?http://localhost:3000',
		'webpack/hot/only-dev-server',
		'./app',
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/static/',
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
	],
	module: {
		loaders: [{
			test: /\.js$/,
			loaders: ['react-hot', 'babel'],
			exclude: /node_modules/,
			include: __dirname,
		}, {
			test: /\.scss$/,
			loaders: ['style', 'css', 'sass'],
			exclude: /node_modules/,
			include: __dirname,
		}],
	},
	sassLoader: {
		includePaths: [path.resolve(__dirname, './gfx')],
	},
};
