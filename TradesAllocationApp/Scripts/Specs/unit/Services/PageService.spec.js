define(['underscore',
        'App/Services/PageService',
        'angular',
        'mocks',
        'route'], function (_) {
            describe('Page Service', function() {
                describe('Given we have a Page Service', function () {

                    beforeEach(module('ngRoute'));
                    beforeEach(function() {
                        module('App.services');
                    });
                    
                    beforeEach(
                        module(function ($routeProvider) {
                            $routeProvider
                                .when('/test', { });
                        }));

                    beforeEach(inject(function (Page) {
                        Page.resetTitle();
                    }));

                    describe('Given we have a page title', function() {
                        it('should return the title set', inject(function (Page) {
                            Page.setTitle('Page Title');
                            expect(Page.getTitle()).toEqual('Page Title');
                        }));

                        it('should reset the page title to the default when the location changes', inject(function ($location, $rootScope, Page, $route) {
                            var defaultTitle = Page.getTitle();
                            Page.setTitle('Page Title');
                            $location.path('/test');
                            $rootScope.$digest();
                            expect(Page.getTitle()).toEqual(defaultTitle);
                        }));
                    });
                    
                    describe('Given we have home.viewables.research breadcrumb', function () {
                        var breadcrumbs,
                            pageService;

                        beforeEach(inject(function (Page) {
                            pageService = Page;
                            breadcrumbs = Page.getBreadcrumbs('home.viewables.research');
                        }));

                        it('should return initially', inject(function () {
                            expect(breadcrumbs.length).toEqual(3);
                            expect(breadcrumbs[0].name).toEqual('My Dashboard');
                            expect(breadcrumbs[1].name).toEqual('Views');
                            expect(breadcrumbs[2].name).not.toBeDefined();
                        }));
                        
                        it('should change after new breadcrumbs loaded', inject(function ($rootScope) {
                            pageService.setLastBreadcrumbs([{ name: 'a name' }, { name: 'a name 2' }], true);

                            $rootScope.$digest();

                            expect(breadcrumbs.length).toEqual(4);
                            expect(breadcrumbs[0].name).toEqual('My Dashboard');
                            expect(breadcrumbs[1].name).toEqual('Views');
                            expect(breadcrumbs[2].name).toEqual('a name');
                            expect(breadcrumbs[3].name).toEqual('a name 2');
                        }));
                    });
                    
                });
            });
        });