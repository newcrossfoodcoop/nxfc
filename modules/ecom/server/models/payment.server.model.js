'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('lodash');

var transactionStates = ['initial', 'info', 'details', 'confirmation', 'cancelled'];
var transactionParams = {
    log: { 
        type: [{ 
            name: { type: String, enum: transactionStates }, 
            date: { type: Date, default: Date.now } 
        }],
        default: []
    }
};

_.forEach(transactionStates, function(state) {
    transactionParams[state] = { 
        type: Object, default: {} 
    };
});

var PaymentSchema = new Schema({
    orderId: { 
        type: Schema.Types.ObjectId,
        required: 'Payment must be associated with an order'
    },
    user: {
        type: Schema.Types.ObjectId,
        required: 'Payment must be associated with an user',
        ref: 'User'
    },
    state: {
        type: String,
        required: 'Payment must have a state'
    },
    method: {
        type: String,
        required: 'Payment must have a method'
    },
    transactions: transactionParams,
    updated: {
		type: Date,
		default: Date.now
	},
	created: {
		type: Date,
		default: Date.now
	},
});

PaymentSchema.methods.recordTransaction = function(name, content, callback) {
    this.transactions[name] = content;
    this.transactions.log.push({ 'name': name });
    this.state = name;
    this.markModified('transactions');
    this.markModified('transactions.' + name);
    this.markModified('transactions.log');
    this.save(callback);
};

var Payment = mongoose.model('Payment', PaymentSchema);
//var PaymentTransactions = mongoose.model('PaymentTransactions', PaymentTransactionSchema);
