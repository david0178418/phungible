const OfflinePlugin = require('offline-plugin');
const path = require('path');
const webpack = require('webpack');
const VERSION = `"${require('./package.json').version}"`;

const isProd = process.env.NODE_ENV === 'production';
let plugins = [
	new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
	new webpack.optimize.ModuleConcatenationPlugin(),
];
let devtool;

if(isProd) {
	plugins.push(
		new webpack.DefinePlugin({
			VERSION,
			API_URI: '"/api"',
			'process.env': {
				NODE_ENV: '"production"'
			}
		})
	);
	plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				comparisons: true,
				dead_code: true,
				screw_ie8: true,
				unsafe: true,
				unsafe_comps: true,
			},
			mangle : {
				screw_ie8 : true,
			},
			output: {
				screw_ie8 : true,
				comments: false,
			},
			sourceMap: false,
			warnings: false,
		})
	);
} else {
	devtool = 'source-map'
	plugins.push(
		new webpack.DefinePlugin({
			VERSION,
			API_URI: '"http://localhost:8081"',
			'process.env': {
				NODE_ENV: '"production"'
			}
		})
	);
}

plugins.push(
	new OfflinePlugin({
		responseStrategy: 'network-first',
		externals: [
			'/',
			'/index.html',
			'/manifest.json',
			'/images/icons/favicon.ico',
			'/images/icons/icon-192x192.png',
		],
		ServiceWorker: {
			events: true,
			output: '../service-worker.js',
		},
		AppCache: {
			directory: '../appcache/'
		}
	})
);

module.exports = {
	plugins,
	devtool,
	entry: './src/client/index.ts',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: ['ts-loader'],
				exclude: /node_modules/
			},
			{
				enforce: 'pre',
				test: /\.ts$/,
				loader: 'tslint-loader'
			},
			{
				test: /\.js$/,
				use: ["source-map-loader"],
				enforce: "pre"
			}
		],
	},
	output: {
		path: path.join(__dirname, 'build/client/js/'),
		filename: 'app.js',
		publicPath: 'js/'
	},
	resolve: {
		extensions: [
			'.js',
			'.ts',
			'.tsx',
		],
	},
};
