/**
 */

/* jshint unused:vars */
'use strict';

angular.module('itmUiApp').directive('topic', [function() {
	return {
		restrict: 'E',
		scope: {
			topic: '='
		},
		templateUrl: 'views/topic.html',
		link: function(scope, element, attrs) {

			scope.selectWord = function(chip) {
				// show the trash can and store the selected word
				//scope.trash = true;
				scope.selected = chip;
			};


			scope.cancelSplit = function() {
				scope.topic.splitting = false;
				scope.topic.words = scope.topic.wordscopy;
				scope.topic.wordscopy = undefined;
				scope.topic.subwords = undefined;
			};

			scope.acceptSplit = function() {
				scope.topic.splitting = false;
				scope.topic.split = true;
				scope.$emit('accept-split', scope.topic);
			};

			/*scope.acceptmerge = function() {
				scope.$emit('accept-merge', topic);
			};*/

			scope.addWord = function(chip) {
				// emit a refinement
				scope.$emit('add-word', chip.word);
			};

			scope.$on('topic-stop-word', function(event) {
				if (scope.selected) {
					scope.$emit('add-stop-word', scope.selected.word);
					// strikethrough the selected word
					scope.selected.status = 'trashed';
					scope.selected = undefined;
				} 
			});

			// Listen for event that a chip has been dragged within the word list
			scope.$on('mdChipDraggable:change', function(event, data) {
				console.log(data);
				if (data.fromCollection === data.toCollection && !scope.topic.splitting) {
					// Move within the same chip list
					var chip = data.item;
					// set the status of the word to reordered and store the original index
					// but only if this chip has not been re-ordered before
					if (chip.status === 'reordered') {
						// if the chip has been re-ordered before, we need to update the final position
						scope.$emit('update-reorder-word', chip.word, data.to, chip.originalIndex);
					} else {
						chip.status = 'reordered';
						chip.originalIndex = data.from;
						scope.$emit('reorder-word', chip.word, data.to, data.from);
					}
					
				} else if (data.fromCollection !== data.toCollection) {
					// Move from one chip list to another
					if (data.fromCollection === 'topicA') {
						var chip = scope.topic.words.splice(data.from, 1)[0];
						chip.status = 'split';
						chip.orginalIndex = data.from;
						chip.originalTopic = data.fromCollection;
						scope.topic.subwords.splice(data.to, 0, chip);
						
					} else {
						var chip = scope.topic.subwords.splice(data.from, 1)[0];
						chip.status = 'split';
						chip.orginalIndex = data.from;
						chip.originalTopic = data.fromCollection;
						scope.topic.words.splice(data.to, 0, chip);
					}
				}

			});


			scope.removeWord = function(chip, index) {
				// if this a previously added word, then this is an undo add refinement
				if (chip.status === 'added') {
					scope.$emit('undo-add-word', chip.word);
				} else if (chip.status === 'removed') {
					// else if this is a previously removed word, then this is an undo remove refinement
					scope.$emit('undo-remove-word', chip.word);

					// need to add the chip back into the same position with an unevaluated status
					chip.status = 'unevaluated';
					scope.topic.words.splice(index, 0, chip);
				} else if (chip.status === "reordered") {
					// else if this is a previously re-ordered word, then this is an undo re-order refinement
					scope.$emit('undo-reorder-word', chip.word, index, chip.originalIndex);

					// need to add the chip back into the same position with an unevaluated status
					chip.status = 'unevaluated';
					scope.topic.words.splice(chip.originalIndex, 0, chip);
				} else if (chip.status === "trashed") {
					// else if this is a previously trashed word, then this is an undo trash refinement
					scope.$emit('undo-stop-word', chip.word);

					chip.status = 'unevaluated';
					scope.topic.words.splice(index, 0, chip);
				} else {
					// emit a refinement
					scope.$emit('remove-word', chip.word);

					// we still want to keep the chip in the same position but with a removed status
					chip.status = 'removed';
					scope.topic.words.splice(index, 0, chip);
				}
			};

			scope.removeDocument = function(doc) {
				if (doc.status === 'removed') {
					doc.status = 'unevaluated';
					scope.$emit('undo-remove-doc', doc.docid);
				} else {
					// remove the document from the list
					//scope.topic.docs = _.without(scope.topic.docs, doc);

					// gray out the document in the list
					doc.status = 'removed';

					// emit a refinement
					scope.$emit('remove-doc', doc.docid);
				}

			}

			scope.transform = function(chip) {
				return {
					word: chip,
					weight: 'unknown',
					status: 'added'
				}
			}
		}
	};
}]);