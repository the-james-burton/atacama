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
      $scope, $uibModal, ngstomp, $resource, $log, Restangular,
      elasticsearchService, chartService, turbineService, utilService) {

        $scope.isLoaded = false;
        $scope.hasError = false;

        // var url = 'http://localhost:48002';
        var sod = moment(0, "HH").format("x");
        // var subscription;

        // TODO select market in UI
        var market = 'FTSE100';

        var topic = '';

        var esError = '';
        var stompError = '';

        // TODO centralise the rest call data more so widgets can share the results...

        // {"stocks":[{"market":"FTSE100","symbol":"ABC"},{"market":"FTSE100","symbol":"DEF"}]}
        // {"indicators":[{"overlay":true,"name":"BollingerBands"},{"overlay":false,"name":"SMA12"}]}
        // {"strategies":[{"name":"SMAStrategy"},{"name":"CCICorrectionStrategy"}]}

          turbineService.symbols(market).then(function(response) {
            // console.log(JSON.stringify(response.stocks));
            $scope.symbols = _.pluck(response.stocks, 'symbol');
            // $scope.selectedSymbol = $scope.symbols[0];
            $scope.selectedSymbol = "...";
          }, function (err) {
            esError = 'unable to load symbols: {0}'.format(err.message);
            console.trace(esError);
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
          //$scope.options.chart.height = firstHeight + ((item.targetScope.gridsterItem.sizeY - 1) * nextHeight);
          //$scope.options.chart.width = firstWidth + ((item.targetScope.gridsterItem.sizeX - 1) * nextWidth);
          //console.log('offsetHeight:' + $scope.offsetParent.prop('offsetHeight'));
          //console.log('offsetWidth:' + $scope.offsetParent.prop('offsetWidth'));

          // TODO this is inconsistent... needs work!
          $scope.options.chart.height = $scope.offsetParent.prop('offsetHeight');
          $scope.options.chart.width = $scope.offsetParent.prop('offsetWidth')
          // TODO now causes an error... is this needed?
          // $scope.api.update();
        });

        function reset() {
          $log.debug('reset()');
          $scope.isLoaded = false;
          $scope.hasError = false;

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
            utilService.unsubscribeTopic(topic);

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
                    height: $scope.offsetParent.prop('offsetHeight'),
                    width: $scope.offsetParent.prop('offsetWidth'),
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
              utilService.traceLog(item, "elasticsearch");
              $scope.data[0].values = elasticsearchService.parseResults(response);
            }, function (err) {
              esError = 'unable to load data: {0}:{1}'.format($scope.selectedSymbol, err.message);
              console.trace(esError);
            });

            topic = '/topic/ticks.' + market + '.' + $scope.selectedSymbol;
            //ngstomp.subscribe(topic, onMessage, {}, $scope);

            try {
              ngstomp
                .subscribeTo(topic)
                .callback(onMessage)
                .withBodyInJson()
                .bindTo($scope)
                .connect();
              // throw new Error("unable to subscribe to topic: " + topic);
            } catch (err) {
              stompError = 'unable to connect to: {0}:{1}'.format(topic, err.message);
              console.trace(stompError);
            }

            function onMessage(message) {
              utilService.traceLog(item, "rabbit");
              // $scope.data[0].values.push(JSON.parse(message.body));
              $scope.data[0].values.push(message.body);
              $scope.$apply();
            }

            $scope.isLoaded = true;

            // TODO catch all errors and set the property and message as required
            if (esError !== '' || stompError !== '') {
              $scope.hasError = true;
            }

        };

        // for smart-table...
        // $scope.addStrategies = function(widget) {
        //    console.log("widget.js::addStrategies");
        //    reset();
        //    $scope.typeStrategies = true;
        //    unsubscribeTopic();
        //  };

        // I don't think this is necessary anymore...
        // $scope.$on('$destroy', function() {
        //   utilService.unsubscribeTopic(topic);
        // });

    });
