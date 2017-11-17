'use strict';

/**
 * @ngdoc function
 * @name itmUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the itmUiApp
 */
angular.module('itmUiApp')
  .controller('LoginCtrl', function($scope, $state, TopicService) {
    // generate a unique user id
    $scope.user = TopicService.guid();

    /*
    * When the user clicks accept, we set the user and go to the topics view.
    */
  	$scope.submit = function() {
  		TopicService.setUser($scope.user);
  		$state.go('topics');
  	};
  });
