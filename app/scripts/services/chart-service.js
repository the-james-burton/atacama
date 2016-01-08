'use strict';

/**
 * @ngdoc service
 * @name atacamaApp.chartService
 * @description
 * # chartService
 * Service in the atacamaApp.
 */
angular.module('atacamaApp')
    .service('chartService', function($rootScope, $resource, $log) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        console.log('chartService has been created');

        // TODO convert these functions to return values instead of modifying the parameters...

        // this.generateChartSeriesAlt = function(name, prefix, results) {
        //   console.log(JSON.stringify(results));
        //   var i = 1;
        //   var series = _(results).property(name)
        //     .keys()
        //     .map(function(item){
        //         return { values: [],
        //         key: prefix + '.' + item,
        //         position: i++,
        //         color: "#9f442c",
        //         strokeWidth: 1,
        //         classed: 'dashed'
        //     };})
        //     .value();
        //   console.log(JSON.stringify(series));
        //   return series;
        // };

        this.generateChartSeries = function(results) {
          console.log(JSON.stringify(_(results).property('indicators').value()));
          var i = 1;
          // var series = _.map(_.keys(results.indicators, 'indicators'), convertIndicators);
          //var series = _(results).property('indicators')
          var series = _(results.indicators)
            .keys()
            .map(function(indicator){
                return { values: [],
                key: 'indicators.' + indicator,
                type: 'line',
                yAxis: 2,
                position: i++,
                color: "#9f442c",
                strokeWidth: 1,
                classed: 'dashed'
            };})
            .value();
          console.log(JSON.stringify(series));
          return series;
        };

        this.convertData = function(data, results) {
          // $log.debug(JSON.stringify(data) + ',' + JSON.stringify(results));
          _.forEach(data, function(item) {
            data[item.position].values = _.sortBy(_.map(results, _.curry(convertMessages)(item.key)), 'x');
          });
        };

        this.addData = function(data, target) {
          _.forEach(data, function(item) {
            Array.prototype.push.apply(data[item.position].values, _.map([target], _.curry(convertMessages)(item.key)));
          });
        };

        var convertMessages = function(property, messages) {
          // $log.debug(property + '.' + JSON.stringify(messages));
          return _.mapKeys({'date' : _.get(messages, 'date'), property: _.get(messages, property)}, renameProperties);
         // return _(messages).pick([property, 'date']).mapKeys(renameProperties).value();
       };

        var renameProperties = function(value, key) {
          switch (key) {
            case 'date':
              return 'x'
            default:
              return 'y';
         }
         return key;
       };

      // this.ohlcChart = function(symbol, date) {
      //    return {
      //    }
      //  };

    });
