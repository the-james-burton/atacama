(function () {

  'use strict';

  angular.module('atacamaApp').directive('psWidgetBody',
    function ($compile) {
      return {
        templateUrl: 'app/components/dashboard/ps.widget.body.template.html',
        link: linkFunc,
        controller: 'WidgetBodyController',
        controllerAs: 'wb'
        // bindToController: true // because the scope is isolated
      };

      function linkFunc(scope, element, attrs) {
        var newElement = angular.element(scope.item.template);
        element.append(newElement);
        //angular has no knowledge of what goes on in jquery functions so you have to call $compile to updaate the view
        $compile(newElement)(scope);
      }

    });

})();
