const gulp = require('gulp');
const gulpSequence = require('gulp-sequence');
const gulpCacheBust = require('gulp-cache-bust');
const path = require('path');
const server = require('gulp-develop-server');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('./src/server/tsconfig.json');
const webpack = require('gulp-webpack');
const webpackConfig = require('./webpack.config');

gulp.task('build:client', buildClientTask);
gulp.task('build:client:watch', buildClientWatchTask);
gulp.task('build:server', buildServerTask);
gulp.task('build:server:watch', buildServerWatchTask);
gulp.task('build:prod:client', buildProdClientTask);
gulp.task('copy', copyStaticAssets);
gulp.task('generate:html', generateHtmlTask);
gulp.task('generate:html:watch', generateHtmlWatchTask);
gulp.task('server:listen', serverTask);
gulp.task('server:watch', serverWatchTask);
gulp.task('build', ['build:client', 'build:server', 'copy']);
gulp.task('build:watch', ['build:client:watch', 'build:server:watch', 'copy']);
gulp.task('server', ['server:listen', 'server:watch']);
gulp.task('build:prod', gulpSequence(['build:prod:client', 'build:server', 'copy'], 'generate:html'));
gulp.task('default', gulpSequence('build', 'generate:html', ['build:watch', 'copy', 'generate:html:watch']));

function buildClientTask() {
	return gulp.src('./src/client/index.ts')
		.pipe(webpack(webpackConfig))
		.pipe(gulp.dest('build/client/js/'));
}

function buildClientWatchTask() {
	const webpackWatchConfig = Object.assign({
		watch: true,
	}, webpackConfig);

	return gulp.src('./src/client/index.js')
		.pipe(webpack(webpackWatchConfig))
		.pipe(gulp.dest('build/client/js/'));
}
function buildProdClientTask() {
	return gulp.src('./src/client/index.ts')
		.pipe(webpack(webpackConfig))
		.pipe(gulp.dest('build/client/js/'));
}

function buildServerWatchTask() {
	return gulp.watch('./src/server/**/*.ts', buildServerTask);
}

function buildServerTask() {
	return gulp.src('./src/server/**/*.ts')
		.pipe(tsProject())
		.js.pipe(gulp.dest('build/server'));
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

function serverTask() {
	server.listen({
		execArgv: [
			'--inspect',
		],
		path: './build/server/index.js',
	});
}

function serverWatchTask() {
	gulp.watch('./build/server/index.js', server.restart);
}
