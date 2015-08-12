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
    'nvd3',
    'ngStomp',
    'angularMoment',
    'restangular'
  ])
    .config(function($routeProvider, RestangularProvider) {

        RestangularProvider.setBaseUrl('http://localhost:48002');

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
            .when('/test', {
                templateUrl: 'views/test.html',
                controller: 'TestCtrl',
                controllerAs: 'test'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
