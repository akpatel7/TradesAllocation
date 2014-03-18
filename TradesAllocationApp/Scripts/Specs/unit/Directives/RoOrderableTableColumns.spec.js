define(['jquery', 'angular', 'mocks', 'App/Directives/ReOrderableTableColumns'], function ($) {
    'use strict';

    describe('ReOrderableTableColumns directive', function () {
        var scope,
            element,
            expectRowValues;

        beforeEach(module('App.directives'));
        beforeEach(module('App.services'));
        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope.$new();
            element = $compile('<table re-orderable-table-columns row-selector="tr.re-orderable">' +
                                    '<thead>' +
                                        '<tr class="re-orderable"><td>One</td><td>Two</td><td>Three</td></tr>' +
                                    '</thead>' +
                                    '<tbody>' +
                                        '<tr class="re-orderable"><td>One</td><td>Two</td><td>Three</td></tr>' +
                                        '<tr class="no-re-order"><td>Do </td><td>not </td><td>re-order</td></tr>' +
                                    '</tbody>' +
                                '</table>')(scope);
            scope.$root.$digest();
        }));

        expectRowValues = function (text) {
            element.children().find('tr.re-orderable').each(function (index, row) {
                expect($(row).text()).toBe(text);
            });
            expect(element.children().find('tr.no-re-order').text()).toBe('Do not re-order');
        };

        describe('When we move column One 2 columns to the right', function () {
            
            beforeEach(function() {
                scope.$broadcast('trade:move-column', { index: 2, oldIndex: 0 });
                scope.$root.$digest();
            });
            it('Should display the columns correctly', function () {
                expectRowValues('TwoThreeOne');
            });
            describe('Then we move column Three one column to the left', function() {
                beforeEach(function() {
                    scope.$broadcast('trade:move-column', { index: 1, oldIndex: 2, isLeftMove: true });
                    scope.$root.$digest();
                });
                it('Should display the columns correctly', function () {
                    expectRowValues('TwoOneThree');
                });
                describe('Then we move column Three two columns to the left', function () {
                    beforeEach(function () {
                        scope.$broadcast('trade:move-column', { index: 0, oldIndex: 2, isLeftMove: true });
                        scope.$root.$digest();
                    });
                    it('Should display the columns correctly', function () {
                        expectRowValues('ThreeTwoOne');
                    });
                });
            });
        });

        describe('When we only want to re-order rows under <tbody> as the header is static', function() {
            beforeEach(function () {
                scope.$broadcast('trade:move-column', { index: 2, oldIndex: 0, bodyRowsOnly: true });
                scope.$root.$digest();
            });
            it('Should display the columns correctly', function () {
                expect($(element.children()[0]).text()).toBe('OneTwoThree');
                expect($(element.children()[1]).find('tr.re-orderable').text()).toBe('TwoThreeOne');
                expect(element.children().find('tr.no-re-order').text()).toBe('Do not re-order');
            });
        });

        describe('When we want to re-order new rows added to the table after existing rows have been re-ordered', function () {
            beforeEach(function() {
                scope.$broadcast('trade:move-column', { index: 2, oldIndex: 0 });
                scope.$root.$digest();
                expectRowValues('TwoThreeOne');
            });

            it('Should only reorder the last row after it is appended', function() {
                $('<tbody><tr class="re-orderable"><td>One</td><td>Two</td><td>Three</td></tr></tbody>')
                    .insertAfter($(element).find('tbody'));

                scope.$broadcast('trade:move-column', { index: 2, oldIndex: 0, rowsAppended: true });
                scope.$root.$digest();
                expectRowValues('TwoThreeOne');
            });
        });
    });
});


