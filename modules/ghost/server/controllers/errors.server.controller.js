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
    
    console.error(err.message);
    switch (process.env.NODE_ENV) {
        case 'development':
            console.error(err.stack); 
    }
    
    res.json(_.omit(err,'stack'));
 };
