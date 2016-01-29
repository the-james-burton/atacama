'use strict';

/**
 * @ngdoc function
 * @name atacamaApp.controller:WidgetCtrl
 * @description
 * # WidgetCtrl
 * Controller of the atacamaApp
 */
angular.module('atacamaApp')
    .controller('OhlcWidgetCtrl', function(
      $scope, $uibModal, ngstomp, $resource, $log, elasticsearchService, chartService, turbineService, Restangular) {
        $scope.blah1 = {
            name: "woo! yay!"
        }

        var url = 'http://localhost:48002';
        var sod = moment(0, "HH").format("x");
        var subscription;

        // TODO how to properly size the chart?
        var firstHeight = 50;
        var firstWidth = 50;
        var nextHeight = 60;
        var nextWidth = 60;

        var market = 'FTSE100';

        var topic = '';

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
        }

        $scope.selectSymbol = function(selectedSymbol) {
          $scope.selectedSymbol = selectedSymbol;
          $log.log('select symbol: ', $scope.selectedSymbol);
          $scope.addOHLC($scope.item);
        };

        $scope.addOHLC = function(item) {
            console.log("ohlcController.js::addOHLC");
            // $scope.item = item;
            item.name = $scope.selectedSymbol;
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
                    height: firstHeight + ((item.sizeY - 1) * nextHeight),
                    width: firstWidth + ((item.sizeX - 1) * nextWidth),
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

        $scope.$on('$destroy', function() {
          unsubscribeTopic();
        });

        function traceLog(text) {
          $log.debug("{0}.{1}.{2} {5}".format(
            $scope.item.name, $scope.item.row, $scope.item.col, text));
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
