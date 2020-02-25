// const OfflinePlugin = require('offline-plugin');
// const path = require('path');
// const webpack = require('webpack');
// const VERSION = `"${require('./package.json').version}"`;

// const isProd = process.env.NODE_ENV === 'production';
// let plugins = [
// 	new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
// 	new webpack.optimize.ModuleConcatenationPlugin(),
// ];

// if(isProd) {
// 	plugins.push(
// 		new webpack.DefinePlugin({
// 			VERSION,
// 			API_URI: '"/api"',
// 			'process.env': {
// 				NODE_ENV: '"production"'
// 			}
// 		})
// 	);
// 	plugins.push(
// 		new webpack.optimize.UglifyJsPlugin({
// 			compress: {
// 				comparisons: true,
// 				dead_code: true,
// 				screw_ie8: true,
// 				unsafe: true,
// 				unsafe_comps: true,
// 			},
// 			mangle : {
// 				screw_ie8 : true,
// 			},
// 			output: {
// 				screw_ie8 : true,
// 				comments: false,
// 			},
// 			sourceMap: !!process.env.SOURCEMAPS,
// 			warnings: false,
// 		})
// 	);
// } else {
// 	plugins.push(
// 		new webpack.DefinePlugin({
// 			VERSION,
// 			API_URI: '"/api"',
// 		})
// 	);
// }

// plugins.push(
// 	new OfflinePlugin({
// 		responseStrategy: 'network-first',
// 		externals: [
// 			'/',
// 			'/index.html',
// 			'/manifest.json',
// 			'/images/icons/favicon.ico',
// 			'/images/icons/icon-192x192.png',
// 		],
// 		ServiceWorker: {
// 			events: true,
// 			output: '../service-worker.js',
// 		},
// 		AppCache: {
// 			directory: '../appcache/'
// 		}
// 	})
// );

// module.exports = {
// 	plugins,
// 	devtool: 'source-map',
// 	entry: './src/client/index.ts',
// 	module: {
// 		rules: [
// 			{
// 				test: /\.tsx?$/,
// 				use: ['ts-loader'],
// 				exclude: /node_modules/
// 			},
// 			{
// 				enforce: 'pre',
// 				test: /\.ts$/,
// 				loader: 'tslint-loader'
// 			},
// 			{
// 				test: /\.js$/,
// 				use: ["source-map-loader"],
// 				enforce: "pre"
// 			}
// 		],
// 	},
// 	output: {
// 		path: path.join(__dirname, 'build/client/js/'),
// 		filename: 'app.js',
// 		publicPath: 'js/'
// 	},
// 	resolve: {
// 		extensions: [
// 			'.js',
// 			'.ts',
// 			'.tsx',
// 		],
// 	},
// };
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
// @ts-ignore
const VERSION = `"${require('./package.json').version}"`;
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const {
	NODE_ENV = '',
} = process.env;

const IS_DEV = NODE_ENV === 'development';

/**
	* @typedef { import('webpack').Configuration } Configuration
	*
	* @type {Configuration}
	*/
module.exports = {
	devServer: {
		compress: true,
		contentBase: path.join(__dirname, 'build'),
		historyApiFallback: true,
		hot: true,
		port: 9000,
	},
	devtool: 'inline-source-map',
	entry: [
		'./src/index.ts',
	],
	mode: IS_DEV ? 'development' : 'production',
	module: {
		rules: [
			{
				exclude: /node_modules/,
				test: /\.tsx?$/,
				use: 'ts-loader',
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					'file-loader',
				],
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader',
				],
			},
		],
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'www'),
		publicPath: '/',
	},
	plugins: [
		new DefinePlugin({
			VERSION,
		}),
		// TODO The copy plugin contents are being blown
		// away on rebuild for some reason
		// new CleanWebpackPlugin(),
		new CopyPlugin([
			{
				from: 'src/static',
			},
		]),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			title: IS_DEV ? 'Development' : 'Phungible',
		}),
	],
	resolve: {
		alias: {
		},
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
	},
};
