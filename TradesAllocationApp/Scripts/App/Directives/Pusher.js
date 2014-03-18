define(['angular', 'jquery'], function (angular, $) {
    'use strict';

    /*
        Creates a div with a fix height.
    */
    return function () {
        return {
            restrict: 'A',
            scope: {
                count: '=',
                height: '@'
            },
            replate: true,
            template: '<div></div>',
            link: function (scope, element) {
                scope.$watch('count', function(newVal) {
                    var height = newVal * parseInt(scope.height, 10);
                    $(element).height(height);
                });
            }
        };
    };
});

