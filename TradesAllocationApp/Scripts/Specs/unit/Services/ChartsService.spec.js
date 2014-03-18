define(['underscore',
        'App/Services/ChartsService',
        'angular',
        'mocks'], function(_) {
            describe('Views Service', function() {
                describe('Given we have a charts Service', function () {
                    var scope,
                        $httpBackend,
                        serverData,
                        endpointUrl = 'http://localhost/api/charts';

                    beforeEach(function () {
                        module('App');
                    });

                    describe('When we get a chart', function () {
                        var userData = {
                                "_id": "rohit.modi",
                                "account": {
                                    "_id": "rohit.modi",
                                    "accessTokens": {
                                        "_code": "0",
                                        "token": [
                                            {
                                                "_expires": "/Date(4073362584000)/",
                                                "_product": "BCA",
                                                "_subscription": "paid"
                                            },
                                            {
                                                "_expires": "/Date(4073362584000)/",
                                                "_product": "CHART",
                                                "_subscription": "paid"
                                            }
                                        ]
                                    },
                                    "manager": {
                                        "email": null,
                                        "name": null,
                                        "tel": null
                                    }
                                },
                                "email": "rohit.modi@skytowers.com",
                                "forename": "Rohit",
                                "groups": {
                                    "group": {
                                        "_id": "7363",
                                        "_name": "Outsourced Research"
                                    }
                                },
                                "link": {
                                    "_href": "http://isis.delphi11.euromoneydigital.com/users/rohit.modi/inbox",
                                    "_rel": "inbox"
                                },
                                "location": {
                                    "city": "Hogeye",
                                    "code": "17027-0312",
                                    "country": "United States of America"
                                },
                                "organization": {
                                    "_id": "7363",
                                    "name": "Outsourced Research"
                                },
                                "salutation": null,
                                "surname": "Modi"
                        };
                        beforeEach(inject(function (UserService) {
                            spyOn(UserService, 'getCurrentUser').andReturn({
                                then: function (expression) {
                                    return expression(userData);
                                }
                            });
                        }));

                        describe('When the chart exists', function() {
                            beforeEach(inject(function (_$httpBackend_, $rootScope, DataEndpoint, $q) {
                                serverData = {
                                    chart: {
                                        _id: 'chartid'
                                    }
                                };
                                $httpBackend = _$httpBackend_;

                                scope = $rootScope.$new();
                                spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallFake(function () {
                                    var deferred = $q.defer();
                                    deferred.resolve(endpointUrl);
                                    return deferred.promise;
                                });
                                $httpBackend.expectGET(endpointUrl)
                                  .respond(serverData);
                            }));

                            it('should pass the right parameters to the endpoint', inject(function (DataEndpoint, Charts) {
                                Charts.getChart({
                                    id: 'ChartId'
                                }).then(function () {
                                });
                                scope.$root.$digest();
                                $httpBackend.flush();
                                expect(DataEndpoint.getTemplatedEndpoint).toHaveBeenCalledWith(['charts', 'chart'], [
                                    {
                                        key: 'id',
                                        value: 'ChartId'
                                    }
                                ]
                                );
                            }));

                            it('should return the chart data', inject(function (DataEndpoint, Charts) {
                                Charts.getChart({
                                    id: 'ChartId'
                                }).then(function (data) {
                                    expect(data).toEqual({
                                        _id: 'chartid'
                                    });
                                });

                                scope.$root.$digest();
                                $httpBackend.flush();
                            }));
                        });

                        describe('When the chart doesnt exist', function() {
                            beforeEach(inject(function (_$httpBackend_, $rootScope, DataEndpoint, $q) {
                                serverData = {
                                    chart: {
                                        _id: 'chartid'
                                    }
                                };
                                $httpBackend = _$httpBackend_;

                                scope = $rootScope.$new();
                                spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallFake(function () {
                                    var deferred = $q.defer();
                                    deferred.resolve(endpointUrl);
                                    return deferred.promise;
                                });
                                $httpBackend.whenGET(endpointUrl)
                                  .respond(404, 'There is no document at ' + endpointUrl);
                            }));

                            it('should reject the promise', inject(function(Charts) {
                                var listener = jasmine.createSpy('listener');
                                Charts.getChart({
                                    id: 'ChartId'
                                }).then(function() {
                                }, listener);
                                scope.$root.$digest();
                                $httpBackend.flush();
                                expect(listener).toHaveBeenCalled();
                            }));
                        });
                    });

                    describe('Given the user doesnt have the CHART token', function() {
                        var userData = {
                            "_id": "rohit.modi",
                            "account": {
                                "_id": "rohit.modi",
                                "accessTokens": {
                                    "_code": "0",
                                    "token": [
                                        {
                                            "_expires": "/Date(4073362584000)/",
                                            "_product": "BCA",
                                            "_subscription": "paid"
                                        },
                                        {
                                            "_expires": "/Date(4073362584000)/",
                                            "_product": "CIS",
                                            "_subscription": "paid"
                                        }
                                    ]
                                },
                                "manager": {
                                    "email": null,
                                    "name": null,
                                    "tel": null
                                }
                            },
                            "email": "rohit.modi@skytowers.com",
                            "forename": "Rohit",
                            "groups": {
                                "group": {
                                    "_id": "7363",
                                    "_name": "Outsourced Research"
                                }
                            },
                            "link": {
                                "_href": "http://isis.delphi11.euromoneydigital.com/users/rohit.modi/inbox",
                                "_rel": "inbox"
                            },
                            "location": {
                                "city": "Hogeye",
                                "code": "17027-0312",
                                "country": "United States of America"
                            },
                            "organization": {
                                "_id": "7363",
                                "name": "Outsourced Research"
                            },
                            "salutation": null,
                            "surname": "Modi"
                            
                        };
                        beforeEach(inject(function (UserService, _$httpBackend_) {
                            spyOn(UserService, 'getCurrentUser').andReturn({
                                then: function(expression) {
                                    return expression(userData);
                                }
                            });
                            $httpBackend = _$httpBackend_;
                        }));

                        describe('When trying to get a chart', function () {
                            it('should reject the request', inject(function (Charts, $rootScope) {
                                var failed = false;
                                Charts.getChart({
                                    id: 'http://data.emii.com/chartId'
                                }).then(function() {
                                    failed = false;
                                }, function () {
                                    failed = true;
                                });
                                $rootScope.$digest();
                                
                                expect(failed).toBe(true);
                            }));
                        });

                    });
                   
                });

            });
        });