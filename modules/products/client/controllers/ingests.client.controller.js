'use strict';

// ingests controller
angular.module('products').controller('IngestsController', [
            '$scope','$stateParams','$location','Authorisation','Ingests','Suppliers','lodash',
	function($scope,  $stateParams,  $location,  Authorisation,  Ingests,  Suppliers,  lodash) {
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
		    $scope.findIngestLogs();
			$scope.ingest = Ingests.get({ 
				ingestId: $stateParams.ingestId
			});
		};
		
		$scope.findIngestLogs = function() {
            $scope.ingestLogs = Ingests.logsQuery({ 
				ingestId: $stateParams.ingestId
			});
		};
		
		$scope.runIngest = function() {
		    $scope.disableRun = true;
		    var run = Ingests.run({
		        ingestId: $stateParams.ingestId
		    }, function() {
		        $scope.ingestLogs.unshift(Ingests.logInfo({
		            ingestId: $stateParams.ingestId,
		            ingestLogId: run.ingestLog
		        }));
		    });
		};
		
		$scope.reloadLog = function(id) {
		    var index = lodash.findIndex($scope.ingestLogs,{_id: id});
		    if (index >=0) {
		        $scope.disableReload = true;
		        var log = Ingests.logInfo({
		            ingestId: $stateParams.ingestId,
		            ingestLogId: id
		        }, function () {
		            $scope.ingestLogs[index] = log;
		            $scope.disableReload = false;
		        });
		    }
		};
		
		$scope.accordionClass = function(log) {
		    return { 
		        'panel-success': log.status === 'success', 
		        'panel-warning': log.status === 'new' || log.status === 'running',
		        'panel-danger': log.status === 'fail' 
		    };
		};
	}
]);
