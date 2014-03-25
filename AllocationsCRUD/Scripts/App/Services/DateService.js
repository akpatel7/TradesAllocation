define(['angular', 'moment', 'nezasa'], function (angular, moment, nezasa) {
    'use strict';

    var service = function () {
        return {
            calculateDifferenceInMonths: function (d1, d2) {
                var a = moment(d1),
                    b = moment(d2);
                
                return b.diff(a, 'months');
            },
            calculateDifferenceInWeeks: function (d1, d2) {
                var a = moment(d1),
                    b = moment(d2);
                
                return b.diff(a, 'weeks');
            },
            calculateDifferenceInDays: function (d1, d2) {
                var a = moment(d1),
                    b = moment(d2);
                
                return b.diff(a, 'days');
            },
            calculateDifferenceInMilliseconds: function (d1, d2) {
                var a = moment(d1),
                    b = moment(d2);
                
                return b.diff(a);
            },
            toDate: function (dateValue) {
                return moment(dateValue, 'YYYY-MM-DD');
            },
            parseTimeSpan: function (period) {
                try {
                    var values = nezasa.iso8601.Period.parse(period, false);
                    return {
                        months: values[1]
                    };
                } catch(e) {
                    return {
                        months: 0
                    };
                }                 
            },
            now: function () {
                return moment().format('YYYY-MM-DD');
            },
            parseFilter: function (lastUpdated, dateNow) {
                var value = '';
                switch (lastUpdated) {
                    case 'LastWeek':
                        value = dateNow.subtract('weeks', 1).format('YYYY-MM-DD');
                        break;
                    case 'LastMonth':
                        value = dateNow.subtract('months', 1).format('YYYY-MM-DD');
                        break;
                    case 'LastQuarter':
                        value = dateNow.subtract('months', 3).format('YYYY-MM-DD');
                        break;
                    case 'LastYear':
                        value = dateNow.subtract('years', 1).format('YYYY-MM-DD');
                        break;
                }
                return value;
            },
            toUTCDate: function (value) {
                var date = moment(value),
                    result = Date.UTC(date.year(), date.month(), date.date());
                return result;
            }
        };      
    };
    service.$inject = [];
    return service;
});