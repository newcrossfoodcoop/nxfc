'use strict';

module.exports = {
    db: process.env.MONGO_URI || 'mongodb://' + (process.env.NXFC_MONGO_PORT_27017_TCP_ADDR || 'localhost') + '/mean-stage',
    app: {
		title: 'NXFC - Stage Environment'
	}
};
