/**
*/

/* jshint unused:vars */
'use strict';

angular.module('itmUiApp').directive('topic', [ function() {
	return {
		restrict: 'E',
		scope: {
			topic: '='
		},
		templateUrl: 'views/topic.html',
		link: function(scope, element, attrs) {
			scope.addWord = function(word) {
				console.log(word);
				// emit a refinement
				scope.$emit('add-word', word);
			};

			scope.removeWord = function(word) {
				console.log(word);

				// emit a refinement
				scope.$emit('remove-word', word);
			};

			scope.removeDocument = function(doc) {
				// remove the document from the list
				scope.topic.docs = _.without(scope.topic.docs, doc);

				// emit a refinement
				scope.$emit('remove-doc', doc);
			}
		}
	};
}]);