define(['App/Controllers/Trades/FollowTradeController',
        'underscore',
        'angular',
        'mocks',
        'App/Services/services',
        'App/Controllers/controllers'
], function (FollowTradeController, _) {
    describe('TradesController', function () {
        var scope, tradeLineItem, currentUser;

        beforeEach(function () {
            module('App.services');
            module('App.controllers');
        });

        beforeEach(function () {
            tradeLineItem = {
                trade: {
                    "TradeLines": [
                        {
                            "trade_line_id": 2,
                            "trade_line_label": "Long Italy 10-year Bonds",
                            "trade_line_editorial_label": "Long Italy 10-year Bonds",
                            "trade_line_group_label": "Long Italy 10-year vs. Germany",
                            "trade_line_group_id": 2,
                            "trade_line_group_type_id": 2,
                            "trade_line_group_type_label": "Box",
                            "tradable_thing_id": 3,
                            "tradable_thing_uri": "<http://data.emii.com/commodities-markets/10y-bonds>",
                            "tradable_thing_label": "Italy 10-years",
                            "tradable_thing_class_id": 1,
                            "tradable_thing_class_uri": "<http://data.emii.com/ontologies/economy/FixedIncomeMarket>",
                            "tradable_thing_class_label": "FixedIncomeMarket",
                            "tradable_thing_class_editorial_label": "Fixed Income",
                            "position_id": 3,
                            "position_uri": "http://data.emii.com/absolute-trade-line-position/long",
                            "position_label": "Long",
                            "trade_id": 2,
                            "trade_line_group_editorial_label": "Long Italy 10-year vs. Germany",
                            "location_id": 76,
                            "location_label": "Italy",
                            "tradable_thing_code": null,
                            "isFollowed": false
                        },
                        {
                            "trade_line_id": 7,
                            "trade_line_label": "Long Italy 17-year Bonds",
                            "trade_line_editorial_label": "Long Italy 17-year Bonds",
                            "trade_line_group_label": "Long Italy 17-year vs. Germany",
                            "trade_line_group_id": 7,
                            "trade_line_group_type_id": 7,
                            "trade_line_group_type_label": "Box",
                            "tradable_thing_id": 7,
                            "tradable_thing_uri":  "<http://data.emii.com/commodities-markets/17y-bonds>",
                            "tradable_thing_label": "Italy 17-years",
                            "tradable_thing_class_id": 7,
                            "tradable_thing_class_uri": "<http://data.emii.com/ontologies/economy/FixedIncomeMarket>",
                            "tradable_thing_class_label": "FixedIncomeMarket",
                            "tradable_thing_class_editorial_label": "Fixed Income",
                            "position_id": 7,
                            "position_uri": "http://data.emii.com/absolute-trade-line-position/long",
                            "position_label": "Long",
                            "trade_id": 7,
                            "trade_line_group_editorial_label": "Long Italy 17-year vs. Germany",
                            "location_id": 76,
                            "location_label": "Italy",
                            "tradable_thing_code": null,
                            "isFollowed": false
                        }
                    ],
                    "trade_id": 2,
                    "service_code": "GIS",
                    "length_type_label": "Strategic",
                    "trade_editorial_label": "GIS Strategic Italy vs. Germany. 2/10 Box (Long Italy 10-year vs. Germany; short Italy 2-year vs. Germany)",
                    "structure_type_label": "Box",
                    "last_updated": "2014-01-12T14:08:54.603",
                    "instruction_entry": "0.85500",
                    "instruction_entry_date": "2014-01-19T14:08:54.607",
                    "instruction_exit": null,
                    "instruction_exit_date": null,
                    "instruction_label": "instruction label for trade 2 - updated",
                    "instruction_type_label": "Market",
                    "absolute_performance": "115",
                    "absolute_measure_type": "BPS",
                    "absolute_currency_code": null,
                    "relative_performance": null,
                    "relative_measure_type": null,
                    "benchmark_label": null,
                    "relative_currency_code": null,
                    "isOpen": true,
                    "trade_uri": "http://data.emii/trade/2",
                    "isClosedFor7DaysOrMore": false,
                    "hedge_label": "Hedge",
                    "absolute_performance_ytd": "0",
                    "relative_performance_ytd": "0",
                    "mark_to_market_rate": null,
                    "interest_rate": null,
                    "comment_label": "comment to trade 2",
                    "parent_trade_editorial_label": "GIS Tactical Short Gold",
                    "isFavourited": false,
                    "isFollowed": false
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
        });

        describe('Given a FollowTradeController', function () {

            beforeEach(inject(function ($q, _$httpBackend_, $rootScope, $controller, PerspectiveBuilder, Perspectives) {
                scope = $rootScope.$new();

                spyOn(PerspectiveBuilder, 'buildTradePerspective').andCallFake(function (arg1, arg2) {
                    var deferred = $q.defer();
                    deferred.resolve({
                        'trade-perspective': {
                            'container-type': arg1,
                            'related-resource-type': 'trade',
                            'trade-id': arg2
                        }
                    });
                    return deferred.promise;
                });
                
                spyOn(PerspectiveBuilder, 'buildTradableThingPerspective').andCallFake(function (arg1, arg2) {
                    var deferred = $q.defer();
                    deferred.resolve({
                        'container-type': arg1,
                        'tradable_thing_uri': arg2
                    });
                    return deferred.promise;
                });

                spyOn(Perspectives, 'post').andCallFake(function () {
                    var deferred = $q.defer();
                    deferred.resolve('new-perspective-id');
                    return deferred.promise;
                });
                
                spyOn(Perspectives, 'remove').andCallFake(function () {
                    var deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                });

                $controller(FollowTradeController, { $scope: scope });
            }));

            it('Should initialise form when the page loads', inject(function () {
                expect(scope.followForm).toBeDefined();
            }));

            describe('When we want to follow a trade that is not followed', function () {
                var hideCalled;

                beforeEach(function () {
                    hideCalled = false;
                    scope.hide = function () { hideCalled = true; };

                    scope.followForm.showFollowTradeForm(tradeLineItem);
                    scope.$root.$digest();
                });

                it('Should display the share trade form with a list of the trade instruments', inject(function () {
                    expect(scope.followForm.trade).toBeDefined();
                    expect(scope.followForm.trade.trade_id).toBe(2);
                    expect(scope.followForm.trade.isFollowed).toBe(false);
                    expect(scope.followForm.tradableThings.length).toBe(2);
                    expect(scope.followForm.tradableThings[0].tradable_thing_id).toBe(3);
                    expect(scope.followForm.tradableThings[0].isFollowed).toBe(false);
                    expect(hideCalled).toBe(false);
                }));

                it('Should say "FOLLOW" on the main button', inject(function () {
                    expect(scope.followForm.mainActionName).toBe('FOLLOW');
                }));

                it('Should call hide on "cancel" button click', inject(function () {
                    scope.followForm.hide();
                    expect(hideCalled).toBe(true);
                }));
                
                it('Should call hide on "submit" button click', inject(function (PerspectiveBuilder, Perspectives) {
                    scope.followForm.submit();
                    expect(PerspectiveBuilder.buildTradePerspective).not.toHaveBeenCalled();
                    expect(Perspectives.post).not.toHaveBeenCalled();
                    expect(hideCalled).toBe(true);
                }));

                describe('When we check the trade and submit', function () {
                    beforeEach(function () {
                        scope.followForm.trade.isFollowed = true;
                        scope.followForm.submit();
                        scope.$root.$digest();
                    });

                    it('Should create perspective and post it', inject(function (PerspectiveBuilder, Perspectives) {
                        expect(PerspectiveBuilder.buildTradePerspective).toHaveBeenCalledWith('follow', tradeLineItem.trade.trade_id);
                        expect(Perspectives.post).toHaveBeenCalledWith({
                            'trade-perspective': {
                                'container-type': 'follow',
                                'related-resource-type': 'trade',
                                'trade-id': tradeLineItem.trade.trade_id
                            }
                        });
                        expect(hideCalled).toBe(true);
                    }));
                    
                    it('Should update original data with perspective id and follow state', inject(function () {
                        expect(tradeLineItem.trade.isFollowed).toBe(true);
                        expect(tradeLineItem.trade.followPerspectiveId).toBe('new-perspective-id');
                    }));
                });
                
                describe('When we check the tradable-thing and submit', function () {
                    beforeEach(function () {
                        scope.followForm.tradableThings[0].isFollowed = true;
                        scope.followForm.tradableThings[1].isFollowed = true;
                        scope.followForm.submit();
                        scope.$root.$digest();
                    });

                    it('Should create perspective and post it', inject(function (PerspectiveBuilder, Perspectives) {
                        expect(PerspectiveBuilder.buildTradableThingPerspective).toHaveBeenCalledWith('follow', tradeLineItem.trade.TradeLines[0].tradable_thing_uri);
                        expect(Perspectives.post).toHaveBeenCalledWith({
                            'container-type': 'follow',
                            'tradable_thing_uri': tradeLineItem.trade.TradeLines[0].tradable_thing_uri
                        });
                        expect(PerspectiveBuilder.buildTradableThingPerspective).toHaveBeenCalledWith('follow', tradeLineItem.trade.TradeLines[1].tradable_thing_uri);
                        expect(Perspectives.post).toHaveBeenCalledWith({
                            'container-type': 'follow',
                            'tradable_thing_uri': tradeLineItem.trade.TradeLines[1].tradable_thing_uri
                        });
                        expect(hideCalled).toBe(true);
                    }));

                    it('Should update original data with perspective id and follow state', inject(function () {
                        expect(tradeLineItem.trade.TradeLines[1].isFollowed).toBe(true);
                        expect(tradeLineItem.trade.TradeLines[1].followPerspectiveId).toBe('new-perspective-id');
                    }));
                });

            });

            describe('When we want to un-follow a trade or tradable thing', function () {
                var hideCalled;
                
                beforeEach(function () {
                    hideCalled = false;
                    scope.hide = function () { hideCalled = true; };

                    tradeLineItem.trade.isFollowed = true;
                    tradeLineItem.trade.followPerspectiveId = 'id8732465';
                    tradeLineItem.trade.TradeLines[0].isFollowed = true;
                    tradeLineItem.trade.TradeLines[0].followPerspectiveId = 'id0897234056987234';
                    
                    scope.followForm.showFollowTradeForm(tradeLineItem);
                    scope.$root.$digest();
                });
                
                it('Should say "APPLY" on the main button', inject(function () {
                    expect(scope.followForm.mainActionName).toBe('APPLY');
                }));

                it('Should call hide on "cancel" button click', inject(function () {
                    scope.followForm.hide();
                    expect(hideCalled).toBe(true);
                }));

                it('Should call hide on "submit" button click', inject(function (PerspectiveBuilder, Perspectives) {
                    scope.followForm.submit();
                    expect(PerspectiveBuilder.buildTradePerspective).not.toHaveBeenCalled();
                    expect(Perspectives.post).not.toHaveBeenCalled();
                    expect(hideCalled).toBe(true);
                }));

                it('Should display the share trade form with a list of the trade instruments', inject(function () {
                    //expect(scope.followForm.trade).toBeDefined();
                    //expect(scope.followForm.trade.trade_id).toBe(2);
                    //expect(scope.followForm.trade.isFollowed).toBe(false);
                    //expect(scope.followForm.tradableThings[0].tradable_thing_id).toBe(3);
                    //expect(scope.followForm.tradableThings[0].isFollowed).toBe(false);
                }));
                
                describe('When we un-check the trade and submit', function () {
                    beforeEach(function () {
                        scope.followForm.trade.isFollowed = false;
                        scope.followForm.submit();
                        scope.$root.$digest();
                    });

                    it('Should delete perspective', inject(function (PerspectiveBuilder, Perspectives) {
                        expect(Perspectives.remove).toHaveBeenCalledWith('id8732465');
                        expect(hideCalled).toBe(true);
                    }));

                    it('Should update original data with follow state', inject(function () {
                        expect(tradeLineItem.trade.isFollowed).toBe(false);
                        expect(tradeLineItem.trade.followPerspectiveId).not.toBeDefined();
                    }));
                });
                
                describe('When we un-check the tradable-thing and submit', function () {
                    beforeEach(function () {
                        scope.followForm.tradableThings[0].isFollowed = false;
                        scope.followForm.submit();
                        scope.$root.$digest();
                    });

                    it('Should delete perspective', inject(function (PerspectiveBuilder, Perspectives) {
                        expect(Perspectives.remove).toHaveBeenCalledWith('id0897234056987234');
                        expect(hideCalled).toBe(true);
                    }));

                    it('Should update original data with follow state', inject(function () {
                        expect(tradeLineItem.trade.TradeLines[0].isFollowed).toBe(false);
                        expect(tradeLineItem.trade.TradeLines[0].followPerspectiveId).not.toBeDefined();
                    }));
                });
            });

            describe('When getting follow state key', function () {
               
                it('Should return "off" state.', inject(function () {
                    var result = scope.followForm.getFollowState(tradeLineItem);
                    expect(result).toBe('off');
                }));
                
                it('Should return "half" state.', inject(function () {
                    tradeLineItem.trade.isFollowed = true;
                    var result = scope.followForm.getFollowState(tradeLineItem);
                    expect(result).toBe('half');
                }));
                
                it('Should return "half" state.', inject(function () {
                    tradeLineItem.trade.TradeLines[1].isFollowed = true;
                    var result = scope.followForm.getFollowState(tradeLineItem);
                    expect(result).toBe('half');
                }));
                
                it('Should return "half" state.', inject(function () {
                    tradeLineItem.trade.isFollowed = true;
                    tradeLineItem.trade.TradeLines[1].isFollowed = true;
                    var result = scope.followForm.getFollowState(tradeLineItem);
                    expect(result).toBe('half');
                }));
                
                it('Should return "on" state.', inject(function () {
                    tradeLineItem.trade.isFollowed = true;
                    tradeLineItem.trade.TradeLines[0].isFollowed = true;
                    tradeLineItem.trade.TradeLines[1].isFollowed = true;
                    var result = scope.followForm.getFollowState(tradeLineItem);
                    expect(result).toBe('on');
                }));
                
            });
        });
    });
});