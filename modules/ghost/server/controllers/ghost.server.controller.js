'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	config = require(path.resolve('./config/config')).modules.ghost,
	errorHandler = require('./errors.server.controller'),
	crypto = require('crypto'),
	CONTEXT = {internal: true};

function api() {
    return config.ghostServer.api;
}

function hashPassword(password) {
    var hash = crypto.pbkdf2Sync(password, new Buffer(config.salt, 'base64'), 10000, 16).toString('base64');
    return hash;
}

function promiseGhostRoleId(roles) {
    var ghostRole;
    if (_.intersection(['admin','ghost-admin'], roles).length) {
        ghostRole = 'Administrator';
    }
    else if (_.find('ghost-editor', roles)) {
        ghostRole = 'Editor';
    }
    else if (_.find('ghost-editor', roles)) {
        ghostRole = 'Author';
    }

    return config.ghostServer.then(function(ghostServer) {
        return ghostServer.api.roles.browse({context: CONTEXT});
    }).then(function (results) {
        var role = _.find(results.roles, {name: ghostRole});
        if (role) {
            return role.id;
        }
        else {
            throw new Error('RoleNotFound');
        }
    });

}

exports.ensureSetup = function(req, res, next) {
    if (!req.user) {
        errorHandler.sendError(new Error('cannot setup ghost, no user'),res);
    }
    
    // setup ghost if it hasn't been already
    return config.ghostServer.then(function(ghostServer) {
        return ghostServer.api.authentication.isSetup();
    }).then(function (result) {
        if (result.setup[0].status) {
            // nothing to do
            return;
        } 
        return config.ghostServer;
    }).then(function (ghostServer) {
        if (!ghostServer) { return; }
        return ghostServer.api.authentication.setupSilent({ setup: [{
            name: 'Owner',
            email: config.ownerEmail,
            password: hashPassword(config.ownerEmail),
        }]});
    }).then(function () {
        next();
    }).catch(_.partialRight(errorHandler.sendError, res));
};

exports.findUser = function(req, res, next) {
    config.ghostServer.then(function(ghostServer) {
        return ghostServer.api.users.read({context: CONTEXT, email: req.user.email, include: 'roles'});
    }).then(function (result) {
        req.ghostUser = result.users[0];
        return next();
    }).catch(function(err) {
        if (err && err.errorType === 'NotFoundError') {
            return next();
        }
        return errorHandler.sendError(err, res);
    });
};

exports.orCreateUser = function(req, res, next) {
    if (req.ghostUser) { return next(); }    
    
    var newUser = {
        name: req.user.displayName,
        email: req.user.email,
        password: hashPassword(req.user.id),
        status: 'active'
    };
    
    // create a new ghostUser for this user with appropriate ghost role
    return promiseGhostRoleId(req.user.roles).then(function (roleId) {
        newUser.roles = [roleId];
        return config.ghostServer;
    }).then(function(ghostServer) {
        return ghostServer.api.users.directAdd({users: [newUser]}, {context: CONTEXT});
    }).then(function(user) {
        req.ghostUser = user;
        return next();
    }).catch(_.partialRight(errorHandler.sendError, res));
};

exports.andSyncUser = function(req, res, next) {
    if (!req.ghostUser) { return next(); }

    //modify user to match current mean user settings if necassary
    promiseGhostRoleId(req.user.roles).then(function(roleId) {
        var newUserValues = {
            name: req.user.displayName
        };

        if (_.chain(req.ghostUser).
            pick(_.keys(newUserValues)).
            isEqual(newUserValues).
            valueOf() || roleId !== req.ghostUser.roles[0].id
        ){
            // nothing to do
            return;
        }
        
        newUserValues.roles = [roleId];
        _.assign(req.ghostUser, newUserValues);
        return config.ghostServer.then(function(ghostServer) {
            return ghostServer.api.users.edit({
                users: [req.ghostUser]}, {context: CONTEXT, id: req.ghostUser.id
            });
        });
    }).then(function(newUser) {
        if (newUser) { req.ghostUser = newUser; }
        next();
    }).catch(_.partialRight(errorHandler.sendError, res));
};

exports.prepAuthentication = function(req, res, next) {
    if (req.ghostUser && req.user) {
        req.body = {
            username: req.user.email, 
            password: hashPassword(req.user.id),
            grant_type: 'password',
            client_id: 'ghost-admin'
        };
        return next();
    }
    return next(new Error('missing ghostUser'));
};

exports.postById = function(req, res, next, id) {
    config.ghostServer.then(function(ghostServer) {
        return ghostServer.api.posts.read({slug: id});
    }).then(function(result) {
        req.ghostPost = result.posts[0];
        next();
    }).catch(_.partialRight(errorHandler.sendError, res));
};

exports.postsByTag = function(req, res, next, id) {
    config.ghostServer.then(function(ghostServer) {
        return ghostServer.api.posts.read({tag: id});
    }).then(function(result) {
        req.ghostPosts = result.posts[0];
        next();
    }).catch(_.partialRight(errorHandler.sendError, res));
};

exports.read = function(req, res) {
	res.json(req.ghostPost);
};

exports.query = function(req, res) {
    res.json(req.ghostPosts);
};
