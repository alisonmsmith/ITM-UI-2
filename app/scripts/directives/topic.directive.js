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

		}
	};
}]);