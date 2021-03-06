(function () {

  'use strict';

  angular.module('atacamaApp').directive('atacamaWidgetBody',
    function ($compile) {
      return {
        templateUrl: 'app/components/dashboard/widget.body.template.html',
        link: linkFunc,
        controller: 'WidgetBodyController',
        controllerAs: 'wb',
        bindToController: true // because the scope is isolated
      };

      function linkFunc(scope, element, attrs) {
        var newElement = angular.element(scope.item.settings.template);
        element.append(newElement);
        //angular has no knowledge of what goes on in jquery functions so you have to call $compile to updaate the view
        $compile(newElement)(scope);
      }

    });

})();
