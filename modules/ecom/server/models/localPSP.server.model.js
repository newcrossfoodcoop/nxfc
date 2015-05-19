'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('lodash');
	
var LocalPSPSchema = new Schema({
    'intent': {
        type: String,
        required: 'MISSING INTENT'
    },
    'payer': {
        'payment_method': {
            type: String,
            required: 'MISSING PAYER PAYMENT_METHOD'
        },
    },
    'transactions': {
        type: [{
            'amount': {
                'total': { 
                    type: Number,
                    required: 'MISSING TOTAL'
                },
                'currency': {
                    type: String,
                    enum: ['GBP'],
                    default: 'GBP'
                }
            },
            'description': String 
        }],
        default: []
    },
    'redirect_urls': {
        return_url: String,
        cancel_url: String,
    },
    'state': {
        type: String,
        enum: ['initial', 'done'],
        default: 'initial',
        required: 'MISSING STATE'
    }
});

mongoose.model('LocalPSP', LocalPSPSchema);
