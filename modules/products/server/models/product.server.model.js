'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ProductOptionSchema = new Schema({
    name: String,
    values: [ String ]
});

/**
 * Product Schema
 */
var ProductSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Product name',
		trim: true
	},
	description: {
	    type: String,
	    default: '',
	    trim: true
	},
	price: Number,
	productOptions: [ ProductOptionSchema ],
	updated: {
	    type: Date,
	    default: Date.now
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Product', ProductSchema);
