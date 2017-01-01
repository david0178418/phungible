const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

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
			}, {
				exclude: [
					path.resolve(__dirname, 'src/server/'),
				],
				loader: ExtractTextPlugin.extract('css-loader?sourceMap'),
				test: /\.css$/,
			}, {
				exclude: [
					path.resolve(__dirname, 'src/server/'),
				],
				loader: ExtractTextPlugin.extract('css-loader?sourceMap!' + 'sass-loader?sourceMap'),
				test: /\.scss$/,
			}, {
				exclude: [
					path.resolve(__dirname, 'src/server/'),
				],
			// 	test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif)(\?\S*)?$/,
			// 	loader: 'url?limit=100000@name=[name][ext]'
			// }, {
				loader: 'file-loader',
				test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
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
		path: __dirname + '/build/client/js/',
	},
	plugins: [
		new ExtractTextPlugin('../css/styles.css'),
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
