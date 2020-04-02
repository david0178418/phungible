const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');

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
	mode: IS_DEV ? 'development' : 'production',
	devtool: IS_DEV && 'inline-source-map',
	entry: [
		'./src/main.ts',
	],
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
		alias: {
			'@common': path.resolve(__dirname, 'src/common/'),
			'@components': path.resolve(__dirname, 'src/components/'),
			'@pages': path.resolve(__dirname, 'src/pages/'),
			'@root': path.resolve(__dirname, 'src/'),
		},
	},
	output: {
		filename: IS_DEV ? '[name].bundle.js' : '[name].[contenthash:8].js',
		path: path.resolve(__dirname, 'build'),
		publicPath: '/',
	},
	devServer: {
		contentBase: path.join(__dirname, 'build'),
		hot: true,
		historyApiFallback: true,
		compress: true,
		port: 9000,
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					'file-loader',
				],
			},
			{
                test: /\.(s?css)$/i,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader',
				],
			},
		],
	},
	plugins: [
		new DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify(NODE_ENV),
			},
		}),
		// TODO The copy plugin contents are being blown
		// away on rebuild for some reason
		new CleanWebpackPlugin(),
		new CopyPlugin([
			{
				from: 'src/static',
			},
		]),
		new HtmlWebpackPlugin({
			title: IS_DEV ? 'Development' : 'ShopLystr',
			template: './src/index.html',
		}),
		new GenerateSW({// Do not precache images
			exclude: [
				/\.(?:png|jpg|jpeg|svg)$/,
				/\.map$/,
				/manifest$/,
				/\.htaccess$/,
				/service-worker\.js$/,
				/sw\.js$/,
			],

			// Define runtime caching rules.
			runtimeCaching: [{
			  // Match any request that ends with .png, .jpg, .jpeg or .svg.
				urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
				// Apply a cache-first strategy.
				handler: 'CacheFirst',
				options: {
					// Use a custom cache name.
					cacheName: 'images',
					// Only cache 10 images.
					expiration: {
						maxEntries: 10,
					},
				},
			}],
		}),
		// new InjectManifest({
		// 	swSrc: './src/service-worker.js',
		// 	swDest: 'service-worker.js',
		// 	exclude: [
		// 		/\.map$/,
		// 		/manifest$/,
		// 		/\.htaccess$/,
		// 		/service-worker\.js$/,
		// 		/sw\.js$/,
		// 	  ],
		// }),
	],
};
