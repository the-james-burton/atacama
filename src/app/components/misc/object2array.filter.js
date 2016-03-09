(function () {

  'use strict';

  /**
   * @ngdoc filter
   * @name atacamaApp.filter:object2arrayFilter
   * @function
   * @description
   * # object2arrayFilter
   * Filter in the atacamaApp.
   */
  angular.module('atacamaApp')
    .filter('object2array', function () {
      return function (input) {
        var out = [];
        for (var i in input) {
          out.push(input[i]);
        }
        return out;
      };
    });
})();
