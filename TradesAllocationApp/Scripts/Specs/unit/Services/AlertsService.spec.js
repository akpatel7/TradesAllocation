define(['underscore',
        'App/Services/AlertsService',
        'angular',
        'mocks',
        'App/Services/services'], function(_) {
            describe('Alerts Service', function() {
                beforeEach(function() {
                    this.addMatchers({
                        toEqualData: function(expected) {
                            return angular.equals(this.actual, expected);
                        }
                    });
                });
                describe('Given we have a Alerts Service', function () {
                    var scope,
                         $httpBackend,
                         expectedData,
                         endpointUrl = 'http://localhost/api/users/current/alerts',
                         userEndpointUrl = 'http://localhost/api/users/user.id/alerts';

                    function promiseOf(stubResult) {
                        return {
                            then: function (callback) {
                                return promiseOf(callback(stubResult));
                            }
                        };
                    }

                    angular.module('AlertsService.spec', [])
                        .service('DataEndpoint', ['$q', function ($q) {
                            return {
                                getTemplatedEndpoint: function () {
                                    var deferred = $q.defer();
                                    deferred.resolve(endpointUrl);
                                    return deferred.promise;
                                },
                                internaliseApiUrl: function (url) {
                                    return url;
                                }
                            };
                        }]);
                    
                    beforeEach(function () {
                        module('App');
                        module('AlertsService.spec');
                    });

                    describe('When we get a user\'s alerts', function () {
                        describe('And the server returns some data', function () {
                            expectedData = [
                                    {
                                        'Timestamp': '2013-11-06T13:52:15.45',
                                        'Originator': null,
                                        'Description': 'Commodity & Energy Strategy: China Economy has created a new strategic view. Click here to view.',
                                        'ResourceLink': 'http://data.emii.com/bca/views/create-conflict',
                                        'Id': 30,
                                        'UserId': 'rohit.modi',
                                        'ProcessedTimestamp': '2013-11-06T13:53:00.2',
                                        'ViewableResourceLink': 'http://dashboard.delphidev.euromoneydigital.com/#/views?uri=http%3a%2f%2fdata.emii.com%2feconomies%2fchn'
                                    },
                                    {
                                        'Timestamp': '2013-11-06T13:52:17.633',
                                        'Originator': null,
                                        'Description': 'Commodity & Energy Strategy: China Economy is creating a conflict. Click here to view.',
                                        'ResourceLink': 'http://data.emii.com/bca/views/create-conflict',
                                        'Id': 31,
                                        'UserId': 'rohit.modi',
                                        'ProcessedTimestamp': '2013-11-06T13:53:00.2',
                                        'ViewableResourceLink': 'http://dashboard.delphidev.euromoneydigital.com/#/views?uri=http%3a%2f%2fdata.emii.com%2feconomies%2fchn'
                                    },
                                    {
                                        'Timestamp': '2013-11-06T14:02:15.72',
                                        'Originator': null,
                                        'Description': 'Commodity & Energy Strategy: view on China Economy has recently been updated. Click here to view.',
                                        'ResourceLink': 'http://data.emii.com/bca/views/create-conflict-e1',
                                        'Id': 32,
                                        'UserId': 'rohit.modi',
                                        'ProcessedTimestamp': '2013-11-06T14:03:00.16',
                                        'ViewableResourceLink': 'http://dashboard.delphidev.euromoneydigital.com/#/views?uri=http%3a%2f%2fdata.emii.com%2feconomies%2fchn'
                                    }
                            ];

                            beforeEach(inject(function (_$httpBackend_, $rootScope) {
                                $httpBackend = _$httpBackend_;

                                $httpBackend.expectGET(endpointUrl)
                                    .respond(null, { 'Location': userEndpointUrl });

                                scope = $rootScope.$new();
                            }));

                            it('Should pass default pagination', inject(function (Alerts, DataEndpoint) {
                                spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallThrough();
                                Alerts.getAlerts();
                                expect(DataEndpoint.getTemplatedEndpoint).toHaveBeenCalledWith(['users', 'alert-history'], [
                                    {
                                        key: 'page',
                                        value: 0
                                    }, {
                                        key: 'pageSize',
                                        value: 10
                                    }
                                ]);
                            }));
                            
                            it('Should pass pagination values', inject(function (Alerts, DataEndpoint) {
                                spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallThrough();
                                Alerts.getAlerts({
                                    page: 1,
                                    pageSize: 20
                                });
                                expect(DataEndpoint.getTemplatedEndpoint).toHaveBeenCalledWith(['users', 'alert-history'], [
                                    {
                                        key: 'page',
                                        value: 1
                                    }, {
                                        key: 'pageSize',
                                        value: 20
                                    }
                                ]);
                            }));
                            
                            it('Should return expected user alerts', inject(function (Alerts) {
                                Alerts.getAlerts().then(function (data) {
                                    expect(data).toEqualData(expectedData);
                                });
                            }));
                        });
                    });

                    describe('When we mark an alert as read', function() {
                        beforeEach(inject(function(_$httpBackend_) {
                            $httpBackend = _$httpBackend_;
                            // Expect to get a redirect response from '/users/current/alerts' to '/users/User.Id/alerts'
                            $httpBackend.expect('GET', endpointUrl).respond(278, {}, { Location: userEndpointUrl });
                        }));

                        it('Should post the alerts for partial read', inject(function(Alerts) {
                            var responseSuccess = false,
                                request = {
                                    ids: [1, 2]
                                };
                            $httpBackend.expectPUT(userEndpointUrl + '?isFullyRead=false', request).respond(204, {});

                            Alerts.markAlertsAsRead([1, 2]).then(function () {
                                responseSuccess = true;
                            });

                            $httpBackend.flush();
                            expect(responseSuccess).toBe(true);
                        }));

                        it('Should post the alerts for full read', inject(function (Alerts) {
                            var responseSuccess = false,
                                request = {
                                    ids: [3, 7]
                                };

                            $httpBackend.expectPUT(userEndpointUrl + '?isFullyRead=true', request).respond(204, {});

                            Alerts.markAlertsAsFullyRead([3, 7]).then(function (data) {
                                responseSuccess = true;
                            });

                            $httpBackend.flush();
                            expect(responseSuccess).toBe(true);
                        }));
                    });
                    
                    describe('When we mark all the alerts as read', function () {
                        beforeEach(inject(function (_$httpBackend_) {
                            $httpBackend = _$httpBackend_;
                            // Expect to get a redirect response from '/users/current/alerts' to '/users/User.Id/alerts'
                            $httpBackend.expect('GET', endpointUrl).respond(278, {}, { Location: userEndpointUrl });
                        }));

                        it('Should post the alerts for partial read', inject(function (Alerts) {
                            var responseSuccess = false,
                                request = {
                                    ids: []
                                };
                            $httpBackend.expectPUT(userEndpointUrl + '?isFullyRead=false', request).respond(204, {});

                            Alerts.markAllAlertsAsRead().then(function () {
                                responseSuccess = true;
                            });

                            $httpBackend.flush();
                            expect(responseSuccess).toBe(true);
                        }));
                        
                        it('Should post the alerts for full read', inject(function (Alerts) {
                            var responseSuccess = false,
                                request = {
                                    ids: []
                                };
                            $httpBackend.expectPUT(userEndpointUrl + '?isFullyRead=true', request).respond(204, {});

                            Alerts.markAllAlertsAsFullyRead().then(function () {
                                responseSuccess = true;
                            });

                            $httpBackend.flush();
                            expect(responseSuccess).toBe(true);
                        }));
                    });
                                   
                });
        });
    });