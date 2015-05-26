'use strict';

// ingests controller
angular.module('products').controller('IngestsController', [
            '$scope','$stateParams','$location','Authorisation','Ingests','Suppliers',
	function($scope,  $stateParams,  $location,  Authorisation,  Ingests,  Suppliers) {
		$scope.authorisation = Authorisation;

        $scope.suppliers = Suppliers.query();

		// Create new ingest
		$scope.create = function() {
			// Create new ingest object
			var ingest = new Ingests ({
				name: this.name
			});

			// Redirect after save
			ingest.$save(function(response) {
				$location.path('ingests/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.name = '';
		};

		// Remove existing ingest
		$scope.remove = function( ingest ) {
			if ( ingest ) { ingest.$remove();

				for (var i in $scope.ingests ) {
					if ($scope.ingests [i] === ingest ) {
						$scope.ingests.splice(i, 1);
					}
				}
			} else {
				$scope.ingest.$remove(function() {
					$location.path('ingests');
				});
			}
		};

		// Update existing ingest
		$scope.update = function() {
			var ingest = $scope.ingest ;

			ingest.$update(function() {
				$location.path('ingests/' + ingest._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of ingests
		$scope.find = function() {
			$scope.ingests = Ingests.query();
		};

		// Find existing ingest
		$scope.findOne = function() {
			$scope.ingest = Ingests.get({ 
				ingestId: $stateParams.ingestId
			});
		};
		
		$scope.runIngest = function() {
		    Ingests.run({
		        ingestId: $stateParams.ingestId
		    });
		};
	}
]);
