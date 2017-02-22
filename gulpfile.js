const gulp = require('gulp');
const gulpSequence = require('gulp-sequence');
const server = require('gulp-develop-server');
const webpack = require('gulp-webpack');
const webpackConfig = require('./webpack.config');
const webpackProdConfig = require('./webpack.config.prod');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('./src/server/tsconfig.json');


gulp.task('build:client', buildClientTask);
gulp.task('build:client:watch', buildClientWatchTask);
gulp.task('build:server', buildServerTask);
gulp.task('build:server:watch', buildServerWatchTask);
gulp.task('build:prod:client', buildProdClientTask);
gulp.task('copy:static:html', copyStaticHtmlTask);
gulp.task('copy:static', ['copy:static:html']);
gulp.task('copy:static:watch', copyStaticWatchTask);
gulp.task('server:listen', serverTask);
gulp.task('server:watch', serverWatchTask);
gulp.task('build', ['build:client', 'build:server']);
gulp.task('build:watch', ['build:client:watch', 'build:server:watch']);
gulp.task('copy', ['copy:static', 'copy:static:watch']);
gulp.task('server', ['server:listen', 'server:watch']);
gulp.task('build:prod', ['build:prod:client', 'build:server', 'copy:static']);
gulp.task('default', gulpSequence('build', 'copy', ['build:watch', 'server']));

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
		.pipe(webpack(webpackProdConfig))
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

function copyStaticHtmlTask() {
	return gulp.src([
			'./src/client/index.html',
		])
		.pipe(gulp.dest('./build/client/'));
}

function copyStaticWatchTask() {
	return gulp.watch('./src/client/index.html', copyStaticHtmlTask);
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
