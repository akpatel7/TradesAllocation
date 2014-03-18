define(['angular', 'mocks', 'App/Filters/filters'], function (angular) {
    'use strict';

    describe('filter', function () {
        beforeEach(module('App.filters'));

        describe('countLabel', function () {
            var filter;
            beforeEach(inject(function (countLabelFilter) {
                return filter = countLabelFilter;
            }));
            it('exists', function () {
                expect(filter).not.toBeUndefined();
            });
            
            describe('Given a number is lower or equal than 10', function() {
                it('should display the number', function() {
                    var input = '10';
                    expect(filter(input)).toEqual('10');
                });
            });
            
            describe('Given a number is greater than 10', function () {
                it('should display the 10+', function () {
                    var input = '11';
                    expect(filter(input)).toEqual('10+');
                });
            });
            
            describe('Given input is not a number', function () {
                it('should display the input', function () {
                    var input = 'not a number';
                    expect(filter(input)).toEqual(input);
                });
            });
        });
    });

});
