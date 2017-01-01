const gulp = require('gulp');
const gulpSequence = require('gulp-sequence');
const server = require('gulp-develop-server');
const webpack = require('gulp-webpack');
const webpackConfig = require('./webpack.config');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('./src/server/tsconfig.json');

gulp.task('build:client', buildClientTask);
gulp.task('build:client:watch', buildClientWatchTask);
gulp.task('build:server', buildServerTask);
gulp.task('build:server:watch', buildServerWatchTask);
gulp.task('copy:static', copyStaticTask);
gulp.task('copy:static:watch', copyStaticWatchTask);
gulp.task('server:listen', serverTask);
gulp.task('server:watch', serverWatchTask);
gulp.task('build', ['build:client', 'build:server']);
gulp.task('build:watch', ['build:client:watch', 'build:server:watch']);
gulp.task('copy', ['copy:static', 'copy:static:watch']);
gulp.task('server', ['server:listen', 'server:watch']);
gulp.task('default', gulpSequence('build', 'copy', ['build:watch', 'server']));

function buildClientTask() {
	return gulp.src('./src/client/index.ts')
		.pipe(webpack(webpackConfig))
		.pipe(gulp.dest('build/client'));
}

function buildClientWatchTask() {
	const webpackWatchConfig = Object.assign({
		watch: true,
	}, webpackConfig);

	return gulp.src('./src/client/index.js')
		.pipe(webpack(webpackWatchConfig))
		.pipe(gulp.dest('build/client'));
}

function buildServerWatchTask() {
	return gulp.watch('./src/server/**/*.ts', buildServerTask);
}

function buildServerTask() {
	return gulp.src('./src/server/**/*.ts')
		.pipe(tsProject())
		.js.pipe(gulp.dest('build/server'));
}

function copyStaticTask() {
	return gulp.src([
			'./src/client/index.html',
			'./node_modules/bootstrap/dist/css/bootstrap.min.css',
			'./node_modules/bootstrap/dist/css/bootstrap.min.css.map',
		])
		.pipe(gulp.dest('./build/client/'));
}

function copyStaticWatchTask() {
	return gulp.watch('./src/client/index.html', copyStaticTask);
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
