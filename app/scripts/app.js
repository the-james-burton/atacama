'use strict';

/**
 * @ngdoc overview
 * @name atacamaApp
 * @description
 * # atacamaApp
 *
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
        'ngStorage',
        'nvd3',
        'angularMoment',
        'restangular',
        'gridster',
        'ui.bootstrap',
        'elasticsearch',
        'AngularStompDK',
        'smart-table'
    ])
    .config(function($routeProvider, $logProvider, RestangularProvider, ngstompProvider) {

        $logProvider.debugEnabled(true);

        RestangularProvider.setBaseUrl('http://localhost:48002');

        // var url = 'http://localhost:48002/ticks';
        var url = 'http://localhost:15674/stomp';

        // https://www.rabbitmq.com/web-stomp.html
        // Missing features
        // RabbitMQ-Web-Stomp is fully compatible with the RabbitMQ-STOMP plugin, with the exception of STOMP heartbeats.
        // STOMP heartbeats won't work with SockJS.
        ngstompProvider
            .url(url)
            .credential('guest', 'guest')
            .debug(true)
            .heartbeat(0, 0)
            .vhost('/')
            .class(SockJS);

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
            .when('/direct', {
                templateUrl: 'views/direct.html',
                controller: 'DirectCtrl',
                controllerAs: 'direct'
            })
            .when('/chart', {
                templateUrl: 'views/chart.html',
                controller: 'ChartCtrl',
                controllerAs: 'chart'
            })
            .when('/test', {
                templateUrl: 'views/test.html',
                controller: 'TestCtrl',
                controllerAs: 'test'
            })
            .when('/grid', {
                templateUrl: 'views/grid.html',
                controller: 'GridCtrl',
                controllerAs: 'grid'
            })
            .when('/gridnew', {
                template: '<wwa-dashboard></wwa-dashboard>'
            })
            .otherwise({
                redirectTo: '/'
            });

            // http://stackoverflow.com/questions/1038746/equivalent-of-string-format-in-jquery
            String.prototype.format = function () {
              var args = arguments;
              return this.replace(/\{(\d+)\}/g, function (m, n) { return args[n]; });
            };
    });
