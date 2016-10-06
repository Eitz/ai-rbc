(function(){
angular
	.module('RBC')
	.controller('OutputController', function ($scope, parserService, dataService) {
		$scope.dataset = dataService.getDataset();
  		$scope.titles = dataService.getTitles();
	})
})()