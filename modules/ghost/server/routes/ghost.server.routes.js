'use strict';

/**
 * Module dependencies.
 */
var ghostPolicy = require('../policies/ghost.server.policy'),
    path = require('path'),
    middleware = require(path.resolve('./node_modules/ghost/core/server/middleware')).middleware,
    ghostController = require('../controllers/ghost.server.controller'),
    helmet = require('helmet'),
    config = require(path.resolve('./config/config')).modules.ghost;

module.exports = function(app) {
    
    // authentication and setup
	app.route('/api/ghost/login').get(
	    ghostPolicy.isAllowed,
	    ghostController.ensureSetup,
	    ghostController.findUser,
	    ghostController.andSyncUser,
	    ghostController.orCreateUser,
	    ghostController.prepAuthentication,
        middleware.addClientSecret,
        middleware.authenticateClient,
        middleware.generateAccessToken
	);
	
	// public routes
	app.route('/api/ghost/posts/slug/:slug').get(
	    ghostController.read
	);
    app.param('slug', ghostController.postById);
    
    app.route('/api/ghost/posts/tag/:tag').get(
	    ghostController.query
	);
    app.param('tag', ghostController.postsByTag);
    
    // routes to ghost's UI
    app.use(
        config.subdir,
        helmet.xframe('sameorigin'),
        ghostPolicy.isAllowed,
        config.ghostServerRootApp
    );

};
