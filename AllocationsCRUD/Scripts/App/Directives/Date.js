define(['angular', 'moment', 'jquery'], function (angular, moment, $) {
    'use strict';

    return function () {
        return {
            restrict: 'EA',
            template: '{{dateText}}',
            scope: { date: '=', displayEmpty: '=' },
            link: function (scope, element, attrs) {
                var format = attrs.format, displayEmpty = attrs.displayEmpty === 'true',
                    defaultFormat = 'DD MMM YYYY',
                    usFormat = 'MMM DD YYYY',
                    localeFormat;
                var locale = $('meta[name=accept-language]').attr("content");
                if (locale === 'en-US') {
                    localeFormat = usFormat;
                } else {
                    localeFormat = defaultFormat;
                }
                scope.$watch('date', function () {
                    if (scope.date) {
                        var d;
                        if (scope.date.indexOf('Date') !== -1) {
                            d = moment(scope.date);
                            scope.dateText = d.format(format && format.length > 0 ? format : localeFormat);
                        } else {
                            d = moment(scope.date, 'YYYY-MM-DD');
                            scope.dateText = moment(d).format(format && format.length > 0 ? format : localeFormat);
                        }
                       
                    } else {
                        scope.dateText = displayEmpty ? '' : 'N/A';
                    }
                });
            }
        };
    };
});

