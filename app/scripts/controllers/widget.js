'use strict';

/**
 * @ngdoc function
 * @name atacamaApp.controller:WidgetCtrl
 * @description
 * # WidgetCtrl
 * Controller of the atacamaApp
 */
angular.module('atacamaApp')
    .controller('CustomWidgetCtrl', function(
      $scope, $uibModal, ngstomp, $resource, $log, elasticsearchService, chartService, turbineService, Restangular) {

        var url = 'http://localhost:48002';
        var sod = moment(0, "HH").format("x");
        var subscription;

        // TODO how to properly size the chart?
        var firstHeight = 140;
        var firstWidth = 200;
        var nextHeight = 228;
        var nextWidth = 228;

        var market = 'FTSE100';

        var topic = '';

        // TODO centralise the rest call data more so widgets can share the results...

        turbineService.symbols(market).then(function(response) {
          // console.log(JSON.stringify(response.stocks));
          $scope.symbols = _.pluck(response.stocks, 'symbol');
          $scope.selectedSymbol = $scope.symbols[0];
        });

        turbineService.indicators().then(function(response) {
            $scope.indicators = response.indicators;
            $scope.selectedIndicator = $scope.indicators[0];
            console.log(JSON.stringify($scope.indicators));
        });

        turbineService.strategies().then(function(response) {
            $scope.strategies = response.strategies;
            $scope.selectedStrategy = $scope.strategies[0];
            console.log(JSON.stringify($scope.strategies));
        });

        // $scope.strategies = [
        //   { action: 'sell', symbol: 'ABC', market: 'FTSE100'},
        //   { action: 'buy', symbol: 'DEF', market: 'FTSE100'},
        //   { action: 'sell', symbol: 'ABC', market: 'FTSE100'},
        //   { action: 'buy', symbol: 'DEF', market: 'FTSE100'},
        //   { action: 'sell', symbol: 'ABC', market: 'FTSE100'},
        //   { action: 'buy', symbol: 'DEF', market: 'FTSE100'},
        //   { action: 'sell', symbol: 'ABC', market: 'FTSE100'},
        //   { action: 'buy', symbol: 'DEF', market: 'FTSE100'},
        //   { action: 'sell', symbol: 'ABC', market: 'FTSE100'},
        //   { action: 'buy', symbol: 'DEF', market: 'FTSE100'}
        // ];

        $scope.options = {
            chart: {
                // TODO error message appears in console...
            }
        };

        $scope.config = {
            deepWatchData: true,
            // deepWatchDataDepth: 1,
            refreshDataOnly: false,
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
            $uibModal.open({
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

        $scope.selectSymbol = function(selectedSymbol) {
          $scope.selectedSymbol = selectedSymbol;
          $log.log('select symbol: ', $scope.selectedSymbol);
        };

        $scope.selectIndicator = function(selectedIndicator) {
          $scope.selectedIndicator = selectedIndicator;
          $log.log('select indicator: ', $scope.selectedIndicator);
        };

        $scope.selectStrategy = function(selectedStrategy) {
          $scope.selectedStrategy = selectedStrategy;
          $log.log('selected strategy: ', $scope.selectedStrategy);
        };

        $scope.remove = function(widget) {
            $scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
        };

        $scope.addIndicators = function(widget) {
            console.log("widget.js::addIndicators");
            widget.name = $scope.selectedSymbol;
            reset();
            $scope.typeIndicators = true;
            unsubscribeTopic();

            var topic = '/topic/indicators' + '.' + market + '.' + $scope.selectedSymbol + '.' + $scope.selectedIndicator;

            console.log(topic);

            ngstomp
              .subscribe(topic, onMessage, {}, $scope);

            function onMessage(message) {
              // TODO add proper selection of indicators and strategies...
              // TODO publish different indicators and strategies on their own topics...
              var payload = JSON.parse(message.body);
              // if (payload.name !== 'BollingerBands') {
              //  return;
              //}
              chartService.addData($scope.data, payload);
              $scope.$apply();
            }

            $scope.config = {
              deepWatchData: true,
              // deepWatchDataDepth: 1,
              refreshDataOnly: false,
              disabled: false
            };

            // TODO when subscribing to a feed, the server acknowledgement should contain a list of key/value indicator tuples

            var closeSeries =  {
                      values: [],
                      key: "close",
                      position: 0,
                      color: "#bdc42d",
                      strokeWidth: 2,
                  };
                  // {
                  //     values: [],
                  //     key: "indicators.bollingerBandsUpperIndicator",
                  //     position: 1,
                  //     color: "#9f442c",
                  //     strokeWidth: 1,
                  //     classed: 'dashed'
                  // },
                  // ];

            var promise = elasticsearchService.getIndicatorsAfter($scope.selectedSymbol, $scope.selectedIndicator, sod);

            promise.then(function (response) {
              var results = elasticsearchService.parseResults(response);
              // based on the first indicator tick, generate the chart series...
              $scope.data = chartService.generateChartSeries(results[0]);
              // add the always present close series to the front of the chart series array...
              $scope.data.unshift(closeSeries);
              // convert the indicator ticks into chart data values...
              chartService.convertData($scope.data, results);
            }, function (err) {
              console.trace(err.message);
            });


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
                  // axisLabel: 'Dates',
                  tickFormat: function (d) {
                    return d3.time.format('%X')(new Date(d));
                  },
                },
                yAxis: {
                  // axisLabel: 'Stock Price',
                  tickFormat: function (d, i) {
                    return '$' + d3.format(',.1f')(d);
                  }
                }
              }
            };

        };

        $scope.addOHLC = function(widget) {
            console.log("widget.js::addOHLC");
            widget.name = $scope.selectedSymbol;
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
            });

            $scope.config = {
              deepWatchData: true,
              // deepWatchDataDepth: 1,
              refreshDataOnly: false,
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
          widget.name = $scope.selectedSymbol;
          reset();
          $scope.typeStrategies = true;
          unsubscribeTopic();

          // {"date":1401174943825,"symbol":"ABC","market":"FTSE100","close":100.0,"action":"enter","amount":1,"position":6,"cost":11.0,"value":14.0,"timestamp":"2015-11-06T18:21:47.263Z"}

          var topic = '/topic/strategies' + '.' + market + '.' + $scope.selectedSymbol + '.' + $scope.selectedStrategy;

          console.log(topic);

          ngstomp
            .subscribe(topic, onMessage, {}, $scope);

          function onMessage(message) {
            var payload = JSON.parse(message.body);
            // if (payload.name !== 'SMAStrategy') {
            //  return;
            // }
            chartService.addData($scope.data, payload);
            $scope.$apply();
          }

          $scope.config = {
            deepWatchData: true,
            // deepWatchDataDepth: 1,
            refreshDataOnly: false,
            disabled: false
          };

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

          var promise = elasticsearchService.getStrategiesAfter($scope.selectedSymbol, $scope.selectedStrategy, sod);

          promise.then(function (response) {
            var results = elasticsearchService.parseResults(response);
            chartService.convertData($scope.data, results);
          }, function (err) {
            console.trace(err.message);
          });

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
                // axisLabel: 'Dates',
                tickFormat: function (d) {
                  return d3.time.format('%X')(new Date(d));
                },
              },
              yAxis: {
                // axisLabel: 'Value',
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
          }
        }

        function unsubscribeCallback() {
          console.log("Unsubscribed from " + topic);
        }

    });
