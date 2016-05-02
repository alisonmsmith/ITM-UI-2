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
  	$scope.submit = function(user) {
  		TopicService.setUser(user);
  		$state.go('topics');    
  	}
  });