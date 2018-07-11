/**
*/

/* jshint unused:vars */
'use strict';

angular.module('itmUiApp').directive('tutorial', [ '$document', function($document) {
  return {
    restrict: 'E',
    scope:true,
    templateUrl: 'views/tutorial.html',
    link: function(scope, element, attrs) {
      scope.tutorialSteps = 35;

      scope.tutorialRange = _.range(0,scope.tutorialSteps+1);

      // set up highlighting and unhighlighting for the tutorial
      function highlight(element) {
        switch (element) {
          case 'add-word':
          angular.element(document.querySelector('#topicA_ac')).addClass('highlight');
          break;
          case 'show-more':
          angular.element(document.getElementsByClassName("toggle-doc")).addClass('highlight');
          break;
          case 'undo-word':
          angular.element(document.getElementsByClassName("undo-word")).addClass('highlight');
          break;
          case 'remove-word':
          angular.element(document.getElementsByClassName("remove-word")).addClass('highlight');
          break;
          case 'save':
          angular.element(document.querySelector('#saveButton')).addClass('highlight');
          break;
          case 'merge-button':
          angular.element(document.getElementsByClassName("merge-button")).addClass('highlight');
          break;
          case 'split-button':
          angular.element(document.getElementsByClassName("split-button")).addClass('highlight');
          break;
          case 'remove-doc':
          angular.element(document.getElementsByClassName("remove-doc")).addClass('highlight');
          break;
          case 'undo-doc':
          angular.element(document.getElementsByClassName("undo-doc")).addClass('highlight');
          break;
          case 'split-checkmark':
          angular.element(document.getElementsByClassName("split-checkmark")).addClass('highlight');
          break;
          case 'create-checkmark':
          angular.element(document.getElementsByClassName("create-checkmark")).addClass('highlight');
          break;
          case 'merge-checkmark':
          angular.element(document.getElementsByClassName("merge-checkmark")).addClass('highlight');
          break;
          case 'undo-merge':
          angular.element(document.getElementsByClassName("undo-merge")).addClass('highlight');
          break;
          case 'undo-split':
          angular.element(document.getElementsByClassName("undo-split")).addClass('highlight');
          break;
          case 'undo-create':
          angular.element(document.getElementsByClassName("undo-split")).addClass('highlight');
          break;
          case 'add-topic':
          angular.element(document.querySelector('#createTopicButton')).addClass('highlight');
          break;
          case 'clear-refinements':
          angular.element(document.querySelector('#clearRefinementsButton')).addClass('highlight');
          break;
          case 'topic-list-item':
          angular.element(document.getElementsByClassName('topic-list-item')).addClass('highlight');
          break;
          case 'trash-can':
          angular.element(document.querySelector('#stopWordsButton')).addClass('highlight');
          break;
          default:
          console.error('unhandled element: ' + element);
        }
      }

      // method to automatically push the tutorial forward, only ever called when user clicks save and when results return from the save method
      scope.$on('tutorial-next', function() {
        scope.tutorialNext();
      });

      function unhighlight(element) {
        switch (element) {
          case 'add-word':
          angular.element(document.querySelector('#topicA_ac')).removeClass('highlight');
          break;
          case 'remove-word':
          angular.element(document.getElementsByClassName("remove-word")).removeClass('highlight');
          break;
          case 'show-more':
          angular.element(document.getElementsByClassName("toggle-doc")).removeClass('highlight');
          break;
          case 'undo-word':
          angular.element(document.getElementsByClassName("undo-word")).removeClass('highlight');
          break;
          case 'undo-doc':
          angular.element(document.getElementsByClassName("undo-doc")).removeClass('highlight');
          break;
          case 'save':
          angular.element(document.querySelector('#saveButton')).removeClass('highlight');
          break;
          case 'merge-checkmark':
          angular.element(document.getElementsByClassName("merge-checkmark")).removeClass('highlight');
          break;
          case 'split-checkmark':
          angular.element(document.getElementsByClassName("split-checkmark")).removeClass('highlight');
          break;
          case 'create-checkmark':
          angular.element(document.getElementsByClassName("create-checkmark")).removeClass('highlight');
          break;
          case 'undo-merge':
          angular.element(document.getElementsByClassName("undo-merge")).removeClass('highlight');
          break;
          case 'remove-doc':
          angular.element(document.getElementsByClassName("remove-doc")).removeClass('highlight');
          break;
          case 'merge-button':
          angular.element(document.getElementsByClassName("merge-button")).removeClass('highlight');
          break;
          case 'split-button':
          angular.element(document.getElementsByClassName("split-button")).removeClass('highlight');
          break;
          case 'undo-split':
          angular.element(document.getElementsByClassName("undo-split")).removeClass('highlight');
          break;
          case 'undo-create':
          angular.element(document.getElementsByClassName("undo-split")).removeClass('highlight');
          break;
          case 'clear-refinements':
          angular.element(document.querySelector('#clearRefinementsButton')).removeClass('highlight');
          break;
          case 'topic-list-item':
          angular.element(document.getElementsByClassName('topic-list-item')).removeClass('highlight');
          break;
          case 'add-topic':
          angular.element(document.querySelector('#createTopicButton')).removeClass('highlight');
          break;
          case 'trash-can':
          angular.element(document.querySelector('#stopWordsButton')).removeClass('highlight');
          break;
          default:
          console.error('unhandled element: ' + element);
        }
      }


      /**
      * Method to go to the next step in the tutorial. Called when the user clicks the 'next' button.
      */
      scope.tutorialNext = function() {
        if (scope.tutorial.step < scope.tutorialSteps) {
          scope.tutorial.step += 1;
          if (scope.tutorial.step === 0 || scope.tutorial.step === 4 || scope.tutorial.step === 8 || scope.tutorial.step === 11 || scope.tutorial.step === 14 || scope.tutorial.step === 17 || scope.tutorial.step === 20 || scope.tutorial.step === 24 || scope.tutorial.step === 27 || scope.tutorial.step === 30 || scope.tutorial.step === 34) {
            scope.tutorial.nextEnabled = true;
          } else {
            scope.tutorial.nextEnabled = false;
          }
        } else {
          scope.tutorial.complete = true;
        }

        // highlight appropriate elements depending on the step
        if (scope.tutorial.step === 1) {
          scope.tutorial.flags.topic1Selected = false;
        }
        if (scope.tutorial.step === 3) {
          scope.tutorial.flags.hoverWord = false;
        }
      }


    }
  };
}]);
