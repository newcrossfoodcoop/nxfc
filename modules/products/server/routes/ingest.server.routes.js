'use strict';

var ingestsPolicy = require('../policies/ingests.server.policy'),
    ingests = require('../controllers/ingests.server.controller');

module.exports = function(app) {

	// ingests Routes
	app.route('/api/ingests').all(ingestsPolicy.isAllowed)
		.get(ingests.list)
		.post(ingests.create);

	app.route('/api/ingests/:ingestId').all(ingestsPolicy.isAllowed)
		.get(ingests.read)
		.put(ingests.update)
		.delete(ingests.delete);

	// Finish by binding the ingest middleware
	app.param('ingestId', ingests.ingestByID);
};
