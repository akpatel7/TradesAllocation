define(['angular', 'mocks', 'App/Directives/Breadcrumb'], function (angular) {
    'use strict';

    describe('Breadcrumb directive', function () {
        var scope,
            element;

        angular.module('Breadcrumb.Spec', []).factory('Analytics', function () {
            return {
                registerPageTrack: function () {
                },
                registerClick: function () {
                },
                logUsage: function () {
                }
            };
        });
        
        beforeEach(module('ngRoute'));
        beforeEach(module('App.directives'));
        beforeEach(module('App.services'));        
        beforeEach(module('Breadcrumb.Spec'));

        beforeEach(
            // setup some test routes
            module(function ($routeProvider) {
                $routeProvider
                    .when('/home/views', {
                        action: 'home.viewables'
                    })
                    .when('/home', {
                        action: 'home.default'
                    })
                    .when('/home/favourites', {
                        action: 'mybca.favourites'
                    })
                    .when('/home/somepage', {
                        action: 'home.somepage'
                    })
                    .when('/home/research', {
                        action: 'home.research'
                    })
                    .when('/home/trades', {
                        action: 'home.trades'
                    })
                    .otherwise(
                        {
                            redirectTo: '/home'
                        }
                    );
            }));

        beforeEach(inject(function($rootScope, $compile) {
            scope = $rootScope;
            var template = angular.element('<div breadcrumb></div>');
            element = $compile(template)(scope);
        }));
        
        describe('When visiting root page', function () {
            // inject($route) is required by angular engine to trigger $location change event
            it('should display nothing.', inject(function ($location, $route) {
                $location.path('/');
                scope.$root.$digest();
                expect(element.find('span[ng-hide]').text().trim()).toEqual('');
            }));
        });

        describe('When visiting home', function () {
            // inject($route) is required by angular engine to trigger $location change event
            it('should display nothing.', inject(function ($location, $route) {
                $location.path('/home');
                scope.$root.$digest();
                expect(element.find('span[ng-hide]').text().trim()).toEqual('');
            }));
        });
        
        describe('When visiting /Views', function () {
            // inject($route) is required by angular engine to trigger $location change event
            it('should display My Dashboard / Views.', inject(function ($location, $route) {
                $location.path('/home/views');
                scope.$root.$digest();
                expect(element.find('span[ng-hide]').text().trim()).toEqual('My DashboardViews');
            }));
        });
        
        describe('When visiting /Favourites', function () {
            it('should display My BCA / Favourited.', inject(function ($location, $route) {
                $location.path('/home/favourites');
                scope.$root.$digest();
                expect(element.find('span[ng-hide]').text().trim()).toEqual('My BCAFavourites');
            }));
        });
        
        describe('When visiting /Trades', function () {
            it('should display My BCA / Trades.', inject(function ($location, $route) {
                $location.path('/home/trades');
                scope.$root.$digest();
                expect(element.find('span[ng-hide]').text().trim()).toEqual('My DashboardTrades');
            }));
        });
        
        describe('When visiting a page that does not have a static breadcrumb text specified', function () {
            beforeEach(inject(function ($location, Page, $route) {
                $location.path('/home/research');
                scope.$root.$digest();
            }));

            it('should display the dynamic page title.', inject(function ($location, Page, $route) {
                Page.setTitle('my dynamic title');
                scope.$root.$digest();

                expect(element.find('span[ng-hide]').text().trim()).toEqual('My Dashboardmy dynamic title');
            }));

            it('should display dynamic breadcrumbs.', inject(function ($location, Page, $route) {
                Page.setLastBreadcrumbs([
                    { name: '1' },
                    { name: '2' },
                    { name: '3' }
                ], false);
                scope.$root.$digest();

                expect(element.find('span[ng-hide]').text().trim()).toEqual('My Dashboard123');
            }));
        });

        describe('Given we are on the views page', function () {
            beforeEach(inject(function($location, $route) {
                $location.path('/home/views');
                scope.$root.$digest();
                expect(element.find('span[ng-hide]').text().trim()).toEqual('My DashboardViews');
            }));
            
            describe('When clicking on My Dashboard', function() {
                it('Should go back to My Dashboard and display nothing.', inject(function($location) {
                    element.find('a').first().trigger('click');
                    expect(element.find('span[ng-hide]').text().trim()).toEqual('');
                    expect($location.$$path).toBe('/home');
                }));
            });

        });
        
        describe('Given we visit a valid page which is not listed in the breadcrumb directive', function () {
            beforeEach(inject(function ($location, $route) {
                $location.path('/home/somepage');
                scope.$root.$digest();
            }));

            it('Should display nothing.', inject(function ($location) {
                expect(element.find('span[ng-hide]').text().trim()).toEqual('');
            }));

        });
    });
});


