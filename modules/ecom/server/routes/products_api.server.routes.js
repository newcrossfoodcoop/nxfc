'use strict';

//var ingestsPolicy = require('../policies/ingests.server.policy'),
//    ingestLogs = {}; //require('../controllers/ingest-logs.server.controller');

//module.exports = function(app) {

//    var ingests = {}; //require('../controllers/ingests.server.controller')(app);

//	// ingests Routes
//	app.route('/api/ingests').all(ingestsPolicy.isAllowed)
//		.get(ingests.list)
//		.post(ingests.create);

//	app.route('/api/ingests/:ingestId').all(ingestsPolicy.isAllowed)
//		.get(ingests.read)
//		.put(ingests.update)
//		.delete(ingests.delete);
//		
//	app.route('/api/ingests/:ingestId/run').all(ingestsPolicy.isAllowed)
//	    .get(ingests.run);

//	app.route('/api/ingests/:ingestId/logs').all(ingestsPolicy.isAllowed)
//	    .get(ingestLogs.list);
//	
//	app.route('/api/ingest-logs/:ingestLogId').all(ingestsPolicy.isAllowed)
//	    .get(ingestLogs.read);
//	
//	app.route('/api/ingest-logs/:ingestLogId/entries').all(ingestsPolicy.isAllowed)
//	    .get(ingestLogs.listEntries);

//	// Finish by binding the ingest middleware
//	app.param('ingestId', ingests.ingestByID);
//	app.param('ingestLogId', ingestLogs.ingestLogByID);
//};

//'use strict';

//var productsPolicy = require('../policies/products.server.policy'),
//    products = {}; // require('../controllers/products.server.controller');

//module.exports = function(app) {

//	// Products Routes
//	app.route('/api/products').all(productsPolicy.isAllowed)
//	    .get(products.list)
//		.post(products.create);

//    app.route('/api/products/count').all(productsPolicy.isAllowed)
//		.get(products.count);
//	
//	app.route('/api/products/tags').all(productsPolicy.isAllowed)
//		.get(products.tags);
//		
//	app.route('/api/products/brands').all(productsPolicy.isAllowed)
//		.get(products.brands);

//    app.route('/api/products/suppliercodes').all(productsPolicy.isAllowed)
//		.get(products.supplierCodes);

//	app.route('/api/products/:productId').all(productsPolicy.isAllowed)
//		.get(products.read)
//		.put(products.update)
//		.delete(products.delete);

//	// Finish by binding the Product middleware
//	app.param('productId', products.productByID);
//};

//'use strict';

//var suppliersPolicy = require('../policies/suppliers.server.policy'),
//    suppliers = {}; //require('../controllers/suppliers.server.controller');

//module.exports = function(app) {

//	// suppliers Routes
//	app.route('/api/suppliers').all(suppliersPolicy.isAllowed)
//		.get(suppliers.list)
//		.post(suppliers.create);

//	app.route('/api/suppliers/:supplierId').all(suppliersPolicy.isAllowed)
//		.get(suppliers.read)
//		.put(suppliers.update)
//		.delete(suppliers.delete);

//	// Finish by binding the supplier middleware
//	app.param('supplierId', suppliers.supplierByID);
//};

module.exports = function(app) {

};
