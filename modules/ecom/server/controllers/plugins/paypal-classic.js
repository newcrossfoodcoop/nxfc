'use strict';

var path = require('path'), 
    util = require('util'),
    PaypalEC = require('paypal-ec'),
    _ = require('lodash');

module.exports = function(config) {

    var cred = {
        username  : config.username,
        password  : config.password,
        signature : config.signature,
    };

    var opts = {
      sandbox : config.sandbox,
      version : '117.0'
    };

    var ec = new PaypalEC( cred, opts );

    exports.initiatePayment = function initiatePayment(order, callback) {

        var params = {
            returnUrl : util.format(config.returnUrl, order._id),
            cancelUrl : util.format(config.cancelUrl, order._id),
            SOLUTIONTYPE                    : 'sole',
            PAYMENTREQUEST_0_AMT            : order.total,
            PAYMENTREQUEST_0_DESC           : 'Something',
            PAYMENTREQUEST_0_CURRENCYCODE   : 'GBP',
            PAYMENTREQUEST_0_PAYMENTACTION  : 'Order',
            BRANDNAME                       : 'HatchamSmokeHouse.co.uk',
            PAYMENTREQUEST_0_SELLERPAYPALACCOUNTID : 'ben@hatchemsmokehouse.co.uk'
        };
        
        ec.set(params, callback);
    };

    exports.approvalRedirectUrl = function approvalRedirectUrl(order) {
        return order.getPayment().transactions.initial.PAYMENTURL;
    };

    exports.rejectToken = function rejectToken(order,req,token) {
        return order.getPayment().transactions.initial.TOKEN !== req.body.token;
    };

    exports.getPaymentDetails = function getPaymentDetails(order,callback) {
        ec.get_details(order.getPayment().transactions.info,callback);
    };

    exports.capturePayment = function capturePayment(order,callback) {
        ec.do_payment(order.getPayment().transactions.details,callback);
    };

    //TODO 
    exports.populatePaymentsArgs = function poplulatePaymentsArgs(req,token) {
        return 'payments';
    };

    return exports;

};
