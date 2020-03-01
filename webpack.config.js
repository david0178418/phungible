const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
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
	mode: IS_DEV ? 'development' : 'production',
	devtool: IS_DEV && 'inline-source-map',
	entry: [
		'./src/main.ts',
	],
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
		alias: {
		},
	},
	output: {
		filename: '[name].bundle.js',
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
				test: /\.s[ac]ss$/i,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader',
				],
			},
		],
	},
	plugins: [
		new DefinePlugin({}),
		// TODO The copy plugin contents are being blown
		// away on rebuild for some reason
		// new CleanWebpackPlugin(),
		new CopyPlugin([
			{
				from: 'src/static',
			},
		]),
		new HtmlWebpackPlugin({
			title: IS_DEV ? 'Development' : 'ShopLystr',
			template: './src/index.html',
		}),
	],
};
