'use strict';

/**
 * @ngdoc function
 * @name atacamaApp.controller:OhlcCtrl
 * @description
 * # OhlcCtrl
 * Controller of the atacamaApp
 */
angular.module('atacamaApp')
  .controller('DirectCtrl', function ($scope, ngstomp, $resource, es, Restangular) {
    console.log('DirectCtrl has been created');

    // var url = 'http://localhost:48002';
    // var url = 'http://localhost:15674';

    var sod = moment(0, "HH").format("x");

    var exchange = 'FTSE100';
    var symbol = 'ABC';

    ngstomp
      .subscribe('/topic/ticks.' + exchange + '.' + symbol, onTick, {}, $scope);

    function onTick(message) {
      $scope.data[0].values.push(JSON.parse(message.body));
      $scope.$apply();
    }

    $scope.data = [{
      key: symbol
      //values: [{}]
    }];

    /*
    es.ping({
      requestTimeout: 3000,
      // undocumented params are appended to the query string
      hello: "elasticsearch"
    }, function (error) {
      if (error) {
        console.error('elasticsearch cluster is down!');
      } else {
        console.log('elasticsearch cluster returned ping');
      }
    });
    */

    //  [2015-09-21 08:09:30,744][INFO ][index.search.slowlog.query] [Fault Zone] [test-tick][4] took[14.8ms], took_millis[14], types[tick], stats[], search_type[DFS_QUERY_THEN_FETCH], total_shards[5], source[{"from":0,"size":17,"query":{"bool":{"must":[{"query_string":{"query":"ABC","fields":["symbol"],"default_operator":"and"}},{"range":{"date":{"from":1442790000000,"to":null,"include_lower":true,"include_upper":true}}}]}}}], extra_source[],
    es.search({
      index: 'test-tick',
      type: 'tick',
      body: {
        size: 5000,
        query: {
          bool: {
            must: [
              {query_string: {
                query: 'ABC',
                fields: ['symbol'],
                default_operator: 'and'
              }
            },{
              range: {
                date: {
                  from: sod,
                  to: null,
                  include_lower: true,
                  include_upper: true
                }
              }
            }]
          }
        }
      }
    }).then(function (response) {
      var results = _.sortBy(_.map(response.hits.hits, '_source'), 'date');
      $scope.data[0].values = results;
    }, function (err) {
      console.trace(err.message);
    });

    // var ticks = Restangular.one('tick').one(symbol).one(sod);

    // ticks.get().then(function (response) {
    //   $scope.data[0].values = response.ticks;
    // });


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
