'use strict';

//ingests service used to communicate ingests REST endpoints
angular.module('ecom').factory('Ingests', ['$resource',
	function($resource) {
		return $resource('/api/10/ingests/:ingestId', { ingestId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			run: {
			    method: 'GET',
			    url: '/api/10/ingests/:ingestId/start-run'
			},
			logInfo: {
			    method: 'GET',
			    url: '/api/10/ingests/runs/:ingestLogId'
			},
			logEntries: {
			    method: 'GET',
			    url: '/api/10/ingests/runs/:ingestLogId/log',
			    isArray: true
			},
			logsQuery: {
			    method: 'GET',
			    url: '/api/10/ingests/:ingestId/runs',
			    isArray: true
			}
		});
	}
]);
