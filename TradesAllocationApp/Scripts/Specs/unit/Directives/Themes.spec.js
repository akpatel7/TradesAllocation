define(['angular', 'mocks', 'App/Directives/Themes'], function (angular) {
    'use strict';

    describe('Themes directive', function () {
        var scope,
            element;

        beforeEach(module('App.directives'));
        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope;
            element = $compile('<span themes="themes"></span>')(scope);
        }));

        describe('for view with 3 themes', function () {
            beforeEach(function() {
               scope.themes =
               [
                   {
                       "@type": "Theme",
                       "@id": "http://data.emii.com/bca/themes/china",
                       "canonicalLabel": "China will experience a soft-landing"
                   },
                   {
                       "@type": "Theme",
                       "@id": "http://data.emii.com/bca/themes/europe",
                       "canonicalLabel": "Europe’s Saints versus Sinners Narrative is Flawed"
                   },
                   {
                       "@type": "Theme",
                       "@id": "http://data.emii.com/bca/themes/equities",
                       "canonicalLabel": "Equities will outperform bonds over a medium-term horizon"
                   }
               ];
                scope.$root.$digest();
            });
            it('should display 3 themes', function () {
                expect(element.find('.themes li').length).toBe(3);
                expect(element.find('.themes > a').text().trim()).toBe('3');
                element.find('.themes > a').trigger('click');
                expect($(element.find("li a")[1]).text()).toBe('China will experience a soft-landing');
                expect($(element.find("li a")[2]).text()).toBe('Europe’s Saints versus Sinners Narrative is Flawed');
                expect($(element.find("li a")[3]).text()).toBe('Equities will outperform bonds over a medium-term horizon');

            });
            it('Themes should have links to the themes page', function () {
                element.find('.themes > a').trigger('click');
                expect(element.find('li a')[1].href).toBe(window.location.href + '#/themes?uri=http://data.emii.com/bca/themes/china');
                expect(element.find('li a')[2].href).toBe(window.location.href + '#/themes?uri=http://data.emii.com/bca/themes/europe');
                expect(element.find('li a')[3].href).toBe(window.location.href + '#/themes?uri=http://data.emii.com/bca/themes/equities');
            });
        });
        describe('for view with 0 themes', function () {
            it('should display 0 themes', function () {
                scope.themes = [];
                scope.$root.$digest();
                expect(element.find('.themes li').length).toBe(0);
                expect(element.find('.themes a').text().trim()).toBe('0');
            });
        });
        describe('for view with undefined themes', function() {
            it('should display 0 themes', function () {
                scope.themes = undefined;
                scope.$root.$digest();
                expect(element.find('.themes li').length).toBe(0);
                expect(element.find('.themes a').text().trim()).toBe('0');
            });
        });
    });
});


