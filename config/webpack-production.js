import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import developmentConfig, { basePath } from './webpack-development';

export default {
	...developmentConfig,
	entry: [
		'./app',
	],
	output: {
		...developmentConfig.output,
		publicPath: '/',
		filename: 'static/bundle.js',
	},
	module: {
		...developmentConfig.module,
		loaders: [{
			test: /\.js$/,
			loaders: ['babel'],
			exclude: /node_modules/,
			include: basePath,
		}, {
			test: /\.scss$/,
			loader: ExtractTextPlugin.extract(
				'style-loader',
				'css-loader?sourceMap!sass-loader?sourceMap!import-glob'
			),
			// loaders: ['style', 'css?sourceMap', 'sass?sourceMap'],
			exclude: /node_modules/,
			include: basePath,
		}],
	},
	plugins: [
		new ExtractTextPlugin('gfx/main.css', {
			allChunks: true,
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'index.template.html',
		}),
	],
};
