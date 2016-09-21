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

  function widgetService($log, ngstomp, elasticsearchService) {
    var service = {
      subscribeToStompUpdates: subscribeToStompUpdates,
      emptyChart: emptyChart,
      fetchHistoricDataFromElasticsearch: fetchHistoricDataFromElasticsearch,
      unsubscribeTopic: unsubscribeTopic
    };

    // -----------------------------------------------------
    // TODO passing scope in feels wrong... any better way?
    function subscribeToStompUpdates(scope, topic, market, selectedSymbol, onMessage) {
      var topic = topic + '.' + market + '.' + selectedSymbol;
      var result = ngstomp
        .subscribeTo(topic)
        .callback(onMessage)
        .withBodyInJson()
        .bindTo(scope)
        .connect();
      // throw new Error("unable to subscribe to topic: " + topic);
      return result;
    }

    // -----------------------------------------------------
    // TODO due to ES client use of promises, we need to use callbacks...
    function fetchHistoricDataFromElasticsearch(market, selectedSymbol, fromMilliseconds, successCallback, errorCallback) {
      var esPromise = elasticsearchService.getTicksAfter(market, selectedSymbol, fromMilliseconds);
      esPromise.then(function (response) {
        var results = elasticsearchService.parseResults(response)
        successCallback(results);
      }, function (err) {
        errorCallback('unable to load ES data', err)
      });
    }

    // -----------------------------------------------------
    // TODO was the old 'reset()'' function, may not be required...
    function emptyChart() {
      var result = {
        options: {
          chart: {}
        },
        config: {
          deepWatchData: true,
          // deepWatchDataDepth: 1,
          refreshDataOnly: false,
          disabled: true
        },
        data: [{
          key: '',
          values: []
        }]
      }
      return result;
    };

    // -----------------------------------------------------
    function unsubscribeTopic(topic) {
      if (topic.length > 0) {
        ngstomp.unsubscribe(topic, A.unsubscribeCallback(topic));
      }
    }

    // -----------------------------------------------------
    $log.debug('widgetService has been created');
    return service;

  }

})();
