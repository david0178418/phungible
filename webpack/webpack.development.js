const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/**
* @typedef { import('webpack').Configuration } Configuration
*
* @type {Configuration}
*/
module.exports = {
	mode: 'development',
	devtool: 'inline-source-map',
	output: {
		filename: '[name].bundle.js',
	},
	devServer: {
		contentBase: path.join(__dirname, '../build'),
		hot: true,
		historyApiFallback: true,
		compress: true,
		port: 9000,
	},
	module: {
		rules: [
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
		new MiniCssExtractPlugin({
			filename: '[name].[contentHash:8].css',
		}),
	],
};
