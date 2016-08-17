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
		/*	scope.topic.name = scope.topic.topic;
			scope.changeName = false;

			scope.$watch(scope.topic.name, function(name) {
				// fire on name change
				console.log(scope.topic.name);
			});*/

			scope.select = function(topic) {
				// emit event that the current topic has been selected
				scope.$emit("select", topic);
			}

			scope.merge = function(topic) {
				// emit event that the user wishes to merge this topic
				if (!topic.merged) {
					scope.$emit("merge", topic);
				}
			}

			scope.split = function(topic) {
				// emit event that the user wishes to split this topic
				if (!topic.split) {
					scope.$emit("split", topic);
				}
			};

			scope.undoSplit = function(topic) {
				scope.$emit("undo-split", topic);
			};

			scope.rename = function(topic) {
				scope.renaming = true;
			}; 

		/*	scope.toggleChangeName = function() {
				scope.changeName = !scope.changeName;
			}; */
		}
	};
}]);