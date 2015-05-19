'use strict';

var paypalClassic = require('./paypal-classic'),
    paypalRest = require('./paypal-rest'),
    localPSP = require('./localPSP'),
    _ = require('lodash'),
    path = require('path'),
    config = require(path.resolve('./config/config')).modules.ecom;

var active = _.filter((config ? config.methods : []), {active: true});

var plugins = {};
_.forEach(active, function(psp) {
    plugins[psp.name] = require('./' + psp.plugin)(psp);
});
    
module.exports.getSubController = function getSubController(method) {
    if (plugins[method]) return plugins[method];
    throw new Error('unrecognised method: ' + method);
};

module.exports.getActive = function getActive() {
    return _.map(active, function(psp) {
        return {
            name: psp.name,
            buttonImageUrl: psp.buttonImageUrl
        };
    });
};
