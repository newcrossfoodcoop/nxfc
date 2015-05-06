'use strict';

angular.module('ghost').controller('GhostController', ['$scope', '$stateParams', '$location', '$sce', 'Authentication', 'Ghost',
	function($scope, $stateParams, $location, $sce, Authentication, Ghost) {
		$scope.authentication = Authentication;

		Ghost.login().then(function() {
		    $scope.adminSrc = '/cms/ghost';
		    $scope.previewSrc = '/cms';
		});
		
	}
]);
