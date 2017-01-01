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
gulp.task('copy:static:css', copyStaticCssTask);
gulp.task('copy:static:font', copyStaticFontTask);
gulp.task('copy:static:html', copyStaticHtmlTask);
gulp.task('copy:static', ['copy:static:css', 'copy:static:font', 'copy:static:html']);
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
		.pipe(gulp.dest('build/client/js/'));
}

function buildClientWatchTask() {
	const webpackWatchConfig = Object.assign({
		watch: true,
	}, webpackConfig);

	return gulp.src('./src/client/index.js')
		.pipe(webpack(webpackWatchConfig));
}

function buildServerWatchTask() {
	return gulp.watch('./src/server/**/*.ts', buildServerTask);
}

function buildServerTask() {
	return gulp.src('./src/server/**/*.ts')
		.pipe(tsProject())
		.js.pipe(gulp.dest('build/server'));
}

function copyStaticCssTask() {
	return gulp.src([
			'./node_modules/bootstrap/dist/css/bootstrap.min.css',
			'./node_modules/bootstrap/dist/css/bootstrap.min.css.map',
			'./node_modules/font-awesome/css/font-awesome.css',
			'./node_modules/font-awesome/css/font-awesome.font-awesome.css.map',
		])
		.pipe(gulp.dest('./build/client/css/'));
}

function copyStaticFontTask() {
	return gulp.src([
			'./node_modules/font-awesome/fonts/fontawesome-webfont.ttf',
			'./node_modules/font-awesome/fonts/FontAwesome.otf',
			'./node_modules/font-awesome/fonts/fontawesome-webfont.eot',
			'./node_modules/font-awesome/fonts/fontawesome-webfont.woff',
			'./node_modules/font-awesome/fonts/fontawesome-webfont.woff2',
		])
		.pipe(gulp.dest('./build/client/fonts/'));
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
