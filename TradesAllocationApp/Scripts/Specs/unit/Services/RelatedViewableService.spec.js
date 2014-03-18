define(['underscore',
        'App/Services/RelatedViewableService',
        'angular',
        'mocks',
        'App/Services/services'], function(_) {
            describe('Related Viewables Service', function() {
                beforeEach(function() {
                    this.addMatchers({
                        toEqualData: function(expected) {
                            return angular.equals(this.actual, expected);
                        }
                    });
                });
                describe('Given we have a Related Viewables Service', function() {
                    var scope,
                        $httpBackend,
                        templatedEndpointUrl = 'http://localhost/api',
                        expectedData;
                    
                    function promiseOf(stubResult) {
                        return {
                            then: function (callback) {
                                return promiseOf(callback(stubResult));
                            }
                        };
                    }

                    angular.module('RelatedViewableService.spec', [])
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
                        module('RelatedViewableService.spec');
                    });
                    
                    beforeEach(function () {
                        expectedData = {
                            '@graph': [{
                                "@id": "http://myview.com.viewable1_1"
                            }]
                        };
                    });

                    describe('When we get the related viewables', function () {
                        describe('And the server returns some data', function() {
                            beforeEach(inject(function (_$httpBackend_, $rootScope) {
                                $httpBackend = _$httpBackend_;

                                $httpBackend.expectGET(templatedEndpointUrl)
                                            .respond(expectedData);
                                scope = $rootScope;
                            }));

                            it('related viewables should be returned', inject(function(RelatedViewable) {
                                RelatedViewable.getRelatedViewables().then(function (data) {
                                    expect(data).toEqualData(expectedData);
                                });
                                scope.$root.$digest();
                                $httpBackend.flush();
                            }));
                            
                            afterEach(function() {
                                $httpBackend.verifyNoOutstandingExpectation();
                                $httpBackend.verifyNoOutstandingRequest();
                            });
                        });


                        it('Should pass the right parameters', inject(function (RelatedViewable, DataEndpoint, $q) {
                            var args;
                            
                            spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallFake(function() {
                                var deferred = $q.defer();
                                deferred.resolve(expectedData);
                                return deferred.promise;
                            });

                            RelatedViewable.getRelatedViewables({ relatedTo: 'http://myview.com/viewable1' })
                                .then(function(data) {
                                    expect(data).toEqualData(expectedData);
                                });
                            scope.$root.$digest();

                            args = DataEndpoint.getTemplatedEndpoint.argsForCall[0][1];
                            expect(args[0].key).toBe('relatedTo');
                            expect(args[0].value).toBe('http://myview.com/viewable1');
                        }));

                    });

                });
            });
        });