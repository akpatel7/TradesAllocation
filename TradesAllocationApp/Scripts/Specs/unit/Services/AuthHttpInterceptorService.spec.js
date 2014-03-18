define(['App/Services/AuthHttpInterceptorService',
        'angular',
        'mocks',
        'App/Services/services'], function (AuthHttpInterceptorService) {
            describe('HttpInterceptor', function () {
                var $httpBackend,
                    currentUrl,
                    scope;
                
                angular.module('RedirectService.Spec.Config', []).service('redirectService', function () {
                    return {
                        logout: function() {
                            currentUrl = 'http://some.url/logout';
                        },
                        forbidden: function() {
                            currentUrl = 'http://some.url/forbidden';
                        },
                        unauthorised: function() {
                            currentUrl = 'http://some.url/unauthorised';
                        }
                    };
                });

                beforeEach(function () {
                    module('App');
                    module('RedirectService.Spec.Config');
                });
                
                beforeEach(inject(function (_$httpBackend_, $rootScope) {
                    scope = $rootScope;
                    currentUrl = '';
                    $httpBackend = _$httpBackend_;
                    
                    $httpBackend.whenGET('/give-me-a-401')
                           .respond(401, 'Unauthorized');
                    
                    $httpBackend.whenGET('/give-me-a-403')
                           .respond(403, 'Forbidden');
                   
                }));

                afterEach(function() {
                    $httpBackend.verifyNoOutstandingExpectation();
                    $httpBackend.verifyNoOutstandingRequest();
                });
                
                describe('Given we have an http interceptor', function() {

                    describe('When making a forbidden request', function() {
                        it('It should result in a redirect to the forbidden URL', inject(function ($http, $location, $window) {
                            $http({
                                url: '/give-me-a-403',
                                method: 'GET'
                            });
                            $httpBackend.flush();
                            expect(currentUrl).toBe('http://some.url/forbidden');
                        }));
                    });
                    
                    describe('When making an unauthorized request', function () {
                        it('It should result in a redirect to the unauthorised URL (login page)', inject(function ($http, $location, $window) {
                            $http({
                                url: '/give-me-a-401',
                                method: 'GET'
                            });

                            $httpBackend.flush();
                            expect(currentUrl).toBe('http://some.url/unauthorised');
                        }));
                    });
                });

            });
        });