'use strict';

module.exports = {
	db: 'mongodb://' + (process.env.MONGO_ADDR_VAR ? process.env[process.env.MONGO_ADDR_VAR] : 'localhost') + '/mean-dev',
	app: {
		title: 'NXFC - Development Environment'
	}
};
