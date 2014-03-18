define(['jquery', 'angular', 'mocks', 'App/Directives/ToggleTableColumns'], function ($) {
    'use strict';

    describe('ToggleTableColumns directive', function () {
        var scope,
            element,
            expectRowValues;

        beforeEach(module('App.directives'));
        beforeEach(module('App.services'));
        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope.$new();
            element = $compile('<table toggle-table-columns>' +
                                    '<thead>' +
                                        '<tr><td data-column="one">One</td><td data-column="two">Two</td><td data-column="three">Three</td></tr>' +
                                    '</thead>' +
                                    '<tbody>' +
                                        '<tr><td data-column="one">One</td><td data-column="two">Two</td><td data-column="three">Three</td></tr>' +
                                        '<tr><td data-column="one">One</td><td data-column="two">Two</td><td data-column="three">Three</td></tr>' +
                                    '</tbody>' +
                                '</table>')(scope);
            scope.$root.$digest();
        }));

        describe('Given we have a HTML table with some columns we want to show/hide', function() {
            it('Should begin with all columns visible', function() {
                element.children().find('tr > td').each(function (index, cell) {
                    expect($(cell).css('display')).not.toBe('none');
                });
            });
            
            describe('When we hide column two', function () {
                beforeEach(function () {
                    scope.$broadcast('trade:toggle-column', { column: 'two', show: false });
                    scope.$root.$digest();
                });
                it('Should display the columns correctly', function () {
                    expect(element.children().find('tr > td:eq(0)').css('display')).not.toBe('none');
                    expect(element.children().find('tr > td:eq(1)').css('display')).toBe('none');
                    expect(element.children().find('tr > td:eq(2)').css('display')).not.toBe('none');
                });
                describe('Then we show column two', function () {
                    beforeEach(function () {
                        scope.$broadcast('trade:toggle-column', { column: 'two', show: true });
                        scope.$root.$digest();
                    });
                    it('Should display the columns correctly', function () {
                        element.children().find('tr > td').each(function (index, cell) {
                            expect($(cell).css('display')).not.toBe('none');
                        });
                    });
                });
            });
        });        
    });
});


