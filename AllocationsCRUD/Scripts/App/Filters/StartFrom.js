define(['angular'], function (angular) {
    'use strict';

    var filter = function () {
        return function (input, start) {
            start = +start;
            return input.slice(start);
        };
    };
    return filter;
});

