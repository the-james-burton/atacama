(function () {

  'use strict';

  /**
   * @ngdoc service
   * @name atacamaApp.elasticsearchService
   * @description
   * # elasticsearchService
   * Service in the atacamaApp.
   */
  angular.module('atacamaApp')

  .service('es', function (esFactory) {
    return esFactory({
      host: 'localhost:9200',
      apiVersion: '1.7'
    });
  })

  .factory('elasticsearchService', elasticsearchService);

  function elasticsearchService($rootScope, $resource, $log, es) {
    var service = {
      createQueryString: createQueryString,
      createQueryStrings: createQueryStrings,
      createQueries: createQueries,
      createESQuery: createESQuery,
      ping: ping,
      getTicksAfter: getTicksAfter,
      getIndicatorsAfter: getIndicatorsAfter,
      getStrategiesAfter: getStrategiesAfter,
      parseResults: parseResults,
      testReply: testReply
    };

    // http://stackoverflow.com/questions/19842669/calling-a-function-in-angularjs-service-from-the-same-service
    // var self = this;

    // TODO 1. return from resource to passed-in variable $scope.data[0].values does not work
    // TODO 2. cannot access $scope.data[0].values from websocket callback in here

    // var ticks = Restangular.one('tick').one(symbol).one(sod);

    // ticks.get().then(function (response) {
    //   $scope.data[0].values = response.ticks;
    // });

    function createQueryString(key, value) {
      return {
        query_string: {
          query: value,
          fields: [key]
        }
      };
    }

    function createQueryStringTuple(tuple) {
      // return {query_string: {query: tuple[0], fields: [tuple[1]]}};
      return createQueryString(tuple[0], tuple[1]);
    }

    function createQueryStrings(arrayOfKeyValueTuples) {
      return _.map(arrayOfKeyValueTuples, createQueryStringTuple);
    }

    function createQueries(arrayOfQueryStrings, date) {
      return arrayOfQueryStrings.concat({
        range: {
          date: {
            from: date,
            to: null,
            include_lower: true,
            include_upper: true
          }
        }
      });
    }

    // TODO improve templating by using lodash to insert a list of tuples as query strings...
    function createESQuery(arrayOfKeyValueTuples, date) {
      // TODO perhaps a little more functional style..?
      var queryStrings = createQueryStrings(arrayOfKeyValueTuples);
      var queries = createQueries(queryStrings, date);
      return {
        size: 5000,
        query: {
          bool: {
            must: queries
          }
        }
      };
    }

    // // TODO improve templating by using lodash to insert a list of tuples as query strings...
    // var template = function(symbol, name, date) {
    //   return {
    //     size: 5000,
    //     query: {
    //       bool: {
    //         must: [{query_string: {query: symbol, fields: ['symbol']}},
    //                {query_string: {query: name, fields: ['name']}},
    //         {range: {
    //             date: {
    //               from: date, to: null, include_lower: true, include_upper: true
    //             }
    //           }
    //         }]
    //       }
    //     }
    //   };
    // };

    function ping() {
      es.ping({
        requestTimeout: 3000,
        // undocumented params are appended to the query string
        hello: "elasticsearch"
      }, function (error) {
        if (error) {
          $log.error('elasticsearch cluster is down!');
        } else {
          $log.info('elasticsearch cluster returned ping');
        }
      });
    }

    function getTicksAfter(symbol, date) {
      //  [2015-09-21 08:09:30,744][INFO ][index.search.slowlog.query] [Fault Zone] [test-tick][4] took[14.8ms], took_millis[14], types[tick], stats[], search_type[DFS_QUERY_THEN_FETCH], total_shards[5], source[{"from":0,"size":17,"query":{"bool":{"must":[{"query_string":{"query":"ABC","fields":["symbol"],"default_operator":"and"}},{"range":{"date":{"from":1442790000000,"to":null,"include_lower":true,"include_upper":true}}}]}}}], extra_source[],
      var query = createESQuery([
        ['symbol', symbol]
      ], date);
      $log.debug(JSON.stringify(query));
      return es.search({
        index: 'turbine-ticks',
        type: 'turbine-tick',
        body: query
      });
    }

    function getIndicatorsAfter(symbol, name, date) {
      var query = createESQuery([
        ['symbol', symbol],
        ['name', name]
      ], date);
      $log.debug(JSON.stringify(query));
      return es.search({
        index: 'turbine-indicators',
        type: 'turbine-indicator',
        body: query
      });
    }

    function getStrategiesAfter(symbol, name, date) {
      var query = createESQuery([
        ['symbol', symbol],
        ['name', name]
      ], date);
      $log.debug(JSON.stringify(query));
      return es.search({
        index: 'turbine-strategies',
        type: 'turbine-strategy',
        body: query
      });
    }

    function parseResults(response) {
      return _.sortBy(_.map(response.hits.hits, '_source'), 'date');
    }

    function testReply(message) {
      return "hello " + message;
    }

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

    $log.debug('elasticsearchService has been created');
    return service;

  }

})();
