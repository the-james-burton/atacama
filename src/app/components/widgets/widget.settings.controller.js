(function () {﻿

  'use strict';

  /**
   * @ngdoc function
   * @name atacamaApp.controller:WidgetsSttingsController
   * @description
   * # WidgetsettingsController
   * Controller of the atacamaApp
   */
  angular.module('atacamaApp')
    .controller('WidgetSettingsController', WidgetSettingsController);

  function WidgetSettingsController($scope, $timeout, $rootScope, $uibModalInstance) {
    // TODO cannot use vm as uibModal.open does not seem to support controllerAs
    // see ps.widget.body.directive.js ...
    // var vm = this;
    
    var widget = $scope.item;

    $scope.form = {
      name: widget.widgetSettings.id,
      sizeX: widget.sizeX,
      sizeY: widget.sizeY,
      col: widget.col,
      row: widget.row
    };

    $scope.dismiss = function () {
      $uibModalInstance.dismiss();
    };

    $scope.submit = function () {
      angular.extend(widget, $scope.form);

      $uibModalInstance.close(widget);
    };

  }

})();
