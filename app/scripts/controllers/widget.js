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
        var firstWidth = 185;
        var nextHeight = 228;
        var nextWidth = 228;

        var market = 'FTSE100';

        var topic = '';

        $scope.selectedIndicator = {};
        $scope.selectedStrategy = {};

        $scope.selectedIndicator.name = "...";
        $scope.selectedStrategy.name = "...";

        // TODO centralise the rest call data more so widgets can share the results...

        // {"stocks":[{"market":"FTSE100","symbol":"ABC"},{"market":"FTSE100","symbol":"DEF"}]}
        // {"indicators":[{"overlay":true,"name":"BollingerBands"},{"overlay":false,"name":"SMA12"}]}
        // {"strategies":[{"name":"SMAStrategy"},{"name":"CCICorrectionStrategy"}]}

        turbineService.symbols(market).then(function(response) {
          // console.log(JSON.stringify(response.stocks));
          $scope.symbols = _.pluck(response.stocks, 'symbol');
          // $scope.selectedSymbol = $scope.symbols[0];
          $scope.selectedSymbol = "...";
        });

        turbineService.indicators().then(function(response) {
            $scope.indicators = response.indicators;
            // $scope.selectedIndicator = $scope.indicators[0];
            console.log(JSON.stringify($scope.indicators));
        });

        turbineService.strategies().then(function(response) {
            $scope.strategies = response.strategies;
            // $scope.selectedStrategy = $scope.strategies[0];
            console.log(JSON.stringify($scope.strategies));
        });

        reset();

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

        // set the size of the chart as the widget is resized...
        $scope.$on('gridster-item-resized', function(item) {
          $log.debug('gridster-item-resized');
          $scope.options.chart.height = firstHeight + ((item.targetScope.gridsterItem.sizeY - 1) * nextHeight);
          $scope.options.chart.width = firstWidth + ((item.targetScope.gridsterItem.sizeX - 1) * nextWidth);
          $scope.api.update();
        });

        function reset() {
          $log.debug('reset()');
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
              key: $scope.selectedSymbol,
              values: [{}]
          }];
          // TODO nasty, nasty, nasty - must split this file into three angular directives...
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
          $scope.addOHLC($scope.widget);
        };

        $scope.selectIndicator = function(selectedIndicator) {
          $scope.selectedIndicator = JSON.parse(selectedIndicator);
          $log.log('select indicator: ', $scope.selectedIndicator);
          $scope.addIndicators($scope.widget);
        };

        $scope.selectStrategy = function(selectedStrategy) {
          $scope.selectedStrategy = JSON.parse(selectedStrategy);
          $log.log('selected strategy: ', $scope.selectedStrategy);
          $scope.addStrategies($scope.widget);
        };

        $scope.remove = function(widget) {
            $scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
        };

        $scope.addIndicators = function(widget) {
            console.log("widget.js::addIndicators");
            $scope.widget = widget;
            widget.name = $scope.selectedSymbol;
            reset();
            $scope.typeIndicators = true;
            unsubscribeTopic();

            if ( $scope.selectedSymbol === "..." || $scope.selectedIndicator === "...") {
              return;
            }

            $scope.config = {
              deepWatchData: true,
              // deepWatchDataDepth: 1,
              refreshDataOnly: false,
              disabled: false
            };

            $scope.options = {
              chart: {
                type: 'multiChart',
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
                yAxis1: {
                  // axisLabel: 'Stock Price',
                  tickFormat: function (d, i) {
                    return '$' + d3.format(',.1f')(d);
                  }
                },
                yAxis2: {
                  // axisLabel: 'Stock Price',
                  tickFormat: function (d, i) {
                    return d3.format(',.1f')(d);
                  }
                }
              }
            };

            var closeSeries =  {
                      values: [],
                      key: "close",
                      type: "line",
                      yAxis: 1,
                      position: 0,
                      color: "#bdc42d",
                      strokeWidth: 2,
                  };

            var promise = elasticsearchService.getIndicatorsAfter($scope.selectedSymbol, $scope.selectedIndicator.name, sod);

            promise.then(function (response) {
              traceLog("elasticsearch");
              // based on the first indicator tick, generate the chart series...
              var results = elasticsearchService.parseResults(response);
              // if our indicator is an overlay, then that will affect the series generation...
              var overlay = _.result(_.find($scope.indicators, { 'name': results[0].name }), 'overlay');
              // console.log("{0} is overlay:{1}".format(results[0].name, overlay));
              $scope.data = chartService.generateChartSeries(results[0], overlay);
              // add the always present close series to the front of the chart series array...
              $scope.data.unshift(closeSeries);
              // convert the indicator ticks into chart data values...
              chartService.convertData($scope.data, results);
            }, function (err) {
              console.trace(err.message);
            });

            var topic = '/topic/indicators' + '.' + market + '.' + $scope.selectedSymbol + '.' + $scope.selectedIndicator.name;

            console.log(topic);

            ngstomp
              .subscribe(topic, onMessage, {}, $scope);

            function onMessage(message) {
              traceLog("rabbit");
              // TODO add proper selection of indicators and strategies...
              // TODO publish different indicators and strategies on their own topics...
              var payload = JSON.parse(message.body);
              // if (payload.name !== 'BollingerBands') {
              //  return;
              //}
              chartService.addData($scope.data, payload);
              $scope.$apply();
            }


        };

        $scope.addOHLC = function(widget) {
            console.log("widget.js::addOHLC");
            $scope.widget = widget;
            widget.name = $scope.selectedSymbol;
            reset();
            $scope.typeOHLC = true;
            unsubscribeTopic();

            if ( $scope.selectedSymbol === "..." ) {
              return;
            }

            $scope.config = {
              deepWatchData: true,
              // deepWatchDataDepth: 1,
              refreshDataOnly: false,
              disabled: false
            };

            $scope.options = {
                chart: {
                    type: 'candlestickBarChart',
                    // type: 'ohlcBarChart',
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

            // $scope.message = moment();

            // var ticks = Restangular.one('tick').one($scope.selectedSymbol).one(sod);

            // ticks.get().then(function(response) {
            //     $scope.data[0].values = response.ticks;
            // });

            var promise = elasticsearchService.getTicksAfter($scope.selectedSymbol, sod);

            promise.then(function (response) {
              traceLog("elasticsearch");
              $scope.data[0].values = elasticsearchService.parseResults(response);
            }, function (err) {
              console.trace(err.message);
            });

            function onMessage(message) {
              traceLog("rabbit");
              $scope.data[0].values.push(JSON.parse(message.body));
              $scope.$apply();
            }

            // TODO disconnect if alrady connected
            topic = '/topic/ticks.' + market + '.' + $scope.selectedSymbol;
            ngstomp.subscribe(topic, onMessage, {}, $scope);

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
          $scope.widget = widget;
          widget.name = $scope.selectedSymbol;
          reset();
          $scope.typeStrategies = true;
          unsubscribeTopic();

          if ( $scope.selectedSymbol === "..." || $scope.selectedStrategy === "...") {
            return;
          }

          $scope.config = {
            deepWatchData: true,
            // deepWatchDataDepth: 1,
            refreshDataOnly: false,
            disabled: false
          };

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

          var promise = elasticsearchService.getStrategiesAfter($scope.selectedSymbol, $scope.selectedStrategy.name, sod);

          promise.then(function (response) {
            traceLog("elasticsearch");
            var results = elasticsearchService.parseResults(response);
            chartService.convertData($scope.data, results);
          }, function (err) {
            console.trace(err.message);
          });

          // {"date":1401174943825,"symbol":"ABC","market":"FTSE100","close":100.0,"action":"enter","amount":1,"position":6,"cost":11.0,"value":14.0,"timestamp":"2015-11-06T18:21:47.263Z"}

          var topic = '/topic/strategies' + '.' + market + '.' + $scope.selectedSymbol + '.' + $scope.selectedStrategy.name;

          console.log(topic);

          ngstomp
            .subscribe(topic, onMessage, {}, $scope);

          function onMessage(message) {
            traceLog("rabbit");
            var payload = JSON.parse(message.body);
            // if (payload.name !== 'SMAStrategy') {
            //  return;
            // }
            chartService.addData($scope.data, payload);
            $scope.$apply();
          }

        };


        $scope.$on('$destroy', function() {
          unsubscribeTopic();
        });

        function traceLog(text) {
          $log.debug("{0}.{1}.{2} i:{3} s:{4} {5}".format(
            $scope.widget.name, $scope.widget.row, $scope.widget.col,
            $scope.selectedIndicator.name, $scope.selectedStrategy.name,
            text));
        }

        function unsubscribeTopic() {
          if (topic.length > 0) {
            ngstomp.unsubscribe(topic, unsubscribeCallback);
          }
        }

        function unsubscribeCallback() {
          console.log("Unsubscribed from " + topic);
        }

    });
