define(['App/Controllers/User/UserNameController',
        'underscore',
        'moment',
        'angular',
        'resource',
        'mocks',
        'App/Controllers/controllers'], function (UserNameController) {
            describe('House Views Controller', function () {
                describe('Given we have a UserNameController', function () {
                    var controller,
                        expectedData,
                        scope;

                    beforeEach(function () {
                        module('App');
                    });
                    
                    beforeEach(function () {
                        expectedData = {
                            "user": {
                                "_id": "rohit.modi",
                                "account": {
                                    "_id": "rohit.modi",
                                    "accessTokens": {
                                        "_code": "0",
                                        "token": [
                                            {
                                                "_expires": "/Date(1377953294000)/",
                                                "_product": "BCA",
                                                "_subscription": "paid"
                                            },
                                            {
                                                "_expires": "/Date(1377953294000)/",
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
                    });

                    beforeEach(inject(function ($rootScope, $controller, $q) {
                        var fakeUserService = {
                            getCurrentUser: function () {
                                var deferred = $q.defer();
                                deferred.resolve(expectedData.user);
                                return deferred.promise;
                            }
                        };

                        scope = $rootScope.$new();
                        
                        controller = $controller(UserNameController, {
                            $scope: scope,
                            UserService: fakeUserService
                        });
                    }));

                    describe('When initializing the controller', function () {
                        it("Should load User full name", function () {
                            scope.$root.$digest();
                            expect(scope.name).toEqual('Rohit Modi');
                        });
                        
                        it("Should load User surname only", function () {
                            expectedData.user.forename = null;
                            scope.$root.$digest();
                            expect(scope.name).toEqual('Modi');
                        });
                        
                        it("Should load User forename only", function () {
                            expectedData.user.surname = null;
                            scope.$root.$digest();
                            expect(scope.name).toEqual('Rohit');
                        });
                        
                        it("Should show that name is not present", function () {
                            expectedData.user.forename = null;
                            expectedData.user.surname = null;
                            scope.$root.$digest();
                            expect(scope.name).toEqual('User');
                        });
                    });
                });
            });
        });