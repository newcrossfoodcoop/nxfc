'use strict';

var ingestsPolicy = require('../policies/ingests.server.policy'),
    ingestLogs = require('../controllers/ingest-logs.server.controller');

module.exports = function(app) {

    var ingests = require('../controllers/ingests.server.controller')(app);

	// ingests Routes
	app.route('/api/ingests').all(ingestsPolicy.isAllowed)
		.get(ingests.list)
		.post(ingests.create);

	app.route('/api/ingests/:ingestId').all(ingestsPolicy.isAllowed)
		.get(ingests.read)
		.put(ingests.update)
		.delete(ingests.delete);
		
	app.route('/api/ingests/:ingestId/run').all(ingestsPolicy.isAllowed)
	    .get(ingests.run);

	app.route('/api/ingests/:ingestId/logs').all(ingestsPolicy.isAllowed)
	    .get(ingestLogs.list);
	
	app.route('/api/ingest-logs/:ingestLogId').all(ingestsPolicy.isAllowed)
	    .get(ingestLogs.read);
	
	app.route('/api/ingest-logs/:ingestLogId/entries').all(ingestsPolicy.isAllowed)
	    .get(ingestLogs.listEntries);

	// Finish by binding the ingest middleware
	app.param('ingestId', ingests.ingestByID);
	app.param('ingestLogId', ingestLogs.ingestLogByID);
};
