define(['underscore',
        'angular',
        'mocks',
        'jquery',
        'App/Directives/FavouritesTabs'], function(_) {
            'use strict';

            describe('Favourites Tabs directive', function () {
                var scope,
                    element;
                
               
                angular.module('FavouritesTabs.spec', []).service('config', function () {
                    return {
                        reportsBaseUrl: 'http://livereport/'
                    };
                });
                
                beforeEach(function () {
                    module('App');
                    module('FavouritesTabs.spec');
                });

                describe('Given favourites tabs', function() {
                    beforeEach(inject(function ($rootScope, $compile) {
                        
                        scope = $rootScope;

                        element = $compile('<div favourites-tabs ></div>')(scope);
                        scope.$digest();
                    }));

                    it('should have a Themes tab', function() {
                        expect($(element.find('li')[0]).text()).toBe('Themes');
                    });

                    it('should have a Markets & Economies tab', function () {
                        expect($(element.find('li')[1]).text()).toBe('Markets & Economies');
                    });
                    
                    it('should have a Trades tab', function () {
                        expect($(element.find('li')[2]).text()).toBe('Trades');
                    });
                    
                    it('should have a Allocations tab', function () {
                        expect($(element.find('li')[3]).text()).toBe('Allocations');
                    });
                    
                    it('should have a Reports tab', function () {
                        expect($(element.find('li')[4]).text()).toBe('Reports');
                    });
                    
                    it('reports tab should link to live report', function () {
                        expect(element.find('li a')[4].href).toBe('http://livereport/#/reports/favourites/Reports');
                    });
                    
                    it('should have a Charts tab', function () {
                        expect($(element.find('li')[5]).text()).toBe('Charts');
                    });
                    
                    it('charts tab should link to live report', function () {
                        expect(element.find('li a')[5].href).toBe('http://livereport/#/reports/favourites/Charts');
                    });
                });

                describe('When we are on the favourites themes page', function () {
                    beforeEach(inject(function ($rootScope, $compile) {
                        scope = $rootScope;
                        scope.renderAction = 'mybca.favourites.themes';
                        element = $compile('<div favourites-tabs ></div>')(scope);
                        scope.$digest();
                    }));
                    
                    it('themes should be active', function() {
                        expect($(element.find('li')[0]).hasClass('active')).toBe(true);
                    });
                });
                
                describe('When we are on the favourites views page', function () {
                    beforeEach(inject(function ($rootScope, $compile) {
                        scope = $rootScope;
                        scope.renderAction = 'mybca.favourites';
                        element = $compile('<div favourites-tabs ></div>')(scope);
                        scope.$digest();
                    }));

                    it('views should be active', function () {
                        expect($(element.find('li')[1]).hasClass('active')).toBe(true);
                    });
                });

                describe('When we are on the favourites trades page', function () {
                    beforeEach(inject(function ($rootScope, $compile) {
                        scope = $rootScope;
                        scope.renderAction = 'mybca.favourites.trades';
                        element = $compile('<div favourites-tabs ></div>')(scope);
                        scope.$digest();
                    }));

                    it('trades should be active', function () {
                        expect($(element.find('li')[2]).hasClass('active')).toBe(true);
                    });
                });
                
                describe('When we are on the favourites allocations page', function () {
                    beforeEach(inject(function ($rootScope, $compile) {
                        scope = $rootScope;
                        scope.renderAction = 'mybca.favourites.allocations';
                        element = $compile('<div favourites-tabs ></div>')(scope);
                        scope.$digest();
                    }));

                    it('allocations should be active', function () {
                        expect($(element.find('li')[3]).hasClass('active')).toBe(true);
                    });
                });
                
                
            });
        });


