define(['jquery', 'App/Helpers/Browser', 'angular', 'mocks', 'App/Directives/StickyTableHeaders'], function ($, browserHelper) {
    'use strict';

    describe('StickyTableHeaders directive', function () {
        var scope,
            element;

        beforeEach(module('App.directives'));
        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope.$new();
            element = $compile('<table sticky-table-headers><thead></thead></table>')(scope);
            scope.$root.$digest();
        }));

        describe('When table is initialized', function () {
            it('Should contain thead with sticky headers CSS class', function () {
                expect($(element.children('thead')[0]).hasClass('tableFloatingHeaderOriginal')).toBe(browserHelper.isIE8() ? false : true);
            });
        });        
    });
});


