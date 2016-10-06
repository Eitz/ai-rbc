angular.module('RBC').service('parserService', function () {

	/**
   * Parse a CSV dataset
   * @param {string} csv - The dataset csv string
   * @param {string} separator - The single character separator of values
   */
	function parseCSV (csv, separator) {

		if (!separator)
			separator = ",";

		var titles = new Array();
		var dataset = new Array();

		var lines = csv.split("\n");
		titles = lines.shift().split(separator);

		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];
			
			var attrs = line.split(separator);
			var obj = {};

			for (var j = 0; j < attrs.length; j++)
				obj[titles[j]] = attrs[j];

			dataset.push(obj);
		}

		return { titles: titles, dataset: dataset }
	}

	return {
		parseCSV: parseCSV
	}

});