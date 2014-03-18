define(['underscore',
        'App/Services/TradeService',
        'angular',
        'mocks',
        'App/Services/services'], function(_) {
            describe('Trade Service', function() {
                describe('Given we have a Trade Service', function() {
                    var scope,
                        $httpBackend,
                        endpointUrl = 'http://localhost/api/trades';

                    angular.module('TradeService.spec', []).service('DataEndpoint', ['$q', function($q) {
                        return {
                            getTemplatedEndpoint: function() {
                                var deferred = $q.defer();
                                deferred.resolve(endpointUrl);
                                return deferred.promise;
                            },
                            getEndpoint: function () {
                                var deferred = $q.defer();
                                deferred.resolve(endpointUrl);
                                return deferred.promise;
                            }
                        };
                    }]);

                    beforeEach(function() {
                        module('App');
                        module('TradeService.spec');
                    });

                    describe('Given trades', function () {
                        var serverData;
                        beforeEach(inject(function (_$httpBackend_, $rootScope, UrlProvider, TradesColumns) {
                            scope = $rootScope.$new();
                            serverData = {
                                "odata.metadata": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/bca/$metadata#Trades",
                                "odata.count": "3",
                                "value": [
                                    {
                                        "TradeLines": [
                                            {
                                                "trade_line_id": 1,
                                                "trade_line_label": "Short Gold",
                                                "trade_line_editorial_label": "Short Gold",
                                                "trade_line_group_label": "Short Gold",
                                                "trade_line_group_id": 1,
                                                "trade_line_group_type_id": 3,
                                                "trade_line_group_type_label": "Long/Short Pair",
                                                "tradable_thing_id": 2,
                                                "tradable_thing_uri": "<http://data.emii.com/commodities-markets/gold>",
                                                "tradable_thing_label": "Gold",
                                                "tradable_thing_class_id": 2,
                                                "tradable_thing_class_uri": "<http://data.emii.com/ontologies/economy/CommodityMarket>",
                                                "tradable_thing_class_label": "CommodityMarket",
                                                "tradable_thing_class_editorial_label": "Commodities",
                                                "position_id": 4,
                                                "position_uri": "http://data.emii.com/absolute-trade-line-position/short",
                                                "position_label": "Short",
                                                "trade_id": 1,
                                                "trade_line_group_editorial_label": "Short Gold"
                                            }
                                        ],
                                        "trade_id": 1,
                                        "service_code": "GIS",
                                        "length_type_label": "Tactical",
                                        "trade_editorial_label": "GIS Tactical Short Gold",
                                        "structure_type_label": "Single",
                                        "last_updated": "2013-11-04T13:20:44.39",
                                        "instruction_entry": "12.74340",
                                        "instruction_entry_date": "2013-10-29T13:20:44.39",
                                        "instruction_exit": null,
                                        "instruction_exit_date": "2013-10-31T13:20:44.39",
                                        "instruction_label": "instruction label for trade 1",
                                        "instruction_type_label": "Buy stop",
                                        "absolute_performance": "1.0",
                                        "absolute_measure_type": "BPS",
                                        "absolute_currency_code": null,
                                        "relative_performance": "80",
                                        "relative_measure_type": "Percent",
                                        "benchmark_label": "S&P 500",
                                        "relative_currency_code": null,
                                        "isOpen": false
                                    },
                                    {
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
                                                "tradable_thing_uri": null,
                                                "tradable_thing_label": "Italy 10-years",
                                                "tradable_thing_class_id": 1,
                                                "tradable_thing_class_uri": "<http://data.emii.com/ontologies/economy/FixedIncomeMarket>",
                                                "tradable_thing_class_label": "FixedIncomeMarket",
                                                "tradable_thing_class_editorial_label": "Fixed Income",
                                                "position_id": 3,
                                                "position_uri": "http://data.emii.com/absolute-trade-line-position/long",
                                                "position_label": "Long",
                                                "trade_id": 2,
                                                "trade_line_group_editorial_label": "Long Italy 10-year vs. Germany"
                                            },
                                            {
                                                "trade_line_id": 3,
                                                "trade_line_label": "Short Germany 10-year Bonds",
                                                "trade_line_editorial_label": "Short Germany 10-year Bonds",
                                                "trade_line_group_label": "Long Italy 10-year vs. Germany",
                                                "trade_line_group_id": 2,
                                                "trade_line_group_type_id": 2,
                                                "trade_line_group_type_label": "Box",
                                                "tradable_thing_id": 5,
                                                "tradable_thing_uri": null,
                                                "tradable_thing_label": "Germany 10-years",
                                                "tradable_thing_class_id": 1,
                                                "tradable_thing_class_uri": "<http://data.emii.com/ontologies/economy/FixedIncomeMarket>",
                                                "tradable_thing_class_label": "FixedIncomeMarket",
                                                "tradable_thing_class_editorial_label": "Fixed Income",
                                                "position_id": 4,
                                                "position_uri": "http://data.emii.com/absolute-trade-line-position/short",
                                                "position_label": "Short",
                                                "trade_id": 2,
                                                "trade_line_group_editorial_label": "Long Italy 10-year vs. Germany"
                                            },
                                            {
                                                "trade_line_id": 4,
                                                "trade_line_label": "Short Italy 2-year Bonds",
                                                "trade_line_editorial_label": "Short Italy 2-year Bonds",
                                                "trade_line_group_label": "Short Italy 2-year vs. Germany",
                                                "trade_line_group_id": 3,
                                                "trade_line_group_type_id": 2,
                                                "trade_line_group_type_label": "Box",
                                                "tradable_thing_id": 4,
                                                "tradable_thing_uri": null,
                                                "tradable_thing_label": "Italy 2-years",
                                                "tradable_thing_class_id": 1,
                                                "tradable_thing_class_uri": "<http://data.emii.com/ontologies/economy/FixedIncomeMarket>",
                                                "tradable_thing_class_label": "FixedIncomeMarket",
                                                "tradable_thing_class_editorial_label": "Fixed Income",
                                                "position_id": 4,
                                                "position_uri": "http://data.emii.com/absolute-trade-line-position/short",
                                                "position_label": "Short",
                                                "trade_id": 2,
                                                "trade_line_group_editorial_label": "Short Italy 2-year vs. Germany"
                                            },
                                            {
                                                "trade_line_id": 5,
                                                "trade_line_label": "Long Germany 2-year Bonds",
                                                "trade_line_editorial_label": "Long Germany 2-year Bonds",
                                                "trade_line_group_label": "Short Italy 2-year vs. Germany",
                                                "trade_line_group_id": 3,
                                                "trade_line_group_type_id": 2,
                                                "trade_line_group_type_label": "Box",
                                                "tradable_thing_id": 6,
                                                "tradable_thing_uri": null,
                                                "tradable_thing_label": "Germany 2-years",
                                                "tradable_thing_class_id": 1,
                                                "tradable_thing_class_uri": "<http://data.emii.com/ontologies/economy/FixedIncomeMarket>",
                                                "tradable_thing_class_label": "FixedIncomeMarket",
                                                "tradable_thing_class_editorial_label": "Fixed Income",
                                                "position_id": 3,
                                                "position_uri": "http://data.emii.com/absolute-trade-line-position/long",
                                                "position_label": "Long",
                                                "trade_id": 2,
                                                "trade_line_group_editorial_label": "Short Italy 2-year vs. Germany"
                                            }
                                        ],
                                        "trade_id": 2,
                                        "service_code": "GIS",
                                        "length_type_label": "Strategic",
                                        "trade_editorial_label": "GIS Strategic Italy vs. Germany. 2/10 Box (Long Italy 10-year vs. Germany; short Italy 2-year vs. Germany)",
                                        "structure_type_label": "Box",
                                        "last_updated": "2013-11-03T13:20:44.39",
                                        "instruction_entry": "0.85500",
                                        "instruction_entry_date": "2013-11-10T13:20:44.39",
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
                                        "isOpen": true
                                    },
                                    {
                                        "TradeLines": [
                                            {
                                                "trade_line_id": 6,
                                                "trade_line_label": "Long Mexican Peso",
                                                "trade_line_editorial_label": "Long MXN",
                                                "trade_line_group_label": "Long Mexician Peso / Short U.S. Dollar",
                                                "trade_line_group_id": 4,
                                                "trade_line_group_type_id": 4,
                                                "trade_line_group_type_label": "Strategy",
                                                "tradable_thing_id": 7,
                                                "tradable_thing_uri": "<http://data.emii.com/currencies/mxn>",
                                                "tradable_thing_label": "Mexican peso",
                                                "tradable_thing_class_id": 3,
                                                "tradable_thing_class_uri": "<http://data.emii.com/ontologies/economy/Currency>",
                                                "tradable_thing_class_label": "Currency",
                                                "tradable_thing_class_editorial_label": "Currency",
                                                "position_id": 3,
                                                "position_uri": "http://data.emii.com/absolute-trade-line-position/long",
                                                "position_label": "Long",
                                                "trade_id": 3,
                                                "trade_line_group_editorial_label": "Long Mexician Peso / Short U.S. Dollar"
                                            },
                                            {
                                                "trade_line_id": 7,
                                                "trade_line_label": "Short U.S. Dollar",
                                                "trade_line_editorial_label": "Short USD",
                                                "trade_line_group_label": "Long Mexician Peso / Short U.S. Dollar",
                                                "trade_line_group_id": 4,
                                                "trade_line_group_type_id": 4,
                                                "trade_line_group_type_label": "Strategy",
                                                "tradable_thing_id": 8,
                                                "tradable_thing_uri": "<http://data.emii.com/currencies/usd>",
                                                "tradable_thing_label": "U.S. dollar",
                                                "tradable_thing_class_id": 3,
                                                "tradable_thing_class_uri": "<http://data.emii.com/ontologies/economy/Currency>",
                                                "tradable_thing_class_label": "Currency",
                                                "tradable_thing_class_editorial_label": "Currency",
                                                "position_id": 4,
                                                "position_uri": "http://data.emii.com/absolute-trade-line-position/short",
                                                "position_label": "Short",
                                                "trade_id": 3,
                                                "trade_line_group_editorial_label": "Long Mexician Peso / Short U.S. Dollar"
                                            }
                                        ],
                                        "trade_id": 3,
                                        "service_code": "GIS",
                                        "length_type_label": "Tactical",
                                        "trade_editorial_label": "GIS Tactical Long Mexician Peso / Short U.S. Dollar",
                                        "structure_type_label": "Single",
                                        "last_updated": "2013-11-03T13:20:44.39",
                                        "instruction_entry": "1.00000",
                                        "instruction_entry_date": "2013-11-12T13:20:44.39",
                                        "instruction_exit": null,
                                        "instruction_exit_date": null,
                                        "instruction_label": "instruction label for trade 3",
                                        "instruction_type_label": "Buy stop",
                                        "absolute_performance": null,
                                        "absolute_measure_type": null,
                                        "absolute_currency_code": null,
                                        "relative_performance": null,
                                        "relative_measure_type": null,
                                        "benchmark_label": null,
                                        "relative_currency_code": null,
                                        "isOpen": true
                                    }
                                ]
                            };
                            
                            $httpBackend = _$httpBackend_;

                            spyOn(UrlProvider, 'getTradesExportUrl').andReturn('http://somefake/export/url');
                            
                            spyOn(TradesColumns, 'getColumns').andReturn({
                                "favourites": {
                                    label: "Favourites",
                                    key: "favourites",
                                    isMandatory: true,
                                    isDefault: true,
                                    defaultOrdinal: 0,
                                    defaultWidth: 20,
                                    isExportable: true
                                },
                                "service_code": {
                                    label: "Service",
                                    key: "service_code",
                                    isMandatory: true,
                                    isDefault: true,
                                    defaultOrdinal: 1,
                                    maxWidth: 125,
                                    defaultWidth: 80,
                                    isExportable: true
                                }
                            });
                        }));
                        
                        afterEach(function () {
                            $httpBackend.verifyNoOutstandingRequest();
                        });
                        describe('When loading the trades', function() {
                            it('should default to 25 trades per page', inject(function (Trades) {
                                var url = 'http://localhost/api/trades?$inlinecount=allpages&$orderby=last_updated+desc&$skip=0&$top=25';
                                $httpBackend.expectGET(url)
                                    .respond(serverData);
                                Trades.loadTrades().then(function (data) {
                                    expect(data).toEqual({ data: serverData, tradesBaseUrl: 'http://localhost/api/trades' });
                                });

                                scope.$root.$digest();
                                $httpBackend.flush();

                            }));

                            it('should be able to override page settings', inject(function (Trades) {
                                var url = 'http://localhost/api/trades?$inlinecount=allpages&$orderby=last_updated+desc&$skip=100&$top=20';
                                $httpBackend.expectGET(url)
                                    .respond(serverData);
                                Trades.loadTrades({
                                    page: 5,
                                    pageSize: 20
                                }).then(function (data) {
                                    expect(data).toEqual({ data: serverData, tradesBaseUrl: 'http://localhost/api/trades' });
                                });

                                scope.$root.$digest();
                                $httpBackend.flush();

                            }));

                            describe('When an error happens', function () {
                                it('should reject the promise', inject(function (Trades) {
                                    var url = 'http://localhost/api/trades?$inlinecount=allpages&$orderby=last_updated+desc&$skip=0&$top=25',
                                        promiseRejected = false;
                                    $httpBackend.expectGET(url)
                                        .respond(500, {});
                                    Trades.loadTrades().then(function (data) {

                                    }, function (data) {
                                        promiseRejected = true;
                                    });
                                    scope.$root.$digest();
                                    $httpBackend.flush();
                                    expect(promiseRejected).toBe(true);
                                }));
                            });
                        });

                        describe('When transforming the trades', function() {
                            it('should transform the data correctly', inject(function (Trades) {
                                var url = 'http://localhost/api/trades';
                                $httpBackend.expectGET(url)
                                    .respond(serverData);
                                
                                Trades.getTransformedTrades()
                                    .then(function(result) {
                                        expect(result.data.trades.length).toBe(3);
                                        expect(result.data.totalCount).toBe(3);

                                        expect(result.data.trades[0].trade).toEqual(serverData.value[0]);
                                        expect(result.data.trades[0].isPerformanceEmpty).toBe(true);
                                        expect(result.data.trades[0].isPerformanceLoaded).toBe(false);
                                        expect(result.data.trades[0].relatedViews).toEqual([]);
                                        expect(result.data.trades[0].relatedThemes).toEqual([]);
                                        expect(result.data.trades[0].linkedTrades.count).toBe('');
                                        expect(result.data.trades[0].linkedTrades.items).toEqual([]);
                                        
                                        expect(result.data.trades[0].trade.trade_line_id).toBe(1);
                                        expect(result.data.trades[0].trade.tradable_thing_class_editorial_label).toBe('Commodities');
                                        expect(result.data.trades[0].trade.position_label).toBe('Short');
                                        expect(result.data.trades[0].trade.location_label).toBeUndefined();
                                        
                                        expect(result.data.trades[1].groups.length).toBe(2);
                                        expect(result.data.trades[1].groups[0].isVisible).toBe(false);
                                        expect(result.data.trades[1].groups[0].group_id).toBe('2'); // trade_line_group_id
                                        expect(result.data.trades[1].groups[0].group_type_label).toBe('Box'); // trade_line_group_type_label
                                        expect(result.data.trades[1].groups[0].group_editorial_label).toBe('Long Italy 10-year vs. Germany'); // trade_line_group_editorial_label
                                        expect(result.data.trades[1].groups[0].lines.length).toBe(2);

                                        expect(result.data.trades[1].groups[0].lines[0].trade_line_id).toBe(2);
                                        expect(result.data.trades[1].groups[0].lines[0].tradable_thing_class_editorial_label).toBe('Fixed Income');
                                        expect(result.data.trades[1].groups[0].lines[0].position_label).toBe('Long');
                                        expect(result.data.trades[1].groups[0].lines[0].tradable_thing_label).toBe('Italy 10-years');
                                        expect(result.data.trades[1].groups[0].lines[0].location_label).toBeUndefined();
                                        expect(result.data.trades[1].groups[0].lines[0].tradable_thing_code).toBeUndefined();
                                        
                                        expect(result.data.trades[1].trade.tradable_thing_code).toBe('');

                                        expect(result.tradesBaseUrl).toBe('http://localhost/api/trades');
                                    });
                                
                                scope.$root.$digest();
                                $httpBackend.flush();
                            }));

                            it('should be able to filter favourites', inject(function (Trades) {
                                var url = "http://localhost/api/trades?$expand=TradeLines,LinkedTrade&$filter=isClosedFor7DaysOrMore+eq+false&$inlinecount=allpages&$orderby=&$skip=0&$top=25&showFavouritesOnly=true";
                                $httpBackend.expectGET(url)
                                    .respond(serverData);
                                
                                Trades.getTransformedTrades({
                                    $skip: 0,
                                    $top: 25,
                                    $inlinecount: 'allpages',
                                    $filter: 'isClosedFor7DaysOrMore eq false',
                                    $expand: 'TradeLines,LinkedTrade',
                                    showFavouritesOnly: true,
                                    $orderby: ''
                                }).then(function() {
                                });
                                
                                scope.$root.$digest();
                                $httpBackend.flush();
                            }));
                            
                            it('should be able to sort', inject(function (Trades) {
                                var url = "http://localhost/api/trades?$expand=TradeLines,LinkedTrade&$filter=isClosedFor7DaysOrMore+eq+false&$inlinecount=allpages&$orderby=last_updated+desc,trade_editorial_label&$skip=0&$top=25";
                                $httpBackend.expectGET(url)
                                    .respond(serverData);

                                Trades.getTransformedTrades({
                                    $skip: 0,
                                    $top: 25,
                                    $inlinecount: 'allpages',
                                    $filter: 'isClosedFor7DaysOrMore eq false',
                                    $expand: 'TradeLines,LinkedTrade',
                                    $orderby: 'last_updated desc,trade_editorial_label'
                                }).then(function () {
                                });

                                scope.$root.$digest();
                                $httpBackend.flush();
                            }));
                            
                            it('should be able to paginate', inject(function (Trades) {
                                var url = "http://localhost/api/trades?$skip=0&$top=25";
                                $httpBackend.expectGET(url)
                                    .respond(serverData);

                                Trades.getTransformedTrades({
                                    $skip: 0,
                                    $top: 25
                                }).then(function () {
                                });

                                scope.$root.$digest();
                                $httpBackend.flush();
                            }));
                        });
                    });
                });
            });
        });
