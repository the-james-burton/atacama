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
    // see widget.body.directive.js ...
    // var vm = this;

    var widget = $scope.item;

    $scope.form = {
      name: widget.settings.widgetSettings.id,
      sizeX: widget.settings.sizeX,
      sizeY: widget.settings.sizeY,
      col: widget.settings.col,
      row: widget.settings.row
    };

    $scope.dismiss = function () {
      $uibModalInstance.dismiss();
    };

    $scope.submit = function () {
      // TODO this looks like a nasty hack to me...
      angular.extend(widget.settings, $scope.form);

      $uibModalInstance.close(widget);
    };

  }

})();
