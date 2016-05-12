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
    $scope.topicsCopy = [];
    $scope.refinements = [];
    $scope.mode = undefined;
    $scope.merged = [];
    $scope.loading = true;
    $scope.user = TopicService.getUser();


    // METHODS REQUIRED FOR DROPPABLE TRASH CAN
    angular.element(document).find('.stop-words').on('dragover', dragOverHandler);
    angular.element(document).find('.stop-words').on('drop', dropHandler);

    function dragOverHandler(ev) {
      console.log("dragged over!");
      ev.preventDefault();
    }

    function dropHandler(ev) {
      ev.preventDefault();
      console.log(ev);
    }

    // Load the intial model
    TopicService.loadModel().then(function(data) {
      console.log("loaded the initial model!")
      console.log(data.data);
      TopicService.getDocuments().then(function(docs) {
        console.log("loaded the initial document assignment");
        console.log(docs.data);
        processModel(data.data, docs.data);


        // Select to display the first topic in the list
        $scope.selectedTopic = $scope.topics[0];
        $scope.topicsCopy = angular.copy($scope.topics);
        $scope.topics[0].selected = true;
      });
    });

    /**
    * Method to process the model returned from the server 
    */
    function processModel(data, docs) {
      $scope.documents = docs.documents;
      $scope.topics = data.topics;

      // determine the display words for each topic
      _.each($scope.topics, function(topic, index) {
        // set the topic id based on its index
        topic.id = index;

        // choose the topic label as the first three words of the topic
        var display = '';
        display += topic.words[0].word + ' ' + topic.words[1].word + ' ' + topic.words[2].word;
        topic.displayWords = display;

        // set the documents
        // AS (4/14): this asserts that the indices match up
        topic.docs = docs.documents[index].docs;

        _.each(topic.docs, function(doc) {
          doc.status = 'unevaluated';
          doc.snippet = doc.text.substring(0,250) + "...";
        });

        // create objects for the documents
     /*   var docs = [];
        _.each(docs.documents, function(doc) {
          docs.push({
            "id":doc,
            'status':'unevaluated',
            "snippet":"...this is where the document snippet will go when we have it..."
          });
        });
        topic.docs = docs;*/

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

      $scope.loading = false;
    }

    /**
    * Method to clear refinements
    */
    $scope.clearRefinements = function() {
      console.log($scope.refinements);
      // undo all refinements
      $scope.topics = $scope.topicsCopy;
      $scope.selectedTopic = $scope.topics[0];
      $scope.topics[0].selected = true;
      $scope.merged = [];
      $scope.refinements = [];
      $scope.isDirty = false;
    }

    /**
     * Method to save the refined model. 
     */
    $scope.save = function() {
      $scope.loading = true;
      // save the refinements
      TopicService.save($scope.refinements).then(function(data) {
        console.log("the model has been updated!")
        console.log(data.data);
        TopicService.getDocuments().then(function(docs) {
          processModel(data.data, docs.data);

          // Select the first topic in the list
          $scope.selectedTopic = $scope.topics[0];
          $scope.topicsCopy = angular.copy($scope.topics);
          $scope.topics[0].selected = true;

          // reset the merged list
          $scope.merged = [];

          // clear the refinement list
          $scope.refinements = [];
          $scope.isDirty = false;
        });

      });
    };

    $scope.$on('accept-split', function(event, topic) {
      var refinement = {
        'type': 'splitTopic',
        'topicId': $scope.selectedTopic.id,
        'seedWords': _.pluck(topic.words, 'word')
      };
      $scope.refinements.push(refinement);
    });

    $scope.$on('undo-split', function(event, topic) {
      topic.words = topic.wordscopy;
      topic.wordscopy = undefined;
      topic.subwords = undefined;
      topic.split = false;

      // remove the refinement
      var indexToRemove = -1;
      _.each($scope.refinements, function(refinement, index) {
        // find the match
        if (refinement.type === 'splitTopic' 
          && refinement.topicId === topic.id) {
          indexToRemove = index;
        }
      });
      if (indexToRemove !== -1) {
        $scope.refinements.splice(indexToRemove, 1);
      }
    });

    $scope.addStopWord = function() {
      $scope.$broadcast('topic-stop-word');
    };

    $scope.acceptMerge = function() {
      $scope.mode = undefined;

      // determine selected topics to merge
      var topics = [];
      var pair = [];
      _.each($scope.topics, function(topic) {
        if (topic.merge) {
          topics.push(topic.id);
          pair.push(topic);
          topic.merge = false;

          // merged status is for display in the topic list
          topic.merged = true;
        }
      });

      // add the topics as a merge pair
      $scope.merged.push(pair);

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

    $scope.undoMerge = function(pair) {
      // remove the merged status from the topics
      _.each(pair, function(p) {
        p.merged = false;
      });

      // remove the topics as a merged pair
      var indexToRemove = -1;
      _.each($scope.merged, function(m, index) {
        if (_.isEqual(m, pair)) {
          indexToRemove = index;
        }
      });
      if (indexToRemove !== -1) {
        $scope.merged.splice(indexToRemove, 1);
      }

      // remove the refinement
      var topics = [];
      _.each(pair, function(p) {
        topics.push(p.id);
      });

      indexToRemove = -1;
      _.each($scope.refinements, function(refinement, index) {
        // find the match
        if (refinement.type === 'mergeTopics' && _.isEqual(refinement.topics,topics)) {
          indexToRemove = index;
        }
      });
      if (indexToRemove !== -1) {
        $scope.refinements.splice(indexToRemove, 1);
      }
    }

    /**
    * Method to go into split 'mode' for the selected topic
    */
    $scope.$on("split", function(event, topic) {
      topic.splitting = true;
      topic.wordscopy = topic.words;
      //topic.subwords = [];
      topic.subwords = [{"status":"hidden"}];
    });

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
        // only allow selection of an unmerged or unsplit topic
        if (!topic.split && !topic.merged) {
          topic.merge = !topic.merge;
        }
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

    $scope.$on('add-stop-word', function(event, word) {
      var refinement = {
        'type': 'trash',
        'word': word
      };
      $scope.refinements.push(refinement);
    });

    $scope.$on('undo-stop-word', function(event, word) {
      var indexToRemove = -1;
      _.each($scope.refinements, function(refinement, index) {
        // find the match
        if (refinement.type === 'trash' 
          && refinement.word === word) {
          indexToRemove = index;
        }
      });
      if (indexToRemove !== -1) {
        $scope.refinements.splice(indexToRemove, 1);
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
    * Listen for event to re-order the word in the currently selected topic
    */
    // AS (5/2/16): the order indices are updated in the UI after the refinement, so if
    // two re-orderings are performed, the indices of the latter refinement will not make sense
    // based on the indices prior to the former refinement - this should only affect the backend if 
    // refinements are not applied in order
    $scope.$on('reorder-word', function(event, word, to, from) {
      var refinement ={
        'type': 'changeWordOrder',
        'word': word,
        'originalPosition': from,
        'newPosition': to,
        'topicId': $scope.selectedTopic.id
      };
      $scope.refinements.push(refinement);
      console.log($scope.refinements);
    });

    /**
    * Listen for event to update the reorder word refinement for the given word and original position
    */
    $scope.$on('update-reorder-word', function(event, word, to, from) {
      _.each($scope.refinements, function(refinement) {
        if (refinement.type === 'changeWordOrder'
          && refinement.topicId === $scope.selectedTopic.id
          && refinement.word === word
          && refinement.originalPosition === from) {
          // update the to location
          refinement.newPosition = to;
        }
      });
      console.log($scope.refinements);
    })

    /**
    * Listen for event to undo previously re-ordered word in the topic
    */
    $scope.$on('undo-reorder-word', function(event, word, to, from) {
      var indexToRemove = -1;
      _.each($scope.refinements, function(refinement, index) {
        // find the match
        if (refinement.type === 'changeWordOrder' 
          && refinement.originalPosition === from
          && refinement.newPosition === to
          && refinement.word === word
          && refinement.topicId === $scope.selectedTopic.id) {
          indexToRemove = index;
        }
      });
      if (indexToRemove !== -1) {
        $scope.refinements.splice(indexToRemove, 1);
      }
      console.log($scope.refinements);
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
    });


  });