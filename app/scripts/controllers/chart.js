'use strict';

/**
 * @ngdoc function
 * @name atacamaApp.controller:ChartCtrl
 * @description
 * # ChartCtrl
 * Controller of the atacamaApp
 */
angular.module('atacamaApp')
  .controller('ChartCtrl', function ($scope, ngstomp, $resource, elasticsearchService, chartService, Restangular) {
    console.log('ChartCtrl has been created');

    var url = 'http://localhost:48002';

    var sod = moment(0, "HH").format("x");

    var market = 'FTSE100';
    var symbol = 'ABC';

    var topic = '/topic/indicators' + '.' + market + '.' + symbol + '.' + 'BollingerBands';

    ngstomp
      .subscribe(topic, onMessage, {}, $scope);

    function onMessage(message) {

      var payload = JSON.parse(message.body);
      // how to merge arrays in lodash..
      // $scope.data[0].values = _($scope.data[0].values).concat(open).value();

      // we expect that each charted item is present in the incoming payload...
      chartService.addData($scope.data, payload);
      // _.forEach($scope.data, function(item) {
      //   Array.prototype.push.apply($scope.data[item.position].values, _.map([payload], _.curry(chartService.convertMessages)(item.key)));
      // });

      $scope.$apply();
    }

    // {"date": 1437583864374, "open": 100.0, "high": 100.24021489109903, "low": 98.2724267098159, "close": 99.51909089116204, "volume": 107.79215866544341, "symbol": "ABC.L", "market": "FTSE100", "timestamp": "2015-07-22T17:52:04.377+01:00" }
    // {"date":1445445787547,"closePriceIndicator":101.3170343070584,"bollingerBandsMiddleIndicator":101.83027737657682,"bollingerBandsLowerIndicator":100.43909562456751,"bollingerBandsUpperIndicator":103.22145912858613,"symbol":"DEF","market":"FTSE100","timestamp":"2015-10-21T17:43:07.547+01:00"}

    // position is a bespoke non-nvd3 field used in the onMessage function above...
    $scope.data = [
          {
              values: [],
              key: "close",
              position: 0,
              color: "#bdc42d"
          },
          {
              values: [],
              key: "indicators.bollingerBandsUpperIndicator",
              position: 1,
              color: "#2ca02c"
          },
          {
              values: [],
              key: "indicators.bollingerBandsLowerIndicator",
              position: 2,
              color: "#9f442c"
          },
        ];



    // var messages = Restangular.one('stocks').one(symbol).one(sod);

    // messages.get().then(function (response) {
      // we expect that each charted item is present in the incoming payload...
    //  _.forEach($scope.data, function(item) {
    //    $scope.data[item.position].values = _.sortBy(_.map(response.stocks, _.curry(convertMessages)(item.key)), 'x');
    //  });
    //});

    var promise = elasticsearchService.getIndicatorsAfter('ABC', 'BollingerBands', sod)

    promise.then(function (response) {
      var results = elasticsearchService.parseResults(response);
      chartService.convertData($scope.data, results);
      //_.forEach($scope.data, function(item) {
      //  $scope.data[item.position].values = _.sortBy(_.map(results, _.curry(chartService.convertMessages)(item.key)), 'x');
      //});
    }, function (err) {
      console.trace(err.message);
    })


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
        //x: function (d) {
        //   return d['date'];
        // },
        // y: function (d) {
        //  return d['closePriceIndicator'];
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
