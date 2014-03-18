define(['underscore',
        'App/Services/UserService',
        'angular',
        'mocks',
        'App/Services/services'], function (_) {
            describe('UserService', function () {
                describe('Given we have a User Service', function () {
                    var scope,
                        $httpBackend,
                        multipleTokensResponse,
                        groupMembers,
                        singleTokenResponse,
                        getEndpoint,
                        endpointUrl = 'http://localhost/api/users/current-user',
                        userEndpointUrl = 'http://localhost/api/users/user.id';
                    
                    beforeEach(function () {
                        module('App');
                    });
                    
                    beforeEach(inject(function ($q) {
                        getEndpoint = function () {
                            var deferred = $q.defer();
                            deferred.resolve(endpointUrl);
                            return deferred.promise;
                        };
                    }));

                    beforeEach(function() {
                        multipleTokensResponse = {
                            "user": {
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
                            }
                        };
                        
                        groupMembers = {
                            "users": {
                                "link": {
                                    "_href_template": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/users/{id}",
                                    "_rel": "user"
                                },
                                "user": [
                                    {
                                        "_email": "Amy.Moreton@SkyTowers.com",
                                        "_forename": "Amy",
                                        "_href": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/users/amy.moreton",
                                        "_id": "amy.moreton",
                                        "_surname": "Moreton"
                                    },
                                    {
                                        "_email": "Melanie.Michaels@GraveDiggers.co.uk",
                                        "_forename": "Melanie",
                                        "_href": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/users/melanie.michaels",
                                        "_id": "melanie.michaels",
                                        "_surname": "Michaels"
                                    },
                                    {
                                        "_email": "Rohit.Modi@SkyTowers.com",
                                        "_forename": "Rohit",
                                        "_href": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/users/rohit.modi",
                                        "_id": "rohit.modi",
                                        "_surname": "Modi"
                                    }
                                ]
                            }
                        };

                        
                        singleTokenResponse = {
                            "user": {
                                "_id": "rohit.modi",
                                "account": {
                                    "_id": "rohit.modi",
                                    "accessTokens": {
                                        "_code": "0",
                                        "token": {
                                            "_expires": "/Date(4073362584000)/",
                                                "_product": "BCA",
                                                "_subscription": "paid"
                                            }
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
                            }
                        };
                    });
                    
                    describe('When we query the service', function () {
                        beforeEach(inject(function (_$httpBackend_, $rootScope, DataEndpoint) {
                            $httpBackend = _$httpBackend_;

                            $httpBackend.expectGET(endpointUrl)
                                .respond(null, { 'Location': userEndpointUrl });
                            
                            $httpBackend.expectGET(userEndpointUrl)
                                .respond(multipleTokensResponse);

                            DataEndpoint.getEndpoint = getEndpoint;
                            
                            scope = $rootScope.$new();
                        }));
                        
                        it('should return user data', inject(function (UserService) {
                            UserService.getCurrentUser().then(function (data) {
                                expect(data['_id']).toBe('rohit.modi');
                            });
                            scope.$root.$digest();
                            $httpBackend.flush();
                        }));
                        
                        describe('When we request current users group members', function () {
                            beforeEach(inject(function (DataEndpoint, $q) {
                                spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallFake(function() {
                                    var deferred = $q.defer();
                                    deferred.resolve('http://someapi/groups/7363/members');
                                    return deferred.promise;
                                });
                                $httpBackend.expectGET('http://someapi/groups/7363/members').respond(groupMembers);
                            }));
                            it('Should return the expected collection of users', inject(function(UserService) {
                                UserService.getCurrentUsersGroupMembers()
                                    .then(function(users) {
                                        expect(users).toEqual(groupMembers.users.user);
                                    });
                            }));
                        });
                    });
                    
                    describe('When we check if user has permission to view charts', function () {
                        describe('When user has permission', function () {
                            beforeEach(inject(function ($rootScope, UserService) {
                                var userData = {
                                    "account": {
                                        "accessTokens": {
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
                                        }
                                    }
                                };
                                spyOn(UserService, 'getCurrentUser')
                                    .andReturn({
                                        then: function(expression) {
                                            return expression(userData);
                                        }
                                    });
                            }));
                            
                            it('should be positive', inject(function (UserService, $rootScope) {
                                var isAuthorised;

                                UserService.isCurrentUserAuthorisedToSeeCharts()
                                    .then(function (result) {
                                        isAuthorised = result;
                                    });
                                
                                $rootScope.$digest();
                                expect(isAuthorised).toBe(true);
                            }));
                        });
                        
                        describe('When user has single permission', function () {
                            beforeEach(inject(function ($rootScope, UserService) {
                                var userData = {
                                    "_id": "rohit.modi",
                                    "account": {
                                        "_id": "rohit.modi",
                                        "accessTokens": {
                                            "_code": "0",
                                            "token": [
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
                                spyOn(UserService, 'getCurrentUser')
                                    .andReturn({
                                        then: function (expression) {
                                            return expression(userData);
                                        }
                                    });
                            }));

                            it('should be positive', inject(function (UserService, $rootScope) {
                                var isAuthorised;

                                UserService.isCurrentUserAuthorisedToSeeCharts()
                                    .then(function (result) {
                                        isAuthorised = result;
                                    });

                                $rootScope.$digest();
                                expect(isAuthorised).toBe(true);
                            }));
                        });
                        
                        describe('When user does not have permission', function () {
                            beforeEach(inject(function ($rootScope, UserService) {
                                var userData = {
                                    "account": {
                                        "accessTokens": {
                                            "token": [
                                                {
                                                    "_expires": "/Date(4073362584000)/",
                                                    "_product": "BCA",
                                                    "_subscription": "paid"
                                                }
                                            ]
                                        }
                                    }
                                };
                                spyOn(UserService, 'getCurrentUser')
                                    .andReturn({
                                        then: function (expression) {
                                            return expression(userData);
                                        }
                                    });
                            }));

                            it('should be negative', inject(function (UserService, $rootScope) {
                                var isAuthorised;

                                UserService.isCurrentUserAuthorisedToSeeCharts()
                                    .then(function (result) {
                                        isAuthorised = result;
                                    });

                                $rootScope.$digest();
                                expect(isAuthorised).toBe(false);
                            }));
                        });
                        
                        describe('When user service has expired', function () {
                            beforeEach(inject(function ($rootScope, UserService) {
                                var userData = {
                                    "account": {
                                        "accessTokens": {
                                            "token": [
                                                {
                                                    "_expires": "/Date(1377953294000)/",
                                                    "_product": "CHART",
                                                    "_subscription": "paid"
                                                }
                                            ]
                                        }
                                    }
                                };
                                spyOn(UserService, 'getCurrentUser')
                                    .andReturn({
                                        then: function (expression) {
                                            return expression(userData);
                                        }
                                    });
                            }));

                            it('should be negative', inject(function (UserService, $rootScope) {
                                var isAuthorised;

                                UserService.isCurrentUserAuthorisedToSeeCharts()
                                    .then(function (result) {
                                        isAuthorised = result;
                                    });

                                $rootScope.$digest();
                                expect(isAuthorised).toBe(false);
                            }));
                        });
                    });
                    
                    describe('When we query the service multiple times', function () {
                        beforeEach(inject(function (_$httpBackend_, $rootScope, DataEndpoint) {
                            $httpBackend = _$httpBackend_;

                            $httpBackend.expectGET(endpointUrl)
                                .respond(null, { 'Location': userEndpointUrl });

                            $httpBackend.expectGET(userEndpointUrl)
                                .respond(multipleTokensResponse);

                            DataEndpoint.getEndpoint = getEndpoint;

                            scope = $rootScope.$new();
                        }));
                        afterEach(function () {
                            $httpBackend.verifyNoOutstandingExpectation();
                            $httpBackend.verifyNoOutstandingRequest();
                        });
                        it('should cache the username', inject(function (UserService) {
                            UserService.getCurrentUser().then(function (data) {
                            });
                            scope.$root.$digest();
                            $httpBackend.flush();
                            UserService.getCurrentUser().then(function (data) {
                            });
                            
                        }));
                    });
                    
                    describe('When the token is a single object', function () {
                        beforeEach(inject(function (_$httpBackend_, $rootScope, DataEndpoint) {
                            $httpBackend = _$httpBackend_;

                            $httpBackend.expectGET(endpointUrl)
                                .respond(null, { 'Location': userEndpointUrl });

                            $httpBackend.expectGET(userEndpointUrl)
                                .respond(singleTokenResponse);

                            DataEndpoint.getEndpoint = getEndpoint;

                            scope = $rootScope.$new();
                        }));
                        it('tokens should be converted to an array', inject(function (UserService) {
                            UserService.getCurrentUser().then(function (data) {
                                expect(data.account.accessTokens.token.length).toBe(1);
                            });
                            scope.$root.$digest();
                            $httpBackend.flush();
                        }));
                    });
                });
            });
        });