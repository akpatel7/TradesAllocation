define(['angular', 'nezasa', 'App/ie8'], function (angular, nezasa) {
    'use strict';

    return function () {
        return {
            restrict: 'EA',
            template: '<span>{{period}}</span>',
            scope : { viewHorizon : '=' },
            link: function (scope, element, attrs) {
                var units = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second'],
                    unitsPlural = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'];

                scope.$watch('viewHorizon', function (value) {
                    if (value !== undefined) {
                        scope.period = nezasa.iso8601.Period.parseToString(value, units, unitsPlural, true);
                    }
                });
            }
        };
    };
});

