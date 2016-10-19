'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	defaultAssets = require('./config/assets/default'),
	testAssets = require('./config/assets/test');

// Karma configuration
module.exports = function(karmaConfig) {
	karmaConfig.set({
		// Frameworks to use
		frameworks: ['jasmine'],

		// List of files / patterns to load in the browser
		files: _.union(defaultAssets.client.lib.js, defaultAssets.client.lib.tests, defaultAssets.client.js, testAssets.tests.client),

		// Test results reporter to use
		// Possible values: 'dots', 'progress', 'mocha', 'coverage'
		reporters: ['mocha'],

		// Web server port
		port: 9876,
		hostname: process.env.HOSTNAME || 'localhost',

		// Enable / disable colors in the output (reporters and logs)
		colors: true,

		// Level of logging
		// Possible values: karmaConfig.LOG_DISABLE || karmaConfig.LOG_ERROR || karmaConfig.LOG_WARN || karmaConfig.LOG_INFO || karmaConfig.LOG_DEBUG
		logLevel: karmaConfig.LOG_INFO,

		// Enable / disable watching file and executing tests whenever any file changes
		//autoWatch: true,

		// Start these browsers, currently available:
		// - Firefox
		// - PhantomJS
		browsers: ['Firefox'],

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 60000,

		// Continuous Integration mode
		// If true, it capture browsers, run tests and exit
		singleRun: true
	});
};
