'use strict';

/**
 * Atacama utility module for shared functions
 */

var A = (function () {

    var testUtils = function () {
      console.log("utils.js working");
    };

    var unsubscribeCallback = function(topic) {
      console.log("Unsubscribed from " + topic);
    };


    return {
      testUtils: testUtils,
      unsubscribeCallback: unsubscribeCallback
    };

})();
