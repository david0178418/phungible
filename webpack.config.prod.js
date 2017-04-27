const baseConfig = require('./webpack.config');
const webpack = require('webpack');

module.exports = Object.assign({
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
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
	].concat(webpack.plugins),
}, baseConfig)
