'use strict';

var dbaddr = process.env['NXFC_MONGO_PORT_27017_TCP_ADDR'] || process.env['NXFC-MONGO_PORT_27017_TCP_ADDR'] || 'localhost';

module.exports = {
	db: 'mongodb://' + dbaddr + '/mean-test',
	port: 3001,
	app: {
		title: 'NXFC - Test Environment'
	}
};
