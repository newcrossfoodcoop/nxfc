'use strict';

angular.module('core').controller('StateController', ['$scope', '$state',
	function($scope, $state) {
		// Expose view variables
		$scope.$state = $state;
	}
]);
