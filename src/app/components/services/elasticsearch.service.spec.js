(function () {
  'use strict';

  describe('service webDevTec', function () {
    var elasticsearchService;
    var $log;

    // ----------------------------------------------------
    var sod = moment(0, "HH").format("x");

    var key1 = 'my-key1';
    var key2 = 'my-key2';
    var value1 = 'my-value1';
    var value2 = 'my-value2';
    var keyValueTuple1 = [key1, value1];
    var keyValueTuple2 = [key2, value2];

    var requiredQueries = function () {
      var arrayOfKeyValueTuples = [];
      arrayOfKeyValueTuples.push(keyValueTuple1);
      arrayOfKeyValueTuples.push(keyValueTuple2);
      return arrayOfKeyValueTuples;
    };

    var checkQueryString = function (result) {
      expect(result[0].query_string.query).toEqual(keyValueTuple1[1]);
      expect(result[0].query_string.fields).toContain(keyValueTuple1[0]);
      expect(result[1].query_string.query).toEqual(keyValueTuple2[1]);
      expect(result[1].query_string.fields).toContain(keyValueTuple2[0]);
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

    it('should create an elasticsearch query string', function () {
      var expected = {
        query_string: {
          query: value1,
          fields: [key1]
        }
      };
      expect(elasticsearchService.createQueryString(key1, value1)).toEqual(expected);
      $log.debug(angular.toJson(expected));
    });

    it('should join many elasticsearch query_strings into an array', function () {
      var input = requiredQueries();
      var result = elasticsearchService.createQueryStrings(input);

      $log.debug(angular.toJson(result));
      checkQueryString(result);
    });

    it('should convert elasticsearch query_strings into an query', function () {
      var input = requiredQueries();
      var queryStrings = elasticsearchService.createQueryStrings(input);
      var result = elasticsearchService.createQueries(queryStrings, sod);

      $log.debug(angular.toJson(result));
      checkQueryString(result);
      expect(result[2].range.date.from).toEqual(sod);
    });

    it('should create a complete elasticsearch query', function () {
      var result = elasticsearchService.createESQuery(requiredQueries(), sod);
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
