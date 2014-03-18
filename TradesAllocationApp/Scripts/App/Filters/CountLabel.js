define(['angular'], function (angular) {
    'use strict';

    var filter = function () {
        return function (input) {
            var count = parseInt(input, 0);
            if (angular.isNumber(count)) {
                if (count > 10) {
                    return '10+';
                }
            }
            return input;
        };
    };
    return filter;
});

