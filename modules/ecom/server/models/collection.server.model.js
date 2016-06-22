'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
var collectionSchema = new Schema({
    'location': String,
    'pickupWindowStart': {
        type: Date,
        required: 'No pickup window start time set'
    },
    'pickupWindowEnd': {
        type: Date,
        required: 'No pickup window end time set'
    },
    'deliveryWindowStart': {
        type: Date,
        required: 'No delivery window start time set'
    },
    'deliveryWindowEnd': {
        type: Date,
        required: 'No delivery window end time set'
    },
    'suppliers': [{
        type: Schema.ObjectId,
	    ref: 'Supplier'
	}],
	'supplierOrders': [{
	    type: Schema.ObjectId,
	    ref: 'SupplierOrder'
	}],
    'state': {
        type: String,
        enum: ['new', 'active', 'closed', 'ordered', 'delivered', 'complete'],
        default: 'new'
    }
});

mongoose.model('Collection', collectionSchema);
