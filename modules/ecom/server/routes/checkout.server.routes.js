'use strict';

module.exports = function(app) {
	var checkout = require('../controllers/checkout.server.controller')(app),
	    checkoutPolicy = require('../policies/checkout.server.policy');

    app.route('/api/checkout/config')
        .get(checkout.config);

	// Paypal Express Checkout Routes		
	app.route('/api/checkout/:method').all(checkoutPolicy.isAllowed)
	    .post(checkout.start);

	app.route('/api/checkout/:method/:checkoutOrderId/:token/redirected').all(checkoutPolicy.isAllowed)
	    .put(checkout.redirected);
	
	app.route('/api/checkout/:method/:checkoutOrderId/:token/confirm').all(checkoutPolicy.isAllowed)
	    .get(checkout.confirm);
	
	app.route('/api/checkout/:method/:checkoutOrderId/:token/cancelled').all(checkoutPolicy.isAllowed)
	    .put(checkout.cancelled);

	// Finish by binding the Order middleware
	app.param('checkoutOrderId', checkout.orderByID);
};
