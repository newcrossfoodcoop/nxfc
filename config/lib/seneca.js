'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
    path = require('path'),
    seneca = require('seneca')();

exports.initWorkerActions = function(seneca) {
	config.files.worker.actions.forEach(function (actionsPath) {
		seneca.use(path.resolve(actionsPath));
	});
};

/**
 * Initialize the Seneca application
 */
module.exports.init = function (db) {
    this.initWorkerActions(seneca);
    
    return seneca;
};
