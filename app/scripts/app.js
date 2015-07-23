'use strict';

/**
 * @ngdoc overview
 * @name atacamaApp
 * @description
 * # atacamaApp
 *
 * Main module of the application.
 */
angular
  .module('atacamaApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'nvd3'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/ohlc', {
        templateUrl: 'views/ohlc.html',
        controller: 'OhlcCtrl',
        controllerAs: 'ohlc'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
