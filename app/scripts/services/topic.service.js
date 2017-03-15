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

	//var backend_head = "http://dna.cs.umd.edu:8080";
	var backend_head = "http://itm.cs.umd.edu:8080";
	//var backend_head = "http://localhost:8080";

	// default user and corpus
	var user = null;

	// default the number of documents to 40
	// TODO: we might want to let the user choose this when he is choosing the number
	// of topics; alternatively, this could be treated as 'show more' button on each topic
	var docNums = 40;

	this.setUser = function(u) {
		console.log("user set to: " + u);
		user = u;
	}

	this.getUser = function() {
		return user;
	}

	/**
	* Method to get the list of all available corpora.
	*/
	this.getCorpora = function() {
		return $http({
			method: 'GET',
			url: backend_head + '/itm-backend/rest/getcorpora'
		});
	}

	/**
	* Method to add a message to the current log file on the server.
	*/
	this.log = function(corpus, topics, message) {
		return $http({
			method: 'POST',
			url: backend_head + '/itm-backend/rest/logger',
			params: {
				corpus: corpus,
				userId: user,
				topicNums: topics,
				modelId: iterationCount
			},
			data: message
		});
	}

	/**
	* Method to load the model for the current user given the corpus and number of topics.
	* The iteration count should always be at 0 for initial load.
	*/
	this.loadModel = function(corpus, topics) {
		// ensure iteration count is at 0
		iterationCount = 0;

		return $http({
			method: 'GET',
			url: backend_head + '/itm-backend/rest/initialmodel',
			params: {
				corpus: corpus,
				userId: user,
				topicNums: topics,
				modelId: iterationCount,
				docNums: docNums
			}
		});
	}

	/**
	* Method to load the documents for the current user given the corpus and number of topics.
	*/
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
				modelId: iterationCount,
				docNums: docNums
			},
			data:data
		});
	}
});
