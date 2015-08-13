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
        'restangular',
        'gridster'
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
            .when('/grid', {
                templateUrl: 'views/grid.html',
                controller: 'GridCtrl',
                controllerAs: 'grid'
            })
            .otherwise({
                redirectTo: '/'
            });
    })

.directive('integer', function() {
    return {
        require: 'ngModel',
        link: function(scope, ele, attr, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
                if (viewValue === '' || viewValue === null || typeof viewValue === 'undefined') {
                    return null;
                }
                return parseInt(viewValue, 10);
            });
        }
    };
})

// helper code
.filter('object2Array', function() {
    return function(input) {
        var out = [];
        for (var i in input) {
            out.push(input[i]);
        }
        return out;
    }
});
