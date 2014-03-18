define(['underscore',
        'App/Services/ViewEvolutionService',
        'angular',
        'mocks',
        'App/Services/services'], function(_) {
            describe('View Evolution Service', function() {
                beforeEach(function() {
                    this.addMatchers({
                        toEqualData: function(expected) {
                            return angular.equals(this.actual, expected);
                        }
                    });
                });
                describe('Given we have a View Evolution Service', function() {
                    var scope,
                        $httpBackend,
                        templatedEndpointUrl = 'http://localhost/api';
                    
                    function promiseOf(stubResult) {
                        return {
                            then: function (callback) {
                                return promiseOf(callback(stubResult));
                            }
                        };
                    }

                    angular.module('ViewEvolutionService.spec', [])
                        .service('DataEndpoint', ['$q', function() {
                            return {
                                getEndpoint: function() {
                                    return promiseOf(templatedEndpointUrl);
                                },
                                getTemplatedEndpoint: function() {
                                    return promiseOf(templatedEndpointUrl);
                                },
                                internaliseApiUrl: function(url) {
                                    return url;
                                }
                            };
                        }]);
                    
                    beforeEach(function () {
                        module('App');
                        module('ViewEvolutionService.spec');
                    });
                    
                    describe('When we get the evolved views', function() {
                        describe('And the server returns some data', function() {
                            var expectedData = { 
                                "@id" : "http://myview.com.view1"
                            };
                            beforeEach(inject(function (_$httpBackend_, $rootScope) {
                                $httpBackend = _$httpBackend_;

                                $httpBackend.expectGET(templatedEndpointUrl)
                                            .respond(expectedData);
                                scope = $rootScope;
                            }));

                            afterEach(function() {
                                $httpBackend.verifyNoOutstandingExpectation();
                                $httpBackend.verifyNoOutstandingRequest();
                            });
                            it('views should be returned', inject(function(ViewEvolution) {
                                ViewEvolution.getViewEvolution().then(function (data) {
                                    expect(data).toEqualData(expectedData);
                                });
                                scope.$root.$digest();
                                $httpBackend.flush();
                            }));
                        });


                        it('Should pass the right parameters', inject(function (ViewEvolution, DataEndpoint, $q) {
                            var args;
                            spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallFake(function() {
                                var deferred = $q.defer();
                                deferred.resolve({});
                                return deferred.promise;
                            });

                            ViewEvolution.getViewEvolution({ uri: 'http://myview.com.view1', restrictToLatestInactiveEvolution: false }).then(function () {
                            });
                            scope.$root.$digest();

                            args = DataEndpoint.getTemplatedEndpoint.argsForCall[0][1];
                            expect(args[0].key).toBe('uri');
                            expect(args[0].value).toBe('http://myview.com.view1');
                            expect(args[1].key).toBe('restrictToLatestInactiveEvolution');
                            expect(args[1].value).toBe(false);
                        }));

                    });

                });
            });
        });