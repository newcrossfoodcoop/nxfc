'use strict';

var _ = require('lodash');

module.exports = function(app) {
    var active = app.locals.ecom.methods;

    var plugins = {};
    _.forEach(active, function(psp) {
        plugins[psp.name] = require('./' + psp.plugin)(psp);
    });
        
    exports.getSubController = function getSubController(method) {
        if (plugins[method]) return plugins[method];
        throw new Error('unrecognised method: ' + method);
    };

    exports.getActive = function getActive() {
        return _.map(active, function(psp) {
            return {
                name: psp.name,
                buttonImageUrl: psp.buttonImageUrl
            };
        });
    };

    return exports;
};
