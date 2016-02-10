'use strict';

/**
 * @ngdoc service
 * @name atacamaApp.utilService
 * @description
 * # utilService
 * Service in the atacamaApp.
 */
angular.module('atacamaApp')
  .service('utilService', utilService);

function utilService($log, ngstomp) {

  this.traceLog = function(item, text) {
    $log.debug("{0}.{1}.{2} {3}".format(
      item.name, item.row, item.col, text));
  };

  this.unsubscribeTopic = function(topic) {
    if (topic.length > 0) {
      ngstomp.unsubscribe(topic, A.unsubscribeCallback(topic));
    }
  };

}
