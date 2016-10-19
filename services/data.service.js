angular.module('RBC').service('dataService', function () {

	this.dataset = new Array();
	this.titles = new Array();

	this.maxCache = {};
	this.minCache = {};

	this.modifiedEvents = new Array();

	this.onModify = function (callback) {
		this.modifiedEvents.push(callback);
	};

	this.triggerModified = function () {
		for(var i=0; i<this.modifiedEvents.length; i++){
			if (typeof this.modifiedEvents[i] == "function") {
				this.modifiedEvents[i]();
			}			
		}
	};

	/**
   * Store the dataset
   * @param {Array} dataset - The dataset array
   */
	this.setDataset = function (_titles, _dataset) {
		if (!(_titles instanceof Array))
			return console.error("The \"titles\" wasn't an Array instance!");

		if (_dataset instanceof Array){
			for(var i = 0; i<_dataset.length; i++) {
				this.dataset.push(_dataset[i]);
			}
		}
		else {
			return console.error("The \"dataset\" wasn't an Array instance!");
		}

		for (var i=0; i<_titles.length; i++) {
			var title = { name: _titles[i], isNumeric: true, value: 1 };
			for (var j=0; j<this.dataset.length; j++) {
				if (this.dataset[j][title.name] && !this.isNumeric(this.dataset[j][title.name])) {
					title.isNumeric = false;
					break;
				} else {
					title.active = true;
				}
			}
			this.titles.push(title);
		}
		this.triggerModified();		
	};

	/**
   * Store the dataset
   * @param {Array} dataset - The dataset array
   */
	this.getDataset = function () {
		return this.dataset;
	};

	/**
   * Return the titles array
   */
	this.getTitles = function () {
		return this.titles;
	};

	/**
   * Return the title
   */
	this.getTitle = function (titleName) {
		for(var i = 0; i < this.titles.length; i++){
			if (this.titles[i].name == titleName){
				return this.titles[i];
			}
		}
		return undefined;
	};

	/**
   * Retrieve the Max value of the respective key from the dataset
   * @param {string} key - The key of the dataset to be retrieved
   */
	this.getMaxOf = function(key) {
		if (this.maxCache[key] != undefined)
			return this.maxCache[key];
		
		var max = 0;
		for (var row of this.dataset){
			if (this.isNumeric(row[key]) && row[key] > max){
				max = row[key];
			}
		}

		this.maxCache[key] = max;
		return max;
	};

	/**
   * Retrieve the Min value of the respective key from the dataset
   * @param {string} key - The key of the dataset to be retrieved
   */
	this.getMinOf = function(key) {
		if (this.minCache[key] != undefined)
			return this.minCache[key];
		
		var min = Infinity;
		for (var row of this.dataset){
			if (this.isNumeric(row[key]) && row[key] < min){
				min = row[key];
			}
		}
		this.minCache[key] = min;
		return min;
	};

	/**
   * Set the key weight value
   * @param {string} key - The key of the dataset to be retrieved
   * @param {Number} value - The value between 0 and 1
   */
	this.setKeyWeight = function(key, value) {
		var title = this.getTitle(key);
		if (title){
			title.weight = value;
		}	else {
			throw new Error("Title " + key + " not found in the titles array!!");
		}
	};

	/**
   * Get the key weight value
   * @param {string} key - The key of the dataset to be retrieved
   */
	this.getKeyWeight = function(key) {
		var title = this.getTitle(key);
		if (title) {
			return title.weight || 1;
		} else {
			throw new Error("Title " + key + " not found in the titles array!!");
		}
	};

	/**
   * Set if the key must be used when getting most relevant
   * @param {string} key - The key of the dataset to be retrieved
   * @param {boolean} value - True or false
   */
	this.setKeyActive = function(key, value) {
		var title = this.getTitle(key);
		if (title)
			title.active = !!value;
		else
			throw new Error("Title " + key + " not found in the titles array!!");
	};

	/**
   * Check if the key must be used when getting most relevant
   * @param {string} key - The key of the dataset to be retrieved
   */
	this.getKeyActive = function(key) {
		var title = this.getTitle(key);
		if (title){
			return title.active;
		} else{
			throw new Error("Title " + key + " not found in the titles array!!");
		}
	};

	/**
   * Get similary value of two rows
   * @param {object} row - The row to be compared
   * @param {object} row - The row to be compared
   * @param {boolena} useWeight - If the weight of the keys must be used
   */
	this.similarityOf = function(base_row, row, useWeight) {
		var similarity = 0;
		for (var key in base_row) {
			if (this.getKeyActive(key) && this.isNumeric(base_row[key]) && this.isNumeric(row[key])) {
				var divisor = (this.getMaxOf(key) - this.getMinOf(key)) ? (this.getMaxOf(key) - this.getMinOf(key)) : 1 ;
				var val = Math.abs(base_row[key]-row[key]) / divisor;
				if (useWeight) {
					similarity += (1-val) * this.getKeyWeight(key);
				}
				else {
					similarity += (1-val);
				}
			}
		}
		return similarity == 0 ? -Infinity : similarity;
	};

	/**
   * Sort the dataset by the most similar rows based on the weights or not
   * @param {object} row - The row to be compared
   * @param {bool} useWeight - If the weight of the keys must be used
   */
	this.datasetSortedBySimilarityTo = function(row, useWeight) {
		var self = this;
		return this.dataset.sort(function (a, b) {
			return self.similarityOf(row, a, useWeight) < self.similarityOf(row, b, useWeight);
		});
	};


	/////

	/**
   * True if the parameter is numeric
   * @param {string} n - The supposed number
   */
	this.isNumeric = function(n) {
  	return !isNaN(parseFloat(n)) && isFinite(n);
	};

	/**
   * Get a Random Integer from an interval
   * @param {Number} min - The minimum value
   * @param {Number} min - The minimum value
   */
	this.randomFromInterval = function(min,max) {
  	return Math.floor(Math.random()*(max-min+1)+min);
	};
});