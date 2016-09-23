'use strict';

/**
 * Atacama utility module for shared functions
 */

// http://stackoverflow.com/questions/1038746/equivalent-of-string-format-in-jquery
String.prototype.format = function () {
  var args = arguments;
  return this.replace(/\{(\d+)\}/g, function (m, n) {
    return args[n];
  });
};

String.prototype.escapeRegExp = function () {
  return this.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
};

var A = (function () {

  var test = function () {
    console.log("functions.js working");
  };

  var toVmProperty = function(property) {
    return 'vm.' + property;
  };

  var isInvalid = function(value) {
    var isUndefined = (value === undefined);
    var isInvalidDate = !isUndefined && (value.toString() === 'Invalid Date');
    return isUndefined || isInvalidDate;
  };

  return {
    test: test,
    toVmProperty: toVmProperty,
    isInvalid: isInvalid
  };

})();
