'use strict';

var suppliersPolicy = require('../policies/suppliers.server.policy'),
    suppliers = require('../controllers/suppliers.server.controller');

module.exports = function(app) {

	// suppliers Routes
	app.route('/api/suppliers').all(suppliersPolicy.isAllowed)
		.get(suppliers.list)
		.post(suppliers.create);

	app.route('/api/suppliers/:supplierId').all(suppliersPolicy.isAllowed)
		.get(suppliers.read)
		.put(suppliers.update)
		.delete(suppliers.delete);

	// Finish by binding the supplier middleware
	app.param('supplierId', suppliers.supplierByID);
};
