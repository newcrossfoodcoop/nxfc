'use strict';

module.exports = {
	app: {
		title: 'NXFC',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'mongodb, express, angularjs, node.js, mongoose, passport',
		googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	ownerUsername: process.env.OWNER || 'OWNER',
	ownerEmail: process.env.OWNER_EMAIL || 'OWNER_EMAIL' + '@a.b'
};
