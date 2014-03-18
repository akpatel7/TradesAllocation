define(['App/Services/HttpInterceptorService',
        'angular',
        'mocks',
        'route',
        'App/Services/services'], function (HttpInterceptorService, config, IsisConsumerId) {
            describe('HttpInterceptor', function () {
                var $httpBackend,
                    scope;
                
                beforeEach(function () {
                    module('ngRoute');
                    module('App');
                });
              
                beforeEach(inject(function (_$httpBackend_, $rootScope) {
                    scope = $rootScope;
                    $httpBackend = _$httpBackend_;
                    $httpBackend.whenGET('/give-me-a-200')
                            .respond(200, 'success');
                    
                    $httpBackend.whenGET('/give-me-a-500')
                           .respond(500, 'error');

                    $httpBackend.whenGET(config.clientServicePath + 'my-isis-request')
                           .respond(200, 'success');

                }));

                afterEach(function() {
                    $httpBackend.verifyNoOutstandingExpectation();
                    $httpBackend.verifyNoOutstandingRequest();
                });
                
                describe('Given we have an http interceptor', function() {
                    describe('When making a successful request', function () {
                        it('Should trigger request:started when sending, and request:ended', inject(function ($http) {
                            var requestStartedListener = jasmine.createSpy('listener'),
                                requestEndedListener = jasmine.createSpy('listener');
                            scope.$on('request:started', requestStartedListener);
                            scope.$on('request:ended', requestEndedListener);
                            
                            $http({
                                url: '/give-me-a-200',
                                method: 'GET'
                            });

                            $httpBackend.flush();
                            
                            expect(requestStartedListener).toHaveBeenCalled();                            
                            expect(requestEndedListener).toHaveBeenCalled();
                        }));
                    });
                    
                    describe('When making an unsucessful request', function () {
                        it('Should trigger request:started when sending, and request:ended', inject(function ($http) {
                            var requestStartedListener = jasmine.createSpy('listener'),
                                requestEndedListener = jasmine.createSpy('listener');
                            scope.$on('request:started', requestStartedListener);
                            scope.$on('request:ended', requestEndedListener);

                            $http({
                                url: '/give-me-a-500',
                                method: 'GET'
                            });

                            $httpBackend.flush();
                            
                            expect(requestStartedListener).toHaveBeenCalled();                            
                            expect(requestEndedListener).toHaveBeenCalled();
                        }));

                        describe('When making a request to ISIS', function () {
                            it('Should add the consumer id header to the request', inject(function ($http) {
                                var consumerIdHeader;
                                $http({
                                    url: config.clientServicePath + 'my-isis-request',
                                    method: 'GET',
                                    transformResponse: function (data, headersGetter) {
                                        consumerIdHeader = headersGetter()["Consumer-Id"];
                                    }
                                });

                                $httpBackend.flush();
                                expect(consumerIdHeader).toBe(IsisConsumerId);
                            }));
                        });

                    });
                });

            });
        });