'use strict';

var _ = require('lodash');

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
var path = require('path');
var productsApi = require(path.resolve('./config/lib/apis')).catalogue.api.resources.products;

var OrderItemSchema = new Schema({
    _product: { type: Schema.Types.ObjectId, ref: 'Product' },
    price: Number,
    total: Number,
    name: String,
    quantity: {
        type: Number,
        min: 1,
        default: 1
    },
    updated: {
		type: Date,
		default: Date.now
	},
	created: {
		type: Date,
		default: Date.now
	},
});

OrderItemSchema.pre('save', function(next) {
    var item = this;
    item.total = item.price * item.quantity;
    next();
});

/**
 * Order Schema
 */
var OrderSchema = new Schema({
	state: {
		type: String,
		enum: ['new', 'submitted', 'redirected', 'gotdetails','confirmed', 'cancelled', 'deleted'],
		required: 'state must be defined'
	},
	items: [ OrderItemSchema ],
	total: {
	    type: Number,
	    min: 0
	},
	updated: {
		type: Date,
		default: Date.now
	},
	created: {
		type: Date,
		default: Date.now
	},
	payments: [{
	    type: Schema.ObjectId,
	    ref: 'Payment'
	}],
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
//	collectionDetails: {
//	    type: Schema.ObjectId,
//		ref: 'Collection',
////		required: 'all orders must be associated with a collection'
//	},
	orderType: {
	    type: String,
	    enum: ['supplier', 'customer'],
	    default: 'customer'
	}
});

OrderSchema.methods.getPayment = function getPayment() {
    return this.payments[0];
};

var Order = mongoose.model('Order', OrderSchema);
var OrderItem = mongoose.model('OrderItem', OrderItemSchema);

// Order total is always validated
OrderSchema.pre('validate', function(next) {
    var order = this;

    console.log('validating order');

    // Essentially we are populating from the catalogue api
    productsApi.get({
        itemsperpage: order.items.length,
        ids: _.map(order.items, '_product')
    }).then(function(res) {
        console.log(res.body);
        var products = _.keyBy(res.body,'_id');
        order.total = _(order.items)
            .map(function(item) {
                item._product = products[item._product];
                item.price = item._product.price;
                item.name = item._product.name;
                item.price = (item.price ? item.price : 0);
                item.total = item.price * item.quantity;
                return item.total;
            })
            .reduce(function(total,subtot) { return total + subtot; },0);
        
        next();
    }).catch(function(err) {
        next(err);
    });

});
