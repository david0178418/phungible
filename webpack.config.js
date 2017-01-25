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
		filename: 'app.js',
	},
	plugins: [
		// new webpack.DefinePlugin({
		// 	'process.env': {
		// 		NODE_ENV: '"production"'
		// 	}
		// }),
		// new webpack.optimize.UglifyJsPlugin({
		// 	compress: {
		// 		warnings: true
		// 	},
		// 	output: {
		// 		comments: false
		// 	},
		// 	sourceMap: false
		// })
	],
	resolve: {
		extensions: [
			'',
			'.js',
			'.ts',
			'.tsx',
		],
	},
};
