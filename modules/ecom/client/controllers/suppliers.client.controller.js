'use strict';

// suppliers controller
angular.module('ecom').controller('SuppliersController', ['$scope', '$stateParams', '$location', 'Authorisation', 'Suppliers',
	function($scope, $stateParams, $location, Authorisation, Suppliers ) {
		$scope.authorisation = Authorisation;

		// Create new supplier
		$scope.create = function() {
			// Create new supplier object
			var supplier = new Suppliers ({
				name: this.name
			});

			// Redirect after save
			supplier.$save(function(response) {
				$location.path('suppliers/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.name = '';
		};

		// Remove existing supplier
		$scope.remove = function( supplier ) {
			if ( supplier ) { supplier.$remove();

				for (var i in $scope.suppliers ) {
					if ($scope.suppliers [i] === supplier ) {
						$scope.suppliers.splice(i, 1);
					}
				}
			} else {
				$scope.supplier.$remove(function() {
					$location.path('suppliers');
				});
			}
		};

		// Update existing supplier
		$scope.update = function() {
			var supplier = $scope.supplier ;

			supplier.$update(function() {
				$location.path('suppliers/' + supplier._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of suppliers
		$scope.find = function() {
			$scope.suppliers = Suppliers.query();
		};

		// Find existing supplier
		$scope.findOne = function() {
			$scope.supplier = Suppliers.get({ 
				supplierId: $stateParams.supplierId
			});
		};
	}
]);
