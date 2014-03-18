define(['App/Controllers/AppController',
        'angular',
        'resource',
        'mocks',
        'route',
        'App/Controllers/controllers'
], function (AppController) {
            describe('App Controller', function () {
                describe('Given we have some routes setup', function () {
                    var controller,
                        scope;
                    
                    angular.module('AppController.Spec', []).factory('Analytics', function () {
                        return {
                            registerPageTrack: function () {
                            },
                            registerClick: function () {
                            },
                            logUsage: function () {
                            }
                        };
                    });
                    
                    beforeEach(module('App.controllers'));
                    beforeEach(module('AppController.Spec'));
                    beforeEach(module('ngRoute'));
                    beforeEach(
                        // setup some test routes
                        module(function ($routeProvider) {
                            $routeProvider
                                 .when('/home/tab1', {
                                     action: 'home.default.tab1'
                                    
                                 })
                                 .when('/home', {
                                     action: 'home.default',
                                     title: 'Home Page'
                                 })
                                .when('/favourites', {
                                    action: 'home.favourites',
                                    title: 'Home Page'
                                })
                                 .otherwise(
                                     {
                                         redirectTo: '/home'
                                     }
                                 );
                        }));
              

                    // create an instance of AppController
                    beforeEach(inject(function ($controller, $rootScope) {
                        scope = $rootScope.$new();
                        controller = $controller(AppController, { $scope: scope });
                    }));

                    describe('When going visiting a page', function () {
                      
                        it('should track the page', inject(function ($controller, $route, $routeParams, $location, $rootScope, Analytics) {
                            spyOn(Analytics, 'registerPageTrack').andCallFake(function () {
                            });
                            scope.$on('$routeChangeSuccess', function () {
                                expect(Analytics.registerPageTrack).toHaveBeenCalled();
                                expect(Analytics.registerPageTrack.argsForCall[0][0]).toBe('HomePage');
                            });

                            $location.path('/home');
                            $rootScope.$digest();
                        }));

                    });
                    
                    describe('When going visiting /home/tab1', function() {
                        it('renderPath should be updated', inject(function ($controller, $route, $routeParams, $location, $rootScope) {
                            expect($route.current).toBeUndefined();
                            scope.$on('$routeChangeSuccess', function () {
                                expect(scope.renderPath[0]).toBe('home');
                                expect(scope.renderPath[1]).toBe('default');
                                expect(scope.renderPath[2]).toBe('tab1');
                            });

                            $location.path('/home/tab1');
                            $rootScope.$digest();
                        }));
                    });

                    describe('When visiting a page which is not a favourites page', function () {
                        it('isFavouritePage should be false', inject(function ($location) {
                            $location.path('/home/tab1');
                            scope.$root.$digest();

                            expect(scope.isFavouritePage).toBe(false);
                        }));
                    });
                    
                    describe('When visiting a favourite page', function() {
                        it('isFavouritePage should be true', inject(function ($location) {
                            $location.path('/favourites');
                            scope.$root.$digest();

                            expect(scope.isFavouritePage).toBe(true);
                        }));
                    });
                    
                    describe('When navigating to unknown path', function () {
                        it('it should redirect to default', inject(function ($controller, $route, $routeParams, $location, $rootScope, Analytics) {
                            var scopeRedirectIndex = 0;
                            spyOn(Analytics, 'registerPageTrack').andCallFake(function () {
                            });
                            expect($route.current).toBeUndefined();
                            scope.$on('$routeChangeSuccess', function () {
                                if (scopeRedirectIndex === 0) {
                                    expect(scope.renderPath.length).toBe(0);
                                }
                                if (scopeRedirectIndex === 1) {
                                    expect(scope.renderPath.length).toBe(2);
                                    expect(scope.renderPath[0]).toBe('home');
                                    expect(scope.renderPath[1]).toBe('default');
                                }
                                if (scopeRedirectIndex === 2) {
                                    throw 'Should call only 2 times.';
                                }
                                scopeRedirectIndex = scopeRedirectIndex + 1;
                            });
                            $location.path('/aaaaaaaaaaaaaaaaaaaaaaa/test/');
                            $rootScope.$digest();
                        }));
                    });
                    
                });
            });
});