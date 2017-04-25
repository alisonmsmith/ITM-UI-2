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
      var tutorialSteps = 28;

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


      scope.tutorialNext = function() {
        if (scope.tutorial.step < tutorialSteps) {
          scope.tutorial.step += 1;
          if (scope.tutorial.step === 0 || scope.tutorial.step === 3 || scope.tutorial.step === 6 || scope.tutorial.step === 8 || scope.tutorial.step === 10 || scope.tutorial.step === 13|| scope.tutorial.step === 15 || scope.tutorial.step === 17 || scope.tutorial.step === 18) {
            scope.tutorial.nextEnabled = true;
          } else {
            scope.tutorial.nextEnabled = false;
          }
        } else {
          scope.tutorial.complete = true;
        }

        // highlight appropriate elements depending on the step
        if (scope.tutorial.step === 1) {
          scope.tutorial.flags.topic3Selected = false;
    //      highlight('topic-list-item');
        }
        if (scope.tutorial.step === 2) {
          scope.tutorial.flags.hoverWord = false;
      //    unhighlight('topic-list-item');
      //    highlight('show-more');
        }
        if (scope.tutorial.step === 3) {
      //    unhighlight('show-more');
        }
        if (scope.tutorial.step === 5) {
      //    highlight('add-word');
        }
        if (scope.tutorial.step === 6) {
      //    unhighlight('add-word');
      //    highlight('save');
        }
        if (scope.tutorial.step === 7) {
      //    unhighlight('save');
      //    highlight('remove-word');
        }
        if (scope.tutorial.step === 8) {
      //    unhighlight('remove-word');
        }
        // save outstanding refinements
        if (scope.tutorial.step === 11) {
      //    highlight('undo-word');
      //    highlight('save');
      //    highlight('clear-refinements');
        }
        // model updating
        if (scope.tutorial.step === 12) {
      //    unhighlight('undo-word');
      //    unhighlight('save');
      //    unhighlight('clear-refinements');
        }
        // remove document
        if (scope.tutorial.step === 14) {
          // need to make sure we still highlight the button after the user clicks to switch to topic 6
      //    highlight('remove-doc');
        }
        if (scope.tutorial.step === 15) {
      //    unhighlight('remove-doc');
        }
      }


    }
  };
}]);
