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

    $scope.modelTypes = [
      {
        value: 0,
        modelName: 'model 1'
      },
      {
        value: 1,
        modelName: 'model 2'
      },
      {
        value: 2,
        modelName: 'model 3'
      }
    ];

    $scope.modelType = 0;

    /*
    * When the user clicks accept, we set the user and go to the topics view.
    */
  	$scope.submit = function(user, type) {
  		TopicService.setUser(user);
      TopicService.setModelType(type);
  		$state.go('topics');
  	};
  });
