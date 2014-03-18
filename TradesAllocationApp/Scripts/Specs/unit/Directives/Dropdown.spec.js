define(['angular', 'mocks', 'App/Directives/Dropdown'], function (angular) {
    'use strict';

    describe('Dropdown directive', function () {
        var scope,
            element;

        beforeEach(module('App.directives'));
        
        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope;
            element = $compile('<span dropdown items="themes" title="Themes" ></span>')(scope);
        }));

        describe('for view with 3 themes', function () {
            beforeEach(function() {
                scope.themes =
                [
                    {
                        "@id": "http://data.emii.com/bca/themes/c2px1vnk1zbt"
                    },
                    {
                        "@id": "http://data.emii.com/bca/themes/c2px1vnk1zd3",
                        "canonicalLabel": "Europe’s Saints versus Sinners Narrative is Flawed"
                    },
                    {
                        "@id": "http://data.emii.com/bca/themes/c2px1vnk1zbw",
                        "canonicalLabel": "Equities will outperform bonds over a medium-term horizon"
                    }
                ];
                scope.$root.$digest();
            });
            it('should display the title "Themes (3)', function () {
                expect(element.find('.title').text()).toBe('Themes (3) ');
            });

            it('should display 3 themes', function () {
                expect(element.find('.items li').length).toBe(3);
            });
            
        });
        describe('for view with 0 themes', function () {
            it('should display 0 themes', function () {
                scope.themes = [];
                scope.$root.$digest();
                expect(element.find('.items li').length).toBe(0);
                expect(element.find('.title').text()).toBe('Themes (0) ');
            });
        });
        describe('for view with undefined themes', function() {
            it('should display 0 themes', function () {
                scope.themes = undefined;
                scope.$root.$digest();
                expect(element.find('.items li').length).toBe(0);
                expect(element.find('.items a').text()).toBe('Themes  ');
            });
        });        
        describe('for view with null themes', function () {
            it('should display 0 themes', function () {
                scope.themes = null;
                scope.$root.$digest();
                expect(element.find('.items li').length).toBe(0);
                expect(element.find('.items a').text()).toBe('Themes  ');
            });
        });
    });
    
    describe('Dropdown directive with urls', function () {
        var scope,
            element;

        beforeEach(module('App.directives'));

        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope;
            element = $compile('<span dropdown items="relatedMarkets" title="Related Markets / Economies" ></span>')(scope);
        }));

        describe('for view with 2 related markets with urls', function () {
            beforeEach(function() {
               scope.relatedMarkets =
                   [
                       {
                           "@id": "http://data.emii.com/economies/china_economy_tst",
                           "canonicalLabel": "China economy",
                           "url": "#/viewable?uri=china-uri"
                       },
                       {
                           "@id": "http://data.emii.com/commodities-markets/gold_tst",
                           "canonicalLabel": "Gold Market",
                           "url": "#/viewable?uri=gold-uri"
                       }
                   ];
                scope.$root.$digest();
            });
            it('should display 2 related markets items', function () {
                expect(element.find('.items li').length).toBe(2);
            });
            
            it('Should display the title "Related Markets / Economies (2)', function() {
                expect(element.find('.title').text()).toBe('Related Markets / Economies (2) ');
            });
            
            it('Each item should have a url', function () {
                expect(element.find('.item a').length).toBe(2);
                expect(element.find('.item a')[0].href).toBe(window.location.href + '#/viewable?uri=china-uri');
                expect(element.find('.item a')[1].href).toBe(window.location.href + '#/viewable?uri=gold-uri');
            });
        });
       
    });
});


