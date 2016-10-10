'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
	defaultAssets = require('./config/assets/default'),
	testAssets = require('./config/assets/test'),
	gulp = require('gulp'),
	gulpLoadPlugins = require('gulp-load-plugins'),
	runSequence = require('run-sequence'),
	plugins = gulpLoadPlugins(),
	args = require('get-gulp-args')();;

// Set NODE_ENV to 'test'
gulp.task('env:test', function () {
	process.env.NODE_ENV = 'test';
});

// Set NODE_ENV to 'development'
gulp.task('env:dev', function () {
	process.env.NODE_ENV = 'development';
});

// Set NODE_ENV to 'production'
gulp.task('env:prod', function () {
	process.env.NODE_ENV = 'production';
});

// Set NODE_ENV to 'stage'
gulp.task('env:stage', function () {
	process.env.NODE_ENV = 'stage';
});

// Set DEBUG environment variables
gulp.task('env:DEBUG', function () {
    console.log('debug');
    process.env.DEBUG = 'express:*';
})

// Nodemon task
gulp.task('nodemon', function () {
	return plugins.nodemon({
		script: 'server.js',
		nodeArgs: ['--debug'],
		ext: 'js,html',
		watch: _.union(defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
	});
});

gulp.task('workermon', function () {
	return plugins.nodemon({
		script: 'worker.js',
		nodeArgs: ['--debug'],
		ext: 'js',
		watch: _.union(defaultAssets.worker.actions, defaultAssets.server.config)
	});
});

gulp.task('node', function () {
    var nodeArgs = ['server.js'];
    var spawn = require('child_process').spawn;
    console.log(args);
    
    _(['stack-size', 'debug', 'max_old_space_size'])
        .forEach(function(k) {
            var sk = 'spawn_' + k;
            if (!_.has(args,sk)) { return; }
            if (typeof(args[sk]) !== 'undefined') {nodeArgs.push( '--' + k + '=' + args[sk] );}
            else {nodeArgs.push('--' + k);}
        });
    console.log('spawning: node',nodeArgs);
    spawn('node', nodeArgs, {stdio: 'inherit'}); 
});

gulp.task('worker', function () {
    var nodeArgs = ['worker.js'];
    var spawn = require('child_process').spawn;
    console.log(args);
    
    _(['stack-size', 'debug', 'max_old_space_size'])
        .forEach(function(k) {
            var sk = 'spawn_' + k;
            if (!_.has(args,sk)) { return; }
            if (typeof(args[sk]) !== 'undefined') {nodeArgs.push( '--' + k + '=' + args[sk] );}
            else {nodeArgs.push('--' + k);}
        });
    console.log('spawning: node',nodeArgs);
    spawn('node', nodeArgs, {stdio: 'inherit'}); 
});

// Watch Files For Changes
gulp.task('watch', function() {
	// Start livereload
	plugins.livereload.listen();

	// Add watch rules
	gulp.watch(defaultAssets.server.views).on('change', plugins.livereload.changed);
	gulp.watch(defaultAssets.server.allJS, ['jshint']).on('change', plugins.livereload.changed);
	gulp.watch(defaultAssets.client.views).on('change', plugins.livereload.changed);
	gulp.watch(defaultAssets.client.js, ['jshint']).on('change', plugins.livereload.changed);
	gulp.watch(defaultAssets.client.css, ['csslint']).on('change', plugins.livereload.changed);
	gulp.watch(defaultAssets.client.less, ['less', 'csslint']).on('change', plugins.livereload.changed);
});

// CSS linting task
gulp.task('csslint', function (done) {
	return gulp.src(defaultAssets.client.css)
		.pipe(plugins.csslint('.csslintrc'))
		.pipe(plugins.csslint.reporter())
		.pipe(plugins.csslint.reporter(function (file) {
			if (!file.csslint.errorCount) {
				done();
			}
		}));
});

// JS linting task
gulp.task('jshint', function () {
	return gulp.src(_.union(defaultAssets.server.allJS, defaultAssets.client.js, testAssets.tests.server, testAssets.tests.client, testAssets.tests.e2e))
		.pipe(plugins.jshint())
		.pipe(plugins.jshint.reporter('default'))
		.pipe(plugins.jshint.reporter('fail'));
});


// JS minifying task
gulp.task('uglify', function () {
	return gulp.src(defaultAssets.client.js)
		.pipe(plugins.ngAnnotate())
		.pipe(plugins.uglify({
			mangle: false
		}))
		.pipe(plugins.concat('application.min.js'))
		.pipe(gulp.dest('public/dist'));
});

// CSS minifying task
gulp.task('cssmin', function () {
	return gulp.src(defaultAssets.client.css)
		.pipe(plugins.cssmin())
		.pipe(plugins.concat('application.min.css'))
		.pipe(gulp.dest('public/dist'));
});

// Less task
gulp.task('less', function () {
	return gulp.src(defaultAssets.client.less)
		.pipe(plugins.less())
		.pipe(plugins.rename(function (path) {
			path.dirname = path.dirname.replace('/less', '/css');
		}))
		.pipe(gulp.dest('./modules/'));
});

// Mocha tests task
gulp.task('mocha', function (done) {
	// Open mongoose connections
	var mongoose = require('./config/lib/mongoose.js');
	var error;

	// Connect mongoose
	mongoose.connect(function() {
		// Run the tests
		gulp.src(testAssets.tests.server)
			.pipe(plugins.mocha({
				reporter: 'spec',
				timeout: 4000
			}))
			.on('error', function (err) {
				// If an error occurs, save it
				error = err;
			})
			.on('end', function() {
				// When the tests are done, disconnect mongoose and pass the error state back to gulp
				mongoose.disconnect(function() {
					done(error);
				});
			});
	});

});

// Karma test runner task
gulp.task('karma', function (done) {
	return gulp.src([])
		.pipe(plugins.karma({
			configFile: 'karma.conf.js',
			action: 'run',
			singleRun: true
		}));
});

// Selenium standalone WebDriver update task
gulp.task('webdriver-update', plugins.protractor.webdriver_update);

// Protractor test runner task
gulp.task('protractor', function () {
	gulp.src([])
		.pipe(plugins.protractor.protractor({
			configFile: 'protractor.conf.js'
		}))
		.on('error', function (e) {
			throw e;
		});
});

// Lint CSS and JavaScript files.
gulp.task('lint', function(done) {
	runSequence('less', ['csslint', 'jshint'], done);
});

// Lint project files and minify them into two production files.
gulp.task('build', function(done) {
	runSequence('env:dev' ,'lint', ['uglify', 'cssmin'], done);
});

// Run the project tests
gulp.task('test', function(done) {
	runSequence('env:test', 'lint', 'mocha', 'karma', done);
});

// Run the project in development mode
gulp.task('default', function(done) {
	runSequence('env:dev', 'lint', ['nodemon', 'watch'], done);
});

// Run the project in debug mode
gulp.task('debug', function(done) {
	runSequence('env:dev', 'env:DEBUG', 'lint', ['nodemon', 'watch'], done);
});

// Run the project in production mode
gulp.task('prod', function(done) {
	runSequence('env:prod', 'node', done);
});

// Run the project in stage mode
gulp.task('stage', function(done) {
	runSequence('env:stage', 'node', done);
});

// Run the worker in development mode
gulp.task('dev-worker', function(done) {
	runSequence('env:dev', 'jshint', 'workermon', done);
});

// Run the worker in stage mode
gulp.task('stage-worker', function(done) {
	runSequence('env:stage', 'jshint', 'worker', done);
});


