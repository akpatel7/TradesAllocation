define(['App/Controllers/Trades/TradeCommentsController',
        'underscore',
        'angular',
        'mocks',
        'App/Services/services',
        'App/Controllers/controllers'
], function (TradeCommentsController, _) {
    describe('TradesController', function () {
        var scope, trade, $httpBackend, commentsPage1, commentsPage2;

        beforeEach(function () {
            module('App.services');
            module('App.controllers');
        });

        beforeEach(function() {
            trade = {
                trade: {
                    trade_id: 3
                }
            };

            commentsPage1 = {
                "odata.metadata": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/bca/$metadata#TradeComments",
                "odata.count": "15",
                "value": [
                    {
                        "comment_id": 4,
                        "trade_id": 3,
                        "comment_label": "comment to trade 3",
                        "created_on": "2013-11-12T12:21:14.127",
                        "created_by": null,
                        "last_updated": "2013-10-09T09:56:34.917"
                    }, {
                        "comment_id": 7,
                        "trade_id": 3,
                        "comment_label": "comment to trade 3",
                        "created_on": "2013-11-12T12:21:14.127",
                        "created_by": null,
                        "last_updated": "2013-10-09T09:56:34.917"
                    }, {
                        "comment_id": 10,
                        "trade_id": 3,
                        "comment_label": "comment to trade 3",
                        "created_on": "2013-11-12T12:21:14.127",
                        "created_by": null,
                        "last_updated": "2013-10-09T09:56:34.917"
                    }, {
                        "comment_id": 13,
                        "trade_id": 3,
                        "comment_label": "comment to trade 3",
                        "created_on": "2013-11-12T12:21:14.127",
                        "created_by": null,
                        "last_updated": "2013-10-09T09:56:34.917"
                    }, {
                        "comment_id": 16,
                        "trade_id": 3,
                        "comment_label": "comment to trade 3",
                        "created_on": "2013-11-12T12:21:14.127",
                        "created_by": null,
                        "last_updated": "2013-10-09T09:56:34.917"
                    }
                ]
            };

            commentsPage2 = {
                "odata.metadata": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/bca/$metadata#TradeComments",
                "odata.count": "15",
                "value": [
                    {
                        "comment_id": 4,
                        "trade_id": 3,
                        "comment_label": "comment to trade 3",
                        "created_on": "2013-11-12T12:21:14.127",
                        "created_by": null,
                        "last_updated": "2013-10-09T09:56:34.917"
                    }, {
                        "comment_id": 7,
                        "trade_id": 3,
                        "comment_label": "comment to trade 3",
                        "created_on": "2013-11-12T12:21:14.127",
                        "created_by": null,
                        "last_updated": "2013-10-09T09:56:34.917"
                    }, {
                        "comment_id": 10,
                        "trade_id": 3,
                        "comment_label": "comment to trade 3",
                        "created_on": "2013-11-12T12:21:14.127",
                        "created_by": null,
                        "last_updated": "2013-10-09T09:56:34.917"
                    }, {
                        "comment_id": 13,
                        "trade_id": 3,
                        "comment_label": "comment to trade 3",
                        "created_on": "2013-11-12T12:21:14.127",
                        "created_by": null,
                        "last_updated": "2013-10-09T09:56:34.917"
                    }, {
                        "comment_id": 16,
                        "trade_id": 3,
                        "comment_label": "comment to trade 3",
                        "created_on": "2013-11-12T12:21:14.127",
                        "created_by": null,
                        "last_updated": "2013-10-09T09:56:34.917"
                    }, {
                        "comment_id": 5,
                        "trade_id": 3,
                        "comment_label": "another comment to trade 3",
                        "created_on": "2013-11-11T12:21:14.127",
                        "created_by": null,
                        "last_updated": "2013-10-09T09:56:44.667"
                    }, {
                        "comment_id": 8,
                        "trade_id": 3,
                        "comment_label": "another comment to trade 3",
                        "created_on": "2013-11-11T12:21:14.127",
                        "created_by": null,
                        "last_updated": "2013-10-09T09:56:44.667"
                    }, {
                        "comment_id": 11,
                        "trade_id": 3,
                        "comment_label": "another comment to trade 3",
                        "created_on": "2013-11-11T12:21:14.127",
                        "created_by": null,
                        "last_updated": "2013-10-09T09:56:44.667"
                    }, {
                        "comment_id": 14,
                        "trade_id": 3,
                        "comment_label": "another comment to trade 3",
                        "created_on": "2013-11-11T12:21:14.127",
                        "created_by": null,
                        "last_updated": "2013-10-09T09:56:44.667"
                    }, {
                        "comment_id": 17,
                        "trade_id": 3,
                        "comment_label": "another comment to trade 3",
                        "created_on": "2013-11-11T12:21:14.127",
                        "created_by": null,
                        "last_updated": "2013-10-09T09:56:44.667"
                    }
                ]
            };
        });

        describe('Given a TradeCommentsController', function () {

            beforeEach(inject(function ($q, DataEndpoint, Dates, _$httpBackend_, $rootScope, $controller) {
                $httpBackend = _$httpBackend_;
                spyOn(DataEndpoint, 'getEndpoint').andCallFake(function() {
                    var deferred = $q.defer();
                    deferred.resolve('http://someapi/bca/TradeComments');
                    return deferred.promise;
                });

                scope = $rootScope.$new();
                $controller(TradeCommentsController, {
                    $scope: scope
                });                
            }));

            describe('When we want to see comments related to a particular trade', function () {

                describe('And we fetch the first page', function() {
                    beforeEach(function() {
                        $httpBackend.expectGET('http://someapi/bca/TradeComments?$filter=trade_id+eq+3&$inlinecount=allpages&$orderby=created_on+desc&$skip=0&$top=5').respond(commentsPage1);
                        scope.init(trade);
                        $httpBackend.flush();
                    });

                    it('Should display the first page of comments for the trade', inject(function(DataEndpoint) {
                        expect(trade.tradeComments.comments).toEqual(commentsPage1.value);
                        expect(trade.tradeComments.totalItems).toBe(parseInt(commentsPage1['odata.count'], 10));
                        expect(scope.tradeComments.totalItems).toBe(trade.tradeComments.totalItems);
                        expect(DataEndpoint.getEndpoint).toHaveBeenCalledWith('trade-comments');
                    }));

                    describe('And we fetch the second page', function() {
                        beforeEach(function() {
                            $httpBackend.expectGET('http://someapi/bca/TradeComments?$filter=trade_id+eq+3&$inlinecount=allpages&$orderby=created_on+desc&$skip=5&$top=15').respond(commentsPage2);
                            scope.showMore();
                            $httpBackend.flush();
                        });

                        it('Should display the second page of comments for the trade', inject(function(DataEndpoint) {
                            expect(trade.tradeComments.comments).toEqual(_.union(commentsPage1.value, commentsPage2.value));
                            expect(trade.tradeComments.totalItems).toBe(parseInt(commentsPage2['odata.count'], 10));
                            expect(DataEndpoint.getEndpoint).toHaveBeenCalledWith('trade-comments');
                        }));
                    });
                });
            });
        });
    });
});