'use strict';

/**
 * @ngdoc function
 * @name atacamaApp.controller:OhlcCtrl
 * @description
 * # OhlcCtrl
 * Controller of the atacamaApp
 */
angular.module('atacamaApp')
    .controller('OhlcCtrl', function($scope, tickService) {
        console.log('OhlcCtrl has been created');

        var sod = moment(0, "HH").format("x");

        // $scope.data = tickService.list();
        tickService.getTicksAfter('ABC', sod);
        $scope.data = $scope.ticks;

        $scope.options = {
            chart: {
                type: 'ohlcBarChart',
                height: 450,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 50,
                    left: 75
                },
                x: function(d) {
                    return d['date'];
                },
                y: function(d) {
                    return d['close'];
                },
                showValues: true,
                refreshDataOnly: true,
                transitionDuration: 500,
                xAxis: {
                    axisLabel: 'Dates',
                    tickFormat: function(d) {
                        return d3.time.format('%X')(new Date(d));
                    },

                },
                yAxis: {
                    axisLabel: 'Stock Price',
                    tickFormat: function(d, i) {
                        return '$' + d3.format(',.1f')(d);
                    }
                }
            }
        };
    });
