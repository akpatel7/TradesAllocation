define(['angular', 'mocks', 'App/Filters/filters'], function (angular) {
    'use strict';

    describe('filter', function () {
        beforeEach(module('App.filters'));

        describe('startFrom', function () {
            var filter;
            beforeEach(inject(function (startFromFilter) {
                return filter = startFromFilter;
            }));
            it('exists', function () {
                expect(filter).not.toBeUndefined();
            });
            it('should return 2 items', function () {
                var input = ['item1', 'item2', 'item3'];
                expect(filter(input, 1)).toEqual(['item2', 'item3']);
            });
        });
    });

});
