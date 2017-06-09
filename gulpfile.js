const gulp = require('gulp');
const gulpSequence = require('gulp-sequence');
const gulpCacheBust = require('gulp-cache-bust');
const path = require('path');
const ts = require('gulp-typescript');
const gulpWebpack = require('gulp-webpack');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

gulp.task('build:client', buildClientTask);
gulp.task('build:client:watch', buildClientWatchTask);
gulp.task('build:prod:client', buildProdClientTask);
gulp.task('copy', copyStaticAssets);
gulp.task('generate:html', generateHtmlTask);
gulp.task('generate:html:watch', generateHtmlWatchTask);
gulp.task('build', ['build:client', 'copy']);
gulp.task('build:watch', ['build:client:watch', 'copy']);
gulp.task('build:prod', gulpSequence(['build:prod:client', 'copy'], 'generate:html'));
gulp.task('default', gulpSequence('build', 'generate:html', ['build:watch', 'copy', 'generate:html:watch']));

function buildClientTask() {
	return gulp.src('./src/client/index.ts')
		.pipe(gulpWebpack(webpackConfig, webpack))
		.pipe(gulp.dest('build/client/js/'));
}

function buildClientWatchTask() {
	const webpackWatchConfig = Object.assign({
		watch: true,
	}, webpackConfig);

	return gulp.src('./src/client/index.js')
		.pipe(gulpWebpack(webpackWatchConfig, webpack))
		.pipe(gulp.dest('build/client/js/'));
}
function buildProdClientTask() {
	return gulp.src('./src/client/index.ts')
		.pipe(gulpWebpack(webpackConfig, webpack))
		.pipe(gulp.dest('build/client/js/'));
}

function generateHtmlTask() {
	return gulp.src('./src/client/index.html')
		.pipe(gulpCacheBust({
			basePath: path.join(__dirname, './build/client/'),
		}))
		.pipe(gulp.dest('./build/client'));
}

function copyStaticAssets() {
	 return gulp.src('./src/client/static/**/*')
		.pipe(gulp.dest('./build/client'));
}

function generateHtmlWatchTask() {
	return gulp.watch('./build/client/js/app.js', generateHtmlTask);
}
