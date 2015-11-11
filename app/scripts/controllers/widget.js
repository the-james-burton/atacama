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

        var topic = '';

        $scope.selectedSymbol = 'ABC';

        $scope.symbols = ['ABC', 'DEF'];

        $scope.strategies = [
          { action: 'sell', symbol: 'ABC', market: 'FTSE100'},
          { action: 'buy', symbol: 'DEF', market: 'FTSE100'},
          { action: 'sell', symbol: 'ABC', market: 'FTSE100'},
          { action: 'buy', symbol: 'DEF', market: 'FTSE100'},
          { action: 'sell', symbol: 'ABC', market: 'FTSE100'},
          { action: 'buy', symbol: 'DEF', market: 'FTSE100'},
          { action: 'sell', symbol: 'ABC', market: 'FTSE100'},
          { action: 'buy', symbol: 'DEF', market: 'FTSE100'},
          { action: 'sell', symbol: 'ABC', market: 'FTSE100'},
          { action: 'buy', symbol: 'DEF', market: 'FTSE100'}
        ];

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

        function reset() {
          $scope.typeOHLC = false;
          $scope.typeIndicators = false;
          $scope.typeStrategies = false;
        }

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
            widget.name = 'Ind: ' + $scope.selectedSymbol;
            reset();
            $scope.typeIndicators = true;
            unsubscribeTopic();

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
                      key: "close",
                      position: 0,
                      color: "#bdc42d",
                      strokeWidth: 2,
                  },
                  {
                      values: [],
                      key: "indicators.smaTwelve",
                      position: 1,
                      color: "#6090c7",
                      strokeWidth: 1,
                  },
                  {
                      values: [],
                      key: "indicators.bollingerBandsUpperIndicator",
                      position: 2,
                      color: "#9f442c",
                      strokeWidth: 1,
                      classed: 'dashed'
                  },
                  {
                      values: [],
                      key: "indicators.bollingerBandsLowerIndicator",
                      position: 3,
                      color: "#9f442c",
                      strokeWidth: 1,
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
            widget.name = 'OHLC: ' + $scope.selectedSymbol;
            reset();
            $scope.typeOHLC = true;
            unsubscribeTopic();

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
                    type: 'candlestickBarChart',
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
            topic = '/topic/ticks.' + market + '.' + $scope.selectedSymbol;
            ngstomp.subscribe(topic, onTick, {}, $scope);

        };

        // for smart-table...
        // $scope.addStrategies = function(widget) {
        //    console.log("widget.js::addStrategies");
        //    reset();
        //    $scope.typeStrategies = true;
        //    unsubscribeTopic();
        //  };

        // for chart...
        $scope.addStrategies = function(widget) {
          console.log("widget.js::addStrategies");
          widget.name = 'Str: ' + $scope.selectedSymbol;
          reset();
          $scope.typeStrategies = true;
          unsubscribeTopic();

          // {"date":1401174943825,"symbol":"ABC","market":"FTSE100","close":100.0,"action":"enter","amount":1,"position":6,"cost":11.0,"value":14.0,"timestamp":"2015-11-06T18:21:47.263Z"}

          ngstomp
            .subscribe('/topic/strategies.' + market + '.' + $scope.selectedSymbol, onMessage, {}, $scope);

          function onMessage(message) {
            var payload = JSON.parse(message.body);
            chartService.addData($scope.data, payload);
            $scope.$apply();
          }

          $scope.data = [
                {
                    values: [],
                    key: "position",
                    position: 0,
                    color: "#d3da41",
                    strokeWidth: 2,
                },
                {
                    values: [],
                    key: "value",
                    position: 1,
                    color: "#4b9f51",
                    strokeWidth: 3
                },
                {
                    values: [],
                    key: "cash",
                    position: 2,
                    color: "#af2727",
                    strokeWidth: 2
                }
              ];

          var promise = elasticsearchService.getStrategiesAfter($scope.selectedSymbol, sod)

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
                axisLabel: 'Value',
                tickFormat: function (d, i) {
                  return '$' + d3.format(',.1f')(d);
                }
              },
            }
          };

        };


        $scope.$on('$destroy', function() {
          unsubscribeTopic();
        });

        function unsubscribeTopic() {
          if (topic.length > 0) {
            ngstomp.unsubscribe(topic, unsubscribeCallback);
          };
        };

        function unsubscribeCallback() {
          console.log("Unsubscribed from " + topic);
        };

    });
