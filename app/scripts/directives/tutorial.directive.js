/**
*/

/* jshint unused:vars */
'use strict';

angular.module('itmUiApp').directive('tutorial', [ 'TutorialService', '$document', function(TutorialService, $document) {
  return {
    restrict: 'E',
    scope:true,
    templateUrl: 'views/tutorial.html',
    link: function(scope, element, attrs) {
      //scope.tutorialMessages = TutorialService.messages;
      var tutorialSteps = 26;

      // set up highlighting and unhighlighting for the tutorial
      scope.highlight = function(element) {
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
          case 'trash-can':
          angular.element(document.querySelector('#stopWordsButton')).addClass('highlight');
          break;
          default:
          console.error('unhandled element: ' + element);
        }
      }

      scope.unhighlight = function(element) {
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

      scope.tutorialNext = function() {
        if (scope.tutorial.step < tutorialSteps) {
          scope.tutorial.step += 1;
        } else {
          scope.tutorial.complete = true;
        }
      }


    }
  };
}]);
