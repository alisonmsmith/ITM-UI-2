/**
*/

/* jshint unused:vars */
'use strict';

angular.module('itmUiApp').directive('topicListItem', [ function() {
	return {
		restrict: 'E',
		scope: {
			topic: '='
		},
		templateUrl: 'views/topic-list-item.html',
		link: function(scope, element, attrs) {
			scope.select = function(topic) {
				// emit event that the current topic has been selected
				scope.$emit("select", topic);
			}

			scope.merge = function(topic) {
				// emit event that the user wishes to merge this topic
				scope.$emit("merge", topic);
			}

			scope.split = function(topic) {
				// emit event that the user wishes to split this topic
				scope.$emit("split", topic);
			};
		}
	};
}]);