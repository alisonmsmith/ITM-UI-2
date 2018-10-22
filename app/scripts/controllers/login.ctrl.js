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
        modelName: 'Variational Bayes ITM'
      },
      {
        value: 1,
        modelName: 'Asymmetric/Informed Prior ITM'
      },
      {
        value: 2,
        modelName: 'Constrained ITM'
      }
    ];

    // default the model type to a random model of the three options
    $scope.modelType = Math.floor(Math.random() * 3);

    /*
    * When the user clicks accept, we set the user and go to the topics view.
    */
  	$scope.submit = function(user, type) {
  		TopicService.setUser(user);
      TopicService.setModelType(type);
      TopicService.log('twitter', '10', '||-1||START_SESSION, ' + user + ', ' + type + '|| loading new session for user ' + user + ' with model type ' + type);
  		$state.go('topics');
  	};
  });
