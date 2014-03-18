define(['underscore',
        'App/Services/PortfolioService',
        'angular',
        'mocks',
        'App/Services/services'], function(_) {
            describe('PortfolioService', function () {
                beforeEach(function() {
                    this.addMatchers({
                        toEqualData: function(expected) {
                            return angular.equals(this.actual, expected);
                        }
                    });
                });
                describe('Given we have a Portfolio Service', function () {
                    var scope,
                        $httpBackend,
                        templatedEndpointUrl = 'http://localhost/api',
                        expectedData;
                    
                    function promiseOf(stubResult) {
                        return {
                            then: function (callback) {
                                return promiseOf(callback(stubResult));
                            }
                        };
                    }

                    angular.module('PortfolioService.spec', [])
                        .service('DataEndpoint', ['$q', function() {
                            return {
                                getEndpoint: function() {
                                    return promiseOf(templatedEndpointUrl);
                                },
                                getTemplatedEndpoint: function() {
                                    return promiseOf(templatedEndpointUrl);
                                },
                                internaliseApiUrl: function(url) {
                                    return url;
                                }
                            };
                        }]);
                    
                    beforeEach(function () {
                        module('App');
                        module('PortfolioService.spec');
                    });

                    describe('Given we have related views and themes', function() {
                        beforeEach(function () {
                            expectedData = {
                                '@graph': [
                                            {
                                                "status": {
                                                    "@type": "Status",
                                                    "@id": "http://data.emii.com/status/published",
                                                    "canonicalLabel": "Published"
                                                },
                                                "@type": "Portfolio",
                                                "@id": "http://data.emii.com/bca/allocation/cis-low-risk-porfolio",
                                                "informedByView": {
                                                    "@set": [
                                                        {
                                                            "informedByTheme": {
                                                                "@type": "Theme",
                                                                "service": {
                                                                    "@type": "Service",
                                                                    "@id": "http://data.emii.com/bca/servicis/cis"
                                                                },
                                                                "@id": "http://data.emii.com/bca/themes/cis-theme4",
                                                                "canonicalLabel": "CONSTRUCTIVE BIAS TOWARDS COMMODITIES"
                                                            },
                                                            "viewOn": {
                                                                "@type": "Economy",
                                                                "@id": "http://data.emii.com/economies/fra",
                                                                "canonicalLabel": "French Economy"
                                                            },
                                                            "viewHorizon": "P9M",
                                                            "economicPosition": {
                                                                "@type": "EconomicPosition",
                                                                "@id": "http://data.emii.com/economic-positions/weaker",
                                                                "canonicalLabel": "Weaker"
                                                            },
                                                            "@type": "View",
                                                            "viewConviction": {
                                                                "@type": "ViewConviction",
                                                                "@id": "http://data.emii.com/view-convictions/medium",
                                                                "canonicalLabel": "Medium"
                                                            },
                                                            "service": {
                                                                "@type": "Service",
                                                                "description": "Strategic investment ideas for China, Hong Kong and Taiwan along with a big picture overview of the economic and financial outlook for the greater-China region.",
                                                                "@id": "http://data.emii.com/bca/services/cis",
                                                                "canonicalLabel": "China Investment Strategy"
                                                            },
                                                            "horizonEndDate": "2099-02-28",
                                                            "@id": "http://data.emii.com/bca/views/cis-view2",
                                                            "viewType": {
                                                                "@type": "ViewType",
                                                                "@id": "http://data.emii.com/view-types/economy",
                                                                "canonicalLabel": "Economy"
                                                            },
                                                            "canonicalLabel": "CIS France Economy 9 months (2013/06/15) weaker(E)",
                                                            "horizonStartDate": "2013-06-15"
                                                        },
                                                        {
                                                            "informedByTheme": {
                                                                "@set": [
                                                                    {
                                                                        "@type": "Theme",
                                                                        "service": {
                                                                            "@type": "Service",
                                                                            "@id": "http://data.emii.com/bca/servicis/cis"
                                                                        },
                                                                        "@id": "http://data.emii.com/bca/themes/cis-theme1",
                                                                        "canonicalLabel": "LIQUIDITY NOW, GROWTH LATER"
                                                                    },
                                                                    {
                                                                        "@type": "Theme",
                                                                        "service": {
                                                                            "@type": "Service",
                                                                            "@id": "http://data.emii.com/bca/servicis/cis"
                                                                        },
                                                                        "@id": "http://data.emii.com/bca/themes/cis-theme3",
                                                                        "canonicalLabel": "SHORT NATURAL GAS (2009-2012), PLAY RANGE IN 2013"
                                                                    },
                                                                    {
                                                                        "@type": "Theme",
                                                                        "service": {
                                                                            "@type": "Service",
                                                                            "@id": "http://data.emii.com/bca/servicis/cis"
                                                                        },
                                                                        "@id": "http://data.emii.com/bca/themes/cis-theme5",
                                                                        "canonicalLabel": "BEARISH GRAINS, ESPECIALLY WHEAT, ONCE WEATHER NORMALIZES"
                                                                    }
                                                                ]
                                                            },
                                                            "viewRelativeTo": {
                                                                "@type": "EquityMarket",
                                                                "@id": "http://data.emii.com/equity-markets/jpn",
                                                                "canonicalLabel": "Japanese Equities"
                                                            },
                                                            "viewOn": {
                                                                "@type": "Economy",
                                                                "@id": "http://data.emii.com/economies/europe",
                                                                "canonicalLabel": "European Economy"
                                                            },
                                                            "viewHorizon": "P12M",
                                                            "economicPosition": {
                                                                "@type": "EconomicPosition",
                                                                "@id": "http://data.emii.com/economic-positions/weaker",
                                                                "canonicalLabel": "Weaker"
                                                            },
                                                            "@type": "View",
                                                            "viewConviction": {
                                                                "@type": "ViewConviction",
                                                                "@id": "http://data.emii.com/view-convictions/high",
                                                                "canonicalLabel": "High"
                                                            },
                                                            "service": {
                                                                "@type": "Service",
                                                                "description": "Strategic investment ideas for China, Hong Kong and Taiwan along with a big picture overview of the economic and financial outlook for the greater-China region.",
                                                                "@id": "http://data.emii.com/bca/services/cis",
                                                                "canonicalLabel": "China Investment Strategy"
                                                            },
                                                            "horizonEndDate": "2099-04-30",
                                                            "@id": "http://data.emii.com/bca/views/cis-view1",
                                                            "viewType": {
                                                                "@type": "ViewType",
                                                                "@id": "http://data.emii.com/view-types/relative",
                                                                "canonicalLabel": "Relative"
                                                            },
                                                            "canonicalLabel": "CIS Europe 12 months (2013/05/01) weaker(E)",
                                                            "horizonStartDate": "2013-05-01"
                                                        },
                                                        {
                                                            "viewRecommendationType": {
                                                                "@type": "ViewRecommendationType",
                                                                "@id": "http://data.emii.com/view-recommendation-types/strategic",
                                                                "canonicalLabel": "Strategic"
                                                            },
                                                            "viewHorizon": "P3M",
                                                            "viewOn": {
                                                                "@type": "Currency",
                                                                "@id": "http://data.emii.com/currencies/chf",
                                                                "canonicalLabel": "Swiss franc"
                                                            },
                                                            "@type": "View",
                                                            "horizonEndDate": "2099-02-28",
                                                            "viewDirection": {
                                                                "@type": "ViewDirection",
                                                                "@id": "http://data.emii.com/view-directions/neutral",
                                                                "canonicalLabel": "Neutral"
                                                            },
                                                            "viewType": {
                                                                "@type": "ViewType",
                                                                "@id": "http://data.emii.com/view-types/absolute",
                                                                "canonicalLabel": "Absolute"
                                                            },
                                                            "canonicalLabel": "CIS Swiss franc Absolute 3 months (2013/08/13) medium(E)",
                                                            "horizonStartDate": "2013-08-13",
                                                            "viewConviction": {
                                                                "@type": "ViewConviction",
                                                                "@id": "http://data.emii.com/view-convictions/high",
                                                                "canonicalLabel": "High"
                                                            },
                                                            "service": {
                                                                "@type": "Service",
                                                                "description": "Strategic investment ideas for China, Hong Kong and Taiwan along with a big picture overview of the economic and financial outlook for the greater-China region.",
                                                                "@id": "http://data.emii.com/bca/services/cis",
                                                                "canonicalLabel": "China Investment Strategy"
                                                            },
                                                            "@id": "http://data.emii.com/bca/views/cis-view6"
                                                        }
                                                    ]
                                                },
                                                "canonicalLabel": "Portfolio One"
                                            }
                                ]
                            };
                        });

                        describe('When we get the related views', function () {
                            describe('And the server returns some data', function () {
                                beforeEach(inject(function (_$httpBackend_, $rootScope) {
                                    $httpBackend = _$httpBackend_;

                                    $httpBackend.expectGET(templatedEndpointUrl)
                                                .respond(expectedData);
                                    scope = $rootScope;
                                }));

                                it('3 related views should be returned', inject(function (Portfolio) {
                                    Portfolio.getPortfolioRelatedViews({
                                        uri: 'http://data.emii.com/bca/allocation/cis-low-risk-porfolio'
                                    }).then(function (data) {
                                        expect(data.length).toBe(3);
                                    });
                                    scope.$root.$digest();
                                    $httpBackend.flush();
                                }));

                                it('all views should have an array of themes', inject(function (Portfolio) {
                                    Portfolio.getPortfolioRelatedViews({
                                        uri: 'http://data.emii.com/bca/allocation/cis-low-risk-porfolio'
                                    }).then(function (data) {
                                        expect(_.isArray(data[0].informedByTheme['@set'])).toBe(true);
                                        expect(_.isArray(data[1].informedByTheme['@set'])).toBe(true);
                                        expect(_.isArray(data[2].informedByTheme['@set'])).toBe(true);
                                    });
                                    scope.$root.$digest();
                                    $httpBackend.flush();
                                }));
                                
                                afterEach(function () {
                                    $httpBackend.verifyNoOutstandingExpectation();
                                    $httpBackend.verifyNoOutstandingRequest();
                                });
                            });


                            it('Should pass the right parameters', inject(function (Portfolio, DataEndpoint, $q) {
                                spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallFake(function () {
                                    var deferred = $q.defer();
                                    deferred.resolve(expectedData);
                                    return deferred.promise;
                                });

                                Portfolio.getPortfolioRelatedViews({ uri: 'http://data.emii.com/bca/allocation/cis-low-risk-porfolio' })
                                    .then(function (data) {
                                    });
                                scope.$root.$digest();

                                expect(DataEndpoint.getTemplatedEndpoint).toHaveBeenCalledWith(['bca-trades', 'allocation-related-views'], [{
                                    key: 'uri',
                                    value: 'http://data.emii.com/bca/allocation/cis-low-risk-porfolio'
                                }]);
                            }));

                        });


                    });
                  
                    describe('Given we have a single related view', function () {
                        beforeEach(function () {
                            expectedData = {
                                '@graph': [
                                            {
                                                "status": {
                                                    "@type": "Status",
                                                    "@id": "http://data.emii.com/status/published",
                                                    "canonicalLabel": "Published"
                                                },
                                                "@type": "Portfolio",
                                                "@id": "http://data.emii.com/bca/allocation/cis-low-risk-porfolio",
                                                "informedByView": {
                                                    "viewOn": {
                                                        "@type": "Economy",
                                                        "@id": "http://data.emii.com/economies/fra",
                                                        "canonicalLabel": "French Economy"
                                                    },
                                                    "viewHorizon": "P9M",
                                                    "economicPosition": {
                                                        "@type": "EconomicPosition",
                                                        "@id": "http://data.emii.com/economic-positions/weaker",
                                                        "canonicalLabel": "Weaker"
                                                    },
                                                    "@type": "View",
                                                    "viewConviction": {
                                                        "@type": "ViewConviction",
                                                        "@id": "http://data.emii.com/view-convictions/medium",
                                                        "canonicalLabel": "Medium"
                                                    },
                                                    "service": {
                                                        "@type": "Service",
                                                        "description": "Strategic investment ideas for China, Hong Kong and Taiwan along with a big picture overview of the economic and financial outlook for the greater-China region.",
                                                        "@id": "http://data.emii.com/bca/services/cis",
                                                        "canonicalLabel": "China Investment Strategy"
                                                    },
                                                    "horizonEndDate": "2099-02-28",
                                                    "@id": "http://data.emii.com/bca/views/cis-view2",
                                                    "viewType": {
                                                        "@type": "ViewType",
                                                        "@id": "http://data.emii.com/view-types/economy",
                                                        "canonicalLabel": "Economy"
                                                    },
                                                    "canonicalLabel": "CIS France Economy 9 months (2013/06/15) weaker(E)",
                                                    "horizonStartDate": "2013-06-15"
                                                },
                                                "canonicalLabel": "Portfolio One"
                                            }
                                ]
                            };
                        });

                        describe('When we get the related views', function () {
                            describe('And the server returns some data', function () {
                                beforeEach(inject(function (_$httpBackend_, $rootScope) {
                                    $httpBackend = _$httpBackend_;

                                    $httpBackend.expectGET(templatedEndpointUrl)
                                                .respond(expectedData);
                                    scope = $rootScope;
                                }));

                                it('1 related views should be returned', inject(function (Portfolio) {
                                    Portfolio.getPortfolioRelatedViews({
                                        uri: 'http://data.emii.com/bca/allocation/cis-low-risk-porfolio'
                                    }).then(function (data) {
                                        expect(data.length).toBe(1);
                                    });
                                    scope.$root.$digest();
                                    $httpBackend.flush();
                                }));

                                afterEach(function () {
                                    $httpBackend.verifyNoOutstandingExpectation();
                                    $httpBackend.verifyNoOutstandingRequest();
                                });
                            });
                        });


                    });
                });
            });
        });