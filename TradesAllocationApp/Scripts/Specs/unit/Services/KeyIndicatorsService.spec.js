define(['underscore',
        'App/Services/KeyIndicatorsService',
        'angular',
        'mocks',
        'App/Services/services'], function(_) {
            describe('Key Indicators Service', function() {
                beforeEach(function() {
                    this.addMatchers({
                        toEqualData: function(expected) {
                            return angular.equals(this.actual, expected);
                        }
                    });
                });
                describe('Given we have a Key Indicators Service', function () {
                    
                    var scope,
                        $httpBackend,
                        templatedEndpointUrl = 'http://localhost/api',
                        multipleIndicators,
                        singleIndicator;
                    
                    function promiseOf(stubResult) {
                        return {
                            then: function (callback) {
                                return promiseOf(callback(stubResult));
                            }
                        };
                    }

                    angular.module('KeyIndicatorsService.spec', [])
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
                        module('KeyIndicatorsService.spec');
                    });
                    

                    beforeEach(function () {
                        singleIndicator = {
                            indicators: {
                                indicator: {
                                    name: 'BCA U.S. SPECULATION INDEX',
                                    published: "/Date(-62135596800000)/",
                                    value: '1.4396',
                                    trend: '-0.056',
                                    viewable: {
                                    _resource: 'http://myview.com/viewable1',
                                    service: {
                                                _resource: 'http://data.emii.com/bca/services/ces'
                                             }
                                            
                                        }
                                    }
                                }
                        };
                        multipleIndicators = {
                            indicators: {
                                indicator: [
                                    {
                                        name: 'BCA U.S. SPECULATION INDEX',
                                        published: "/Date(-62135596800000)/",
                                        value: '1.4396',
                                        trend: '-0.056',
                                        viewable: {
                                            _resource: 'http://myview.com/viewable1',
                                            service: {
                                                         _resource: 'http://data.emii.com/bca/services/ces'
                                                     }
                                            
                                        }
                                    },
                                    {
                                        name: 'U.S. S&#38;P 500',
                                        published: "/Date(-62135596800000)/",
                                        value: '1786',
                                        trend: '24.81',
                                        viewable: {
                                            _resource: 'http://myview.com/viewable1',
                                            service: [
                                                    {
                                                        _resource: 'http://data.emii.com/bca/services/bca'
                                                    },
                                                    {
                                                        _resource: 'http://data.emii.com/bca/services/ces'
                                                    }
                                            ]
                                        }
                                    }
                                ],
                                totalResults: '12'
                            }                          
                        };
                    });

                    describe('When we get the indicators', function () {
                        describe('And the user has the CHART token', function() {
                            beforeEach(inject(function (UserService) {
                                spyOn(UserService, 'isCurrentUserAuthorisedToSeeCharts').andReturn({
                                    then: function (expression) {
                                        return expression(true);
                                    }
                                });
                            }));
                            beforeEach(inject(function ($rootScope, _$httpBackend_) {
                                scope = $rootScope.$new();
                                $httpBackend = _$httpBackend_;
                            }));

                            it('Should pass the right parameters', inject(function (KeyIndicators, DataEndpoint, $q) {
                                spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallFake(function () {
                                    var deferred = $q.defer();
                                    deferred.resolve({});
                                    return deferred.promise;
                                });
                                KeyIndicators.get({ viewable: 'http://data.emii.com/viewable1' })
                                    .then(function (data) { });
                                
                                expect(DataEndpoint.getTemplatedEndpoint).toHaveBeenCalledWith(['charts', 'indicators'], [
                                    { key: 'viewable', value: 'http://data.emii.com/viewable1' },
                                    { key: 'page', value: 1 },
                                    { key: 'pageSize', value: 10 }
                                ]);
                            }));

                            it('Should support pagination', inject(function (KeyIndicators, DataEndpoint, $q) {
                                spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallFake(function () {
                                    var deferred = $q.defer();
                                    deferred.resolve({});
                                    return deferred.promise;
                                });

                                KeyIndicators.get(
                                    {
                                        viewable: 'http://data.emii.com/viewable1',
                                        page: 2,
                                        pageSize: 30
                                    })
                                    .then(function (data) { });

                                expect(DataEndpoint.getTemplatedEndpoint).toHaveBeenCalledWith(['charts', 'indicators'], [
                                    { key: 'viewable', value: 'http://data.emii.com/viewable1' },
                                    { key: 'page', value: 2 },
                                    { key: 'pageSize', value: 30 }
                                ]);
                            }));

                            describe('And the server returns a single indicator', function () {
                                beforeEach(function () {
                                    $httpBackend.expectGET(templatedEndpointUrl)
                                                .respond(singleIndicator);

                                });
                                it('indicators should be returned', inject(function (KeyIndicators) {
                                    KeyIndicators.get().then(function (data) {
                                        expect(data.indicators.length).toBe(1);
                                    });
                                    scope.$root.$digest();
                                    $httpBackend.flush();
                                }));


                                afterEach(function () {
                                    $httpBackend.verifyNoOutstandingExpectation();
                                    $httpBackend.verifyNoOutstandingRequest();
                                });
                            });

                            describe('And the server returns multiple indicators', function () {
                                beforeEach(function () {
                                    $httpBackend.expectGET(templatedEndpointUrl)
                                                .respond(multipleIndicators);
                                });

                                it('indicators should be returned', inject(function (KeyIndicators) {
                                    KeyIndicators.get().then(function (data) {
                                        expect(data.indicators.length).toBe(2);
                                    });
                                    scope.$root.$digest();
                                    $httpBackend.flush();
                                }));
                                it('indicators going down should have the flag up set to false', inject(function (KeyIndicators) {
                                    KeyIndicators.get().then(function (data) {
                                        expect(data.indicators[0].isUp).toBe(false);
                                    });
                                    scope.$root.$digest();
                                    $httpBackend.flush();
                                }));
                                it('indicators going up should have the flag up set to true', inject(function (KeyIndicators) {
                                    KeyIndicators.get().then(function (data) {
                                        expect(data.indicators[1].isUp).toBe(true);
                                    });
                                    scope.$root.$digest();
                                    $httpBackend.flush();
                                }));
                                it('services should always be an array', inject(function (KeyIndicators) {
                                    KeyIndicators.get().then(function (data) {
                                        expect(data.indicators[0].viewable.service.length).toBe(1);
                                        expect(data.indicators[1].viewable.service.length).toBe(2);
                                    });
                                    scope.$root.$digest();
                                    $httpBackend.flush();
                                }));

                                it('totalCount should be returned', inject(function (KeyIndicators) {
                                    KeyIndicators.get().then(function (data) {
                                        expect(data.totalCount).toBe(12);
                                    });
                                    scope.$root.$digest();
                                    $httpBackend.flush();
                                }));


                                it('formatted services should be CES, BCA', inject(function (KeyIndicators) {
                                    KeyIndicators.get().then(function (data) {
                                        expect(data.indicators[0].formattedServices).toBe('CES');
                                        expect(data.indicators[1].formattedServices).toBe('BCA, CES');
                                    });
                                    scope.$root.$digest();
                                    $httpBackend.flush();
                                }));
                                afterEach(function () {
                                    $httpBackend.verifyNoOutstandingExpectation();
                                    $httpBackend.verifyNoOutstandingRequest();
                                });
                            });
                        });
                        describe('And the user doesnt have the CHART token', function () {
                            beforeEach(inject(function (UserService) {
                                spyOn(UserService, 'isCurrentUserAuthorisedToSeeCharts').andReturn({
                                    then: function (expression) {
                                        return expression(true);
                                    }
                                });
                            }));

                            it('should return no indicators', inject(function (KeyIndicators) {
                                KeyIndicators.get().then(function (data) {
                                    expect(data.indicators.length).toBe(0);
                                });
                                scope.$root.$digest();
                            }));
                        });
                    });
                    
                  

                });
            });
        });