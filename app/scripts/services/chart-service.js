'use strict';

/**
 * @ngdoc service
 * @name atacamaApp.chartService
 * @description
 * # chartService
 * Service in the atacamaApp.
 */
angular.module('atacamaApp')
    .service('chartService', function($rootScope, $resource) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        console.log('chartService has been created');

        this.convertData = function(data, results) {
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
         return _(messages).pick([property, 'date']).mapKeys(renameProperties).value();
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
