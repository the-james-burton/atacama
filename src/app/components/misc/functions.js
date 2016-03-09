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


var A = (function () {

  var testUtils = function () {
    console.log("functions.js working");
  };

  var unsubscribeCallback = function (topic) {
    console.log("Unsubscribed from " + topic);
  };


  return {
    testUtils: testUtils,
    unsubscribeCallback: unsubscribeCallback
  };

})();
