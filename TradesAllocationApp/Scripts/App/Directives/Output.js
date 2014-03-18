define(['angular', 'jquery'], function (angular, $) {
    'use strict';

    return function () {
        return {
            restrict: 'A',
            scope: false,
            priority: 500,
            link: function (scope, element, attrs) {
                $(element).append(scope.$eval(attrs.value));
            }
        };
    };
});

