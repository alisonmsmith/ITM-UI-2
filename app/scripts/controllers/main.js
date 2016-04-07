'use strict';

/**
 * @ngdoc function
 * @name itmUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the itmUiApp
 */
angular.module('itmUiApp')
  .controller('MainCtrl', function($scope, $http, TopicService) {

    $scope.documents = [];
    $scope.topics = [];
    $scope.refinements = [];
    $scope.mode = undefined;

    // Load the intial model
    TopicService.loadModel().then(function(data) {
      console.log("the initial model!")
      console.log(data.data);
      processModel(data.data);

      // Select to display the first topic in the list
      $scope.selectedTopic = $scope.topics[0];
      $scope.topics[0].selected = true;
    });

    /**
    * Method to process the model returned from the server 
    */
    function processModel(data) {
      $scope.topics = data.topics;

      // determine the display words for each topic
      _.each($scope.topics, function(topic, index) {
        // set the topic id based on its index
        topic.id = index;

        // choose the topic label as the first three words of the topic
        var display = '';
        display += topic.words[0].word + ' ' + topic.words[1].word + ' ' + topic.words[2].word;
        topic.displayWords = display;

        // create objects for the documents
        var docs = [];
        _.each(topic.docs, function(doc) {
          docs.push({
            "id":doc,
            'status':'unevaluated',
            "snippet":"...this is where the document snippet will go when we have it..."
          });
        });
        topic.docs = docs;

        // retain the weighted words (term, weight)
       // topic.weightedWords = topic.words;

        // store only the list of terms
     //  var words = [];
        _.each(topic.words, function(word) {
          word.status = 'unevaluated';
          //words.push(word.word);
        });
       // topic.words = words; */

        // set the merge status to false
        topic.merge = false;
      });
    }

    /**
     * Method to save the refined model. 
     */
    $scope.save = function() {
      // save the refinements
      TopicService.save($scope.refinements).then(function(data) {
        console.log("the model has been updated!")
        console.log(data.data);
        processModel(data.data);

        // Select the first topic in the list
        $scope.selectedTopic = $scope.topics[0];
        $scope.topics[0].selected = true;

        // clear the refinement list
        $scope.refinements = [];
        $scope.isDirty = false;
      });
    };

    $scope.acceptMerge = function() {
      $scope.mode = undefined;

      // determine selected topics to merge
      var topics = [];
      _.each($scope.topics, function(topic) {
        if (topic.merge) {
          topics.push(topic.id);
          topic.merge = false;
        }
      });

      var refinement = {
        'type': 'mergeTopics',
        'topics': topics
      };
      $scope.refinements.push(refinement);
      $scope.isDirty = true;
    }

    $scope.cancelMerge = function() {
      $scope.mode = undefined;
      _.each($scope.topics, function(topic) {
        topic.merge = false;
      });
    }

    /**
    * Method to go into merge 'mode' for the selected topic
    */
    $scope.$on("merge", function(event, topic) {
      // enter merge mode
      $scope.mode = 'merge';
      topic.merge = true;
    });

    /**
    * Listen for event to select a topic
    */
    $scope.$on("select", function(event, topic) {
      // if we're in merge mode, toggle the merge status
      if ($scope.mode === 'merge') {
        topic.merge = !topic.merge;
      } else {
        // deselect other topics
        _.each($scope.topics, function(topic) {
          topic.selected = false;
        });

        // select the current topic
        topic.selected = true;
        $scope.selectedTopic = topic;
      }

    });

    /**
     * Listen for event to remove a word to the currently selected topic
     */
    $scope.$on('remove-word', function(event, word) {
      var refinement = {
        'type': 'removeWord',
        'topicId': $scope.selectedTopic.id,
        'word': word
      };
      $scope.refinements.push(refinement);
    });

    /**
    * Listen for event to undo a previously removed word for the currently selected topic
    */
    $scope.$on('undo-remove-word', function(event, word) {
      var indexToRemove = -1;
      _.each($scope.refinements, function(refinement, index) {
        // find the match
        if (refinement.type === 'removeWord' 
          && refinement.topicId === $scope.selectedTopic.id 
          && refinement.word === word) {
          indexToRemove = index;
        }
      });
      if (indexToRemove !== -1) {
        $scope.refinements.splice(indexToRemove, 1);
      }
    });

    /**
     * Listen for event to add a word to the currently selected topic
     */
    $scope.$on('add-word', function(event, word) {
      var refinement = {
        'type': 'addWord',
        'topicId': $scope.selectedTopic.id,
        'word': word
      };
      $scope.refinements.push(refinement);
    });

    /**
    * Listen for event to undo a previously removed word for the currently selected topic
    */
    $scope.$on('undo-add-word', function(event, word) {
      // AS (4/7/16): there has to be a better way to do this...
      var indexToRemove = -1;
      _.each($scope.refinements, function(refinement, index) {
        // find the match
        if (refinement.type === 'addWord' 
          && refinement.topicId === $scope.selectedTopic.id 
          && refinement.word === word) {
          indexToRemove = index;
        }
      });
      if (indexToRemove !== -1) {
        $scope.refinements.splice(indexToRemove, 1);
      }
     /* $scope.refinements = _.without($scope.refinements, {
        'type': 'addWord',
        'topicId': $scope.selectedTopic.id,
        'word': word
      });*/
    });

    /**
     * Listen for event to remove a document from the currently selected topic
     */
    $scope.$on('remove-doc', function(event, doc) {
      var refinement = {
        'type': 'removeDocument',
        'topicId': $scope.selectedTopic.id,
        'documentId': doc
      };
      $scope.refinements.push(refinement);
    });

        /**
    * Listen for event to undo a previously removed word for the currently selected topic
    */
    $scope.$on('undo-remove-doc', function(event, doc) {
      var indexToRemove = -1;
      _.each($scope.refinements, function(refinement, index) {
        // find the match
        if (refinement.type === 'removeDocument' 
          && refinement.topicId === $scope.selectedTopic.id 
          && refinement.documentId === doc) {
          indexToRemove = index;
        }
      });
      if (indexToRemove !== -1) {
        $scope.refinements.splice(indexToRemove, 1);
      }
    })
  });