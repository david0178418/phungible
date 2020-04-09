const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');

/**
* @typedef { import('webpack').Configuration } Configuration
*
* @type {Configuration}
*/
module.exports = {
	mode: 'production',
	optimization: {
		minimizer: [
			new TerserPlugin(),
			new OptimizeCssAssetsPlugin(),
		],
	},
	output: {
		filename: '[name].[contentHash:8].js',
	},
	module: {
		rules: [
			{
                test: /\.(s?css)$/i,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'sass-loader',
				],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].[contentHash:8].css',
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
	],
};
