'use strict';

angular.module('home').controller('PageController', ['$scope', '$state', 'Authentication',
	function($scope, $state, Authentication) {
		// Expose view variables
		$scope.$state = $state;
		$scope.authentication = Authentication;
        $scope.getSlug = function() {
	        return $state.current.name.replace(/\./g,'-');
	    };
	}
]);
