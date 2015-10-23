'use strict';

/**
 * @ngdoc service
 * @name atacamaApp.elasticsearchService
 * @description
 * # elasticsearchService
 * Service in the atacamaApp.
 */
angular.module('atacamaApp')
    .service('elasticsearchService', function($rootScope, $resource, es) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        console.log('elasticsearchService has been created');

        // TODO 1. return from resource to passed-in variable $scope.data[0].values does not work
        // TODO 2. cannot access $scope.data[0].values from websocket callback in here

        // var ticks = Restangular.one('tick').one(symbol).one(sod);

        // ticks.get().then(function (response) {
        //   $scope.data[0].values = response.ticks;
        // });

        var template = function(symbol, date) {
          return {
            size: 5000,
            query: {
              bool: {
                must: [
                  {query_string: {
                    query: symbol,
                    fields: ['symbol'],
                    default_operator: 'and'
                  }
                },{
                  range: {
                    date: {
                      from: date,
                      to: null,
                      include_lower: true,
                      include_upper: true
                    }
                  }
                }]
              }
            }
          };
        };

        this.ping = function() {
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
        };

        this.getTicksAfter = function(symbol, date) {
          //  [2015-09-21 08:09:30,744][INFO ][index.search.slowlog.query] [Fault Zone] [test-tick][4] took[14.8ms], took_millis[14], types[tick], stats[], search_type[DFS_QUERY_THEN_FETCH], total_shards[5], source[{"from":0,"size":17,"query":{"bool":{"must":[{"query_string":{"query":"ABC","fields":["symbol"],"default_operator":"and"}},{"range":{"date":{"from":1442790000000,"to":null,"include_lower":true,"include_upper":true}}}]}}}], extra_source[],
          return es.search({
            index: 'turbine-ticks',
            type: 'turbine-tick',
            body: template(symbol, date)
          });
        };

        this.getStocksAfter = function(symbol, date) {
          return es.search({
            index: 'turbine-stocks',
            type: 'turbine-stock', //TODO TYPO!!!
            body: template(symbol, date)
          });
        };

        this.parseResults = function(response) {
          return _.sortBy(_.map(response.hits.hits, '_source'), 'date');
        };

        //this.getTicksAfter = function(symbol, date, reply) {
        //    var call = GetTicksAfter.get({
        //            symbol: symbol,
        //            date: date
        //        }
        //        ,function(response) {
        //            reply = response.ticks;
        //        }
        //    )
        //};


        //this.getTicksAfter(symbol, date) {
        //    $http.get(url + '/' + symbol + '/' + date).
        //      success(function(data, status, headers, config) {
        //      })
        //}

        // this.add = function(tick) {
        //    ticks.push(tick);
        //};

    });
