'use strict';

/**
 * Module dependencies.
 */

module.exports = function(app) {
	// User Routes
	var home = require('../controllers/home.server.controller'),
	    policy = require('../policies/home.server.policy');
	
    // User activating their account
    app.route('/api/activate/:token').all(policy.isAllowed)
        .put(home.sendActivation)
        .get(home.validateActivationToken)
        .post(home.activate);
        
    //app.route('/register-interest').post(home.registerInterest);
    app.route('/register-interest').post(home.registerInterestAndSendActivation);
};
