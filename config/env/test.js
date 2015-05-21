'use strict';

module.exports = {
	db: 'mongodb://' + (process.env.NXFC_MONGO_PORT_27017_TCP_ADDR || 'localhost') + '/mean-test',
	port: 3001,
	app: {
		title: 'NXFC - Test Environment'
	}
};
