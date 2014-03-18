define(['App/Controllers/Trades/TradeRelatedViewsController',
        'underscore',
        'angular',
        'mocks',
        'App/Services/services',
        'App/Controllers/controllers'
], function (TradeRelatedViewsController, _) {
    describe('TradesRelatedViewsController', function () {
        var scope, $httpBackend, flush, relatedView, relatedViews;

        beforeEach(function () {
            module('App.services');
            module('App.controllers');
        });

        beforeEach(function() {
            relatedView = {
                "@graph": [{
                    "@type": "TradeRecommendation",
                    "@id": "http://data.emii.com/bca/accept-test/trades/relatedviewsthemes/1",
                    "informedByView": {
                        "informedByTheme": {
                            "@type": "Theme",
                            "service": {
                                "@type": "Service",
                                "description": "Strategic investment ideas for China, Hong Kong and Taiwan along with a big picture overview of the economic and financial outlook for the greater-China region.",
                                "@id": "http://data.emii.com/bca/services/cis",
                                "canonicalLabel": "China Investment Strategy"
                            },
                            "@id": "http://data.emii.com/bca/accept-test/trades/relatedviewsthemes/theme/1",
                            "canonicalLabel": "Theme"
                        },
                        "viewOn": {
                            "@type": "",
                            "@id": "http://data.emii.com/economies/europe",
                            "canonicalLabel": "Europe"
                        },
                        "viewHorizon": "P12M",
                        "economicPosition": {
                            "@type": "EconomicPosition",
                            "@id": "http://data.emii.com/economic-positions/stronger",
                            "canonicalLabel": "Stronger"
                        },
                        "@type": "View",
                        "viewConviction": {
                            "@type": "ViewConviction",
                            "@id": "http://data.emii.com/view-convictions/high",
                            "canonicalLabel": "High"
                        },
                        "horizonEndDate": "2052-04-30",
                        "@id": "http://data.emii.com/bca/accept-test/trades/relatedviewsthemes/view/1",
                        "viewType": {
                            "@type": "ViewType",
                            "@id": "http://data.emii.com/view-types/relative",
                            "canonicalLabel": "Relative"
                        },
                        "service": {
                            "@type": "Service",
                            "description": "Forecasts, trading recommendations and technical indicators that highlight intermediate and primary trends for all major currencies.",
                            "@id": "http://data.emii.com/bca/services/fes",
                            "canonicalLabel": "Foreign Exchange Strategy"
                        },
                        "canonicalLabel": "View 1",
                        "horizonStartDate": "2013-05-01"
                    },
                    "canonicalLabel": "This is our trade recommendation"
                }]
            };

            relatedViews = {
                "@graph": [{
                    "@type": "TradeRecommendation",
                    "@id": "http://data.emii.com/bca/accept-test/trades/relatedviewsthemes/1",
                    "informedByView": {
                        "@set": [{
                                "informedByTheme": {
                                    "@type": "Theme",
                                    "service": {
                                        "@type": "Service",
                                        "description": "Strategic investment ideas for China, Hong Kong and Taiwan along with a big picture overview of the economic and financial outlook for the greater-China region.",
                                        "@id": "http://data.emii.com/bca/services/cis",
                                        "canonicalLabel": "China Investment Strategy"
                                    },
                                    "@id": "http://data.emii.com/bca/accept-test/trades/relatedviewsthemes/theme/1",
                                    "canonicalLabel": "Theme"
                                },
                                "viewOn": {
                                    "@type": "",
                                    "@id": "http://data.emii.com/economies/europe",
                                    "canonicalLabel": "Europe"
                                },
                                "viewHorizon": "P12M",
                                "economicPosition": {
                                    "@type": "EconomicPosition",
                                    "@id": "http://data.emii.com/economic-positions/stronger",
                                    "canonicalLabel": "Stronger"
                                },
                                "@type": "View",
                                "viewConviction": {
                                    "@type": "ViewConviction",
                                    "@id": "http://data.emii.com/view-convictions/high",
                                    "canonicalLabel": "High"
                                },
                                "horizonEndDate": "2052-04-30",
                                "@id": "http://data.emii.com/bca/accept-test/trades/relatedviewsthemes/view/1",
                                "viewType": {
                                    "@type": "ViewType",
                                    "@id": "http://data.emii.com/view-types/relative",
                                    "canonicalLabel": "Relative"
                                },
                                "service": {
                                    "@type": "Service",
                                    "description": "Forecasts, trading recommendations and technical indicators that highlight intermediate and primary trends for all major currencies.",
                                    "@id": "http://data.emii.com/bca/services/fes",
                                    "canonicalLabel": "Foreign Exchange Strategy"
                                },
                                "canonicalLabel": "View 1",
                                "horizonStartDate": "2013-05-01"
                            },
                            {
                                "informedByTheme": {
                                    "@type": "Theme",
                                    "service": {
                                        "@type": "Service",
                                        "description": "Strategic investment ideas for China, Hong Kong and Taiwan along with a big picture overview of the economic and financial outlook for the greater-China region.",
                                        "@id": "http://data.emii.com/bca/services/cis",
                                        "canonicalLabel": "China Investment Strategy"
                                    },
                                    "@id": "http://data.emii.com/bca/accept-test/trades/relatedviewsthemes/theme/1",
                                    "canonicalLabel": "Theme"
                                },
                                "viewOn": {
                                    "@type": "",
                                    "@id": "http://data.emii.com/economies/europe",
                                    "canonicalLabel": "Europe"
                                },
                                "viewHorizon": "P12M",
                                "fiscalPolicyPosition": {
                                    "@type": "FiscalPolicyPosition",
                                    "@id": "http://data.emii.com/economic-positions/stronger",
                                    "canonicalLabel": "Stronger"
                                },
                                "@type": "View",
                                "viewConviction": {
                                    "@type": "ViewConviction",
                                    "@id": "http://data.emii.com/view-convictions/high",
                                    "canonicalLabel": "High"
                                },
                                "horizonEndDate": "2052-04-30",
                                "@id": "http://data.emii.com/bca/accept-test/trades/relatedviewsthemes/view/1",
                                "viewType": {
                                    "@type": "ViewType",
                                    "@id": "http://data.emii.com/view-types/relative",
                                    "canonicalLabel": "Relative"
                                },
                                "service": {
                                    "@type": "Service",
                                    "description": "Forecasts, trading recommendations and technical indicators that highlight intermediate and primary trends for all major currencies.",
                                    "@id": "http://data.emii.com/bca/services/fes",
                                    "canonicalLabel": "Foreign Exchange Strategy"
                                },
                                "canonicalLabel": "View 1",
                                "horizonStartDate": "2013-05-01"
                            },
                            {
                                "informedByTheme": {
                                    "@type": "Theme",
                                    "service": {
                                        "@type": "Service",
                                        "description": "Strategic investment ideas for China, Hong Kong and Taiwan along with a big picture overview of the economic and financial outlook for the greater-China region.",
                                        "@id": "http://data.emii.com/bca/services/cis",
                                        "canonicalLabel": "China Investment Strategy"
                                    },
                                    "@id": "http://data.emii.com/bca/accept-test/trades/relatedviewsthemes/theme/1",
                                    "canonicalLabel": "Theme"
                                },
                                "viewOn": {
                                    "@type": "",
                                    "@id": "http://data.emii.com/economies/europe",
                                    "canonicalLabel": "Europe"
                                },
                                "viewHorizon": "P12M",
                                "monetaryPolicyPosition": {
                                    "@type": "MonetaryPolicyPosition",
                                    "@id": "http://data.emii.com/economic-positions/stronger",
                                    "canonicalLabel": "Stronger"
                                },
                                "@type": "View",
                                "viewConviction": {
                                    "@type": "ViewConviction",
                                    "@id": "http://data.emii.com/view-convictions/high",
                                    "canonicalLabel": "High"
                                },
                                "horizonEndDate": "2052-04-30",
                                "@id": "http://data.emii.com/bca/accept-test/trades/relatedviewsthemes/view/1",
                                "viewType": {
                                    "@type": "ViewType",
                                    "@id": "http://data.emii.com/view-types/relative",
                                    "canonicalLabel": "Relative"
                                },
                                "service": {
                                    "@type": "Service",
                                    "description": "Forecasts, trading recommendations and technical indicators that highlight intermediate and primary trends for all major currencies.",
                                    "@id": "http://data.emii.com/bca/services/fes",
                                    "canonicalLabel": "Foreign Exchange Strategy"
                                },
                                "canonicalLabel": "View 1",
                                "horizonStartDate": "2013-05-01"
                            },
                            {
                                "informedByTheme": {
                                    "@type": "Theme",
                                    "service": {
                                        "@type": "Service",
                                        "description": "Strategic investment ideas for China, Hong Kong and Taiwan along with a big picture overview of the economic and financial outlook for the greater-China region.",
                                        "@id": "http://data.emii.com/bca/services/cis",
                                        "canonicalLabel": "China Investment Strategy"
                                    },
                                    "@id": "http://data.emii.com/bca/accept-test/trades/relatedviewsthemes/theme/1",
                                    "canonicalLabel": "Theme"
                                },
                                "viewOn": {
                                    "@type": "",
                                    "@id": "http://data.emii.com/economies/europe",
                                    "canonicalLabel": "Europe"
                                },
                                "viewHorizon": "P12M",
                                "trendPosition": {
                                    "@type": "TrendPosition",
                                    "@id": "http://data.emii.com/economic-positions/stronger",
                                    "canonicalLabel": "Stronger"
                                },
                                "@type": "View",
                                "viewConviction": {
                                    "@type": "ViewConviction",
                                    "@id": "http://data.emii.com/view-convictions/high",
                                    "canonicalLabel": "High"
                                },
                                "horizonEndDate": "2052-04-30",
                                "@id": "http://data.emii.com/bca/accept-test/trades/relatedviewsthemes/view/1",
                                "viewType": {
                                    "@type": "ViewType",
                                    "@id": "http://data.emii.com/view-types/relative",
                                    "canonicalLabel": "Relative"
                                },
                                "service": {
                                    "@type": "Service",
                                    "description": "Forecasts, trading recommendations and technical indicators that highlight intermediate and primary trends for all major currencies.",
                                    "@id": "http://data.emii.com/bca/services/fes",
                                    "canonicalLabel": "Foreign Exchange Strategy"
                                },
                                "canonicalLabel": "View 1",
                                "horizonStartDate": "2013-05-01"
                            }],
                        "canonicalLabel": "This is our trade recommendation"
                    }
                }]
            };
        });

        describe('Given a TradeRelatedViewsController', function() {

            beforeEach(inject(function ($q, DataEndpoint, Dates, _$httpBackend_, $rootScope, $controller) {
                scope = $rootScope.$new();
                $httpBackend = _$httpBackend_;
                spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallFake(function() {
                    var deferred = $q.defer();
                    deferred.resolve('http://someapi/trade/views?uri=http://sometradeuri');
                    return deferred.promise;
                });                
                                
                $controller(TradeRelatedViewsController, {
                    $scope: scope
                });
            }));            

            flush = function()  {
                scope.$root.$digest();
                $httpBackend.flush();
            };

            describe('When we want to see views related to a particular trade', function () {
                var trade;
                
                beforeEach(function () {
                    trade = {
                        trade: {
                            'trade_uri': 'http://sometradeuri'
                        },
                        isInformationOpen: true
                    };                    
                });

                describe('And only one related view exists', function () {
                    beforeEach(function() {
                        $httpBackend.expectGET('http://someapi/trade/views?uri=http://sometradeuri').respond(relatedView);
                        scope.init(trade);
                        flush();
                    });
                    it('Should display the related view for the trade', inject(function (DataEndpoint) {
                        expect(trade.relatedViews[0]).toEqual(relatedView['@graph'][0].informedByView);
                        expect(DataEndpoint.getTemplatedEndpoint).toHaveBeenCalledWith('trade-relations', [{ key: 'uri', value: 'http://sometradeuri' }]);
                    }));
                });

                describe('And many related views exist', function() {
                    beforeEach(function () {
                        $httpBackend.expectGET('http://someapi/trade/views?uri=http://sometradeuri').respond(relatedViews);
                        scope.init(trade);
                        flush();
                    });
                    it('Should display the related views for the trade', inject(function (DataEndpoint) {
                        expect(trade.relatedViews.length).toBe(4);
                        expect(DataEndpoint.getTemplatedEndpoint).toHaveBeenCalledWith('trade-relations', [{ key: 'uri', value: 'http://sometradeuri' }]);
                    }));
                });
            });
        });
    });
});

