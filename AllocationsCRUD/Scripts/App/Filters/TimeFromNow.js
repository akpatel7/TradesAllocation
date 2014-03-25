define(['angular', 'moment'], function (angular, moment) {
    'use strict';

    var filter = function () {
        return function (input) {
            var date = moment(input);
            if (date.isValid()) {
                return date.fromNow();
            }
            return input;
        };
    };
    return filter;
});

