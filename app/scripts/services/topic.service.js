/**
 * This is an angular service that provides access to BOSS web services
 *
 * <p>Copyright: Copyright (c) 2015</p>
 *
 * <p>Company: Decisive Analytics Corporation</p>
 *
 */

/* jshint unused:vars */
'use strict';

angular.module('itmUiApp').service('TopicService', function($http) {
	// initially set the iteration count to 0
	var iterationCount = 0;

	this.loadModel = function() {
		//return $http.get('data/model2.json');

		return $http({
			method: 'GET',
			url:'http://localhost:8080/itm-backend/rest/initialmodel',
			params: {
				corpus: 'test',
				userId: 'test',
				topicNums: 5,
				modelId: iterationCount
			}
		}); 
	}

	this.getDocuments = function () {
		return $http({
			method: 'GET',
			url:'http://localhost:8080/itm-backend/rest/getdocuments',
			params: {
				corpus: 'test',
				userId: 'test',
				topicNums: 5,
				modelId: iterationCount
			}
		}); 
	}

	this.save = function(refinements) {
		// update the iteration count
		iterationCount += 1;
		var data = {'feedback':refinements};
		return $http({
			method: 'POST',
			url: 'http://localhost:8080/itm-backend/rest/updatemodel',
			params: {
				corpus: 'test',
				userId: 'test',
				topicNums: 5,
				modelId: iterationCount
			},
			data:data
		}); 
	}
});