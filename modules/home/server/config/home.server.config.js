'use strict';

exports = {
    useHolding: true, //process.env.HOLDING_USERNAME & process.env.HOLDING_PASSWORD,
    holdingUsername: process.env.HOLDING_USERNAME || 'HOLDING_USERNAME',
    holdingPassword: process.env.HOLDING_PASSWORD || 'HOLDING_PASSWORD'
};

module.exports = function(app, db) {
	// Root routing
	var core = require('../controllers/home.server.controller'), 
	    express = require('express');
	
	if (exports.useHolding) {
        app.use(express.static('../views/holding'));
        app.use(core.renderHoldingPage);

        // Basic auth for holding
        app.use(core.checkBasicAuth);
    }

    module.exports = exports;
};
