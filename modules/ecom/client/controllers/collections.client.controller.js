'use strict';

angular.module('ecom').controller('CollectionsController', [
    '$scope', '$stateParams', '$location', 'Authorisation', 'Collections', 'Suppliers',
	function($scope, $stateParams, $location, Authorisation, Collections, Suppliers) {
		$scope.authorisation = Authorisation;
		$scope.suppliers = Suppliers.query();

		$scope.create = function() {
			var collection = new Collections({
				location: this.location,
				pickupWindowStart: this.pickupWindowStart,
				pickupWindowEnd: this.pickupWindowEnd,
				deliveryWindowStart: this.deliveryWindowStart,
				deliveryWindowEnd: this.deliveryWindowEnd,
				suppliers: this.suppliers
			});
			collection.$save(function(response) {
				$location.path('collections/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(collection) {
			if (collection) {
				collection.$remove();

				for (var i in $scope.collections) {
					if ($scope.collections[i] === collection) {
						$scope.collections.splice(i, 1);
					}
				}
			} else {
				$scope.collection.$remove(function() {
					$location.path('collections');
				});
			}
		};

		$scope.update = function() {
			var collection = $scope.collection;

			collection.$update(function() {
				$location.path('collections/' + collection._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.collections = Collections.query();
		};

		$scope.findOne = function() {
			$scope.collection = Collections.get({
				collectionId: $stateParams.collectionId
			});
		};
	}
]);
