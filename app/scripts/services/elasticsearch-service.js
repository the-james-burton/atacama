'use strict';

/**
 * @ngdoc service
 * @name atacamaApp.elasticsearchService
 * @description
 * # elasticsearchService
 * Service in the atacamaApp.
 */
angular.module('atacamaApp')
    .service('elasticsearchService', function($rootScope, $resource) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        console.log('elasticsearchService has been created');

        var url = 'http://localhost:48002';

        // TODO 1. return from resource to passed-in variable $scope.data[0].values does not work
        // TODO 2. cannot access $scope.data[0].values from websocket callback in here

        //this.list = function() {
        //    return $rootScope.ticks;
        //};

        // var GetTicksAfter = $resource(url + '/tick/:symbol/:date');

        //this.getTicksAfter = function(symbol, date, reply) {
        //    var call = GetTicksAfter.get({
        //            symbol: symbol,
        //            date: date
        //        }
        //        ,function(response) {
        //            reply = response.ticks;
        //        }
        //    )
        //};


        //this.getTicksAfter(symbol, date) {
        //    $http.get(url + '/' + symbol + '/' + date).
        //      success(function(data, status, headers, config) {
        //      })
        //}

        // this.add = function(tick) {
        //    ticks.push(tick);
        //};

    });
