define(['App/Controllers/Trades/TradesController',
    'App/Helpers/Browser',
    'underscore',
    'angular',
    'mocks',
    'App/Services/services',
    'App/Controllers/controllers'
], function(TradesController, browserHelper, _) {
    describe('TradesController', function() {
        var scope,
            controller,
            $httpBackend,
            routeParams,
            expectedLookupData,
            _TRADE_SET_HEADER_WIDTHS_ = 'trade:set-header-widths';


        beforeEach(function() {
            module('App.services');
            module('App.controllers');
            module('ngRoute');
        });

        expectedLookupData = {
            "odata.metadata": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/bca/$metadata#TradeLookupData",
            "value": [{
                "id": "1",
                "field": "benchmark_label",
                "value": "Germany 10-year Bonds",
                "trade_id": 5
            }, {
                "id": "2",
                "field": "benchmark_label",
                "value": "Germany 10-year Bonds",
                "trade_id": 10
            }, {
                "id": "3",
                "field": "service_code",
                "value": "GIS",
                "trade_id": 10
            }, {
                "id": "4",
                "field": "service_code",
                "value": "DI",
                "trade_id": 10
            }, {
                "id": "5",
                "field": "length_type_label",
                "value": "Strategic",
                "trade_id": 10
            }, {
                "id": "6",
                "field": "length_type_label",
                "value": "Tactical",
                "trade_id": 10
            }]
        };

        describe('Given a TradesController', function() {

            beforeEach(inject(function($q, DataEndpoint, Dates, _$httpBackend_, $rootScope, $controller) {
                spyOn(DataEndpoint, 'getEndpoint').andCallFake(function (argument) {
                    var deferred = $q.defer();

                    switch (argument) {
                        case 'trade-lookup-data':
                            deferred.resolve('http://someapi/trade-lookup-data');
                            break;
                        default:
                            throw 'Not supported data endpoint';
                }
                    return deferred.promise;
                });

                spyOn(Dates, 'now').andReturn('2013-11-04');

                routeParams = {};
                scope = $rootScope.$new();
                controller = $controller;

            }));

            describe('Build Isis query', function () {
               
                describe('When viewing favourites', function () {
                    beforeEach(function () {
                        controller(TradesController, {
                            $scope: scope,
                            $routeParams: routeParams
                        });
                    });
                    
                    beforeEach(function() {
                        scope.showFavouritesOnly = true;
                    });

                    it('should add the showFavouritesOnly flag', function () {
                        var result = scope.buildIsisQuery();
                        expect(result).toEqual(
                            {
                                $orderby: 'last_updated desc,trade_editorial_label',
                                $skip: 0,
                                $top: browserHelper.isIE8() ? 10 : 25,
                                $inlinecount: 'allpages',
                                $filter: 'isClosedFor7DaysOrMore eq false',
                                $expand: 'TradeLines,LinkedTrade',
                                showFavouritesOnly: true,
                                showFollowsOnly: false
                            });

                    });
                });
                
                describe('When viewing follows', function () {
                    beforeEach(function () {
                        controller(TradesController, {
                            $scope: scope,
                            $routeParams: routeParams
                        });
                    });

                    beforeEach(function () {
                        scope.showFollowsOnly = true;
                    });

                    it('should add the showFollowsOnly flag', function () {
                        var result = scope.buildIsisQuery();
                        expect(result).toEqual(
                            {
                                $orderby: 'last_updated desc,trade_editorial_label',
                                $skip: 0,
                                $top: browserHelper.isIE8() ? 10 : 25,
                                $inlinecount: 'allpages',
                                $filter: 'isClosedFor7DaysOrMore eq false',
                                $expand: 'TradeLines,LinkedTrade',
                                showFollowsOnly: true,
                                showFavouritesOnly: false
                            });

                    });
                });


                describe('When paginating', function () {
                    beforeEach(function () {
                        controller(TradesController, {
                            $scope: scope,
                            $routeParams: routeParams
                        });
                    });
                    
                    beforeEach(function() {
                        scope.options = {
                            skip: 40,
                            pager: {
                                currentPage: 2
                            },
                            take: 20
                        };
                    });

                    it('should build pass the right pagination data', function () {
                        var result = scope.buildIsisQuery();
                        expect(result).toEqual(
                            {
                                $orderby: 'last_updated desc,trade_editorial_label',
                                $skip: 40,
                                $top: 20,
                                $inlinecount: 'allpages',
                                $filter: 'isClosedFor7DaysOrMore eq false',
                                $expand: 'TradeLines,LinkedTrade',
                                showFavouritesOnly: false,
                                showFollowsOnly: false
                            });
                    });
                });

                describe('When ordering', function () {
                    beforeEach(function () {
                        controller(TradesController, {
                            $scope: scope
                        });

                        scope.options.orderby = 'last_updated';
                        scope.options.direction = 'asc';
                    });
                    
                    it('should build pass the right pagination data', function () {
                        var result = scope.buildIsisQuery();
                        
                        expect(result).toEqual(
                            {
                                $orderby: 'last_updated asc,trade_editorial_label',
                                $skip: 0,
                                $top: browserHelper.isIE8() ? 10 : 25,
                                $inlinecount: 'allpages',
                                $filter: 'isClosedFor7DaysOrMore eq false',
                                $expand: 'TradeLines,LinkedTrade',
                                showFavouritesOnly: false,
                                showFollowsOnly: false
                            });
                    });
                });

                describe('When filtering', function() {
                    beforeEach(function () {
                      
                        controller(TradesController, {
                            $scope: scope
                        });

                        scope.options.filter = '(service_code eq \'DI\' or service_code eq \'GIS\') and (length_type_label eq \'Strategic\')';
                    });
                    
                    it('should add the filter', function() {
                        var result = scope.buildIsisQuery();
                        
                        expect(result).toEqual(
                            {
                                $orderby: 'last_updated desc,trade_editorial_label',
                                $skip: 0,
                                $top: browserHelper.isIE8() ? 10 : 25,
                                $inlinecount: 'allpages',
                                $filter: "((service_code eq 'DI' or service_code eq 'GIS') and (length_type_label eq 'Strategic')) and isClosedFor7DaysOrMore eq false",
                                $expand: 'TradeLines,LinkedTrade',
                                showFavouritesOnly: false,
                                showFollowsOnly: false
                            });
                    });
                });
             

            });

            describe('When we want to view current trade recommendations', function () {
               
                beforeEach(inject(function (_$httpBackend_, Trades, TradesUrlBuilder) {
                    spyOn(Trades, 'getTransformedTrades')
                      .andReturn({
                          then: function (expression) {
                              return expression({
                                  data: {
                                      totalCount: 3,
                                      trades: [
                                          {

                                          }, {

                                          }, {

                                          }]
                                  },
                                  tradesBaseUrl: 'http://somefake/trades/url'                                  
                              });
                          }
                      });

                    spyOn(TradesUrlBuilder, 'buildExportUrl').andReturn('http://somefake/trades/export/url');                    

                    controller(TradesController, {
                        $scope: scope,
                        $routeParams: routeParams
                    });

                    spyOn(scope, 'buildIsisQuery').andCallThrough();

                    _$httpBackend_.expectGET('http://someapi/trade-lookup-data')
                      .respond(expectedLookupData);
                }));
                
                it('should have initial values set', inject(function (TradesUrlBuilder) {
                    scope.$root.$digest();
                    expect(scope.showFavouritesOnly).toBe(false);
                    expect(scope.showFollowsOnly).toBe(false);
                    expect(scope.tradesBaseUrl).toBe('http://somefake/trades/url');
                    expect(scope.exportTradesUrl).toBe('http://somefake/trades/export/url');
                    expect(scope.options.take).toBe(browserHelper.isIE8() ? 10 : 25);
                    expect(scope.options.pager.pageSize).toBe(browserHelper.isIE8() ? 10 : 25);
                    expect(TradesUrlBuilder.buildExportUrl).toHaveBeenCalled();
                    expect(scope.buildIsisQuery).toHaveBeenCalled();
                }));
                
                it('Should load the trades the first 25 trades', inject(function (_$httpBackend_) {
                    scope.$root.$digest();
                    _$httpBackend_.flush();
                    
                    expect(scope.totalCount).toBe(3);
                    expect(scope.trades.length).toBe(3);
                }));

                it('should initialize the columns', inject(function (_$httpBackend_, TradesColumns, $timeout) {
                    var listener = jasmine.createSpy('listener');
                    spyOn(TradesColumns, 'initTradesColumns').andCallFake(angular.noop);
                    scope.$on(_TRADE_SET_HEADER_WIDTHS_, listener);
                    
                    scope.$root.$digest();
                    _$httpBackend_.flush();
                    $timeout.flush();

                    expect(listener).toHaveBeenCalled();
                    expect(TradesColumns.initTradesColumns).toHaveBeenCalled();
                }));
                

                describe('When getting group lines', function () {
                    var trade,
                        groupLines;
                    beforeEach(function () {
                        trade = {
                            trade: {
                                trade_id: 1
                            },
                            groups: [
                                {
                                    group_id: '1',
                                    group_type_label: 'Box',
                                    lines: [
                                        {
                                            trade_line_id: 1,
                                            tradable_thing_class_editorial_label: 'Fixed Income'
                                        },
                                        {
                                            trade_line_id: 2,
                                            tradable_thing_class_editorial_label: 'Fixed Income 2'
                                        }
                                    ]
                                },
                                {
                                     group_id: '2',
                                     group_type_label: 'Box',
                                     lines: [
                                         {
                                             trade_line_id: 3,
                                             tradable_thing_class_editorial_label: 'Economy'
                                         }
                                     ]
                                 }
                            ]
                        };
                        groupLines = scope.getGroupLines(trade);

                    });
                    it('should return 3 group lines', function () {
                        expect(groupLines.length).toBe(3);
                    });
                    describe('the first group line', function () {
                        it('should contain the trade group', function () {
                            expect(groupLines[0].group).toBe(trade.groups[0]);
                        });
                        it('should contain the first trade line', function () {
                            expect(groupLines[0].line.trade_line_id).toBe(1);
                        });
                        it('should be marked as first in group', function () {
                            expect(groupLines[0].isFirstInGroup).toBe(true);
                        });
                    });
                    describe('the second groupLine', function () {
                        it('should contain the trade group', function () {
                            expect(groupLines[1].group).toBe(trade.groups[0]);
                        });
                        it('shhould contain the second trade line', function () {
                            expect(groupLines[1].line.trade_line_id).toBe(2);
                        });
                        it('should not be marked as first in group', function () {
                            expect(groupLines[1].isFirstInGroup).toBe(false);
                        });
                    });

                });

                describe('When we want to view groups for a particular trade', function () {
                    var trade;
                    beforeEach(function () {
                        trade = {
                            trade: {
                                trade_id: 1
                            },
                            groups: [
                                {
                                    group_id: '1',
                                    group_type_label: 'Box',
                                    lines: [
                                        {
                                            trade_line_id: 1,
                                            tradable_thing_class_editorial_label: 'Fixed Income'
                                        },
                                        {
                                            trade_line_id: 2,
                                            tradable_thing_class_editorial_label: 'Fixed Income 2'
                                        }
                                    ]
                                },
                                {
                                    group_id: '2',
                                    group_type_label: 'Box',
                                    lines: [
                                        {
                                            trade_line_id: 3,
                                            tradable_thing_class_editorial_label: 'Economy'
                                        }
                                    ]
                                }
                            ]
                        };
                        scope.toggleGroupsDisplay(trade);
                    });
                    it('should now display the trade groups', function () {
                        expect(trade.isGroupsOpen).toBe(true);
                        _.each(trade.groups, function (group) {
                            expect(group.isVisible).toBe(true);
                        });
                    });
                });

                describe('When viewing favourite trades only', function () {
                    beforeEach(inject(function ($location) {
                        spyOn($location, 'search').andCallThrough();
                        scope.toggleFavouritesOnly();
                        scope.$root.$digest();
                    }));

                    it('Should show only favourited trades', inject(function ($location) {
                        expect($location.search).toHaveBeenCalledWith({
                            'showFavouritesOnly': true,
                            'showFollowsOnly': false,
                            '$orderby': 'last_updated asc'
                        });
                        expect(scope.showFavouritesOnly).toBe(true);
                    }));

                    describe('And going back to viewing all trades', function () {
                        beforeEach(function () {
                           
                            scope.toggleFavouritesOnly();
                            scope.$root.$digest();
                        });
                        it('Should show all trades again', inject(function ($location) {
                            expect($location.search).toHaveBeenCalledWith({
                                'showFavouritesOnly': false,
                                'showFollowsOnly': false,
                                $orderby: "last_updated asc"
                            });
                           
                            expect(scope.showFavouritesOnly).toBe(false);
                        }));
                    });
                });
                
                describe('When viewing followed trades only', function () {
                    beforeEach(inject(function ($location) {
                        spyOn($location, 'search').andCallThrough();
                        scope.toggleFollowOnly();
                        scope.$root.$digest();
                    }));

                    it('Should show only followed trades', inject(function ($location) {
                        expect($location.search).toHaveBeenCalledWith({
                            'showFavouritesOnly': false,
                            'showFollowsOnly': true,
                            '$orderby': 'last_updated asc'
                        });
                        expect(scope.showFollowsOnly).toBe(true);
                    }));

                    describe('When we want to go back to viewing all trades', function () {
                        beforeEach(function () {
                            scope.toggleFollowOnly();
                            scope.$root.$digest();
                        });
                        it('Should show all trades again - "showFollowsOnly" not specified', inject(function ($location) {
                            expect($location.search).toHaveBeenCalledWith({
                                'showFavouritesOnly': false,
                                'showFollowsOnly': false,
                                $orderby: "last_updated asc"
                            });
                            expect(scope.showFavouritesOnly).toBe(false);
                        }));
                    });
                });

                describe('When we filter the results', function() {
                    beforeEach(inject(function($location) {
                        spyOn($location, 'search').andCallThrough();
                        scope.filters.service_code.options = [
                            {
                                name: 'GIS',
                                isSelected: true
                            },
                            {
                                name: 'DI',
                                isSelected: true
                            },
                            {
                                name: 'CES'
                            }
                        ];
                        scope.filters.length_type_label.options = [
                            {
                                name: 'Strategic',
                                isSelected: true
                            }, {
                                name: 'Tactical'
                            }];

                        scope.showFavouritesOnly = false;

                        scope.onFiltersChanged();
                    }));

                    it('Should rebuild the export trades URL', inject(function(TradesUrlBuilder) {
                        expect(scope.exportTradesUrl).toBe('http://somefake/trades/export/url');
                        expect(TradesUrlBuilder.buildExportUrl).toHaveBeenCalled();
                    }));
                });


                describe('When fetching the page 1', function () {
                    beforeEach(function () {
                        expect(scope.options.skip).toBe(0);
                        expect(scope.options.take).toBe(browserHelper.isIE8() ? 10 : 25);
                        scope.fetchPage(1);
                    });

                    it('should change the page start to 25', function () {
                        expect(scope.options.skip).toBe(browserHelper.isIE8() ? 10 : 25);
                    });
                });

                describe('When fetching the next page 1', function () {
                    beforeEach(function () {
                        expect(scope.options.skip).toBe(0);
                        expect(scope.options.take).toBe(browserHelper.isIE8() ? 10 : 25);
                        scope.fetchNextPage(1);
                    });

                    it('should change the page start to 25', function () {
                        expect(scope.options.skip).toBe(browserHelper.isIE8() ? 10 : 25);
                    });

                    it('should load the trades', inject(function (Trades) {
                        expect(Trades.getTransformedTrades).toHaveBeenCalled();
                    }));
                });
                
                describe('When trying to fetch the next page', function () {
                    describe('And we havent loaded all the trades', function() {
                        beforeEach(function () {
                            var i;
                            scope.trades = [];
                            for (i = 0; i < 80; i++) {
                                scope.trades.push({});
                            }
                            scope.options.skip = 50;
                            expect(scope.options.take).toBe(browserHelper.isIE8() ? 10 : 25);
                            
                            scope.fetchNextPage();
                        });

                        it('should load the trades', inject(function(Trades) {
                            expect(scope.options.skip).toBe(browserHelper.isIE8() ? 60 : 75);
                            expect(Trades.getTransformedTrades).toHaveBeenCalled();
                        }));
                    });
                    
                    describe('And we have loaded all the trades', function () {
                        beforeEach(function () {
                            var i;
                            scope.trades = [];
                            for (i = 0; i < 80; i++) {
                                scope.trades.push({});
                            }
                            scope.options.skip = 81;
                            expect(scope.options.take).toBe(browserHelper.isIE8() ? 10 : 25);

                            scope.fetchNextPage();
                        });

                        it('should not load the trades', inject(function (Trades) {
                            expect(Trades.getTransformedTrades).not.toHaveBeenCalled();
                        }));
                    });

                });

                describe('When we need to update the trade export url', function() {
                    it('Should display the updated export url to match the table', inject(function(TradesUrlBuilder) {
                        scope.$broadcast('trade:build-export');
                        scope.$root.$digest();

                        expect(scope.exportTradesUrl).toBe('http://somefake/trades/export/url');
                        expect(TradesUrlBuilder.buildExportUrl).toHaveBeenCalled();
                    }));
                });
            });

            describe('When we want to view an individual trade recommendation', function () {
               
                beforeEach(inject(function (_$httpBackend_, Trades, Page) {
                    spyOn(Trades, 'getTransformedTrades')
                             .andReturn({
                                 then: function (expression) {
                                     return expression({
                                         data: {
                                             totalCount: 1,
                                             trades: [
                                                 {
                                                     trade: {
                                                     trade_editorial_label: 'GIS Tactical Short Gold'
                                                     }
                                                 }
                                             ]
                                         }
                                     });
                                 }
                             });
                    
                    spyOn(Page, 'setTitle').andCallFake(angular.noop);
                    spyOn(Page, 'setLastBreadcrumbs').andCallFake(angular.noop);

                    controller(TradesController, {
                        $scope: scope,
                        $routeParams: { tradeId: 1 }
                    });
                    
                    $httpBackend = _$httpBackend_;
                    
                    _$httpBackend_.expectGET('http://someapi/trade-lookup-data')
                           .respond(expectedLookupData);

                    scope.$root.$digest();
                    _$httpBackend_.flush();

                }));

                it('Should only display the single trade', inject(function(Page) {
                    expect(scope.trades.length).toBe(1);
                    expect(Page.setTitle).toHaveBeenCalledWith('GIS Tactical Short Gold');
                    expect(Page.setLastBreadcrumbs).toHaveBeenCalledWith([{ name: 'Trades', link: '/trades' }, { name: 'GIS Tactical Short Gold' }], true);
                }));
            });

            describe('Linked Trades', function() {
                describe('When we click to view linked trades', function () {
                    var trade, $event;
                    beforeEach(inject(function ($location) {
                        $event = {
                            stopPropagation: function () { }
                        };

                        trade = {
                            trade: {
                                trade_id: 1
                            },
                            linkedTrades: {
                                items: [{
                                    id: 2,
                                    title: "GIS Strategic Italy vs. Germany. 2/10 Box (Long Italy 10-year vs. Germany; short Italy 2-year vs. Germany)"
                                }]
                            }
                        };

                        spyOn($event, 'stopPropagation');
                        spyOn($location, 'url');

                        controller(TradesController, {
                            $scope: scope
                        });
                        scope.showLinkedTrades(trade, $event);
                    }));
                    it('should be redirected to the linked trades page', inject(function ($location) {
                        expect($event.stopPropagation).toHaveBeenCalled();
                        expect($location.url).toHaveBeenCalledWith('/linked-trades/1?showFollowsOnly=false&showFavouritesOnly=false&%24orderby=last_updated desc');
                    }));
                    

                });
                
                describe('When viewing linked trades', function () {
                    
                    beforeEach(inject(function (_$httpBackend_, Trades, Page) {
                        $httpBackend = _$httpBackend_;

                        spyOn(Trades, 'getTransformedTrades')
                             .andReturn({
                                 then: function (expression) {
                                     return expression({
                                         data: {
                                             totalCount: 3,
                                             trades: [
                                                 {
                                                     trade: {
                                                         parent_trade_editorial_label: 'GIS Tactical Short Gold'
                                                     }
                                                 }, {
                                                     trade: {
                                                         parent_trade_editorial_label: 'GIS Strategic Short Gold'
                                                     }
                                                 }, {
                                                     trade: {
                                                         parent_trade_editorial_label: 'GIS Tactical Long Gold'
                                                     }
                                                 }]
                                         }
                                     });
                                 }
                             });
                        scope.renderAction = 'home.linked-trades';
                        

                        _$httpBackend_.expectGET('http://someapi/trade-lookup-data')
                            .respond(expectedLookupData);
                        
                        controller(TradesController, {
                            $scope: scope,
                            $routeParams: {
                                tradeId: 1,
                                '$filter': 'trade_id eq 2'
                            }
                        });

                        spyOn(Page, 'setTitle').andCallFake(angular.noop);
                        spyOn(Page, 'setLastBreadcrumbs').andCallFake(angular.noop);
                        
                        scope.$root.$digest();
                        _$httpBackend_.flush();

                    }));
                    it('Should display the linked trades', inject(function (Page) {
                        expect(scope.isLinkTradeView).toBe(true);
                        expect(Page.setTitle).toHaveBeenCalledWith('Linked Trades for GIS Tactical Short Gold');
                        expect(Page.setLastBreadcrumbs).toHaveBeenCalledWith([{ name: 'Trades', link: '/trades' }, { name: 'Linked Trades for GIS Tactical Short Gold' }], true);
                    }));
                });
            });

            describe('When updating the search', function () {
                beforeEach(inject(function (_$httpBackend_, $timeout, Trades) {
                    spyOn(Trades, 'getTransformedTrades')
                             .andReturn({
                                 then: function (expression) {
                                     return expression({
                                         data: {
                                             totalCount: 3,
                                             trades: [
                                                 {

                                                 }, {

                                                 }, {

                                                 }]
                                         }
                                     });
                                 }
                             });

                    controller(TradesController, {
                        $scope: scope
                    });

                    _$httpBackend_.expectGET('http://someapi/trade-lookup-data')
                             .respond(expectedLookupData);

                    spyOn(scope, 'onFiltersChanged').andCallFake(angular.noop);
                    Trades.getTransformedTrades.reset();
                    scope.$root.$broadcast('$routeUpdate');
                }));

                it('Should update the trades', inject(function (Trades) {
                    expect(Trades.getTransformedTrades).toHaveBeenCalled();
                }));
                
            });
            
            describe('Pagination', function() {
                describe('in IE8', function () {
                    beforeEach(inject(function ($q, DataEndpoint, Dates, _$httpBackend_, $rootScope, Trades) {
                        spyOn(browserHelper, 'isIE8').andCallFake(function (argument) {
                            return true;
                        });

                        scope = $rootScope.$new();
                        spyOn(Trades, 'getTransformedTrades')
                                .andReturn({
                                    then: function (expression) {
                                        return expression({
                                            data: {
                                                totalCount: 51,
                                                trades: [{}, {}, {}]
                                            },
                                            exportUrl: 'http://somefake/export/url'
                                        });
                                    }
                                });

                        controller(TradesController, {
                            $scope: scope
                        });

                        _$httpBackend_.expectGET('http://someapi/trade-lookup-data')
                                 .respond(expectedLookupData);
                        scope.$root.$digest();
                    }));

                    it('Should have 10 trades per page', inject(function () {
                        expect(scope.options.take).toBe(10);
                        expect(scope.options.pager.pageSize).toBe(10);
                    }));

                    it('Should show boundary links when there are 51 results', inject(function () {
                        expect(scope.showBoundaryLinks).toBe(true);
                    }));
                });
                
                describe('not in IE8', function () {
                    beforeEach(inject(function ($q, DataEndpoint, Dates, _$httpBackend_, $rootScope, Trades) {
                        spyOn(browserHelper, 'isIE8').andCallFake(function (argument) {
                            return false;
                        });

                        scope = $rootScope.$new();
                        spyOn(Trades, 'getTransformedTrades')
                                .andReturn({
                                    then: function (expression) {
                                        return expression({
                                            data: {
                                                totalCount: 51,
                                                trades: [{}, {}, {}]
                                            }
                                        });
                                    }
                                });

                        controller(TradesController, {
                            $scope: scope
                        });

                        _$httpBackend_.expectGET('http://someapi/trade-lookup-data')
                                 .respond(expectedLookupData);
                        scope.$root.$digest();
                    }));

                    it('Should have 25 trades per page', inject(function () {
                        expect(scope.options.take).toBe(25);
                        expect(scope.options.pager.pageSize).toBe(25);
                    }));

                    it('Should show boundary links when there are 51 results', inject(function () {
                        expect(scope.showBoundaryLinks).toBe(false);
                    }));
                });
            });
          
            
            describe('Synchronising filters', function() {
                beforeEach(inject(function ($rootScope, _$httpBackend_, Trades) {
                    scope = $rootScope.$new();
                    
                    spyOn(Trades, 'getTransformedTrades')
                           .andReturn({
                               then: function (expression) {
                                   return expression({
                                       data: {
                                           totalCount: 3,
                                           trades: [
                                               {

                                               }, {

                                               }, {

                                               }]
                                       },
                                       exportUrl: 'http//somefake/export/url'
                                   });
                               }
                           });
                    
                    _$httpBackend_.expectGET('http://someapi/trade-lookup-data')
                           .respond(expectedLookupData);
                }));

                describe('When we filter a fixed list', function () {
                    beforeEach(inject(function ($q, DataEndpoint, Dates, _$httpBackend_, $rootScope, Trades, LookupData) {
                        var fakeRouteParams = {
                            $filter: "(TradeLines/any(_1TradeLines: _1TradeLines/tradable_thing_class_editorial_label eq 'Commodity'))"
                        };
                        
                        spyOn(LookupData, 'getData').andReturn({
                            then: function (expression) {
                                expression({
                                    tradable_thing_class_editorial_label: [
                                        {
                                            "name": "Commodity",
                                            "label": "Commodity"
                                        },
                                        {
                                            "name": "Currency",
                                            "label": "Currency"
                                        },
                                        {
                                            "name": "Equity",
                                            "label": "Equity"
                                        },
                                        {
                                            "name": "Fixed Income",
                                            "label": "Fixed Income"
                                        }
                                    ]
                                });
                            }
                        });
                       
                        controller(TradesController, {
                            $scope: scope,
                            $routeParams: fakeRouteParams
                        });

                        scope.$root.$digest();
                    }));
                    
                    it('should mark the filter as selected', function () {
                        expect(scope.filters['TradeLines/tradable_thing_class_editorial_label'].selected).toEqual(['Commodity']);
                    });
                });
                
                describe('When we filter a free text filter', function () {
                    beforeEach(inject(function ($q, DataEndpoint, Dates, _$httpBackend_, $rootScope, Trades, LookupData) {
                        var fakeRouteParams = {
                            $filter: "$filter=((indexof(trade_editorial_label, 'trade') gt -1))"
                        };
                        
                        spyOn(LookupData, 'getData').andReturn({
                            then: function (expression) {
                                expression({
                                    trade_editorial_label: {
                                        "isFreeText": true,
                                        "options": [],
                                        "selected": []
                                    }
                                });
                            }
                        });
                       
                        controller(TradesController, {
                            $scope: scope,
                            $routeParams: fakeRouteParams
                        });

                        scope.$root.$digest();
                    }));

                    it('should mark the filter as selected', function () {
                        expect(scope.filters['trade_editorial_label'].selected).toEqual(['trade']);
                    });
                });
                
                describe('When we filter a date', function () {
                    beforeEach(inject(function ($q, DataEndpoint, Dates, _$httpBackend_, $rootScope, Trades, LookupData) {
                        var fakeRouteParams = {
                            $filter: "((instruction_entry_date ge datetime'2014-02-12') and (instruction_entry_date lt datetime'2014-02-13'))"
                        };

                        spyOn(LookupData, 'getData').andReturn({
                            then: function (expression) {
                                expression({
                                    instruction_entry_date: {
                                        "isDate": true,
                                        "date": null,
                                        "operator": "="
                                    }
                                });
                            }
                        });

                        controller(TradesController, {
                            $scope: scope,
                            $routeParams: fakeRouteParams
                        });

                        scope.$root.$digest();
                    }));

                    it('should mark the filter as selected', function () {
                        expect(scope.filters['instruction_entry_date'].date).toEqual('Feb 12, 2014');
                        expect(scope.filters['instruction_entry_date'].operator).toEqual('=');
                    });
                });
            });
            
            describe('Reloading filters', function () {
                beforeEach(inject(function ($rootScope, _$httpBackend_, Trades) {
                    scope = $rootScope.$new();

                    spyOn(Trades, 'getTransformedTrades')
                           .andReturn({
                               then: function (expression) {
                                   return expression({
                                       data: {
                                           totalCount: 3,
                                           trades: [
                                               {

                                               }, {

                                               }, {

                                               }]
                                       },
                                       exportUrl: 'http//somefake/export/url'
                                   });
                               }
                           });

                    _$httpBackend_.expectGET('http://someapi/trade-lookup-data')
                           .respond(expectedLookupData);
                }));

                describe('When we filter a fixed list', function () {
                    beforeEach(inject(function ($q, DataEndpoint, Dates, _$httpBackend_, $rootScope, Trades, LookupData) {
                        spyOn(LookupData, 'getData').andReturn({
                            then: function (expression) {
                                expression({
                                    tradable_thing_class_editorial_label: [
                                        {
                                            "name": "Commodity",
                                            "label": "Commodity"
                                        },
                                        {
                                            "name": "Currency",
                                            "label": "Currency"
                                        },
                                        {
                                            "name": "Equity",
                                            "label": "Equity"
                                        },
                                        {
                                            "name": "Fixed Income",
                                            "label": "Fixed Income"
                                        }
                                    ]
                                });
                            }
                        });

                        controller(TradesController, {
                            $scope: scope
                        });

                        scope.$root.$digest();
                    }));

                    it('should update the url', inject(function ($location) {
                        scope.filters['TradeLines/tradable_thing_class_editorial_label'].selected = ['Commodity'];
                        scope.reloadTrades();
                        expect($location.$$search).toEqual({
                            $orderby: 'last_updated asc',
                            $filter: "(TradeLines/any(_1TradeLines: _1TradeLines/tradable_thing_class_editorial_label eq 'Commodity'))",
                            showFavouritesOnly: false,
                            showFollowsOnly: false
                        });
                        
                    }));
                });

                describe('When we filter a free text filter', function () {
                    beforeEach(inject(function ($q, DataEndpoint, Dates, _$httpBackend_, $rootScope, Trades, LookupData) {
                        spyOn(LookupData, 'getData').andReturn({
                            then: function (expression) {
                                expression({
                                    trade_editorial_label: {
                                        "isFreeText": true,
                                        "options": [],
                                        "selected": []
                                    }
                                });
                            }
                        });

                        controller(TradesController, {
                            $scope: scope
                        });

                        scope.$root.$digest();
                    }));

                    it('should update the url', inject(function ($location) {
                        scope.filters['trade_editorial_label'].selected = ['trade'];
                        scope.reloadTrades();
                        expect($location.$$search).toEqual({
                            $orderby: 'last_updated asc',
                            $filter: "((indexof(trade_editorial_label, 'trade') gt -1))",
                            showFavouritesOnly: false,
                            showFollowsOnly: false
                        });

                    }));
                });

                describe('When we filter a date', function () {
                    beforeEach(inject(function ($q, DataEndpoint, Dates, _$httpBackend_, $rootScope, Trades, LookupData) {
                        spyOn(LookupData, 'getData').andReturn({
                            then: function (expression) {
                                expression({
                                    instruction_entry_date: {
                                        "isDate": true,
                                        "date": null,
                                        "operator": "="
                                    }
                                });
                            }
                        });

                        controller(TradesController, {
                            $scope: scope
                        });

                        scope.$root.$digest();
                    }));

                    it('should update the url', inject(function ($location) {
                        scope.filters['instruction_entry_date'].date = '2014-02-12';
                        scope.filters['instruction_entry_date'].operator = '=';
                        scope.reloadTrades();
                        expect($location.$$search).toEqual({
                            $orderby: 'last_updated asc',
                            $filter: "((instruction_entry_date ge datetime'2014-02-12') and (instruction_entry_date lt datetime'2014-02-13'))",
                            showFavouritesOnly: false,
                            showFollowsOnly: false
                        });

                    }));
                 
                });
                
                describe('When changing the order of a column', function () {
                    beforeEach(inject(function ($q, DataEndpoint, Dates, _$httpBackend_, $rootScope, Trades, LookupData) {
                        spyOn(LookupData, 'getData').andReturn({
                            then: function (expression) {
                                expression({
                                    instruction_entry_date: {
                                        "isDate": true,
                                        "date": null,
                                        "operator": "="
                                    }
                                });
                            }
                        });

                        controller(TradesController, {
                            $scope: scope
                        });

                        scope.$root.$digest();
                    }));

                    it('should default to ascending', inject(function ($location) {
                        scope.options.orderby = 'instruction_type_label';
                        scope.options.direction = 'asc';
                        scope.filters['instruction_entry_date'].date = '2014-02-12';
                        scope.filters['instruction_entry_date'].operator = '=';
                        
                        scope.reloadTrades({
                            'orderby': 'instruction_entry_date'
                        });
                        expect($location.$$search).toEqual({
                            $orderby: 'instruction_entry_date asc',
                            $filter: "((instruction_entry_date ge datetime'2014-02-12') and (instruction_entry_date lt datetime'2014-02-13'))",
                            showFavouritesOnly: false,
                            showFollowsOnly: false
                        });

                    }));

                });
                
                describe('When changing the order of a column already sorted', function () {
                    beforeEach(inject(function ($q, DataEndpoint, Dates, _$httpBackend_, $rootScope, Trades, LookupData) {
                        spyOn(LookupData, 'getData').andReturn({
                            then: function (expression) {
                                expression({
                                    instruction_entry_date: {
                                        "isDate": true,
                                        "date": null,
                                        "operator": "="
                                    }
                                });
                            }
                        });

                        controller(TradesController, {
                            $scope: scope
                        });

                        scope.$root.$digest();
                    }));

                    it('should revert the ordering', inject(function ($location) {
                        scope.options.orderby = 'instruction_entry_date';
                        scope.options.direction = 'asc';
                        scope.filters['instruction_entry_date'].date = '2014-02-12';
                        scope.filters['instruction_entry_date'].operator = '=';
                       
                        scope.reloadTrades({
                            'orderby': 'instruction_entry_date'
                        });
                        expect($location.$$search).toEqual({
                            $orderby: 'instruction_entry_date desc',
                            $filter: "((instruction_entry_date ge datetime'2014-02-12') and (instruction_entry_date lt datetime'2014-02-13'))",
                            showFavouritesOnly: false,
                            showFollowsOnly: false
                        });

                    }));

                });
            });
            
            describe('Update Ordering Options', function () {
                beforeEach(inject(function ($rootScope, _$httpBackend_, Trades) {
                    scope = $rootScope.$new();

                    spyOn(Trades, 'getTransformedTrades')
                           .andReturn({
                               then: function (expression) {
                                   return expression({
                                       data: {
                                           totalCount: 3,
                                           trades: [
                                               {

                                               }, {

                                               }, {

                                               }]
                                       }
                                   });
                               }
                           });

                    _$httpBackend_.expectGET('http://someapi/trade-lookup-data')
                           .respond(expectedLookupData);
                }));

                describe('When the url contains a order by property', function () {
                    beforeEach(inject(function () {
                        var fakeParams = {
                            $orderby: 'structure_type_label asc'
                        };
                        controller(TradesController, {
                            $scope: scope,
                            $routeParams: fakeParams
                        });

                        scope.$root.$digest();
                    }));

                    it('should aggregate the order by properties', function () {
                        scope.updateOrderingOptionsFromUrl();
                        expect(scope.options.orderby).toBe('structure_type_label');
                        expect(scope.options.direction).toBe('asc');
                    });
                });
                
                describe('When the url contains a order by trade_editorial_label asc property', function () {
                    beforeEach(inject(function () {
                        var fakeParams = {
                            $orderby: 'trade_editorial_label asc'
                        };
                        controller(TradesController, {
                            $scope: scope,
                            $routeParams: fakeParams
                        });

                        scope.$root.$digest();
                    }));
                    
                    it('should update', function () {
                        scope.updateOrderingOptionsFromUrl();
                        expect(scope.options.orderby).toBe('trade_editorial_label');
                        expect(scope.options.direction).toBe('asc');
                    });
                });

                
                describe('When the url does not contain a order by property', function () {
                    beforeEach(inject(function () {
                      
                        controller(TradesController, {
                            $scope: scope
                        });

                        scope.$root.$digest();
                    }));

                    it('should order by descending last updated', function () {
                        scope.updateOrderingOptionsFromUrl();
                        expect(scope.options.orderby).toBe('last_updated');
                        expect(scope.options.direction).toBe('desc');
                    });
                });
            });
            
        });
    });
});