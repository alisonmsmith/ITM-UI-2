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
    'ngRoute',
    'ngMaterial'
  ])
  .config(function ($routeProvider, $mdThemingProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });

    $mdThemingProvider.theme('default')
    .primaryPalette('blue-grey')
    .accentPalette('pink');
  });
