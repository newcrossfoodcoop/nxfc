'use strict';

module.exports = {
    db: process.env.MONGO_URI || 'mongodb://' + (process.env.MONGO_ADDR_VAR ? process.env[process.env.MONGO_ADDR_VAR] : 'localhost') + '/mean-stage',
    app: {
		title: 'NXFC - Stage Environment'
	}
};
