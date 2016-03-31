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
	this.loadModel = function() {
		return $http.get('data/model2.json');

	/*	return $http({
			method: 'POST',
			url:'/itm-backend/rest/initialmodel',
			params: {
				corpus: 'synthetic',
				userId: 'test',
				topicNums: 5,
				modelId: 0
			}); */
	}

	this.save = function(refinements) {
		var data = {'feedback':refinements};
	/*	return $http({
			method: 'POST',
			url: '/itm-backend/rest/updatemodel',
			params: {
				corpus: 'synthetic',
				userId: 'test',
				topicNums: 5,
				modelId: 1
			},
			data:data
		}); */
	}
});