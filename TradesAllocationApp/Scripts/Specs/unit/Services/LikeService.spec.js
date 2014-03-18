define(['underscore',
        'App/Services/LikeService',
        'angular',
        'mocks',
        'App/Services/services'], function(_) {
            describe('Like Service', function() {
                beforeEach(function() {
                    this.addMatchers({
                        toEqualData: function(expected) {
                            return angular.equals(this.actual, expected);
                        }
                    });
                });
                describe('Given we have a Like Service', function() {
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

                    angular.module('LikeService.spec', [])
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
                        module('LikeService.spec');
                    });

                    describe('When I vote for a resource', function() {
                        var $httpBackend;

                        beforeEach(inject(function(_$httpBackend_) {
                            $httpBackend = _$httpBackend_;
                        }));
                        
                        it('should put the correct "like" doc', inject(function (Like) {
                            $httpBackend.expectPUT(templatedEndpointUrl, 'like').respond(204, '');
                            Like.like('blob', 'someid', "like");
                        }));

                        it('should put the correct "dislike" doc', inject(function(Like) {
                            $httpBackend.expectPUT(templatedEndpointUrl, 'dislike').respond(204, '');
                            Like.like('blob', 'someid', "dislike");
                        }));
                    });
                    
                    describe('When we get the aggregate count of likes', function() {
                        describe('And the server returns some data', function() {
                            var expectedData = { 
                                count: 3
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
                            it('count should be returned', inject(function(Like) {
                                Like.getAggregatedLikeCount().then(function(data) {
                                    expect(data).toEqualData(expectedData);
                                });
                                scope.$root.$digest();
                                $httpBackend.flush();
                            }));
                        });


                        it('Should pass the right parameters', inject(function(Like, DataEndpoint, $q) {
                            spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallFake(function() {
                                var deferred = $q.defer();
                                deferred.resolve({});
                                return deferred.promise;
                            });

                            Like.getAggregatedLikeCount('view', 'xyz').then(function() {
                            });
                            scope.$root.$digest();

                            expect(DataEndpoint.getTemplatedEndpoint).toHaveBeenCalledWith('likes', [
                                   { key: 'resourceType', value: 'view' },
                                   { key: 'resourceId', value: 'xyz' },
                                   { key: 'status', value: 'like' }
                            ]);
                        }));

                    });

                    describe('When we get the aggregate count of likes', function() {

                        it('Should pass the right parameters', inject(function(Like, DataEndpoint, $q) {
                            spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallFake(function() {
                                var deferred = $q.defer();
                                deferred.resolve({});
                                return deferred.promise;
                            });

                            Like.getAggregatedDislikeCount('view', 'xyz').then(function() {
                            });
                            scope.$root.$digest();

                            expect(DataEndpoint.getTemplatedEndpoint).toHaveBeenCalledWith('likes', [
                                     { key: 'resourceType', value: 'view' },
                                     { key: 'resourceId', value: 'xyz' },
                                     { key: 'status', value: 'dislike' }
                            ]);
                         
                        }));

                    });
                    
                    describe('When we get the aggregate count of likes for multiple resources', function () {
                        describe('And the server returns some data', function () {
                            var expectedData = {
                                "OpinionsResults": {
                                    "Results": {
                                        "OpinionResult": [
                                            {
                                                "Count": "3",
                                                "ResourceId": "view_gold_01"
                                            },
                                            {
                                                "Count": "4",
                                                "ResourceId": "view_gold_02"
                                            }
                                        ]
                                    }
                                }
                            };
                            beforeEach(inject(function (_$httpBackend_, $rootScope, DataEndpoint, $q) {
                                $httpBackend = _$httpBackend_;

                                spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallFake(function () {
                                    var deferred = $q.defer();
                                    deferred.resolve(templatedEndpointUrl);
                                    return deferred.promise;
                                });
                                
                                $httpBackend.expectGET(templatedEndpointUrl)
                                            .respond(expectedData);
                                scope = $rootScope;
                            }));

                            afterEach(function () {
                                $httpBackend.verifyNoOutstandingExpectation();
                                $httpBackend.verifyNoOutstandingRequest();
                            });
                            
                            it('Should pass the right parameters', inject(function (Like, DataEndpoint) {
                                Like.getAggregatedLikeCount('view', ['view_gold_01', 'view_gold_02']).then(function () {
                                });
                                scope.$root.$digest();
                                $httpBackend.flush();
                                expect(DataEndpoint.getTemplatedEndpoint).toHaveBeenCalledWith('opinions', [
                                    { key: 'resourceType', value: 'view' },
                                    { key: 'status', value: 'like' },
                                    { key: 'resource', value: ['view_gold_01', 'view_gold_02'] }
                                ]);
                            }));

                            it('should transform the response', inject(function (Like) {
                                var result;
                                Like.getAggregatedLikeCount('view', ['view_gold_01', 'view_gold_02']).then(function (data) {
                                    result = data;
                                });
                                scope.$root.$digest();
                                $httpBackend.flush();
                                expect(result).toEqual({
                                    'view_gold_01': 3,
                                    'view_gold_02': 4
                                });
                            }));
                        });
                    });
                    
                    describe('When we get the aggregate count of likes for an empty list of resources', function () {
                        beforeEach(inject(function (_$httpBackend_, $rootScope, DataEndpoint) {
                            $httpBackend = _$httpBackend_;
                            scope = $rootScope;
                            spyOn(DataEndpoint, 'getTemplatedEndpoint');
                        }));

                        it('Should pass not try to fetch data', inject(function (Like, DataEndpoint) {
                            Like.getAggregatedLikeCount('view', []).then(function () {
                            });
                            scope.$root.$digest();
                            expect(DataEndpoint.getTemplatedEndpoint).not.toHaveBeenCalled();
                        }));

                        it('should return an empty response', inject(function (Like) {
                            var result;
                            Like.getAggregatedLikeCount('view', []).then(function (data) {
                                result = data;
                            });
                            scope.$root.$digest();
                            expect(result).toEqual({});
                        }));
                    });

                });
            });
        });