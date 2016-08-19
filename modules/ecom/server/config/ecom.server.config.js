'use strict';

var path = require('path'),
    config = require(path.resolve('./config/config')),
    _ = require('lodash');

var moduleConfig = {
    methods: [{
        name: 'local-psp',
        plugin: 'localPSP',
        returnUrl: 'http://' + config.externalAddress + '/checkout/local-psp/%s/redirected',
    }, {
        name: 'paypal-classic-sandbox',
        plugin: 'paypal-classic',
        username: process.env.PAYPAL_CLASSIC_USERNAME,
        password: process.env.PAYPAL_CLASSIC_PASSWORD,
        signature: process.env.PAYPAL_CLASSIC_SIGNATURE,
        sandbox: true,
        returnUrl : 'http://' + config.externalAddress + '/checkout/paypal-classic/%s/redirected',
        cancelUrl : 'http://' + config.externalAddress + '/checkout/paypal-classic/%s/cancelled',
        buttonImageUrl: 'https://www.paypal.com/en_GB/GB/i/btn/btn_xpressCheckout.gif'
    }, {
        name: 'paypal-rest-sandbox',
        plugin: 'paypal-rest',
        mode: 'sandbox',
        clientID: process.env.PAYPAL_REST_CLIENTID,
        clientSecret: process.env.PAYPAL_REST_CLIENTSECRET,
        returnUrl : 'http://' + config.externalAddress + '/checkout/paypal-rest/%s/redirected',
        cancelUrl : 'http://' + config.externalAddress + '/checkout/paypal-rest/%s/cancelled',
        buttonImageUrl: 'https://www.paypal.com/en_GB/GB/i/btn/btn_xpressCheckout.gif'
    }],
    worker: {
        host: config.workerHost,
        port: config.workerPort
    }
};

module.exports = function(app, db) {
    //TODO: this should be based on some config/env var
    moduleConfig.methods = _.filter(moduleConfig.methods, {name: 'local-psp'});

    app.locals.ecom = moduleConfig;
};
