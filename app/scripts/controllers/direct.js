'use strict';

/**
 * @ngdoc function
 * @name atacamaApp.controller:OhlcCtrl
 * @description
 * # OhlcCtrl
 * Controller of the atacamaApp
 */
angular.module('atacamaApp')
  .controller('DirectCtrl', function ($scope, ngstomp, $resource, elasticsearchService) {
    console.log('DirectCtrl has been created');

    // var url = 'http://localhost:48002';
    // var url = 'http://localhost:15674';

    var sod = moment(0, "HH").format("x");

    var market = 'FTSE100';
    var symbol = 'ABC';

    ngstomp
      .subscribe('/topic/ticks.' + market + '.' + symbol, onTick, {}, $scope);

    function onTick(message) {
      $scope.data[0].values.push(JSON.parse(message.body));
      $scope.$apply();
    }

    $scope.data = [{
      key: symbol
      //values: [{}]
    }];

    var promise = elasticsearchService.getTicksAfter('ABC', sod)

    promise.then(function (response) {
      $scope.data[0].values = elasticsearchService.parseResults(response);
    }, function (err) {
      console.trace(err.message);
    })

    $scope.config = {
      deepWatchData: true,
      // deepWatchDataDepth: 1,
      refreshDataOnly: false
    };

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
        x: function (d) {
          return d['date'];
        },
        y: function (d) {
          return d['close'];
        },
        showValues: true,
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
    }

  });
