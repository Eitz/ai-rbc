(function(){
angular
	.module('RBC')
	.controller('OutputController', function ($scope, parserService, dataService) {
		
		$scope.data = {};
		
		$scope.data.dataset = dataService.getDataset();
		$scope.data.titles = dataService.getTitles();

		$scope.$watch('data.search', function() {
    	$scope.data.sortBySimilarity();
		}, true);
		
		$scope.data.sortBySimilarity = function () {
			dataService.datasetSortedBySimilarityTo($scope.data.search, true);
		};

		dataService.onModify(function () {
			$scope.data.sortBySimilarity();
		});
	})
})()