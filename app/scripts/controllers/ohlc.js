'use strict';

/**
 * @ngdoc function
 * @name atacamaApp.controller:OhlcCtrl
 * @description
 * # OhlcCtrl
 * Controller of the atacamaApp
 */
angular.module('atacamaApp')
    .controller('OhlcCtrl', function($scope, $stomp, $resource, tickService) {
        console.log('OhlcCtrl has been created');

        var url = 'http://localhost:48002';

        var sod = moment(0, "HH").format("x");

        // {"date": 1437583864374, "open": 100.0, "high": 100.24021489109903, "low": 98.2724267098159, "close": 99.51909089116204, "volume": 107.79215866544341, "symbol": "ABC.L", "exchange": "FTSE100", "timestamp": "2015-07-22T17:52:04.377+01:00" }

        // $scope.data = tickService.list();
        var symbol = 'ABC';

        //$scope.ticks = {};
        //$scope.ticks[symbol] = [];
        //$scope.ticks[symbol].values = [];

        //$scope.ticks = [];

        $stomp
            .connect(url + '/ticks', [])

        // frame = CONNECTED headers
        .then(function(frame) {
            console.log('connected to tick websocket');
            var subscription = $stomp.subscribe('/topic/ticks', function(payload, headers, res) {
                // alert(payload.message);
                $scope.data[0].values.push(payload);
                $scope.$apply();
            }, {
                "headers": "are awesome"
            });

        });

        var GetTicksAfter = $resource(url + '/tick/:symbol/:date');

        $scope.data = [{
            key: symbol
            //values: [{}]
        }];

        var ticks = GetTicksAfter.get({
                    symbol: symbol,
                    date: sod
            }
            ,function(response) {
                $scope.data[0].values = response.ticks;
            }
        );


        //tickService.getTicksAfter(symbol, sod, $scope.data[0].values);
        //$scope.ticks[symbol].values = response.ticks;
        //$scope.data.values = $scope.ticks.ticks;

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
