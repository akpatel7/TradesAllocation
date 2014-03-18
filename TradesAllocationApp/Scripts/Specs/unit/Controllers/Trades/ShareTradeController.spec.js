define(['App/Controllers/Trades/ShareTradeController',
        'underscore',
        'angular',
        'mocks',
        'App/Services/services',
        'App/Controllers/controllers'
], function (ShareTradeController, _) {
    describe('TradesController', function () {
        var scope, trade, currentUser, groupMembers, colleaguesList;

        beforeEach(function () {
            module('App.services');
            module('App.controllers');
        });

        trade = {
            trade: {
                trade_id: 3
            }
        };

        currentUser = {
            "_id": "amy.moreton",
            "account": {
                "_id": "Account9c474b31ffad458bbf3f51b17fbbe61f",
                "accessTokens": {
                    "_code": "532560",
                    "token": [
                        {
                            "_expires": "/Date(1418083200000)/",
                            "_product": "DASH",
                            "_subscription": "paid"
                        },
                        {
                            "_expires": "/Date(1418083200000)/",
                            "_product": "GIS",
                            "_subscription": "paid"
                        },
                        {
                            "_expires": "/Date(1418083200000)/",
                            "_product": "CIS",
                            "_subscription": "paid"
                        },
                        {
                            "_expires": "/Date(1418083200000)/",
                            "_product": "BCASR",
                            "_subscription": "paid"
                        }
                    ]
                },
                "manager": {
                    "email": "test@bcaresearch.com",
                    "name": "Joe Sales",
                    "tel": "1 999-555-123456"
                }
            },
            "email": "Amy.Moreton@SkyTowers.com",
            "forename": "Amy",
            "groups": {
                "group": {
                    "_id": "7363",
                    "_name": "Outsourced Research"
                }
            },
            "link": {
                "_href": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/users/amy.moreton/inbox",
                "_rel": "inbox"
            },
            "location": {
                "city": "Montreal",
                "code": "H1A 1A1",
                "country": "Canada"
            },
            "organization": {
                "_id": "7363",
                "name": "Outsourced Research"
            },
            "salutation": "Dr.",
            "surname": "Moreton"
        };

        groupMembers = [
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
        ];

        colleaguesList = [
            {
                id: 'melanie.michaels',
                label: 'Melanie Michaels',
                isSelected: false
            },
            {
                id: 'rohit.modi',
                label: 'Rohit Modi',
                isSelected: false
            }
        ];
        
        describe('Given a ShareTradeController', function () {

            beforeEach(inject(function ($q, _$httpBackend_, $rootScope, $controller, UserService) {
                scope = $rootScope.$new();
                
                spyOn(UserService, 'getCurrentUser').andCallFake(function() {
                    var deferred = $q.defer();
                    deferred.resolve(currentUser);
                    return deferred.promise;
                });
                
                spyOn(UserService, 'getCurrentUsersGroupMembers').andCallFake(function () {
                    var deferred = $q.defer();
                    deferred.resolve(groupMembers);
                    return deferred.promise;
                });

                $controller(ShareTradeController, {
                    $scope: scope
                });                
            }));

            describe('When we want to share a BCA trade recommendation', function () {
                beforeEach(function () {
                    scope.shareTrade(trade);
                    scope.$root.$digest();
                });

                it('Should display the share trade form with a list of the current users colleagues to select as recipients', inject(function(DataEndpoint, UserService) {
                    expect(UserService.getCurrentUser).toHaveBeenCalled();
                    expect(UserService.getCurrentUsersGroupMembers).toHaveBeenCalled();
                    expect(scope.colleagues).toEqual(colleaguesList);
                }));

                describe('And we want to submit the shared trade to the server', function() {
                    describe('When we do not choose any recipients', function() {
                        beforeEach(inject(function(PerspectiveBuilder) {
                            spyOn(PerspectiveBuilder, 'buildTradePerspective');
                            scope.submit();
                        }));
                        it('Should output an error message telling us to choose a recipient', inject(function (PerspectiveBuilder) {
                            expect(scope.invalid).toBe(true);
                            expect(PerspectiveBuilder.buildTradePerspective).not.toHaveBeenCalled();
                        }));
                    });
                    describe('When we choose a recipient and enter a message', function() {
                        beforeEach(inject(function (Notifications, PerspectiveBuilder, Perspectives, $q) {
                            spyOn(Notifications, 'success').andCallThrough();
                            
                            spyOn(PerspectiveBuilder, 'buildTradePerspective').andCallFake(function() {
                                var deferred = $q.defer();
                                deferred.resolve({
                                    'trade-perspective': {
                                        'container-type': 'shared',
                                        'related-resource-type': 'trade',
                                        'trade-id': 3
                                    }
                                });
                                return deferred.promise;
                            });

                            spyOn(Perspectives, 'post').andCallFake(function () {
                                var deferred = $q.defer();
                                deferred.resolve();
                                return deferred.promise;
                            });
                            
                            scope.colleagues[0].isSelected = true;
                            scope.form = {
                                message: {
                                    $modelValue: 'Check this out!'
                                }
                            };
                            scope.submit();
                            scope.$root.$digest();
                        }));
                        it('Should send the shared trade perspective to the server', inject(function (Notifications, PerspectiveBuilder, Perspectives) {
                            expect(PerspectiveBuilder.buildTradePerspective).toHaveBeenCalledWith('shared', 3);
                            expect(Notifications.success).toHaveBeenCalledWith('Trade shared successfully.');
                            expect(Perspectives.post).toHaveBeenCalledWith({
                                'trade-perspective': {
                                    'container-type': 'shared',
                                    'related-resource-type': 'trade',
                                    'trade-id': 3,
                                    'description': 'Check this out!',
                                    'member': [{ _id: 'melanie.michaels', _type: 'user' }]
                                }
                            });
                        }));
                    });
                });
            });
            describe("when working out when to disable the share button", function () {
                
                it("should be false when form is not dirty", function () {
                    scope.form = {
                        $dirty: false
                    };
                    
                    scope.invalid = false;

                    expect(scope.disableShare()).toBe(true);
                });
                
                it("should be false when form is dirty and invalid", function () {
                    scope.form = {
                        $dirty: true,
                        message: {
                            $invalid: false
                        }
                    };

                    scope.invalid = false;                   

                    expect(scope.disableShare()).toBe(false);
                });

                it("should be false when form is dirty and invalid", function () {
                    scope.form = {
                        $dirty: true
                    };

                    scope.invalid = true;

                    expect(scope.disableShare()).toBe(true);
                });

                it("should be false when form is dirty and invalid", function() {
                    scope.form = {
                        $dirty: true,
                        message : {
                            $invalid : true
                        }
                    };
            

                    scope.invalid = true;

                    expect(scope.disableShare()).toBe(true);
                });
                
            });
        });
    });
});