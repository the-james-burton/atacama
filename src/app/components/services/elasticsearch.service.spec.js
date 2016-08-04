(function () {
  'use strict';

  describe('service webDevTec', function () {
    var elasticsearchService;
    var $log;

    // ----------------------------------------------------
    var sod = moment(0, "HH").format("x");

    var marketTerm = { match: { market: "XYZ"} };
    var symbolTerm = { match: { symbol: "ZYX"} };

    var requiredQueries = function () {
      var arrayOfQueryTerms = [];
      arrayOfQueryTerms.push(marketTerm);
      arrayOfQueryTerms.push(symbolTerm);
      return arrayOfQueryTerms;
    };

    // ----------------------------------------------------

    beforeEach(module('atacamaApp', function ($provide) {
      $provide.value('$log', console);
    }));

    beforeEach(inject(function (_elasticsearchService_, _$log_) {
      elasticsearchService = _elasticsearchService_;
      $log = _$log_;
    }));

    it('should be registered', function () {
      expect(elasticsearchService).not.toEqual(null);
    });

    it('should return something', function () {
      expect(elasticsearchService.testReply("jasmine")).toEqual("hello jasmine");
    });

    // it('should create an elasticsearch query string', function () {
    //   var expected = {
    //     query_string: {
    //       query: value1,
    //       fields: [key1]
    //     }
    //   };
    //   expect(elasticsearchService.createQueryString(key1, value1)).toEqual(expected);
    //   $log.debug(angular.toJson(expected));
    // });
    //
    // it('should join many elasticsearch query_strings into an array', function () {
    //   var input = requiredQueries();
    //   var result = elasticsearchService.createQueryStrings(input);
    //
    //   $log.debug(angular.toJson(result));
    //   checkQueryString(result);
    // });

    // it('should convert elasticsearch query_strings into an query', function () {
    //   var input = requiredQueries();
    //   var queryStrings = elasticsearchService.createQueryStrings(input);
    //   var result = elasticsearchService.createQueries(queryStrings, sod);
    //
    //   $log.debug(angular.toJson(result));
    //   checkQueryString(result);
    //   expect(result[2].range.date.from).toEqual(sod);
    // });

    it('should add a date range onto a array of queries', function () {
      var input = requiredQueries();
      var result = elasticsearchService.addDateRangeToQueries(input, sod);

      $log.debug(angular.toJson(result));
      expect(result[0]).toEqual(marketTerm);
      expect(result[1]).toEqual(symbolTerm);
      expect(result[2].range.date.from).toEqual(sod);
    });

    it('should create a complete elasticsearch query', function () {
      var input = requiredQueries();
      var result = elasticsearchService.createESQueryFromDate(input, sod);
      $log.debug(angular.toJson(result));

      expect(result.size).toBeDefined();
      expect(result.query).toBeDefined();
      expect(result.query.bool).toBeDefined();
      expect(result.query.bool.must).toBeDefined();
      expect(result.query.bool.must.length).toEqual(3);
    });

    // describe('getTec function', function() {
    //   it('should exist', function() {
    //     expect(webDevTec.getTec).not.toEqual(null);
    //   });
    //
    //   it('should return array of object', function() {
    //     var data = webDevTec.getTec();
    //     expect(data).toEqual(jasmine.any(Array));
    //     expect(data[0]).toEqual(jasmine.any(Object));
    //     expect(data.length > 5).toBeTruthy();
    //   });
    // });
  });
})();
