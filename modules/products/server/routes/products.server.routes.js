'use strict';

var productsPolicy = require('../policies/products.server.policy'),
    products = require('../controllers/products.server.controller');

module.exports = function(app) {

	// Products Routes
	app.route('/api/products').all(productsPolicy.isAllowed)
	    .get(products.list)
		.post(products.create);

    app.route('/api/products/count').all(productsPolicy.isAllowed)
		.get(products.count);
	
	app.route('/api/products/tags').all(productsPolicy.isAllowed)
		.get(products.tags);
		
	app.route('/api/products/brands').all(productsPolicy.isAllowed)
		.get(products.brands);

    app.route('/api/products/suppliercodes').all(productsPolicy.isAllowed)
		.get(products.supplierCodes);

	app.route('/api/products/:productId').all(productsPolicy.isAllowed)
		.get(products.read)
		.put(products.update)
		.delete(products.delete);

	// Finish by binding the Product middleware
	app.param('productId', products.productByID);
};
