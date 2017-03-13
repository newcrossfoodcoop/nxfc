'use strict';

// Authentication service for user variables
angular.module('users').factory('Authorisation', ['Authentication', 'lodash',
	function(Authentication, lodash) {
	    var _rules = {};
	    
	    function addRules(role, resources, permissions) {
            if (!lodash.isArray(resources)) { resources = [resources]; }
            if (!lodash.isArray(permissions)) { permissions = [permissions]; }
            
            lodash.forEach(resources, function(resource) {
                lodash.forEach(permissions, function(permission) {
                    if (!_rules[resource]) { _rules[resource] = {}; }
                    if (!_rules[resource][permission]) { _rules[resource][permission] = []; }
                    _rules[resource][permission] = lodash.union(_rules[resource][permission], [role]);
                });
            });
        }
	    
	    function allow(roles, resources, permissions) {
            if (lodash.isArray(roles)) {
                var groups = roles;
                lodash.forEach(groups, function(group) {
                    lodash.forEach(group.roles, function(role) {
                        addRules(role, group.resources, group.permissions);
                    });
                });
            }
            else {
                addRules(roles, resources, permissions);
            }
        }
        
        function isAllowed(resource, permission) {
            if (!_rules[resource]) { return true; }
            if (!_rules[resource][permission] && !_rules[resource]['*']) { return false; }
            var roles = Authentication.user ? Authentication.user.roles : ['guest'];

            if (lodash.intersection(roles, lodash.union(_rules[resource][permission],_rules[resource]['*'])).length) {
                return true;
            }
            else {
                return false;
            }
        }
	
	    return {
	        'allow': allow,
	        'isAllowed': isAllowed
	    };
	}
]);

// This is where state transitions are checked
angular.module('users').run(['$rootScope', 'Authorisation', 'lodash',
    function($rootScope, Authorisation, lodash) {
        $rootScope.$on('$stateChangeStart', function(e, to) {
            var result = to.name.split('.');
            if (!Authorisation.isAllowed(result[0],result[1])) {
                e.preventDefault();
            }
		});
	}
]);
