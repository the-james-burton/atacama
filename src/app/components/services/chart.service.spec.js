(function () {
  'use strict';

  describe('service chartService', function () {
    var chartService;
    var $log;

    // how to get angularjs to print log messages to console inside a test...
    // http://stackoverflow.com/questions/21602750/how-to-see-log-calls-in-terminal-when-running-angularjs-unit-tests-with-karma
    beforeEach(module('atacamaApp', function ($provide) {
      $provide.value('$log', console);
    }));

    beforeEach(inject(function (_chartService_, _$log_) {
      chartService = _chartService_;
      $log = _$log_;
    }));

    // interrogate $log messages in Karma...
    // http://www.jvandemo.com/how-to-access-angular-log-debug-messages-from-within-karma/
    // afterEach(function () {
    //   console.log("debug:{0}".format(angular.toJson($log.debug.logs)));
    // });

    it('should be registered', function () {
      expect(chartService).not.toEqual(null);
      //$log.debug("**** angular, log, {0}".format("working"));
    });

    it('converts the data', function () {
      var series = [{
        values: [],
        key: "value1",
        position: 0
      }, {
        values: [],
        key: "value2",
        position: 1
      }, {
        values: [],
        key: "nested.value3",
        position: 2
      }];
      var data = [{
        date: 100,
        value1: 200,
        value2: 300,
        nested: {
          value3: 400
        }
      }, {
        date: 101,
        value1: 201,
        value2: 301,
        nested: {
          value3: 401
        }
      }];
      var expected0 = [{
        x: 100,
        y: 200
      }, {
        x: 101,
        y: 201
      }];
      var expected1 = [{
        x: 100,
        y: 300
      }, {
        x: 101,
        y: 301
      }];
      var expected2 = [{
        x: 100,
        y: 400
      }, {
        x: 101,
        y: 401
      }];
      chartService.convertData(series, data);
      $log.debug(series[0].values);
      $log.debug(series[1].values);
      $log.debug(series[2].values);
      expect(series[0].values).toEqual(expected0);
      expect(series[1].values).toEqual(expected1);
      expect(series[2].values).toEqual(expected2);
    });

    // {"date":1449734099942,"close":97.20246150811069,"indicators":{"sma12":97.65283855250777},"symbol":"ABC","exchange":"LSE","name":"SMA12","timestamp":"2015-12-10T07:54:59.942Z"}, headers: {"rabbitmq.EXCHANGE_NAME":"turbine.test1.exchange.ticks","rabbitmq.DELIVERY_TAG":19,"breadcrumbId":"ID-x220t-34259-1449734079305-0-73","rabbitmq.ROUTING_KEY":"","objectType":"org.jimsey.projects.turbine.fuel.domain.IndicatorJson","spring.simple.messaging.DESTINATION_SUFFIX":".LSE.ABC.SMA12"}]
    it('given an indicator, it should generate the chart series boilerplate ', function () {
      var data = {
        date: 1449734099942,
        close: 97,
        indicators: {
          testone: 96,
          testtwo: 98
        },
        ric: "ABC.L",
        exchange: "LSE",
        name: "testname",
        timestamp: "2015-12-10T07:54:59.942Z"
      };
      var expected = [{
        values: [],
        key: "indicators.testone",
        type: 'line',
        yAxis: 2,
        position: 1,
        color: "#9f442c",
        strokeWidth: 1,
        classed: "dashed"
      }, {
        values: [],
        key: "indicators.testtwo",
        type: 'line',
        yAxis: 2,
        position: 2,
        color: "#9f442c",
        strokeWidth: 1,
        classed: "dashed"
      }];
      $log.debug(angular.toJson(data));
      //var series = chartService.generateChartSeriesAlt('indicators', 'indicator', data);
      var series = chartService.generateChartSeries(data);
      expect(series).toEqual(expected);
    });

  });
})();
