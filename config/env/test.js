'use strict';

module.exports = {
	db: 'mongodb://' + (process.env.MONGO_ADDR_VAR ? process.env[process.env.MONGO_ADDR_VAR] : 'localhost') + '/mean-test',
	port: 3001,
	app: {
		title: 'NXFC - Test Environment'
	}
};
