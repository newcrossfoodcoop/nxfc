'use strict';

var path = require('path'),
    pkgjson = require(path.resolve('./package.json'));

function getEnvValue(varName, fallback) {
    if (process.env[varName]) {
        return process.env[varName];
    }
    if (process.env[varName + '_VAR']) {
        return process.env[process.env[varName + '_VAR']];
    }
    return fallback;
}

module.exports = {
	app: {
		title: 'NXFC',
		description: 'NXFC Gateway',
		keywords: 'mongodb, express, angularjs, node.js, mongoose, passport',
		googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID',
		version: pkgjson.version || 'VERSION'
	},
	facebook: {
        clientID: process.env.FACEBOOK_ID || 'APP_ID',
        clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
        callbackURL: '/api/auth/facebook/callback'
    },
    twitter: {
        clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
        clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
        callbackURL: '/api/auth/twitter/callback'
    },
    google: {
        clientID: process.env.GOOGLE_ID || 'APP_ID',
        clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
        callbackURL: '/api/auth/google/callback'
    },
    linkedin: {
        clientID: process.env.LINKEDIN_ID || 'APP_ID',
        clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
        callbackURL: '/api/auth/linkedin/callback'
    },
    github: {
        clientID: process.env.GITHUB_ID || 'APP_ID',
        clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
        callbackURL: '/api/auth/github/callback'
    },
    mailer: {
        from: process.env.MAILER_FROM || 'MAILER_FROM',
        options: {
            service: process.env.MAILER_SERVICE_PROVIDER,
            host: process.env.MAILER_HOST,
            port: process.env.MAILER_PORT,
            secure: process.env.MAILER_SECURE,
            tls: (process.env.MAILER_REJECT_UNAUTHORISED ? {rejectUnauthorized: false} : {rejectUnauthorized: true}),
            auth: {
                user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
                pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
            }
        }
    },
    mongo: {
        host: getEnvValue('MONGO_HOST','localhost')
    },
    catalogue: {
        host: getEnvValue('CATALOGUE_HOST','localhost'),
        path: '/api',
        port: 3010
    },
    ghost: {
        host: getEnvValue('GHOST_HOST','localhost'),
        path: '',
        port: 3020
    },
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	ownerUsername: process.env.OWNER || 'OWNER',
	externalAddress: process.env.EXTERNAL_ADDRESS || 'localhost:' + (process.env.PORT || 3000)
};
