(function () {

  'use strict';

  /**
   * @ngdoc service
   * @name atacamaApp.chartService
   * @description
   * # chartService
   * Service in the atacamaApp.
   */
  angular.module('atacamaApp')
    .factory('chartService', chartService);

  function chartService($rootScope, $resource, $log) {
    var service = {
      generateChartSeries: generateChartSeries,
      convertData: convertData,
      addData: addData
    };

    // TODO convert these functions to return values instead of modifying the parameters...

    function generateChartSeries(results, overlay) {
      $log.debug(JSON.stringify(_(results).property('indicators').value()));
      var i = 1;
      // var series = _.map(_.keys(results.indicators, 'indicators'), convertIndicators);
      //var series = _(results).property('indicators')
      var series = _(results.indicators)
        .keys()
        .map(function (indicator) {
          return {
            values: [],
            key: 'indicators.' + indicator,
            type: 'line',
            yAxis: overlay ? 1 : 2,
            position: i++,
            color: "#9f442c",
            strokeWidth: 1,
            classed: 'dashed'
          };
        })
        .value();
      $log.debug(JSON.stringify(series));
      return series;
    }

    function convertData(data, results) {
      // $log.debug(JSON.stringify(data) + ',' + JSON.stringify(results));
      _.forEach(data, function (item) {
        data[item.position].values = _.sortBy(_.map(results, _.curry(convertMessages)(item.key)), 'x');
      });
    }

    function addData(data, target) {
      _.forEach(data, function (item) {
        Array.prototype.push.apply(data[item.position].values, _.map([target], _.curry(convertMessages)(item.key)));
      });
    }

    function convertMessages(property, messages) {
      // $log.debug(property + '.' + JSON.stringify(messages));
      return _.mapKeys({
        'date': _.get(messages, 'date'),
        property: _.get(messages, property)
      }, renameProperties);
      // return _(messages).pick([property, 'date']).mapKeys(renameProperties).value();
    }

    function renameProperties(value, key) {
      switch (key) {
      case 'date':
        return 'x';
      default:
        return 'y';
      }
      return key;
    }

    // this.ohlcChart = function(symbol, date) {
    //    return {
    //    }
    //  };

    $log.debug('chartService has been created');
    return service;

  }

})();
