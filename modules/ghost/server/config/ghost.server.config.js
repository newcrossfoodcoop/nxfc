'use strict';

/**
 * Module dependencies.
 */
 
var path = require('path'),
    config = require(path.resolve('./config/config')),
    ghost = require('ghost'),
    _ = require('lodash');

/**
 * Generate default config for the module and merge it into the main config
 *
 * Since starting up ghost means waiting for a promise to be fulfilled we have
 * to stake our claim in the express routing stack and redirect it to our ghost
 * server once it's up
 */

module.exports = function(app, db) {
    
    var ghostDefaultConf = {
        modules: {
            ghost: {
                subdir: '/cms',
                salt: 'meanjsghost',
                ownerEmail: ''
            }
        }
    };
    
    _.merge(config, ghostDefaultConf, function(a,b){
        if (!_.isObject(a) && !_.isArray(a) && !_.isUndefined(a)) { return a; } 
    });
    
    config.modules.ghost.ghostServerRootApp = function (req, res, next) {
        if (config.modules.ghost.ghostServer) {
            return config.modules.ghost.ghostServer.rootApp(req, res, next);
        }
        else {
            return res.status(500).send('Ghost server is not ready yet!');
        }
    };
    
    ghost({
        config: path.join(__dirname, '../content/config/ghost.server.content.config.js')
    }).then(function (ghostServer) {
        config.modules.ghost.ghostServer = ghostServer;
        ghostServer.start(app);
    });
    
};
