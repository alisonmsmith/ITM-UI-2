'use strict';

/**
 * @ngdoc overview
 * @name itmUiApp
 * @description
 * # itmUiApp
 *
 * Main module of the application.
 */
angular
  .module('itmUiApp', [
    'ngAnimate',
    'ngResource',
    'ui.router',
    'ngMaterial',
    'mdChipDraggable'
  ])
  .config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('login', {
        url: '/',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .state('topics', {
        url: '/topics?user&corpus',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      });

    $mdThemingProvider.theme('default')
    .primaryPalette('blue-grey')
    .accentPalette('pink');
  });
