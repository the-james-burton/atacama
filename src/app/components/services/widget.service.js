(function () {

  'use strict';

  /**
   * @ngdoc service
   * @name atacamaApp.WidgetService
   * @description
   * # widgetService
   * Service in the atacamaApp.
   */
  angular.module('atacamaApp')
    .factory('widgetService', widgetService);

  function widgetService($log, ngstomp) {
    var service = {
      subscribeToStompUpdates: subscribeToStompUpdates
    };

    // -----------------------------------------------------
    // TODO passing scope in feels wrong... any better way?
    function subscribeToStompUpdates(scope, topic, market, selectedSymbol, onMessage) {
      topic = topic + '.' + market + '.' + selectedSymbol;
        return ngstomp
          .subscribeTo(topic)
          .callback(onMessage)
          .withBodyInJson()
          .bindTo(scope)
          .connect();
        // throw new Error("unable to subscribe to topic: " + topic);
    }

    // -----------------------------------------------------

    // -----------------------------------------------------
    $log.debug('widgetService has been created');
    return service;

  }

})();
