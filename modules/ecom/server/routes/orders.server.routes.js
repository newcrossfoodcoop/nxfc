'use strict';

module.exports = function(app) {
	var orders = require('../controllers/orders.server.controller'),
	    ordersPolicy = require('../policies/orders.server.policy');

	// Orders Routes
	app.route('/api/orders').all(ordersPolicy.isAllowed)
		.get(orders.list);
		//.post(orders.create);

    app.route('/api/orders/history').all(ordersPolicy.isAllowed)
        .get(orders.history);

	app.route('/api/orders/:orderId').all(ordersPolicy.isAllowed)
		.get(orders.read)
		.delete(orders.delete);

	// Finish by binding the Order middleware
	app.param('orderId', orders.orderByID);
};
