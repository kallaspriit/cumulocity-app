import path from 'path';
import webpack from 'webpack';

export const basePath = path.join(__dirname, '..');
export const distributionPath = path.join(basePath, 'dist');

export default {
	// devtool: 'cheap-module-eval-source-map',
	devtool: 'source-map',
	entry: [
		'webpack-dev-server/client?http://10.220.20.140:3000',
		'webpack/hot/only-dev-server',
		'./app',
	],
	output: {
		path: distributionPath,
		filename: 'bundle.js',
		publicPath: '/static/',
	},
	module: {
		loaders: [{
			test: /\.js$/,
			loaders: ['react-hot', 'babel'],
			exclude: /node_modules/,
			include: basePath,
		}, {
			test: /\.scss$/,
			// loader: ExtractTextPlugin.extract('style', 'css?sourceMap', 'sass?sourceMap'),
			loaders: ['style', 'css?sourceMap', 'sass?sourceMap'],
			exclude: /node_modules/,
			include: basePath,
		}],
	},
	sassLoader: {
		// includePaths: [path.resolve(__dirname, './gfx')],
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
	],
};
