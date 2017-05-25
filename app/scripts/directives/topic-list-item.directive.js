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
			/**
			* Method to select a topic in the list.
			*/
			scope.select = function(topic) {
				// emit event that the current topic has been selected
				scope.$emit("select", topic);
			}

			/**
			* Method to start merging with the selected topic
			*/
			scope.merge = function(topic) {
				// emit event that the user wishes to merge this topic
				if (!topic.merged) {
					scope.$emit("merge", topic);
				}
			}

			/**
			* Method to start splitting the selected topic
			*/
			scope.split = function(topic) {
				// emit event that the user wishes to split this topic
				if (!topic.split) {
					scope.$emit("split", topic);
				}
			};

			/**
			* Method to undo the split topic progress for the given topic
			*/
			scope.undoSplit = function(topic) {
				scope.$emit("undo-split", topic);
			};

			/**
			* Method to undo the create new topic progress for the given topic
			*/
			scope.undoCreateNew = function(topic) {
				scope.$emit("undo-create", topic);
			}

			/**
			* Method to rename a topic. Saves a temporary name until user presses 'save' or cancel'
			*/
			scope.rename = function(topic) {
				topic.name = topic.topic;
				scope.renaming = true;
			};

			/**
			* Method to save the updated name
			*
			* @param topic - the topic for which to save the name; topic.name is the temporary topic name
			*/
			scope.saveName = function(topic) {
				topic.topic = topic.name;
				scope.renaming = false;

				// emit event to save the new name for the topic
				scope.$emit("rename-topic", topic);
			}

			/**
			* Method to cancel topic renaming
			*/
			scope.cancelName = function(topic) {
				topic.name = "";
				scope.renaming = false;
			}

		}
	};
}]);
