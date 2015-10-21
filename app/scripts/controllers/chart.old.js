'use strict';

/**
 * @ngdoc function
 * @name atacamaApp.controller:ChartCtrl
 * @description
 * # ChartCtrl
 * Controller of the atacamaApp
 */
angular.module('atacamaApp')
  .controller('ChartCtrl', function ($scope, ngstomp, $resource, tickService, Restangular) {
    console.log('ChartCtrl has been created');

    var url = 'http://localhost:48002';

    var sod = moment(0, "HH").format("x");

    // {"date": 1437583864374, "open": 100.0, "high": 100.24021489109903, "low": 98.2724267098159, "close": 99.51909089116204, "volume": 107.79215866544341, "symbol": "ABC.L", "market": "FTSE100", "timestamp": "2015-07-22T17:52:04.377+01:00" }

    var market = 'FTSE100';
    var symbol = 'ABC';

    ngstomp
      .subscribe('/topic/ticks.' + market + '.' + symbol, onTick, {}, $scope);

    function onTick(message) {

      var payload = JSON.parse(message.body);
      // TODO remove the square brackets if sent an array instead of single object...
      var open = _.map([payload], _.curry(convertTicks)('open'));
      var high = _.map([payload], _.curry(convertTicks)('high'));
      var low = _.map([payload], _.curry(convertTicks)('low'));
      var close = _.map([payload], _.curry(convertTicks)('close'));

      // how to merge arrays in lodash..
      // $scope.data[0].values = _($scope.data[0].values).concat(open).value();

      Array.prototype.push.apply($scope.data[0].values, open);
      Array.prototype.push.apply($scope.data[1].values, high);
      Array.prototype.push.apply($scope.data[2].values, low);
      Array.prototype.push.apply($scope.data[3].values, close);
      $scope.$apply();
    }

//dummy
    // $scope.data = sinAndCos();

    var open = [],
        high = [],
        low = [],
        close = [];

    $scope.data = [
          {
              values: open,
              key: "open",
              color: "#bdc42d"
          },
          {
              values: high,
              key: "high",
              color: "#2ca02c"
          },
          {
              values: low,
              key: "low",
              color: "#9f442c"
          },
          {
              values: close,
              key: "close",
              color: "#2c649f"
          }
        ];


    function convertTicks(property, ticks) {
     return _(ticks).pick([property, 'date']).mapKeys(renameProperties).value();
    }

    function renameProperties(value, key) {
      switch (key) {
        case 'date':
          return 'x'
        default:
          return 'y';
     }
     return key;
   }

    var ticks = Restangular.one('tick').one(symbol).one(sod);

    ticks.get().then(function (response) {
     // $scope.data[0].values = response.ticks;

     // console.log("original ticks:" + JSON.stringify(response.ticks));

     $scope.data[0].values = _.sortBy(_.map(response.ticks, _.curry(convertTicks)('open')), 'x');
     $scope.data[1].values = _.sortBy(_.map(response.ticks, _.curry(convertTicks)('high')), 'x');
     $scope.data[2].values = _.sortBy(_.map(response.ticks, _.curry(convertTicks)('low')), 'x');
     $scope.data[3].values = _.sortBy(_.map(response.ticks, _.curry(convertTicks)('close')), 'x');

    });


    $scope.options = {
      chart: {
        type: 'lineChart',
        height: 450,
        margin: {
          top: 20,
          right: 20,
          bottom: 50,
          left: 75
        },
        // x: function (d) {
        //   return d['date'];
        // },
        // y: function (d) {
        //  return d['close'];
        // },
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
    };

  });
