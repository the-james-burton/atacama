'use strict';

/**
 * @ngdoc function
 * @name atacamaApp.controller:WidgetCtrl
 * @description
 * # WidgetCtrl
 * Controller of the atacamaApp
 */
angular.module('atacamaApp')

.controller('CustomWidgetCtrl', function($scope, $uibModal, $stomp, $resource, elasticsearchService, Restangular) {

      $scope.options = {
          chart: {
            // TODO error message appears in console...
          }
        };

        $scope.config = {
          disabled: true
        };

      $scope.data = [{
        key: "test",
        values: [{}]
      }];

      $scope.remove = function(widget) {
          $scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
      };

      $scope.addContent = function(widget) {
        console.log("widget.js::addContent");
          // $scope.message = moment();
          $scope.data = [{
              key: "Cumulative Return",
              values: [
                  { "label" : "A" , "value" : -29.765957771107 },
                  { "label" : "B" , "value" : 0 },
                  { "label" : "C" , "value" : 32.807804682612 },
                  { "label" : "D" , "value" : 196.45946739256 },
                  { "label" : "E" , "value" : 0.19434030906893 },
                  { "label" : "F" , "value" : -98.079782601442 },
                  { "label" : "G" , "value" : -13.925743130903 },
                  { "label" : "H" , "value" : -5.1387322875705 }
              ]
          }];

          $scope.config = {
            disabled: false
          };

          $scope.options = {
              chart: {
                  type: 'discreteBarChart',
                  // height: 450,
                  margin : {
                      top: 20,
                      right: 20,
                      bottom: 60,
                      left: 55
                  },
                  x: function(d){ return d.label; },
                  y: function(d){ return d.value; },
                  showValues: true,
                  valueFormat: function(d){
                      return d3.format(',.4f')(d);
                  },
                  transitionDuration: 500,
                  xAxis: {
                      axisLabel: 'X Axis'
                  },
                  yAxis: {
                      axisLabel: 'Y Axis',
                      axisLabelDistance: 30
                  }
              }
          };

      };

      // set the size of the chart as the widget is resized...
      $scope.$on('gridster-item-resized', function(item) {
          $scope.options.chart.height = 170 + ((item.targetScope.gridsterItem.sizeY -1) * 238);
          $scope.options.chart.width = 218 + ((item.targetScope.gridsterItem.sizeX -1) * 238);
          $scope.api.update();
      })

        $scope.openSettings = function(widget) {
            $modal.open({
                scope: $scope,
                templateUrl: 'views/partials/widget.settings.html',
                controller: 'WidgetSettingsCtrl',
                resolve: {
                    widget: function() {
                        return widget;
                    }
                }
            });
        };

    }
);
