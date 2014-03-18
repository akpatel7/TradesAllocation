define(['angular', 'mocks', 'App/Filters/filters'], function (angular) {
    'use strict';

    describe('filter', function () {
        beforeEach(module('App.filters'));

        describe('timeFromNow', function () {
            var filter;
            beforeEach(inject(function (timeFromNowFilter) {
                return filter = timeFromNowFilter;
            }));
            it('exists', function () {
                expect(filter).not.toBeUndefined();
            });
            it('should return .. ago for a valid date', function () {
                var input = '2010-11-06T14:02:15.72',
                    result = filter(input);
                expect(result.indexOf('ago')).not.toBe(-1);
                expect(result.indexOf('years')).not.toBe(-1);
            });
            it('should return the input for an invalid date', function () {
                var input = 'not a date';
                expect(filter(input)).toBe('not a date');
            });
           
        });
    });

});
