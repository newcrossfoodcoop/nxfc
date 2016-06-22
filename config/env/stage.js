'use strict';

module.exports = {
    db: process.env.MONGO_URI || 'mongodb://' + (process.env.MONGO_ADDR_VAR ? process.env[process.env.MONGO_ADDR_VAR] : 'localhost') + '/mean-stage',
    mysqlAddress: process.env.MYSQL_ADDR_VAR ? process.env[process.env.MYSQL_ADDR_VAR] : 'localhost',
    app: {
		title: 'NXFC - Stage Environment'
	}
};
