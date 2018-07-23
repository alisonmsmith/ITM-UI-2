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

      scope.numQuestions = 4;

      // append userId to the questionnaire

      // we will need to reuse the response from answer 1 to pass to the google form for the post-task survey
      scope.questionnaire.answers = {
        1:4,
        2:"",
        3:"",
        4:""
      };

      let refinements = [
        {
          'value':'remove_word',
          'name':'remove word from a topic'
        },
        {
          'value':'trash_word',
          'name':'remove word from all topics (trash)'
        },
        {
          'value':'reorder',
          'name':'change word order in a topic'
        },
        {
          'value':'remove_doc',
          'name':'remove document from a topic'
        },
        {
          'value':'merge',
          'name':'merge topics'
        },
        {
          'value':'split',
          'name':'split topic'
        },
        {
          'value':'create',
          'name':'create new topic'
        },
        {
          'value':'delete',
          'name':'delete topic'
        }
      ];

      let random = function(array) {
        return array.sort(function() {
          return .5 - Math.random();
        });
      }

      scope.randomRefs = random(refinements);

      scope.skipQuestionnaire = function() {
        scope.questionnaire.complete = true;
        scope.startTask();
      };

      /**
      * Method to submit an answer to a question in the questionnaire
      */
      scope.submitAnswer = function(id) {
        var answer = scope.questionnaire.answers[id];

        // account for 0 indexing on the questions
        id = id-1;

        // submit the question to the questionnaire service
        TopicService.submitAnswer(id, answer, scope.corpus, scope.topics.length).then(function(response) {
          // go to the next question
          if (scope.questionnaire.step < scope.numQuestions) {
            scope.questionnaire.step += 1;
          } else {
            scope.questionnaire.complete = true;
            scope.startTask();
          }

        }, function(error) {
        //  console.error('error submitting questionnaire answer');
          // go to the next question
          if (scope.questionnaire.step < scope.numQuestions) {
            scope.questionnaire.step += 1;
          } else {
            scope.questionnaire.complete = true;
            scope.startTask();
          }
        });
      }
    }
  };
}]);
