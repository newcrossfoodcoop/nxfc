'use strict';

var path = require('path'), 
    config = require(path.resolve('./config/config')).modules.ecom,
    util = require('util'),
    paypal = require('paypal-rest-sdk'),
    url = require('url'),
    _ = require('lodash');

module.exports = function(config) {

    paypal.configure({
      'mode': config.mode,
      'client_id': config.clientID,
      'client_secret': config.clientSecret
    });

    exports.initiatePayment = function initiatePayment(order, callback) {

        var params = {
            'intent': 'sale',
            'payer': {
                'payment_method': 'paypal',
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
        
        paypal.payment.create(params, callback);
    };

    exports.approvalRedirectUrl = function approvalRedirectUrl(order) {
        var link = _.find(order.getPayment().transactions.initial.links, { rel: 'approval_url' });
        return link.href;
    };

    exports.rejectToken = function rejectToken(order,req,token) {
        var link = _.find(order.getPayment().transactions.initial.links, { rel: 'approval_url' });
        var urlObj = url.parse(link.href, true);
        return urlObj.query.token !== token;
    };

    exports.getPaymentDetails = function getPaymentDetails(order,callback) {
        var paypalPaymentId = order.getPayment().transactions.initial.id;
        paypal.payment.get(paypalPaymentId,callback);
    };

    exports.capturePayment = function capturePayment(order,callback) {
        var payment = order.getPayment();
        var paypalPaymentId = payment.transactions.initial.id;
        paypal.payment.execute(paypalPaymentId, {payer_id: payment.transactions.info.PayerID}, callback);
    };

    //TODO 
    exports.populatePaymentsArgs = function poplulatePaymentsArgs(req,token) {
        return 'payments';
    };

    return exports;
};

