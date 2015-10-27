'use strict';

/**
 * @ngdoc function
 * @name atacamaApp.controller:WidgetCtrl
 * @description
 * # WidgetCtrl
 * Controller of the atacamaApp
 */
angular.module('atacamaApp')
    .controller('CustomWidgetCtrl', function($scope, $modal, ngstomp, $resource, $log, elasticsearchService, chartService, Restangular) {

        var url = 'http://localhost:48002';
        var sod = moment(0, "HH").format("x");
        var subscription;

        // TODO how to properly size the chart?
        var firstHeight = 170;
        var firstWidth = 218;
        var nextHeight = 238;
        var nextWidth = 238;

        var market = 'FTSE100';

        $scope.selectedSymbol = 'ABC';

        $scope.symbols = ['ABC', 'DEF'];

        $scope.options = {
            chart: {
                // TODO error message appears in console...
            }
        };

        $scope.config = {
            disabled: true
        };

        $scope.data = [{
            key: $scope.selectedSymbol
                //values: [{}]
        }];

        // set the size of the chart as the widget is resized...
        $scope.$on('gridster-item-resized', function(item) {
            $scope.options.chart.height = firstHeight + ((item.targetScope.gridsterItem.sizeY - 1) * nextHeight);
            $scope.options.chart.width = firstWidth + ((item.targetScope.gridsterItem.sizeX - 1) * nextWidth);
            $scope.api.update();
        });

        $scope.openSettings = function(widget) {
            $modal.open({
                scope: $scope,
                templateUrl: 'views/partials/widgetsettings.html',
                controller: 'WidgetSettingsCtrl',
                resolve: {
                    widget: function() {
                        return widget;
                    }
                }
            });
        };

        $scope.selectSymbol = function() {
          $log.log('select symbol: ', $scope.selectedSymbol);
        };

        $scope.remove = function(widget) {
            $scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
        };

        $scope.addIndicators = function(widget) {
            console.log("widget.js::addIndicators");

            ngstomp
              .subscribe('/topic/stocks.' + market + '.' + $scope.selectedSymbol, onMessage, {}, $scope);

            function onMessage(message) {
              var payload = JSON.parse(message.body);
              chartService.addData($scope.data, payload);
              $scope.$apply();
            }

            $scope.data = [
                  {
                      values: [],
                      key: "closePriceIndicator",
                      position: 0,
                      color: "#bdc42d",
                      strokeWidth: 2,
                  },
                  {
                      values: [],
                      key: "bollingerBandsUpperIndicator",
                      position: 1,
                      color: "#9f442c",
                      strokeWidth: 1,
                      classed: 'dashed'
                  },
                  {
                      values: [],
                      key: "bollingerBandsLowerIndicator",
                      position: 2,
                      color: "#9f442c",
                      classed: 'dashed'
                  }
                  // {
                  //     values: [],
                  //     key: "bollingerBandsMiddleIndicator",
                  //     position: 3,
                  //     color: "#2c649f"
                  //     classed: 'dashed'
                  // }
                ];

            var promise = elasticsearchService.getStocksAfter($scope.selectedSymbol, sod)

            promise.then(function (response) {
              var results = elasticsearchService.parseResults(response);
              chartService.convertData($scope.data, results);
            }, function (err) {
              console.trace(err.message);
            })


            $scope.options = {
              chart: {
                type: 'lineChart',
                height: firstHeight + ((widget.sizeY - 1) * nextHeight),
                width: firstWidth + ((widget.sizeX - 1) * nextWidth),
                margin: {
                    top: 20,
                    right: 40,
                    bottom: 40,
                    left: 40
                },
                //x: function (d) {
                //   return d['date'];
                // },
                // y: function (d) {
                //  return d['closePriceIndicator'];
                // },
                showValues: true,
                showLegend: false,
                transitionDuration: 500,
                xAxis: {
                  axisLabel: 'Dates',
                  tickFormat: function (d) {
                    return d3.time.format('%X')(new Date(d));
                  },
                },
                yAxis: {
                  axisLabel: 'Stock Price',
                  tickFormat: function (d, i) {
                    return '$' + d3.format(',.1f')(d);
                  }
                }
              }
            };

        };

        $scope.addOHLC = function(widget) {
            console.log("widget.js::addOHLC");
            // $scope.message = moment();

            // var ticks = Restangular.one('tick').one($scope.selectedSymbol).one(sod);

            // ticks.get().then(function(response) {
            //     $scope.data[0].values = response.ticks;
            // });

            var promise = elasticsearchService.getTicksAfter($scope.selectedSymbol, sod);

            promise.then(function (response) {
              $scope.data[0].values = elasticsearchService.parseResults(response);
            }, function (err) {
              console.trace(err.message);
            })

            $scope.config = {
                disabled: false
            };

            $scope.options = {
                chart: {
                    type: 'ohlcBarChart',
                    height: firstHeight + ((widget.sizeY - 1) * nextHeight),
                    width: firstWidth + ((widget.sizeX - 1) * nextWidth),
                    margin: {
                        top: 20,
                        right: 40,
                        bottom: 40,
                        left: 40
                    },
                    x: function(d) {
                        return d['date'];
                    },
                    y: function(d) {
                        return d['close'];
                    },
                    showValues: true,
                    transitionDuration: 500,
                    xAxis: {
                        // axisLabel: 'Dates',
                        tickFormat: function(d) {
                            return d3.time.format('%X')(new Date(d));
                        },
                    },
                    yAxis: {
                        // axisLabel: 'Stock Price',
                        tickFormat: function(d, i) {
                            return '$' + d3.format(',.1f')(d);
                        }
                    }
                }
            };

            function onTick(message) {
              $scope.data[0].values.push(JSON.parse(message.body));
              $scope.$apply();
            }

            // TODO disconnect if alrady connected
            ngstomp
              .subscribe('/topic/ticks.' + market + '.' + $scope.selectedSymbol, onTick, {}, $scope);

        };

    });
