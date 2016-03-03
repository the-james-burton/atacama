(function () {

  'use strict';

  angular.module('psDashboard').directive('psWidgetBody',
    function ($compile, $uibModal) {
      return {
        templateUrl: 'app/components/dashboard/ps.widget.body.template.html',
        link: linkFunc
      };

      function linkFunc(scope, element, attrs) {
        var newElement = angular.element(scope.item.template);
        element.append(newElement);
        //angular has no knowledge of what goes on in jquery functions so you have to call $compile to updaate the view
        $compile(newElement)(scope);

        scope.close = function () {
          scope.widgets.splice(scope.widgets.indexOf(scope.item), 1);
        };

        scope.settings = function () {
          var options = {
            templateUrl: scope.item.widgetSettings.templateUrl,
            controller: scope.item.widgetSettings.controller,
            scope: scope
          };
          $uibModal.open(options);
        };

        //use empty function so angular handles click event and allows menu to be opened on touch devices
        scope.iconClicked = function () {
          //empty body
          //this function is used by ng-click in the template
          //so that icon clicks aren't intercepted by widgets
        };
      }

    });

})();
