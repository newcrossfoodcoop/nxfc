'use strict';

//Ghost service used for communicating with the ghost api
angular.module('ghost').factory('Ghost', ['$http', 'localStorageService',
	function($http, localStorageService) {
	    return {
	        login: function() {
	            return $http.get('api/ghost/login').
                    success(function(data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available
                        
                        data.authenticator = 'simple-auth-authenticator:oauth2-password-grant';
                        data.expires_at = data.expires_in + Date.now();
                        
                        localStorageService.set('ghost-cms:session',data);
                    }).
                    error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        console.log('ghost login failure');
                    });
            }
	    };
	}
]).factory('GhostPosts', ['$http',
	function($http) {
	    return {
            read: function(options) {
                return $http.get('api/ghost/posts/slug/' + options.slug).
                    success(function(data, status, headers, config) {
                        //console.log(data);
                        return data;
                    });
            },
            query: function(options) {
                return $http.get('api/ghost/posts/tag/' + options.tag).
                    success(function(data, status, headers, config) {
                        //console.log(data);
                        return data;
                    });
            }
	    };
	}
]);
