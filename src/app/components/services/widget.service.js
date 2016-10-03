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

    // these declarations MUST come above the returned 'service' object
    // TODO it works in the browser, but PhantomJS gives this error
    // if we use ES6 keyword 'const' for these variables..
    // PhantomJS 2.1.1 (Linux 0.0.0) ERROR SyntaxError: Unexpected token 'const'

    // adjustments to make the chart fit better in the widget...
    var adjustX = -35;
    var adjustY = -65;

    // starting points for the topics...
    var tickTopicRoot = '/topic/ticks';
    var indicatorTopicRoot = '/topic/indicators';
    var strategyTopicRoot = '/topic/strategies';
    var status = _.keyBy(['WAITING', 'LOADING', 'LOADED', 'ERROR'], _.identity);

    var service = {
      subscribeToStompUpdates: subscribeToStompUpdates,
      resolveElasticsearchPromise: resolveElasticsearchPromise,
      emptyChart: emptyChart,
      unsubscribeTopic: unsubscribeTopic,
      startWatches: startWatches,
      adjustX: adjustX,
      adjustY: adjustY,
      tickTopicRoot: tickTopicRoot,
      indicatorTopicRoot: indicatorTopicRoot,
      strategyTopicRoot: strategyTopicRoot,
      status: status
    };

    // -----------------------------------------------------
    // TODO passing scope in feels wrong... any better way?
    function subscribeToStompUpdates(scope, topic, onMessage, errorCallback) {
      try {
        var result = ngstomp
          .subscribeTo(topic)
          .callback(onMessage)
          .withBodyInJson()
          .bindTo(scope)
          .connect();
        // throw new Error("unable to subscribe to topic: " + topic);
        return result;
      } catch (err) {
        errorCallback('STOMP subscribeTo error:', err);
      }
    }

    // -----------------------------------------------------
    // TODO due to ES client use of promises, we need to use callbacks...
    function resolveElasticsearchPromise(promise, successCallback, errorCallback) {
      promise.then(function (response) {
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
        return ngstomp.unsubscribe(topic, function (topic) {
          $log.info("Unsubscribed from " + topic);
        });
      }
    }

    // -----------------------------------------------------
    // NOTE this has side-effects (setups up angular watches), I don't think this can be avoided...
    function startWatches(watches, action, scope) {

      var watchKeys = _(watches).map(A.toVmProperty).value();
      // var watchValues = _(watches).map(_.propertyOf(vm)).value();

      // if any user input changes, re-do the chart...
      scope.$watchGroup(watchKeys, function (newValues, oldValues) {

        $log.info('newValues:{0}'.format(newValues));

        // use lodash to filter for undefined of 'Invalid Date',
        // then check that the resulting array is empty...
        var invalidValues = _(newValues).filter(A.isInvalid).value();

        // if we have any invalid values, then abort...
        if (invalidValues.length > 0) {
          return;
        }

        // load each watch into the scope...
        _(watches).forEach(function (watch) {
          scope.item[watch] = scope.vm[watch];
          //$log.info($scope.item[watch]);
        });

        //$scope.item.symbol = vm.symbol;
        //$scope.item.dateFrom = vm.dateFrom;
        $log.log('detected updates: old:{0}, new:{1}'.format(
          angular.toJson(oldValues), angular.toJson(newValues)));
        action(scope.item);
      }, false);

      // set the size of the chart as the widget is resized...
      scope.$on('gridster-item-resized', function (item, gridsterWidget) {
        $log.debug('gridster-item-resized {0}x{1}'.format(
          gridsterWidget.getElementSizeX(), gridsterWidget.getElementSizeY()));
        scope.vm.chart.options.chart.width = gridsterWidget.getElementSizeX() + adjustX;
        scope.vm.chart.options.chart.height = gridsterWidget.getElementSizeY() + adjustY;
        // TODO now causes an error... is this needed?
        // $scope.api.update();
      });
    }

    // -----------------------------------------------------
    $log.debug('widgetService has been created');
    return service;

  }

})();
