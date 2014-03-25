define(['angular'], function (angular) {
    'use strict';

    return function () {
        return {
            restrict: 'EA',
            transclude: true,
            template: '<div ng-transclude id="{{id}}"></div>',
            link: function (scope, element, attrs) {
                scope.id = scope.$id;
                element.bind('click', function () {
                    var el = document.getElementById(scope.id);
                    el.scrollIntoView(true);
                });
                
            }
        };
    };
});

