(function () {

  'use strict';

  /**
   * @ngdoc function
   * @name atacamaApp.controller:WidgetBodyController
   * @description
   * # WidgetBodyController
   * Controller of the atacamaApp
   */
  angular.module('atacamaApp')
    .controller('WidgetBodyController', WidgetBodyController);

  function WidgetBodyController($scope, $uibModal, $log) {
    var vm = this;
    var widget = $scope.$parent;
    // TODO ...aaaargh! How to avoid this? How to sensibly work with the dashobard controller?
    var dashboard = $scope.$parent.$parent.$parent.vm.dashboard;

    vm.close = function () {
      dashboard.widgets.splice(dashboard.widgets.indexOf(widget.item), 1);
    };

    vm.settings = function () {
      var options = {
        templateUrl: widget.item.widgetSettings.templateUrl,
        controller: widget.item.widgetSettings.controller,
        scope: $scope
      };
      $uibModal.open(options);
    };

    //use empty function so angular handles click event and allows menu to be opened on touch devices
    vm.iconClicked = function () {
      $log.info("wb.settings()");
    };
  }

})();
