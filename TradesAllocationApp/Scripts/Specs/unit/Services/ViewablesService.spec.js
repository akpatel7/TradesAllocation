define(['underscore',
        'App/Services/ViewablesService',
        'angular',
        'mocks',
        'App/Services/services'], function (_) {
            describe('ViewablesService', function () {
                describe('Given we have a Viewables Service', function () {
                    var scope,
                        $httpBackend,
                        expectedData,
                        endpointUrl = 'http://localhost/api/viewables';

                    angular.module('ViewablesService.spec', []).service('DataEndpoint', ['$q', function ($q) {
                        return {
                            getTemplatedEndpoint: function () {
                                var deferred = $q.defer();
                                deferred.resolve(endpointUrl);
                                return deferred.promise;
                            }
                        };
                    }]);

                    beforeEach(function () {
                        module('App');
                        module('ViewablesService.spec');
                    });

                    describe('When we query the service including active views', function () {
                        beforeEach(inject(function (_$httpBackend_, $rootScope) {
                            expectedData = {
                                totalCount: 1324,
                                viewables: [
                                    {
                                        "@id": "http://data.emii.com/currency-market/usd-eur",
                                        "@type": "CurrencyMarket",
                                        "canonicalLabel": "USD/EUR",
                                        "activeView": {
                                            "@set": [
                                                {
                                                    "viewType": {
                                                        "@type": "ViewType",
                                                        "@id": "http://data.emii.com/view-types/economy",
                                                        "canonicalLabel": "Economy"
                                                    },
                                                    "horizonStartDate": "2013-03-30",
                                                    "lastUpdatedDate": "2013-03-30",
                                                    "canonicalLabel": "US Economy"
                                                },
                                                {
                                                    "viewWeighting": {
                                                        "@type": "ViewWeighting",
                                                        "@id": "http://data.emii.com/view-weightings/overweight",
                                                        "canonicalLabel": "Overweight"
                                                    },
                                                    "viewRelativeTo": {
                                                        "@type": "Currency",
                                                        "@id": "http://data.emii.com/currencies/eur",
                                                        "canonicalLabel": "Euro"
                                                    },
                                                    "viewType": {
                                                        "@type": "ViewType",
                                                        "@id": "http://data.emii.com/view-types/relative",
                                                        "canonicalLabel": "EUR Currency"
                                                    },
                                                    "horizonStartDate": "2013-09-30",
                                                    "lastUpdatedDate": "2013-09-29",
                                                    "canonicalLabel": "USD Market"
                                                },
                                                {
                                                    "viewWeighting": {
                                                        "@type": "ViewWeighting",
                                                        "@id": "http://data.emii.com/view-weightings/overweight",
                                                        "canonicalLabel": "Overweight"
                                                    },
                                                    "viewRelativeTo": {
                                                        "@type": "Currency",
                                                        "@id": "http://data.emii.com/currencies/eur",
                                                        "canonicalLabel": "Euro"
                                                    },
                                                    "viewType": {
                                                        "@type": "ViewType",
                                                        "@id": "http://data.emii.com/view-types/relative",
                                                        "canonicalLabel": "EUR Currency"
                                                    },
                                                    "horizonStartDate": "2013-04-30",
                                                    "lastUpdatedDate": "2013-04-30",
                                                    "canonicalLabel": "USD Market"
                                                },
                                                {
                                                    "viewWeighting": {
                                                        "@type": "ViewWeighting",
                                                        "@id": "http://data.emii.com/view-weightings/overweight",
                                                        "canonicalLabel": "Overweight"
                                                    },
                                                    "viewRelativeTo": {
                                                        "@type": "Currency",
                                                        "@id": "http://data.emii.com/currencies/eur",
                                                        "canonicalLabel": "Euro"
                                                    },
                                                    "viewType": {
                                                        "@type": "ViewType",
                                                        "@id": "http://data.emii.com/view-types/relative",
                                                        "canonicalLabel": "EUR Currency"
                                                    },
                                                    "canonicalLabel": "USD Market"
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "@id": "http://data.emii.com/economies/dbl/transportation-and-warehousing",
                                        "@type": "Economy",
                                        "canonicalLabel": "Dollar Block Transportation and Warehousing",
                                        "activeView": {
                                            "@set": []
                                        }
                                    },
                                    {
                                        "@id": "http://data.emii.com/commodities-markets/wheat",
                                        "@type": "CommodityMarket",
                                        "canonicalLabel": "Wheat",
                                        "activeView": {
                                            "@set": []
                                        }
                                    },
                                    {
                                        "@id": "http://data.emii.com/currency-market/usd-eur",
                                        "@type": "CurrencyMarket",
                                        "canonicalLabel": "USD/EUR",
                                        "activeView": {
                                            "@set": []
                                        }
                                    },
                                    {
                                        "@id": "http://data.emii.com/economies/dbl/transportation-and-warehousing",
                                        "@type": "Economy",
                                        "canonicalLabel": "Dollar Block Transportation and Warehousing",
                                        "activeView": {
                                            "@set": []
                                        }
                                    },
                                    {
                                        "@id": "http://data.emii.com/commodities-markets/wheat",
                                        "@type": "CommodityMarket",
                                        "canonicalLabel": "Wheat",
                                        "activeView": {
                                            "@set": []
                                        }
                                    }
                                ]
                            };
                            $httpBackend = _$httpBackend_;

                            $httpBackend.expectGET(endpointUrl)
                                .respond(expectedData);
                            scope = $rootScope.$new();
                        }));

                        it('should return viewables data', inject(function (Viewables) {
                            Viewables.getViewables().then(function (data) {
                                expect(data.viewables.length).toBe(6);
                                expect(data.totalCount).toBe(1324);
                            });
                            scope.$root.$digest();
                            $httpBackend.flush();
                        }));

                        it('Views should have a relativeViewLabel', inject(function (Viewables) {
                            Viewables.getViewables().then(function (data) {
                                expect(data.viewables[0].activeView['@set'][0].relativeViewLabel).toBe('Absolute');
                                expect(data.viewables[0].activeView['@set'][1].relativeViewLabel).toBe('Vs: Euro');
                            });
                            scope.$root.$digest();
                            $httpBackend.flush();
                        }));

                        it('should return viewable last horizon data', inject(function (Viewables) {
                            Viewables.getViewables().then(function (data) {
                                expect(data.viewables.length).toBe(6);
                                expect(data.totalCount).toBe(1324);
                                expect(data.viewables[0].latestHorizonStartDate).toBe('2013-09-29');
                            });
                            scope.$root.$digest();
                            $httpBackend.flush();
                        }));


                    });

                    describe('When we query the service excluding active views', function () {
                        beforeEach(inject(function (_$httpBackend_, $rootScope) {
                            expectedData = {
                                totalCount: 1324,
                                viewables: [
                                    {
                                        "@id": "http://data.emii.com/economies/dbl/transportation-and-warehousing",
                                        "@type": "Economy",
                                        "canonicalLabel": "Dollar Block Transportation and Warehousing"
                                    },
                                    {
                                        "@id": "http://data.emii.com/commodities-markets/wheat",
                                        "@type": "CommodityMarket",
                                        "canonicalLabel": "Wheat"
                                    },
                                    {
                                        "@id": "http://data.emii.com/currency-market/usd-eur",
                                        "@type": "CurrencyMarket",
                                        "canonicalLabel": "USD/EUR"
                                    }
                                ]
                            };
                            $httpBackend = _$httpBackend_;

                            $httpBackend.expectGET(endpointUrl)
                                .respond(expectedData);
                            scope = $rootScope.$new();
                        }));
                        it('should return viewables data', inject(function (Viewables) {
                            Viewables.getViewables().then(function (data) {
                                expect(data.viewables.length).toBe(3);
                                expect(data.totalCount).toBe(1324);
                            });
                            scope.$root.$digest();
                            $httpBackend.flush();
                        }));
                    });

                    describe('When viewable have the word Economy in their canonical label', function () {
                        beforeEach(inject(function (_$httpBackend_, $rootScope) {
                            expectedData = {
                                totalCount: 23,
                                viewables: [
                                    {
                                        "@id": "http://data.emii.com/economies/us",
                                        "@type": "Econony",
                                        "canonicalLabel": "US Economy",
                                        "activeView": {
                                            "@set": []
                                        }
                                    }
                                ]
                            };
                            $httpBackend = _$httpBackend_;

                            $httpBackend.expectGET(endpointUrl)
                                .respond(expectedData);
                            scope = $rootScope.$new();
                        }));

                        it('The word Economy should be stripped out', inject(function (Viewables) {
                            Viewables.getViewables().then(function (data) {
                                expect(data.viewables[0].canonicalLabel).toBe('US');
                                expect(data.totalCount).toBe(23);
                            });
                            scope.$root.$digest();
                            $httpBackend.flush();
                        }));
                    });

                    describe('When retrieving viewables with no filters', function () {
                        it('Should pass default filters to the ISIS api', inject(function (Viewables, DataEndpoint, $q, Dates) {
                            spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallFake(function (data) {
                                var deferred = $q.defer();
                                deferred.resolve({});
                                return deferred.promise;
                            });

                            spyOn(Dates, 'parseFilter').andCallFake(function () {
                                return '2013-07-20';
                            });

                            Viewables.getViewables({

                            }).then(function (data) {
                            });
                            scope.$root.$digest();

                            var args = DataEndpoint.getTemplatedEndpoint.argsForCall[0][1];
                            expect(args[0].key).toBe('service');
                            expect(args[0].value).toEqual([]);
                            expect(args[1].key).toBe('type');
                            expect(args[1].value).toEqual([]);
                            expect(args[4].key).toBe('restrictToFavourites');
                            expect(args[4].value).toBe(false);
                            expect(args[5].key).toBe('viewType');
                            expect(args[5].value).toEqual([]);
                            expect(args[6].key).toBe('conviction');
                            expect(args[6].value).toEqual([]);
                            expect(args[7].key).toBe('recommendationType');
                            expect(args[7].value).toBe('');
                            expect(args[8].key).toBe('date');
                            expect(args[8].value).toBe('');
                            expect(args[9].key).toBe('viewPosition');
                            expect(args[9].value).toEqual([]);
                            expect(args[10].key).toBe('uri');
                            expect(args[10].value).toBe('');
                            expect(args[11].key).toBe('location');
                            expect(args[11].value).toEqual([]);
                            expect(args[12].key).toBe('includeFacetsCount');
                            expect(args[12].value).toEqual(true);
                            expect(args[13].key).toBe('onlyViewablesWithActiveViews');
                            expect(args[13].value).toEqual(true);
                            expect(args[14].key).toBe('isFollowed');
                            expect(args[14].value).toEqual(false);
                            expect(args[15].key).toBe('isFavourited');
                            expect(args[15].value).toEqual(false);

                        }));
                    });

                    describe('When retrieving filtered viewables', function () {
                        var filters;
                        beforeEach(function () {
                            filters =
                            {
                                assetClass: [
                                    {
                                        key: 'Economy',
                                        label: 'Economy',
                                        isSelected: true,
                                        uri: 'http://data.emii.com/view-types/economy'
                                    },
                                    {
                                        key: 'EquityMarket',
                                        label: 'Equity',
                                        isSelected: true,
                                        uri: 'http://data.emii.com/view-types/equitymarket'
                                    }
                                ],
                                viewConviction: [
                                    {
                                        key: 'Low',
                                        label: 'Low',
                                        isSelected: true,
                                        uri: 'http://data.emii.com/view-convictions/low'
                                    },
                                    {
                                        key: 'Medium',
                                        label: 'Medium',
                                        isSelected: false,
                                        uri: 'http://data.emii.com/view-convictions/medium'
                                    },
                                    {
                                        key: 'High',
                                        label: 'High',
                                        isSelected: false,
                                        uri: 'http://data.emii.com/view-convictions/high'
                                    }
                                ],
                                position: [
                                    {
                                        key: 'Positive',
                                        label: 'Positive',
                                        isSelected: true,
                                        uri: [
                                            'http://data.emii.com/view-directions/long',
                                            'http://data.emii.com/economic-positions/stronger',
                                            'http://data.emii.com/trend-positions/rise',
                                            'http://data.emii.com/monetary-policy-positions/expand',
                                            'http://data.emii.com/fiscal-policy-positions/ease',
                                            'http://data.emii.com/view-weightings/overweight'
                                        ]
                                    },
                                    {
                                        key: 'Neutral',
                                        label: 'Flat/Neutral',
                                        isSelected: false,
                                        uri: [
                                            'http://data.emii.com/view-directions/neutral',
                                            'http://data.emii.com/economic-positions/flat',
                                            'http://data.emii.com/trend-positions/flat',
                                            'http://data.emii.com/monetary-policy-positions/no-change',
                                            'http://data.emii.com/fiscal-policy-positions/no-change',
                                            'http://data.emii.com/view-weightings/neutral'
                                        ]
                                    },
                                    {
                                        key: 'Negative',
                                        label: 'Negative',
                                        isSelected: false,
                                        uri: [
                                            'http://data.emii.com/view-directions/short',
                                            'http://data.emii.com/economic-positions/weaker',
                                            'http://data.emii.com/trend-positions/fall',
                                            'http://data.emii.com/monetary-policy-positions/contract',
                                            'http://data.emii.com/fiscal-policy-positions/tighten',
                                            'http://data.emii.com/view-weightings/underweight'
                                        ]
                                    }
                                ],
                                recommendationType: {
                                    key: 'RecommendationType',
                                    value: 'http://someuri/tactical'
                                },
                                viewType: [
                                    {
                                        key: 'ViewType',
                                        label: 'Relative',
                                        isSelected: false,
                                        uri: ['http://data.emii.com/view-types/relative']
                                    },
                                    {
                                        key: 'ViewType',
                                        label: 'Absolute',
                                        isSelected: true,
                                        uri: ['http://someuri/absolute', 'http://someuri/absolute2']
                                    }
                                ],
                                lastUpdated: {
                                    key: 'LastUpdated',
                                    value: 'LastYear'
                                },
                                viewStatus: {
                                    key: 'ViewStatus',
                                    value: false
                                },
                                services: [{
                                    key: 'Service',
                                    isSelected: true,
                                    uri: 'http://data.emii.com/bca/services/bcah'
                                }],
                                viewableUri: {
                                    key: 'uri',
                                    value: 'http://data.emii.com/economies/china_economy_tst'
                                },
                                regions: [
                                    {
                                        key: 'Asia',
                                        label: 'Asia',
                                        isSelected: true,
                                        uri: 'http://data.emii.com/locations/asi'
                                    }
                                ],
                                custom: [
                                    {
                                        key: 'favourites',
                                        label: 'Favourites',
                                        uri: 'true',
                                        isSelected: true
                                    },
                                    {
                                        key: 'followed',
                                        label: 'Followed',
                                        uri: 'true',
                                        isSelected: true
                                    }
                                ]
                            };
                        });
                        it('Should pass filters with the request to ISIS api', inject(function (Viewables, DataEndpoint, $q, Dates) {
                            spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallFake(function (data) {
                                var deferred = $q.defer();
                                deferred.resolve({});
                                return deferred.promise;
                            });

                            spyOn(Dates, 'parseFilter').andCallFake(function () {
                                return '2013-07-20';
                            });
                            
                            Viewables.getViewables({
                                filters: filters
                            }).then(function (data) {
                            });
                            scope.$root.$digest();

                            var args = DataEndpoint.getTemplatedEndpoint.argsForCall[0][1];
                            expect(args[0].key).toBe('service');
                            expect(args[0].value).toEqual(['http://data.emii.com/bca/services/bcah']);
                            expect(args[1].key).toBe('type');
                            expect(args[1].value).toEqual(['http://data.emii.com/view-types/economy', 'http://data.emii.com/view-types/equitymarket']);
                            expect(args[4].key).toBe('restrictToFavourites');
                            expect(args[4].value).toBe(false);
                            expect(args[5].key).toBe('viewType');
                            expect(args[5].value).toEqual(['http://someuri/absolute', 'http://someuri/absolute2']);
                            expect(args[6].key).toBe('conviction');
                            expect(args[6].value).toEqual(['http://data.emii.com/view-convictions/low']);
                            expect(args[7].key).toBe('recommendationType');
                            expect(args[7].value).toBe('http://someuri/tactical');
                            expect(args[8].key).toBe('date');
                            expect(args[8].value).toBe('2013-07-20');
                            expect(args[9].key).toBe('viewPosition');
                            expect(args[9].value).toEqual(['http://data.emii.com/view-directions/long', 'http://data.emii.com/economic-positions/stronger', 'http://data.emii.com/trend-positions/rise', 'http://data.emii.com/monetary-policy-positions/expand', 'http://data.emii.com/fiscal-policy-positions/ease', 'http://data.emii.com/view-weightings/overweight']);
                            expect(args[10].key).toBe('uri');
                            expect(args[10].value).toBe('http://data.emii.com/economies/china_economy_tst');
                            expect(args[11].key).toBe('location');
                            expect(args[11].value).toEqual(['http://data.emii.com/locations/asi']);
                            expect(args[12].key).toBe('includeFacetsCount');
                            expect(args[12].value).toEqual(true);
                            expect(args[13].key).toBe('onlyViewablesWithActiveViews');
                            expect(args[13].value).toEqual(false);
                            expect(args[14].key).toBe('isFollowed');
                            expect(args[14].value).toBe(true);
                            expect(args[15].key).toBe('isFavourited');
                            expect(args[15].value).toBe(true);
                        }));


                    });

                    describe('Given we page on viewables endpoint', function () {
                        var requestOptions;

                        beforeEach(inject(function (_$httpBackend_) {
                            requestOptions = {
                                filters: {
                                    viewableUri: {
                                        value: 'http://data.emii.com/currencies/us_dollar_tst'
                                    }
                                }
                            };
                            expectedData = {
                                totalCount: 1,
                                viewables: [
                                    {
                                        "@id": "http://data.emii.com/currencies/us_dollar_tst",
                                        "canonicalLabel": "US $"
                                    }
                                ]
                            };
                            $httpBackend = _$httpBackend_;


                        }));

                        describe('When retrieving the viewables page 0', function () {
                            beforeEach(inject(function (_$httpBackend_, $rootScope) {
                                requestOptions.page = 0;
                                $httpBackend.expectGET(endpointUrl).respond(expectedData);
                                scope = $rootScope.$new();
                            }));

                            it('should return a page', inject(function (Viewables) {
                                Viewables.getViewables(requestOptions).then(function (data) {
                                    expect(data.viewables[0]['@id']).toBe('http://data.emii.com/currencies/us_dollar_tst');
                                });

                                scope.$root.$digest();
                                $httpBackend.flush();
                            }));
                        });

                        describe('When retrieving the viewables page 1', function () {
                            beforeEach(inject(function (_$httpBackend_, $rootScope) {
                                requestOptions.page = 1;
                                scope = $rootScope.$new();
                            }));

                            it('should return a page', inject(function (Viewables) {
                                Viewables.getViewables(requestOptions).then(function (data) {
                                    expect(data.viewables).toBeDefined();
                                    expect(data.viewables.length).toBe(0);
                                });

                                scope.$root.$digest();
                            }));
                        });
                    });

                    describe('When asset class has multiple uris', function () {
                        var filters;
                        beforeEach(function () {
                            filters =
                            {
                                assetClass: [
                                   {
                                       key: 'CurrencyMarket',
                                       label: 'Currency',
                                       isSelected: true,
                                       uri: ['http://data.emii.com/ontologies/economy/CurrencyMarket', 'http://data.emii.com/ontologies/economy/Currency'],
                                       serverKeys: ['CurrencyMarket', 'Currency'],
                                       count: 0
                                   }
                                ]
                            };
                        });

                        it('Should pass a list of asset class to ISIS', inject(function (Viewables, DataEndpoint, $q, Dates) {
                            spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallFake(function (data) {
                                var deferred = $q.defer();
                                deferred.resolve({});
                                return deferred.promise;
                            });

                            spyOn(Dates, 'parseFilter').andCallFake(function () {
                                return '2013-07-20';
                            });

                            Viewables.getViewables({
                                filters: filters
                            }).then(function (data) {
                            });
                            scope.$root.$digest();

                            var args = DataEndpoint.getTemplatedEndpoint.argsForCall[0][1];
                            expect(args[1].key).toBe('type');
                            expect(args[1].value).toEqual(['http://data.emii.com/ontologies/economy/CurrencyMarket', 'http://data.emii.com/ontologies/economy/Currency']);
                        }));
                    });

                    describe('Given a viewable has a set of canonicalLabels', function () {
                        beforeEach(inject(function (_$httpBackend_, $rootScope) {
                            expectedData = {
                                totalCount: 1324,
                                viewables: [
                                    {
                                        "@id": "http://data.emii.com/currency-market/usd-eur",
                                        "@type": "CurrencyMarket",
                                        "canonicalLabel": { "@set": ["USD/EUR", "USD/EUR dublicate label"] }
                                    }
                                ]
                            };
                            $httpBackend = _$httpBackend_;

                            $httpBackend.expectGET(endpointUrl).respond(expectedData);
                            scope = $rootScope.$new();
                        }));

                        it('should not throw an exception', inject(function (Viewables) {
                            expect(function () {
                                Viewables.getViewables();
                                scope.$root.$digest();
                                $httpBackend.flush();
                            }).not.toThrow();
                        }));
                    });

                    describe('When retrieving the facet count for filtered viewables', function () {
                        var filters;
                        beforeEach(function () {
                            filters =
                            {
                                assetClass: [
                                    {
                                        key: 'Economy',
                                        label: 'Economy',
                                        isSelected: true,
                                        uri: 'http://data.emii.com/view-types/economy'
                                    },
                                    {
                                        key: 'EquityMarket',
                                        label: 'Equity',
                                        isSelected: true,
                                        uri: 'http://data.emii.com/view-types/equitymarket'
                                    }
                                ],
                                viewConviction: [
                                    {
                                        key: 'Low',
                                        label: 'Low',
                                        isSelected: true,
                                        uri: 'http://data.emii.com/view-convictions/low'
                                    },
                                    {
                                        key: 'Medium',
                                        label: 'Medium',
                                        isSelected: false,
                                        uri: 'http://data.emii.com/view-convictions/medium'
                                    },
                                    {
                                        key: 'High',
                                        label: 'High',
                                        isSelected: false,
                                        uri: 'http://data.emii.com/view-convictions/high'
                                    }
                                ],
                                position: [
                                    {
                                        key: 'Positive',
                                        label: 'Positive',
                                        isSelected: true,
                                        uri: [
                                            'http://data.emii.com/view-directions/long',
                                            'http://data.emii.com/economic-positions/stronger',
                                            'http://data.emii.com/trend-positions/rise',
                                            'http://data.emii.com/monetary-policy-positions/expand',
                                            'http://data.emii.com/fiscal-policy-positions/ease',
                                            'http://data.emii.com/view-weightings/overweight'
                                        ]
                                    },
                                    {
                                        key: 'Neutral',
                                        label: 'Flat/Neutral',
                                        isSelected: false,
                                        uri: [
                                            'http://data.emii.com/view-directions/neutral',
                                            'http://data.emii.com/economic-positions/flat',
                                            'http://data.emii.com/trend-positions/flat',
                                            'http://data.emii.com/monetary-policy-positions/no-change',
                                            'http://data.emii.com/fiscal-policy-positions/no-change',
                                            'http://data.emii.com/view-weightings/neutral'
                                        ]
                                    },
                                    {
                                        key: 'Negative',
                                        label: 'Negative',
                                        isSelected: false,
                                        uri: [
                                            'http://data.emii.com/view-directions/short',
                                            'http://data.emii.com/economic-positions/weaker',
                                            'http://data.emii.com/trend-positions/fall',
                                            'http://data.emii.com/monetary-policy-positions/contract',
                                            'http://data.emii.com/fiscal-policy-positions/tighten',
                                            'http://data.emii.com/view-weightings/underweight'
                                        ]
                                    }
                                ],
                                recommendationType: {
                                    key: 'RecommendationType',
                                    value: 'http://someuri/tactical'
                                },
                                viewType: [
                                    {
                                        key: 'ViewType',
                                        label: 'Relative',
                                        isSelected: false,
                                        uri: ['http://data.emii.com/view-types/relative']
                                    },
                                    {
                                        key: 'ViewType',
                                        label: 'Absolute',
                                        isSelected: true,
                                        uri: ['http://someuri/absolute', 'http://someuri/absolute2']
                                    }
                                ],
                                lastUpdated: {
                                    key: 'LastUpdated',
                                    value: 'LastYear'
                                },
                                viewStatus: {
                                    key: 'ViewStatus',
                                    value: false
                                },
                                services: [{
                                    key: 'Service',
                                    isSelected: true,
                                    uri: 'http://data.emii.com/bca/services/bcah'
                                }],
                                viewableUri: {
                                    key: 'uri',
                                    value: 'http://data.emii.com/economies/china_economy_tst'
                                },
                                regions: [
                                    {
                                        key: 'Asia',
                                        label: 'Asia',
                                        isSelected: true,
                                        uri: 'http://data.emii.com/locations/asi'
                                    }
                                ],
                                custom: [
                                    {
                                        key: 'favourites',
                                        label: 'Favourites',
                                        uri: 'true',
                                        isSelected: true
                                    },
                                    {
                                        key: 'followed',
                                        label: 'Followed',
                                        uri: 'true',
                                        isSelected: true
                                    }
                                ]
                            };
                        });
                        it('Should pass filters with the request to ISIS api', inject(function (Viewables, DataEndpoint, $q, Dates) {
                            spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallFake(function (data) {
                                var deferred = $q.defer();
                                deferred.resolve({});
                                return deferred.promise;
                            });

                            spyOn(Dates, 'parseFilter').andCallFake(function () {
                                return '2013-07-20';
                            });

                            Viewables.getViewablesFacetCount({
                                filters: filters
                            }).then(function (data) {
                            });
                            scope.$root.$digest();
                            var args = DataEndpoint.getTemplatedEndpoint.argsForCall[0][1];
                            expect(args[0].key).toBe('service');
                            expect(args[0].value).toEqual(['http://data.emii.com/bca/services/bcah']);
                            expect(args[1].key).toBe('type');
                            expect(args[1].value).toEqual(['http://data.emii.com/view-types/economy', 'http://data.emii.com/view-types/equitymarket']);
                            expect(args[2].key).toBe('viewType');
                            expect(args[2].value).toEqual(['http://someuri/absolute', 'http://someuri/absolute2']);
                            expect(args[3].key).toBe('conviction');
                            expect(args[3].value).toEqual(['http://data.emii.com/view-convictions/low']);
                            expect(args[4].key).toBe('recommendationType');
                            expect(args[4].value).toBe('http://someuri/tactical');
                            expect(args[5].key).toBe('date');
                            expect(args[5].value).toBe('2013-07-20');
                            expect(args[6].key).toBe('viewPosition');
                            expect(args[6].value).toEqual(['http://data.emii.com/view-directions/long', 'http://data.emii.com/economic-positions/stronger', 'http://data.emii.com/trend-positions/rise', 'http://data.emii.com/monetary-policy-positions/expand', 'http://data.emii.com/fiscal-policy-positions/ease', 'http://data.emii.com/view-weightings/overweight']);
                            expect(args[7].key).toBe('uri');
                            expect(args[7].value).toBe('http://data.emii.com/economies/china_economy_tst');
                            expect(args[8].key).toBe('location');
                            expect(args[8].value).toEqual(['http://data.emii.com/locations/asi']);
                            expect(args[9].key).toBe('onlyViewablesWithActiveViews');
                            expect(args[9].value).toEqual(false);
                        }));


                    });

                });
            });
        });
