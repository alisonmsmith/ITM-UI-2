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
	// var backend_head = "http://lda.cs.umd.edu:8080";
	//var backend_head = "http://localhost:8080";
	var backend_head = "http://35.237.234.44:8080";

	// default user and corpus
	var user = null;

	// default the number of documents to 20
	// TODO: we might want to let the user choose this when he is choosing the number
	// of topics; alternatively, this could be treated as 'show more' button on each topic
	var docNums = 20;

	this.setUser = function(u) {
		console.log("user set to: " + u);
		user = u;
	};

	this.getUser = function() {
		return user;
	};

	/**
	* Method to submit an answer to a question of the pre-task questionnaire
	*/
	this.submitAnswer = function(id, answer, corpus, topics) {
		//console.log(id);
		//console.log(answer);
		// submit the user id, question id, and answer to the questionnaire service
		return $http({
			method: 'GET',
			url: backend_head + '/itm-backend/rest/questionnaire',
			params: {
				userId: user,
				questionId: id,
				userResponse: answer,
				corpus: corpus,
				topicNums: topics
			}
		});
	};

	/**
	* Method to return a unique id
	*/
	this.guid = function() {
	  function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000)
	      .toString(16)
	      .substring(1);
	  }
	  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	    s4() + '-' + s4() + s4() + s4();
	};

	/**
	* Method to get the list of all available corpora.
	*/
	this.getCorpora = function() {
		return $http({
			method: 'GET',
			url: backend_head + '/itm-backend/rest/getcorpora'
		});
	};

	/**
	* Method to get the vocabulary for the current corpus (used by autocomplete)
	*/
	this.getVocab = function(corpus) {
		console.log('retrieiving vocab for ' + corpus);
		return $http.get(backend_head + '/itm-backend/rest/getvocab?corpus=' + corpus);
	};

	/**
	* Method to add a message to the current log file on the server.
	*/
	this.log = function(corpus, topics, message) {
		$http({
			method: 'POST',
			url: backend_head + '/itm-backend/rest/logger',
			params: {
				corpus: corpus,
				userId: user,
				topicNums: topics,
				modelId: iterationCount
			},
			data: message
		}).then(function(success) {
			console.log('succesfully logged');
		}, function (error) {
			console.log('error logging');
		});
	};

	this.loadTutorial = function(iter) {
		return $http.get(backend_head + '/itm-backend/rest/dummymodel?model_id=' + iter);
	};

	/**
	* Method to load the model for the current user given the corpus and number of topics.
	* The iteration count should always be at 0 for initial load.
	*/
	this.loadModel = function(corpus, topics, tutorialComplete) {
		// ensure iteration count is at 0
		iterationCount = 0;

		if (!tutorialComplete) {
			return $http.get(backend_head + '/itm-backend/rest/dummymodel?model_id=' + iterationCount);
		}

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
	};

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
	};

	this.save = function(refinements, corpus, topics, tutorialComplete) {
		// update the iteration count
		iterationCount += 1;

		if (!tutorialComplete) {
			return $http.get(backend_head + '/itm-backend/rest/dummymodel?model_id=' + iterationCount);
		}

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
	};
});
