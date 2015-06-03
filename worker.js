'use strict';

/**
 * Module dependencies.
 */
var config = require('./config/config'),
	mongoose = require('./config/lib/mongoose'),
	seneca = require('./config/lib/seneca');

// Initialize mongoose
mongoose.connect(function (db) {
	// Initialize express
	var app = seneca.init(db);

	// Start the app by listening on <port>
	app.listen(config.workerPort);

	// Logging initialization
	console.log('NXFC-worker started on port ' + config.workerPort);
});
