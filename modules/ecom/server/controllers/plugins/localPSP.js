'use strict';

var path = require('path'), 
    util = require('util'),
    url = require('url'),
    _ = require('lodash');

var mongoose = require('mongoose'),
	LocalPSP = mongoose.model('LocalPSP');

module.exports = function(config) {

    exports.initiatePayment = function initiatePayment(order, callback) {

        var params = {
            'intent': 'sale',
            'payer': {
                'payment_method': 'localPSP',
            },
            'transactions': [{
                'amount': {
                    'total': order.total,
                    'currency': 'GBP',
                },
                'description': 'This is the payment transaction description.' }
            ],
            'redirect_urls': {
                return_url: util.format(config.returnUrl, order._id),
                cancel_url: util.format(config.cancelUrl, order._id),
            }
        };
        
        LocalPSP.create(params, callback);
    };

    exports.approvalRedirectUrl = function approvalRedirectUrl(order) {
        return util.format(config.returnUrl, order._id) + '?token=TOKEN&PayerID=localpayer';
    };

    exports.rejectToken = function rejectToken(order,req,token) {
        return 'TOKEN' !== token;
    };

    exports.getPaymentDetails = function getPaymentDetails(order,callback) {
        var paymentId = order.getPayment().transactions.initial.id;
        LocalPSP.findById(paymentId).exec(callback);
    };

    exports.capturePayment = function capturePayment(order,callback) {
        var payment = order.getPayment();
        var paymentId = payment.transactions.initial._id;
        LocalPSP.findById(paymentId).exec(function(err,pspRecord) {
            if (err) return callback(err);
            if (pspRecord.state !== 'initial') return callback(new Error('not in initial state'));
            pspRecord.state = 'done';
            pspRecord.save(function(_err){
                callback(_err,{ state: 'done' });
            });
        });
    };

    //TODO 
    exports.populatePaymentsArgs = function poplulatePaymentsArgs(req,token) {
        return 'payments';
    };

    return exports;
};

