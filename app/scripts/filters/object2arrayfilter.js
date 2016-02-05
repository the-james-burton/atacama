'use strict';

/**
 * @ngdoc filter
 * @name atacamaApp.filter:object2ArrayFilter
 * @function
 * @description
 * # object2ArrayFilter
 * Filter in the atacamaApp.
 */
angular.module('atacamaApp')
  .filter('object2Array', function () {
    return function (input) {
      var out = [];
      for (var i in input) {
          out.push(input[i]);
      }
      return out;
    };
  });
