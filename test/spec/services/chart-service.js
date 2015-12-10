'use strict';

describe('Service: chartService', function () {

  // load the service's module
  beforeEach(module('atacamaApp'));

  // instantiate service
  var chartService;
  beforeEach(inject(function (_chartService_) {
    chartService = _chartService_;
  }));

  it('should do something', function () {
    expect(!!chartService).toBe(true);
  });

  it('converts the data', function () {
    var series = [
      { values: [], key: "value1", position: 0 },
      { values: [], key: "value2", position: 1 },
      { values: [], key: "nested.value3", position: 2 }
    ];
    var data = [
      { date: 100, value1: 200, value2: 300, nested: { value3: 400 } },
      { date: 101, value1: 201, value2: 301, nested: { value3: 401 } }
    ];
    var expected0 = [
      {x: 100, y: 200},
      {x: 101, y: 201}
    ];
    var expected1 = [
      {x: 100, y: 300},
      {x: 101, y: 301}
    ];
    var expected2 = [
      {x: 100, y: 400},
      {x: 101, y: 401}
    ];
    chartService.convertData(series, data);
    console.log(series[0].values);
    console.log(series[1].values);
    console.log(series[2].values);
    expect(series[0].values).toEqual(expected0);
    expect(series[1].values).toEqual(expected1);
    expect(series[2].values).toEqual(expected2);
  });

  // {"date":1449734099942,"close":97.20246150811069,"indicators":{"sma12":97.65283855250777},"symbol":"ABC","market":"FTSE100","name":"SMA12","timestamp":"2015-12-10T07:54:59.942Z"}, headers: {"rabbitmq.EXCHANGE_NAME":"turbine.test1.market.ticks","rabbitmq.DELIVERY_TAG":19,"breadcrumbId":"ID-x220t-34259-1449734079305-0-73","rabbitmq.ROUTING_KEY":"","objectType":"org.jimsey.projects.turbine.fuel.domain.IndicatorJson","spring.simple.messaging.DESTINATION_SUFFIX":".FTSE100.ABC.SMA12"}]
  it('given an indicator, it should generate the chart series boilerplate ', function() {
    var data = {
      date: 1449734099942, close: 97, indicators:{testone: 96, testtwo: 98 },
      symbol: "ABC", market: "FTSE100", name: "testname", timestamp: "2015-12-10T07:54:59.942Z"};
    var expected = [
      { values: [], key: "indicators.testone", position: 1, color: "#9f442c", strokeWidth: 1, classed: "dashed" },
      { values :[], key: "indicators.testtwo", position: 2, color: "#9f442c", strokeWidth: 1, classed: "dashed" }];
    console.log(JSON.stringify(data));
    //var series = chartService.generateChartSeriesAlt('indicators', 'indicator', data);
    var series = chartService.generateChartSeries(data);
    expect(series).toEqual(expected);
  });

});
