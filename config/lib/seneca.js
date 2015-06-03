'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
    path = require('path'),
    seneca = require('seneca');

exports.initWorkerActions = function(app) {
	config.files.worker.actions.forEach(function (actionsPath) {
		require(path.resolve(actionsPath))(app);
	});
};

/**
 * Initialize the Express application
 */
module.exports.init = function (db) {
	// Initialize seneca app
    var app = seneca();
    
    this.initWorkerActions(app);
    
    return app;
};
