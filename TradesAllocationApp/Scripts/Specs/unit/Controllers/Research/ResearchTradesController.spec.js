define(['App/Controllers/Research/ResearchTradesController',
        'underscore',
        'moment',
        'angular',
        'resource',
        'mocks',
        'App/Controllers/controllers'], function (ResearchTradesController) {
            describe('Research Trades Controller', function () {
                describe('Given we have a research trades controller', function () {
                    var controller,
                        scope;

                    var viewable = {
                        '@id': 'http://data.emii.com/commodities-markets/gold'
                    };
                    beforeEach(function () {
                        module('App');
                    });

                    beforeEach(inject(function ($rootScope, $controller, Trades) {

                        scope = $rootScope.$new();
                        
                        scope.$parent.viewable = viewable;
                        spyOn(Trades, 'loadTrades').andCallFake(function (data) {
                            var response = [
                                {
                                    "trade_id": 54,
                                    "service_code": "FES",
                                    "length_type_label": "Tactical",
                                    "trade_editorial_label": "FES Editorial Label",
                                    "structure_type_label": "Box",
                                    "last_updated": "2013-11-15T15:24:01.04",
                                    "absolute_performance": "11",
                                    "absolute_measure_type": "BPS",
                                    "isOpen": true
                                },
                                {
                                    "trade_id": 55,
                                    "service_code": "BCAH",
                                    "length_type_label": "Strategic",
                                    "trade_editorial_label": "BCA Editorial Label",
                                    "structure_type_label": "Box",
                                    "last_updated": "2013-11-15T15:24:01.04",
                                    "absolute_performance": "11",
                                    "absolute_measure_type": "BPS",
                                    "isOpen": true
                                },
                                {
                                    "trade_id": 56,
                                    "service_code": "CES",
                                    "length_type_label": "Strategic",
                                    "trade_editorial_label": "CES Editorial Label",
                                    "structure_type_label": "Box",
                                    "last_updated": "2013-11-15T15:24:01.04",
                                    "absolute_performance": "11",
                                    "absolute_measure_type": "BPS",
                                    "isOpen": true
                                }
                            ];
                            return {
                                then: function(expression) {
                                    return expression({
                                        data: {
                                            'odata.count': 3,
                                            value: response.slice(data.page * data.pageSize, (data.page + 1) * data.pageSize)
                                        }
                                    });
                                }
                            };
                        });
                        controller = $controller(ResearchTradesController, {
                            $scope: scope
                        });
                        scope.pageSize = 2;
                        $rootScope.$digest();
                    }));

                    describe('When the parent scope viewable changes', function () {
                        it("should call the trades service", inject(function ($rootScope, Trades) {
                           
                            expect(Trades.loadTrades).toHaveBeenCalledWith({
                                filter: 'isOpen eq true and TradeLines/any(x:x/tradable_thing_uri eq \'http://data.emii.com/commodities-markets/gold\')',
                                pageSize: 2,
                                page: 0
                            });
                        }));
                        
                        it("should load a page of trades", function () {
                            expect(scope.trades.length).toEqual(2);
                            expect(scope.trades[0]).toEqual(
                               {
                                   type: 'Tactical',
                                   tradeStructure: 'Box',
                                   description: 'FES Editorial Label',
                                   service: 'FES',
                                   performance: '11 BPS',
                                   lastUpdated: '2013-11-15T15:24:01.04',
                                   url: '#/trade/54'
                               } 
                            );
                        });
                        
                        it("set the loaded flag", function () {
                            expect(scope.loaded).toBe(true);
                        });
                        
                        it("totalCount should be 3", function () {
                            expect(scope.totalCount).toBe(3);
                        });
                        
                        it("page should increase to 1", function () {
                            expect(scope.page).toBe(1);
                        });
                        
                        it("canShowMore should be true", function () {
                            expect(scope.canShowMore).toBe(true);
                        });

                        describe('When loading an extra page of data', function() {
                            beforeEach(function() {
                                scope.showMore();
                                scope.$root.$digest();
                            });

                            it('should fetch an extra page of data', inject(function(Trades) {
                                expect(Trades.loadTrades).toHaveBeenCalledWith({
                                    filter: 'isOpen eq true and TradeLines/any(x:x/tradable_thing_uri eq \'http://data.emii.com/commodities-markets/gold\')',
                                    pageSize: 2,
                                    page: 1
                                });
                            }));
                            
                            it("page should increase to 2", function () {
                                expect(scope.page).toBe(2);
                            });

                            it("canShowMore should be false", function () {
                                expect(scope.canShowMore).toBe(false);
                            });

                            describe('And changing viewable', function() {
                                beforeEach(function() {
                                    scope.$parent.viewable = {
                                        '@id': 'http://data.emii.com/commodities-markets/silver'
                                    };

                                    scope.$root.$digest();
                                });

                                it("should call the trades service for the new viewable", inject(function ($rootScope, Trades) {
                                    expect(Trades.loadTrades).toHaveBeenCalledWith({
                                        filter: 'isOpen eq true and TradeLines/any(x:x/tradable_thing_uri eq \'http://data.emii.com/commodities-markets/silver\')',
                                        pageSize: 2,
                                        page: 0
                                    });
                                }));
                            });
                        });
                    });

                    
                });
            });
        });

