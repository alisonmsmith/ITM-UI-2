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
    $scope.refinements = [];
    $scope.isDirty = false;
    //$scope.vocabulary = [];

    TopicService.loadModel().then(function(data) {
      console.log(data.data);
    //  $scope.documents = data.data.documents;
      $scope.topics = data.data.topics;
    //  $scope.vocabulary = data.data.vocabulary;

      // determine the display words for each topic
      _.each($scope.topics, function(topic) {
        var display = '';
        display += topic.words[0].word + ' ' + topic.words[1].word + ' ' + topic.words[2].word;
        topic.displayWords = display;

        topic.weightedWords = topic.words;

        var words = [];
        _.each(topic.words, function(word) {
          words.push(word.word);
        });
        topic.words = words; 

     /*   var docs = [];
        _.each(topic.docs, function(doc) {
          // TODO: this doesn't actually work because the document ids do not correspond with the
          // array indices
          if ($scope.documents[parseInt(doc)]) {
            docs.push($scope.documents[parseInt(doc)]);
          }
          
        });
        topic.docs = docs; */
      });
    });

    /**
    * Method to save the refined model. 
    */
    $scope.save = function() {
      // save the refinements
    /*  TopicService.save($scope.refinements).then(function(data) {
        // TODO: display the updated model

        // clear the refinement list
        $scope.refinements = [];
        $scope.isDirty = false;
      }); */

        // clear the refinement list
        $scope.refinements = [];
        $scope.isDirty = false;
    };

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

    /**
    * Listen for event to remove a word to the currently selected topic
    */
    $scope.$on('remove-word', function(event, word) {
      var refinement = {
        'type':'RemoveWord',
        'TopicId':$scope.selectedTopic.id,
        'word':word
      };
      $scope.refinements.push(refinement);
      $scope.isDirty = true;
    });

    /**
    * Listen for event to add a word to the currently selected topic
    */
    $scope.$on('add-word', function(event, word) {
      var refinement = {
        'type':'AddWord',
        'TopicId':$scope.selectedTopic.id,
        'word':word
      };
      $scope.refinements.push(refinement);
      $scope.isDirty = true;
    });

    /**
    * Listen for event to remove a document from the currently selected topic
    */
    $scope.$on('remove-doc', function(event, doc) {
      var refinement = {
        'type':'RemoveDocument',
        'TopicId':$scope.selectedTopic.id,
        'DocumentId':doc
      };
      $scope.refinements.push(refinement);
      $scope.isDirty = true;
    });
  });
