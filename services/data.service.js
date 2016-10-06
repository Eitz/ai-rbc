angular.module('RBC').service('dataService', function () {

	var dataset = new Array()
	var titles = new Array()

	var maxCache = {}
	var minCache = {}

	/**
   * Store the dataset
   * @param {Array} dataset - The dataset array
   */
	function setDataset (_titles, _dataset) {
		if (!(_titles instanceof Array))
			return console.error("The \"titles\" wasn't an Array instance!");

		if (_dataset instanceof Array)
			dataset = _dataset;
		else
			return console.error("The \"dataset\" wasn't an Array instance!");

		for (var i=0; i<_titles.length; i++) {
			var title = { name: _titles[i], isNumeric: true, value: 1 };

			for (var j=0; j<dataset.length; j++) {
				if (dataset[j][title.name] && !isNumeric(dataset[j][title.name])) {
					title.isNumeric = false;
					break;
				}
			}

			titles.push(title);
		}		
	}

	/**
   * Store the dataset
   * @param {Array} dataset - The dataset array
   */
	function getDataset () {
		return dataset;
	}

	/**
   * Return the titles array
   */
	function getTitles () {
		return titles;
	}

	/**
   * Return the title
   */
	function getTitle (titleName) {
		for(var i = 0; i < titles.length; i++){
			if (titles[i].name == titleName){
				return titles[i];
			}
		}

		return undefined;
	}

	/**
   * Retrieve the Max value of the respective key from the dataset
   * @param {string} key - The key of the dataset to be retrieved
   */
	function getMaxOf(key) {
		if (maxCache[key] != undefined)
			return maxCache[keyName];
		
		var max = 0;
		for (var row of dataset)
			if (getAsNumber(row[key]) > max)
				max = row[key];

		cache[key] = max;
		return max;
	}

	/**
   * Retrieve the Min value of the respective key from the dataset
   * @param {string} key - The key of the dataset to be retrieved
   */
	function getMinOf(key) {
		if (minCache[key] != undefined)
			return minCache[keyName];
		
		var max = 0;
		for (var row of dataset)
			if (getAsNumber(row[key]) > max)
				max = row[key];

		minCache[key] = max;
		return max;
	}

	/**
   * Set the key weight value
   * @param {string} key - The key of the dataset to be retrieved
   * @param {Number} value - The value between 0 and 1
   */
	function setKeyWeight(key, value) {
		var title = getTitle(key);
		if (title)
			title.weight = value;
		else
			throw new Error("Title " + key + " not found in the titles array!!");
	}

	/**
   * Get the key weight value
   * @param {string} key - The key of the dataset to be retrieved
   */
	function getKeyWeight(key) {
		var title = getTitle(key);
		if (title)
			return title.weight || 1;
		else
			throw new Error("Title " + key + " not found in the titles array!!");
	}

	/**
   * Set if the key must be used when getting most relevant
   * @param {string} key - The key of the dataset to be retrieved
   * @param {boolean} value - True or false
   */
	function setKeyActive(key, value) {
		var title = getTitle(key);
		if (title)
			title.active = !!value;
		else
			throw new Error("Title " + key + " not found in the titles array!!");
	}

	/**
   * Check if the key must be used when getting most relevant
   * @param {string} key - The key of the dataset to be retrieved
   */
	function getKeyActive(key) {
		var title = getTitle(key);
		if (title)
			return title.active;
		else
			throw new Error("Title " + key + " not found in the titles array!!");
	}


	/**
   * Get a dataset copy sorted by the most similar rows based on the weights or not
   * @param {object} row - The row to be compared
   * @param {bool} useWeight - If the weight of the keys must be used
   */
	function datasetSortedBySimilarityTo(row, useWeight) {
		return dataset.sort(function (a, b) {
			return similarityOf(row, a, useWeight) > similarityOf(row, b, useWeight);
		});
	}

	/**
   * Get similary value of two rows
   * @param {object} row - The row to be compared
   * @param {object} row - The row to be compared
   * @param {boolena} useWeight - If the weight of the keys must be used
   */
	function similarityOf(base_row, row, useWeight) {
		var similarity = 0;
		for (var key in base_row) {
			if (isNumeric(base_row[key]) && isNumeric(base_row[key])) {
				var val = Math.abs(base_row[key]-row[key]) / (getMaxOf(key) - getMinOf(key))
				if (useWeight) {
					similarity += 1 - val * getKeyWeight(key);
				}
				else {
					similarity += 1 - val;
				}
			}
		}
		return similarity;
	}


	/////

	/**
   * True if the parameter is numeric
   * @param {string} n - The supposed number
   */
	function isNumeric(n) {
  	return !isNaN(parseFloat(n)) && isFinite(n);
	}

	/**
   * Get a Random Integer from an interval
   * @param {Number} min - The minimum value
   * @param {Number} min - The minimum value
   */
	function randomFromInterval(min,max) {
  	return Math.floor(Math.random()*(max-min+1)+min);
	}

	return {
		getDataset: getDataset,
		setDataset: setDataset,
		getMaxOf: getMaxOf,
		getMinOf: getMinOf,
		getKeyWeight: getKeyWeight,
		setKeyWeight: setKeyWeight,
		getKeyActive: getKeyActive,
		setKeyActive: setKeyActive,
		getTitles: getTitles,
		getTitle: getTitle
	}
});