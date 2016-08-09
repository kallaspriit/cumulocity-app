const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../config/webpack.config');

// configuration
const port = 3000;
const compilerOptions = {
	publicPath: webpackConfig.output.publicPath,
	hot: true,
	historyApiFallback: true,
	noInfo: true,
};

// create compiler and server
const compiler = webpack(webpackConfig);
const webpackDevServer = new WebpackDevServer(compiler, compilerOptions);

// start the server
webpackDevServer.listen(port, '0.0.0.0', (error) => {
	if (error) {
		console.error(error);

		return;
	}

	console.log(`Server is now listening on port ${port}`);
});
