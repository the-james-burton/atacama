'use strict';

/**
 * @ngdoc function
 * @name atacamaApp.controller:WidgetCtrl
 * @description
 * # WidgetCtrl
 * Controller of the atacamaApp
 */
angular.module('atacamaApp')
    .controller('CustomWidgetCtrl', function($scope, $modal, ngstomp, $resource, $log, elasticsearchService, Restangular) {

        var url = 'http://localhost:48002';
        var sod = moment(0, "HH").format("x");
        var subscription;

        // TODO how to properly size the chart?
        var firstHeight = 170;
        var firstWidth = 218
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

        $scope.remove = function(widget) {
            $scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
        };

        $scope.addContent = function(widget) {
            console.log("widget.js::addContent");
            // $scope.message = moment();

            var ticks = Restangular.one('tick').one($scope.selectedSymbol).one(sod);

            ticks.get().then(function(response) {
                $scope.data[0].values = response.ticks;
            });

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
            }

            // TODO disconnect if alrady connected

            ngstomp
              .subscribe('/topic/ticks.' + market + '.' + $scope.selectedSymbol, onTick, {}, $scope);

            function onTick(message) {
              $scope.data[0].values.push(JSON.parse(message.body));
              $scope.$apply();
            }

        };

        // set the size of the chart as the widget is resized...
        $scope.$on('gridster-item-resized', function(item) {
            $scope.options.chart.height = firstHeight + ((item.targetScope.gridsterItem.sizeY - 1) * nextHeight);
            $scope.options.chart.width = firstWidth + ((item.targetScope.gridsterItem.sizeX - 1) * nextWidth);
            $scope.api.update();
        })

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
        }

    });
