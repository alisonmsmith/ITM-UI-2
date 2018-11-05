/**
*/

/* jshint unused:vars */
'use strict';

angular.module('itmUiApp').directive('topicListItem', [ 'TopicService', function(TopicService) {
	return {
		restrict: 'E',
		scope: {
			topic: '=',
			corpus: '=',
			nums: '=',
			tutorial: '='
		},
		templateUrl: 'views/topic-list-item.html',
		link: function(scope, element, attrs) {
			/**
			* Method to select a topic in the list.
			*/
			scope.select = function(topic) {
				TopicService.log(scope.corpus, scope.nums, '||' + scope.topic.id + '||SELECT_TOPIC|| user selected topic ' + scope.topic.id);
				// emit event that the current topic has been selected
				scope.$emit("select", topic);
			};

			scope.hoverTopicEnter = function(topic) {
				TopicService.log(scope.corpus, scope.nums, '||' + scope.topic.id + '||HOVER, TOPIC, ENTER|| user hovered over topic ' + scope.topic.id);
			}

			scope.hoverTopicExit = function(topic) {
				TopicService.log(scope.corpus, scope.nums, '||' + scope.topic.id + '||HOVER, TOPIC, EXIT|| user hovered off topic ' + scope.topic.id);
			}

			/**
			* Method to start merging with the selected topic
			*/
			scope.merge = function(topic) {
				// emit event that the user wishes to merge this topic
				if (!topic.merged) {
					scope.$emit("merge", topic);
				}
			};

			scope.hoverMerge = function(topic) {
				TopicService.log(scope.corpus, scope.nums, '||' + scope.topic.id + '||HOVER, MERGE|| user hovered over button to merge topic ' + scope.topic.id);
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

			scope.hoverSplit = function(topic) {
				TopicService.log(scope.corpus, scope.nums, '||' + scope.topic.id + '||HOVER, SPLIT|| user hovered over button to split topic ' + scope.topic.id);
			}

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
			};

			/**
			* Method to undo the deletion of the topic
			*/
			scope.undoDeleteTopic = function(topic) {
				scope.$emit("undo-delete", topic);
			};

			/**
			* Method to rename a topic. Saves a temporary name until user presses 'save' or cancel'
			*/
			scope.rename = function(topic) {
				if (!scope.tutorial.complete) {
					// if on step 2, we should be renaming topic 4 to SPORTS
					if (scope.tutorial.step === 2) {
						if (topic.id === 3) {
							// continue
						} else {
							return;
						}
					} else {
						return;
					}
				}
				TopicService.log(scope.corpus, scope.nums, '||' + scope.topic.id + '||RENAME_TOPIC, START|| user clicked to start renaming topic ' + scope.topic.id);
				topic.name = topic.topic;
				scope.renaming = true;
			};

			scope.hoverRename = function(topic) {
				TopicService.log(scope.corpus, scope.nums, '||' + scope.topic.id + '||HOVER, RENAME_TOPIC|| user hovered over button to rename topic ' + scope.topic.id);
			}

			/**
			* Method to save the updated name
			*
			* @param topic - the topic for which to save the name; topic.name is the temporary topic name
			*/
			scope.saveName = function(topic) {
				TopicService.log(scope.corpus, scope.nums, '||' + scope.topic.id + '||RENAME_TOPIC, COMPLETE, ' + topic.name + '|| user clicked to save new name of for topic ' + scope.topic.id);

				topic.topic = topic.name;
				scope.renaming = false;

				// emit event to save the new name for the topic
				scope.$emit("rename-topic", topic);
			};

			scope.hoverSaveName = function(topic) {
				TopicService.log(scope.corpus, scope.nums, '||' + scope.topic.id + '||HOVER, SAVE_RENAME, ' + topic.name + '|| user hovered over button to save new name of for topic ' + scope.topic.id);
			};

			/**
			* Method to cancel topic renaming
			*/
			scope.cancelName = function(topic) {
				TopicService.log(scope.corpus, scope.nums, '||' + scope.topic.id + '||RENAME_TOPIC, CANCEL|| user clicked to cancel renaming for topic ' + scope.topic.id);
				topic.name = "";
				scope.renaming = false;
			};

			scope.hoverCancelName = function(topic) {
				TopicService.log(scope.corpus, scope.nums, '||' + scope.topic.id + '||HOVER, CANCEL_RENAME, ' + topic.name + '|| user hovered over button to cancel saving new name of for topic ' + scope.topic.id);
			};

		}
	};
}]);
