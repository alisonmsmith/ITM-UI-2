/**
*/

/* jshint unused:vars */
'use strict';

angular.module('itmUiApp').directive('questionnaire', [ 'TopicService', function(TopicService) {
  return {
    restrict: 'E',
    scope:true,
    templateUrl: 'views/questionnaire.html',
    link: function(scope, element, attrs) {

      var numQuestions = 3;

      // append userId to the questionnaire

      // we will need to reuse the response from answer 1 to pass to the google form for the post-task survey
      scope.questionnaire.answers = {
        1:"",
        2:"",
        3:""
      };

      scope.skipQuestionnaire = function() {
        scope.questionnaire.complete = true;
        scope.startTask();
      }

      /**
      * Method to submit an answer to a question in the questionnaire
      */
      scope.submitAnswer = function(id) {
        var answer = scope.questionnaire.answers[id];

        // account for 0 indexing on the questions
        var id = id-1;

        // submit the question to the questionnaire service
        TopicService.submitAnswer(id, answer).then(function(response) {
          // go to the next question
          if (scope.questionnaire.step < numQuestions) {
            scope.questionnaire.step += 1;
          } else {
            scope.questionnaire.complete = true;
            scope.startTask();
          }

        }, function(error) {
          console.error('error submitting questionnaire answer');
        });
      }
    }
  };
}]);
