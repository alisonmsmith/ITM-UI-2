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

			scope.selectWord = function(chip) {
				// show the trash can and store the selected word
				scope.trash = true;
				scope.selected = chip.word;
			};

			scope.trashWord = function() {
				scope.$emit('trash-word', scope.selected);

				scope.trash = false;
				// remove the selected word from the chips list
				//scope.topic.words = _.without(scope.topic.words, scope.selected);
				scope.selected = undefined;
			};

			scope.addWord = function(chip) {
				// emit a refinement
				scope.$emit('add-word', chip.word);
			};

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
				} else {
					// emit a refinement
					scope.$emit('remove-word', chip.word);

					// we still want to keep the chip in the same position but with a removed status
					chip.status = 'removed';
					scope.topic.words.splice(index, 0, chip);
				}
			};

			scope.removeDocument = function(doc) {
				// remove the document from the list
				//scope.topic.docs = _.without(scope.topic.docs, doc);

				// gray out the document in the list
				doc.status = 'removed';

				// emit a refinement
				scope.$emit('remove-doc', doc.id);
			}

			scope.undoRemove = function(doc) {
				doc.status = 'unevaluated';

				// emit an undo refinement
				scope.$emit('undo-remove-doc', doc.id);
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