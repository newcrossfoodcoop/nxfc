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
                ownerEmail: config.ownerEmail,
                mysqlAddress: config.mysqlAddress
            }
        }
    };
    
    _.merge(config, ghostDefaultConf, function(a,b){
        if (!_.isObject(a) && !_.isArray(a) && !_.isUndefined(a)) { return a; } 
    });
    
    config.modules.ghost.ghostServerRootApp = function (req, res, next) {
        if (config.modules.ghost.ghostServer) {
            config.modules.ghost.ghostServer.then(function(ghostServer) {
                ghostServer.rootApp(req, res, next);
            });
        }
        else {
            res.status(500).send('Ghost server not setup!');
        }
    };
    
    var makeGhost = config.modules.ghost.makeGhost = function makeGhost() {
        config.modules.ghost.ghostServer = ghost({
            config: path.join(__dirname, '../content/config/ghost.server.content.config.js')
        });
        return config.modules.ghost.ghostServer;
    };
     
    if (process.env.NODE_ENV !== 'test') {
        makeGhost().then(function(ghostServer) {
            console.log('starting ghost server...');
            ghostServer.start(app);
        });
    }
    
};
