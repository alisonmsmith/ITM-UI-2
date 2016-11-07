'use strict';

/**
 * @ngdoc function
 * @name itmUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the itmUiApp
 */
angular.module('itmUiApp')
  .controller('MainCtrl',  function($scope, $state, $http, TopicService, $mdDialog) {

    $scope.user = TopicService.getUser();

    if (!$scope.user) {
      $state.go('login');
    } else {

   // $scope.documents = [];
    $scope.topics = [];
    $scope.topicsCopy = [];
    $scope.refinements = [];
    $scope.mode = undefined;
    $scope.merged = [];
    $scope.loading = true;
    $scope.stops = [];

    // DEFAULT VALUES FOR CORPORA AND TOPIC NUMBERS
    $scope.corpus = "twitter";
    $scope.topicNums = 10;


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

    // Get all corpora
    TopicService.getCorpora().then(function(data) {
      $scope.corpora = data.data.corpus;
    });

    // Load the intial model
    loadModel();

    function loadModel() {
      $scope.loading = true;
      TopicService.loadModel($scope.corpus, $scope.topicNums).then(function(data) {
        console.log("loaded the initial model!")
        console.log(data.data);
        processModel(data.data);
       // TopicService.getDocuments($scope.corpus, $scope.topicNums).then(function(docs) {
       //   console.log("loaded the initial document assignment");
       //   console.log(docs.data);
       //   processModel(data.data, docs.data);


          // Select to display the first topic in the list
          $scope.selectedIndex = 0;
          $scope.selectedTopic = $scope.topics[$scope.selectedIndex];
          $scope.topicsCopy = angular.copy($scope.topics);
          $scope.topics[0].selected = true;
       // });
     }, function() {
       // on error
       console.log("error loading initial model");
     });
    }

    /**
    * Dialog box to allow the user to set the corpus and number of topics for the interface.
    */
    $scope.configureModel = function(ev) {
        $mdDialog.show({
          controller: DialogController,
          templateUrl: 'views/configure-model.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          locals: {
            corpus: $scope.corpus,
            number: $scope.topicNums,
            corpora: $scope.corpora
          }
        })
        .then(function(data) {
          $scope.corpus = data.corpus;
          $scope.topicNums = data.number;
          loadModel();
        }, function() {
          console.log('You cancelled the dialog.');
        });
    };

    function DialogController($scope, $mdDialog, corpus, number, corpora) {
      $scope.corpus = corpus;
      $scope.number = number;
      $scope.corpora = corpora;
      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.submit = function(corpus, number) {
        var data = {corpus: corpus,
                    number: number};
        $mdDialog.hide(data);
      };
    };

    /**
    * Method to process the model returned from the server
    */
    function processModel(data) {
      $scope.topics = data.topics;

      // determine the display words for each topic
      _.each($scope.topics, function(topic) {
        // set the topic id based on its index
        topic.id = topic.topicindex;

        // choose the topic label as the first three words of the topic
        var display = '';
        display += topic.words[0].word + ' ' + topic.words[1].word + ' ' + topic.words[2].word;
        topic.displayWords = display;

        // set document to unevalauted and compute snippet
        console.log("num docs: " + topic.docs.length);
        _.each(topic.docs, function(doc) {
          doc.status = 'unevaluated';
          if (doc.text.length <= 350) {
            doc.hasMore = false;
            doc.snippet = doc.text;
          } else {
            doc.hasMore = true;
            doc.snippet = doc.text.substring(0,350) + "...";
          }

          doc.more = false;
        });

        // set the status of each word to unevalauted
        var weights = [];
        _.each(topic.words, function(word) {
          word.status = 'unevaluated';
          weights.push(word.weight);
        });

        // set the topic merge status to false
        topic.merge = false;

        // determine the topic word font size
        var scale = d3.scaleLinear();

        scale.range([8,32]);
        scale.domain([d3.min(weights), d3.max(weights)]);

        _.each(topic.words, function(word) {
          word.style = "{'font-size':'" + Math.round(scale(word.weight)) + "pt'}";
        });
      });

      // sort the list by topic index
      $scope.topics = _.sortBy($scope.topics, "topicindex");

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
      $scope.stops = [];
    }

    /**
     * Method to save the refined model.
     */
    $scope.save = function() {
      $scope.loading = true;
      // save the refinements
      TopicService.save($scope.refinements, $scope.corpus, $scope.topicNums).then(function(data) {
        console.log("the model has been updated!")
        console.log(data.data);
        processModel(data.data);
       // TopicService.getDocuments($scope.corpus, $scope.topicNums).then(function(docs) {
      //    processModel(data.data, docs.data);

          // Select the previously selected topic in the list
          $scope.selectedTopic = $scope.topics[$scope.selectedIndex];
          $scope.topicsCopy = angular.copy($scope.topics);
          $scope.topics[$scope.selectedIndex].selected = true;

          // reset the merged list
          $scope.merged = [];

          // clear the refinement list
          $scope.refinements = [];
          $scope.isDirty = false;
          $scope.stops = [];
      //  });

    }, function() {
      // error saving model
      alert('error saving model - reverting to model prior to save');
      $scope.refinements = [];
      $scope.isDirty = false;
      $scope.stops = [];
      $scope.merged = [];

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

      // IF we do not have more than one topic
      if (topics.length <= 1) {
                      $mdDialog.show(
                $mdDialog.alert()
                  .parent(angular.element(document.body))
                  .clickOutsideToClose(true)
                  .textContent('please select at least one additional topic to merge')
                  .ariaLabel('merge alert')
                  .ok('Got it!')
              );
        return;
      }

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

      // AS (8/2): due to the way that the md-chips-draggable directive works
      // add a single 'empty' sub word to support dragging into sub topic B
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
        if (!topic.split && !topic.merged && !topic.selected) {
          topic.merge = !topic.merge;
        } else {
          console.log("unable to merge with split or merged topic");
        }
      } else {
        // if the current topic is being split, don't let the user move away
        var splitting = _.filter($scope.topics, function(topic) {
          return topic.splitting;
        });

        if (splitting.length > 0) {
              $mdDialog.show(
                $mdDialog.alert()
                  .parent(angular.element(document.body))
                  .clickOutsideToClose(true)
                  .textContent('please confirm or cancel your split topic modifications')
                  .ariaLabel('Alert Dialog Demo')
                  .ok('Got it!')
              );
          return;
        }

        // deselect other topics
        _.each($scope.topics, function(topic) {
          topic.selected = false;
        });

        // select the current topic
        topic.selected = true;
        $scope.selectedTopic = topic;

        // remember this id
        $scope.selectedIndex = topic.topicindex;

        $scope.$broadcast("select-topic", topic);
      }

    });

    $scope.$on('add-stop-word', function(event, word) {
      // store the stop word
      $scope.stops.push(word);

      // create the refinement
      var refinement = {
        'type': 'trash',
        'word': word
      };
      $scope.refinements.push(refinement);
    });

    $scope.$on('undo-stop-word', function(event, word) {
      // remove the stop word
      $scope.stops = _.without($scope.stops, word);

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
}

  });
