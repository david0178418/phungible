const OfflinePlugin = require('offline-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
	devtool: 'source-map',
	entry: './src/client/index.ts',
	module: {
		loaders: [
			{
				include: [
					path.resolve(__dirname, 'src/client/'),
				],
				loader: 'awesome-typescript',
				query: {
					configFileName: './src/client/tsconfig.json',
				},
				test: /\.tsx?$/,
			},
		],
		preLoaders: [
			// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
			{
				loader: 'source-map-loader',
				test: /\.js$/,
			},
		],
	},
	output: {
		path: path.join(__dirname, 'build/client/js/'),
		filename: 'app.js',
	},
	resolve: {
		extensions: [
			'',
			'.js',
			'.ts',
			'.tsx',
		],
	},
	plugins: [
		new OfflinePlugin({
			publicPath: '/js/'
		})
	]
};
