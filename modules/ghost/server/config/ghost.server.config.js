'use strict';

/**
 * Module dependencies.
 */
 
var path = require('path'),
    config = require(path.resolve('./config/config')),
    _ = require('lodash');

/**
 * Generate default config for the module and merge it into the main config
 *
 * Since starting up ghost means waiting for a promise to be fulfilled we have
 * to stake our claim in the express routing stack and redirect it to our ghost
 * server once it's up
 */

module.exports = function(app) {
    
};
