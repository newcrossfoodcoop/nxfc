'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

/**
 * Get the error message from error object
 */
 
 exports.sendError = function (err, res) {
    res.status(err.code || 500);
    
    if (!_.isArray(err)) {
        err = [err];
    }
    
    _.forEach(err,function(error) {
        console.error(error.message);
        switch (process.env.NODE_ENV) {
            case 'development':
            case 'test':
                console.error(error.stack);
                break;
            default:
                _.omit(error,'stack');
        }
    });
    
    res.json(err);
 };
