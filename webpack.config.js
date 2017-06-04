const OfflinePlugin = require('offline-plugin');
const path = require('path');
const webpack = require('webpack');
const VERSION = `"${require('./package.json').version}"`;

const isProd = process.env.NODE_ENV === 'production';
let plugins = [];
let devtool;


if(isProd) {
	plugins.push(
		new webpack.DefinePlugin({
			VERSION,
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
			'process.env': {
				NODE_ENV: '"production"'
			}
		})
	);
}

plugins.push(
	new OfflinePlugin({
		externals: [
			'/',
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
};
