/**
 */

/* jshint unused:vars */
'use strict';

angular.module('itmUiApp').directive('topic', ['$sce', '$mdDialog', 'TopicService', function($sce, $mdDialog, TopicService) {
  return {
    restrict: 'E',
    scope: {
      topic: '=',
      stops: '=',
      vocab: '=',
      corpus: '=',
      nums: '=',
      tutorial: '='
    },
    templateUrl: 'views/topic.html',
    link: function(scope, element, attrs) {

      scope.chipsCtrl = undefined;

      // initialize the view when a new topic is selected
      scope.$watch("topic", function() {
        if (!scope.topic) {
          return;
        }
        scope.hoveredWord = null;
        scope.selectedWord = null;
        scope.selected = null;
        scope.numDocs = 20;

        // ensure that we have struckthrough any stop words
        _.each(scope.topic.words, function(word) {
          if (scope.stops.indexOf(word.word) !== -1) {
            word.status = 'trashed';
          }
        });

        scope.chipsCtrl = angular.element(document.querySelector( '#topicA' )).controller('mdChips');
      });

      scope.$watchCollection('stops', function(value) {
        scope.stops = value;
      });

    /*  scope.$watch("chipsCtrl.selectedWord", function() {
        console.log('selected word changed', scope.chipsCtrl.selectedWord);
      }); */

      /*scope.$watch('topic.topic', function () {
      	scope.$emit("rename", scope.topic);
      	//console.log(scope.topic.topic);
      });*/


      scope.selectWord = function(chip) {
        // console.log('selectWord', chip);
        // TODO: looks like the chip is autoselected but for some reason the chip object is not passed through to the select method; this is a hacky fix, but might want to figure out what's really going on at some point
        if (!chip) {
          return;
        }
        TopicService.log(scope.corpus, scope.nums, '||' + scope.topic.id + '||SELECT_WORD, ' + chip.word + '|| user selected ' + chip.word + ' in topic ' + scope.topic.id);
        // store the selected word for the trash can
        scope.selected = chip;

        // highlight the word in the documents
        scope.selectedWord = chip.word;

        scope.$emit('select-word', chip.word);
      };

      scope.blur = function() {
        console.log("blur!");
      };


      /**
       * Method called when a user chooses to delete the topic
       */
      scope.delete = function(topic) {
        // TODO: confirm DELETE
        scope.$emit('remove-topic', topic);
      };

      /**
       * Method called when a user chooses to cancel the topic creation process; the topic is removed from the list.
       */
      scope.cancelCreate = function() {
        // remove this topic from the list
        scope.$emit('remove-topic', scope.topic);
      };

      /**
       * Method called when the user accepts the created topic.
       */
      scope.acceptCreate = function() {
        scope.topic.creating = false;
        scope.topic.created = true;
        scope.topic.displayWords = _.pluck(scope.topic.words.slice(0, 3), "word").join(" ");
        scope.$emit('accept-create', scope.topic);
      };

      scope.cancelSplit = function() {
        TopicService.log(scope.corpus, scope.nums, '||' + scope.topic.id + ')||SPLIT_TOPIC, CANCEL|| user clicked to cancel split of topic ' + scope.topic.id);
        scope.topic.splitting = false;
        scope.topic.words = scope.topic.wordscopy;
        scope.topic.wordscopy = undefined;
        scope.topic.subwords = undefined;
      };

      scope.acceptSplit = function() {
        // only allow the user to split if the subwords have been modified
        if (scope.topic.subwords.length === 1 && scope.topic.subwords[0].status === 'hidden') {
          $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.body))
            .clickOutsideToClose(true)
            .textContent('please drag words between the sub topics before confirming or press the x if you would like to cancel the split operation')
            .ariaLabel('split topic dialog')
            .ok('Got it!')
          );
          return;
        }
        scope.topic.splitting = false;
        scope.topic.split = true;
        scope.$emit('accept-split', scope.topic);
      };

      scope.hoverWord = function(chip) {
        TopicService.log(scope.corpus, scope.nums, '||' + scope.topic.id + '||HOVER_WORD, ' + chip.word + '|| user hovered over ' + chip.word + ' in topic ' + scope.topic.id);
        // highlight the word in the documents
        scope.hoveredWord = chip.word;

        scope.$emit('hover-word', chip.word);

      };

      scope.unhoverWord = function(chip) {
        // unhighlight the word unless it has been clicked
        scope.hoveredWord = null;

      };

      scope.highlight = function(text, search, search2) {
        if (!search && !search2) {
          return $sce.trustAsHtml(text);
        } else if (!search2) {
          return $sce.trustAsHtml(text.replace(new RegExp('\\b' + search + '\\b', 'gi'), '<span class="highlightedText">$&</span>'));
        } else if (!search) {
          return $sce.trustAsHtml(text.replace(new RegExp('\\b' + search2 + '\\b', 'gi'), '<span class="highlightedText">$&</span>'));
        } else {
          var text2 = text.replace(new RegExp('\\b' + search + '\\b', 'gi'), '<span class="highlightedText">$&</span>');
          return $sce.trustAsHtml(text2.replace(new RegExp('\\b' + search2 + '\\b', 'gi'), '<span class="highlightedText">$&</span>'));
        }
      };

      /*scope.acceptmerge = function() {
      	scope.$emit('accept-merge', topic);
      };*/

      scope.addWord = function(chip) {
        // if we're in create topic mode or split topic model, don't add a word
        if (scope.topic.creating) {
          TopicService.log(scope.corpus, scope.nums, '||' + scope.topic.id + '||CREATE_TOPIC, ADD_WORD, ' + chip.word + '|| user added ' + chip.word + ' to the topic they are creating ' + scope.topic.id);
          return;
        }
        if (scope.topic.splitting) {
          TopicService.log(scope.corpus, scope.nums, '||' + scope.topic.id + '||ADD_WORD, PREVENTED, ' + chip.word + '|| user prevented from adding the word ' + chip.word + ' while they were splitting topic ' + scope.topic.id);
          return;
        }
        // emit a refinement
        scope.$emit('add-word', chip.word);
      };

      scope.$on('topic-stop-word', function(event) {
        if (scope.selected) {
          scope.$emit('add-stop-word', scope.selected.word);
          // strikethrough the selected word
          scope.selected.status = 'trashed';
          scope.selected = undefined;
        } else {
          $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.body))
            .clickOutsideToClose(true)
            .textContent('please first click to select a topic word before clicking this button to remove it from all topics.')
            .ariaLabel('stop words dialog')
            .ok('Got it!')
          );
        }
      });

      // Listen for event that a chip has been dragged within the word list
      scope.$on('mdChipDraggable:change', function(event, data) {
      //  console.log(data);
        if (data.fromCollection === data.toCollection && !scope.topic.splitting) {
          // Move within the same chip list
          var chip = data.item;
          // set the status of the word to reordered and store the original index
          // but only if this chip has not been re-ordered before
          if (chip.status === 'reordered') {
            // if the chip has been re-ordered before, we need to update the final position
            scope.$emit('update-reorder-word', chip.word, data.to, chip.originalIndex);
          } else {
            chip.status = 'reordered';
            chip.originalIndex = data.from;
            scope.$emit('reorder-word', chip.word, data.to, data.from);
          }
        } else if (data.fromCollection !== data.toCollection) {
          // Move from one chip list to another
          if (data.fromCollection === 'topicA') {

            // moving from A to B
            var chip = scope.topic.words.splice(data.from, 1)[0];
            chip.status = 'split';
            chip.orginalIndex = data.from;
            chip.originalTopic = data.fromCollection;
            TopicService.log(scope.corpus, scope.nums, '||' + scope.topic.id + '||SPLIT_TOPIC, DRAG, B, ' + chip.word + '|| user dragged ' + chip.word + ' from sub topic A to sub topic B to split topic ' + scope.topic.id);
            // if this is the first chip to be dragged into B, we can remove the hidden chip
            if (scope.topic.subwords.length === 1 && scope.topic.subwords[0].status === 'hidden') {
              scope.topic.subwords = [chip];
            } else {
              // otherwise insert the chip appropriately
              scope.topic.subwords.splice(data.to, 0, chip);
            }

          } else {
            // moving from B to A
            var chip = scope.topic.subwords.splice(data.from, 1)[0];
            TopicService.log(scope.corpus, scope.nums, '||' + scope.topic.id + '||SPLIT_TOPIC, DRAG, A, ' + chip.word + '|| user dragged ' + chip.word + ' from sub topic B to sub topic A to split topic ' + scope.topic.id);
            // if B is now empty, we need to add back in the hidden chip
            if (scope.topic.subwords.length === 0) {
              scope.topic.subwords = [{
                'status': 'hidden'
              }];
            }
            chip.status = 'split';
            chip.orginalIndex = data.from;
            chip.originalTopic = data.fromCollection;
            scope.topic.words.splice(data.to, 0, chip);
          }
        }

      });


      scope.removeWord = function(chip, index) {
        // if we're in split topic mode, don't let the user remove any words
        if (scope.topic.splitting) {
          TopicService.log(scope.corpus, scope.nums, '||' + scope.topic.id + '||REMOVE_WORD, PREVENTED, ' + chip.word + '|| user prevented from removing the word ' + chip.word + ' while they were splitting topic ' + scope.topic.id);
          return;
        }
        // if this a previously added word, then this is an undo add refinement
        if (chip.status === 'added') {
          scope.$emit('undo-add-word', chip.word);
        } else if (chip.status === 'removed') {
          // else if this is a previously removed word, then this is an undo remove refinement
          scope.$emit('undo-remove-word', chip.word);

          // need to add the chip back into the same position with an unevaluated status
          chip.status = 'unevaluated';
          scope.topic.words.splice(index, 0, chip);
        } else if (chip.status === "reordered") {
          // else if this is a previously re-ordered word, then this is an undo re-order refinement
          scope.$emit('undo-reorder-word', chip.word, index, chip.originalIndex);

          // need to add the chip back into the same position with an unevaluated status
          chip.status = 'unevaluated';
          scope.topic.words.splice(chip.originalIndex, 0, chip);
        } else if (chip.status === "trashed") {
          // else if this is a previously trashed word, then this is an undo trash refinement
          scope.$emit('undo-stop-word', chip.word);

          chip.status = 'unevaluated';
          scope.topic.words.splice(index, 0, chip);
        } else {
          // emit a refinement
          scope.$emit('remove-word', chip.word);

          // we still want to keep the chip in the same position but with a removed status
          chip.status = 'removed';
          scope.topic.words.splice(index, 0, chip);
        }
      };

      scope.removeDocument = function(doc) {
        // only allow removing documents on tutorial step 22
        if (!scope.tutorial.complete) {
          if (scope.tutorial.step !== 22) {
            return;
          }
        }
        if (doc.status === 'removed') {
          doc.status = 'unevaluated';
          scope.$emit('undo-remove-doc', doc.docid);
        } else {
          // remove the document from the list
          //scope.topic.docs = _.without(scope.topic.docs, doc);

          // gray out the document in the list
          doc.status = 'removed';

          // emit a refinement
          scope.$emit('remove-doc', doc.docid);
        }

      };

      scope.moreDocuments = function() {
        console.warn('more documents button hidden in UI');
        TopicService.log(scope.corpus, scope.nums, 'user clicked to view more documents');
        // up the doc count by 20
        scope.numDocs += 20;

      };

      scope.vocabSearch = function(query) {
        var results = query ? scope.vocab.filter(createFilterFor(query)) : [];
        return results;
      };

      /**
       * Create filter function for a query string
       */
      function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(word) {
          return (angular.lowercase(word).indexOf(lowercaseQuery) === 0);
        };

      }

      /**
      * Method to return the proper object when append is called
      */
      scope.transform = function(chip) {
        // check that the chip is not already in the list
        var chip_match = undefined;
        _.each(scope.topic.words, function (w, i) {
          if (w.word === chip) {
            chip_match = w;
            scope.chipsCtrl.selectAndFocusChipSafe(i);
          }
        });
        if (chip_match) {
          // this will ensure duplicate is not added to the list
          return chip_match;
        } else {
          // otherwise create a new one
          return {
            word: chip,
            weight: 'unknown',
            status: 'added'
          };
        }
      };
    }
  };
}]);
