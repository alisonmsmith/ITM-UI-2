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

	var backend_head = "http://dna.cs.umd.edu:8080";
	//var backend_head = "http://localhost:8080";

	// default user and corpus
	var user = null;

	this.setUser = function(u) {
		console.log("user set to: " + u);
		user = u;
	}

	this.getUser = function() {
		return user;
	}

	this.getCorpora = function() {
		return $http({
			method: 'GET',
			url: backend_head + '/itm-backend/rest/getcorpora'
		}); 
	}

	this.loadModel = function(corpus, topics) {
		//return $http.get('data/model2.json');

		return $http({
			method: 'GET',
			url: backend_head + '/itm-backend/rest/initialmodel',
			params: {
				corpus: corpus,
				userId: user,
				topicNums: topics,
				modelId: iterationCount
			}
		}); 
	}

	this.getDocuments = function (corpus, topics) {
		return $http({
			method: 'GET',
			url: backend_head + '/itm-backend/rest/getdocuments',
			params: {
				corpus: corpus,
				userId: user,
				topicNums: topics,
				modelId: iterationCount
			}
		}); 
	}

	this.save = function(refinements, corpus, topics) {
		// update the iteration count
		iterationCount += 1;
		var data = {'feedback':refinements};
		return $http({
			method: 'POST',
			url: backend_head + '/itm-backend/rest/updatemodel',
			params: {
				corpus: corpus,
				userId: user,
				topicNums: topics,
				modelId: iterationCount
			},
			data:data
		}); 
	}
});