'use strict';

/**
 * @ngdoc function
 * @name itmUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the itmUiApp
 */
angular.module('itmUiApp')
  .controller('MainCtrl', function ($scope) {
  	$scope.topics = [
  		{name:"Topic 1",
  		 words:"this is a topic that is made up"},
  		 {name: "Topic 2",
  		 words:"this is another topic that is also made up"}
  	];

  	$scope.$on("select", function(event, topic) {
  		// deselect other topics
  		_.each($scope.topics, function(topic) {
  			topic.selected = false;
  		});

  		// select the current topic
  		topic.selected = true;
  		$scope.selectedTopic = topic;
  	});
  });
