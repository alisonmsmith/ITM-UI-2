'use strict';

/**
 * @ngdoc function
 * @name itmUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the itmUiApp
 */
angular.module('itmUiApp')
  .controller('MainCtrl', function ($scope, $http, TopicService) {

    $scope.documents = [];
    $scope.topics = [];
    $scope.vocabulary = [];

    TopicService.loadModel().then(function(data) {
      console.log(data.data);
      $scope.documents = data.data.documents;
      $scope.topics = data.data.topics;
      $scope.vocabulary = data.data.vocabulary;

      // determine the display words for each topic
      _.each($scope.topics, function(topic) {
        var display = '';
        display += $scope.vocabulary[topic.words[0].word].word + ' ' + $scope.vocabulary[topic.words[1].word].word + ' ' + $scope.vocabulary[topic.words[2].word].word;
        topic.displayWords = display;

        var words = [];
        _.each(topic.words, function(word) {
          words.push($scope.vocabulary[word.word].word);
        });
        topic.words = words;

        var docs = [];
        _.each(topic.docs, function(doc) {
          // TODO: this doesn't actually work because the document ids do not correspond with the
          // array indices
          if ($scope.documents[parseInt(doc)]) {
            docs.push($scope.documents[parseInt(doc)]);
          }
          
        });
        topic.docs = docs;
      });
    });

  /*	$scope.topics = [
  		{name:"Topic 1",
  		 words:"this is a topic that is made up"},
  		 {name: "Topic 2",
  		 words:"this is another topic that is also made up"}
  	]; */

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
