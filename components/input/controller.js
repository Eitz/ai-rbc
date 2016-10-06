(function(){
angular
	.module('RBC')
	.controller('InputController', function ($scope, parserService, dataService) {

		$scope.fileInput = undefined;

		$scope.onFileLoaded = function() {
			let parsedOutput = parserService.parseCSV($scope.fileInput, ',');
			dataService.setDataset(parsedOutput.titles, parsedOutput.dataset)
			$scope.titles = dataService.getTitles();
			$scope.$apply();
	  }

	  $scope.onFileLoadingError = function() {
	  	console.log("Error loading file!");
	  }

	  $scope.onFileLoadingProgress = function(total, current) {
	  	// console.log(current + "/" + total);
	  }

	  $scope.onChangeWeight = function (key, value) {
	  	dataService.setKeyWeight(key, value);
	  }

	  $scope.onChangeActive = function (key, value) {
	  	console.log(key, value);
	  	dataService.setKeyActive(key, value);
	  }

	})
})()