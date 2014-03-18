define(['underscore',
        'App/Services/ThemesService',
        'angular',
        'mocks',
        'App/Services/services'], function (_) {
            describe('Themes Service', function () {
                describe('Given we have a Themes Service', function () {
                    var scope,
                        $httpBackend,
                        expectedData,
                        endpointUrl = 'http://localhost/api/annotations';

                    angular.module('ThemesService.spec', []).service('DataEndpoint', ['$q', function ($q) {
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
                        module('ThemesService.spec');
                    });                    
                    
                    describe('When we get the themes', function () {
                        describe('And the server returns some data', function() {
                            beforeEach(inject(function(_$httpBackend_, $rootScope) {
                                expectedData = {
                                    '@graph': [
                                        {
                                            '@id': 'http://data.emii.com/themes/theme1',
                                            childTheme: {
                                                '@set': [
                                                {
                                                    '@id': 'http://data.emii.com/themes/theme2',
                                                    impactedView: {
                                                        '@set': [
                                                            {
                                                                '@id': 'http://data.emii.com/market1-view1',
                                                                horizonStartDate: '2013-08-22',
                                                                viewOn: {
                                                                    '@id': 'http://data.emii.com/market1',
                                                                    canonicalLabel: 'Market 1',
                                                                    isFavourited: true,
                                                                    perspectiveId: 'favouritedId'
                                                                }
                                                            },
                                                            {
                                                                horizonStartDate: '2013-08-20',
                                                                viewOn: {
                                                                    '@id': 'http://data.emii.com/market3',
                                                                    canonicalLabel: 'Market 3'
                                                                }
                                                            }
                                                        ]

                                                    }
                                                }
                                                ]
                                            },
                                            impactedView: {
                                                '@set': [
                                                    {
                                                        '@id': 'http://data.emii.com/market1-view2',
                                                        horizonStartDate: '2013-08-18',
                                                        viewOn: {
                                                            '@id': 'http://data.emii.com/market1',
                                                            canonicalLabel: 'Market 1',
                                                            isFavourited: true,
                                                            perspectiveId: 'favouritedId'
                                                        }
                                                    },
                                                    {
                                                        '@id': 'http://data.emii.com/market1-view3',
                                                        horizonStartDate: '2013-05-18',
                                                        viewOn: {
                                                            '@id': 'http://data.emii.com/market1',
                                                            canonicalLabel: 'Market 1'
                                                        }
                                                    },
                                                    {
                                                        '@id': 'http://data.emii.com/market2-view1',
                                                        horizonStartDate: '2013-08-21',
                                                        viewOn: {
                                                            '@id': 'http://data.emii.com/market2',
                                                            canonicalLabel: 'Market 2'
                                                        }
                                                    }
                                                ]

                                            }
                                        }
                                    ]



                                };
                                $httpBackend = _$httpBackend_;

                                $httpBackend.expectGET(endpointUrl)
                                    .respond(expectedData);
                                scope = $rootScope.$new();
                            }));

                            it('themes should be returned', inject(function(Themes) {
                                Themes.getThemes().then(function(data) {
                                    expect(data).toBeDefined();
                                });
                                scope.$root.$digest();
                                $httpBackend.flush();
                            }));
                            
                            it('theme1 should have 3 viewables', inject(function(Themes) {
                                Themes.getThemes().then(function (data) {
                                    expect(data['@graph'][0].viewables).toBeDefined();
                                    expect(data['@graph'][0].viewables.length).toBe(3);
                                    expect(data['@graph'][0].viewables[0]['@id']).toBe('http://data.emii.com/market1');
                                    expect(data['@graph'][0].viewables[0].canonicalLabel).toBe('Market 1');
                                    expect(data['@graph'][0].viewables[0].lastUpdated).toBe('2013-08-22');
                                    expect(data['@graph'][0].viewables[0].isFavourited).toBe(true);
                                    expect(data['@graph'][0].viewables[0].perspectiveId).toBe('favouritedId');
                                    expect(data['@graph'][0].viewables[0].activeView['@set'].length).toBe(3);

                                    expect(data['@graph'][0].viewables[1].canonicalLabel).toBe('Market 2');
                                    expect(data['@graph'][0].viewables[1].lastUpdated).toBe('2013-08-21');
                                    expect(data['@graph'][0].viewables[2].canonicalLabel).toBe('Market 3');
                                    expect(data['@graph'][0].viewables[2].lastUpdated).toBe('2013-08-20');
                                });
                                scope.$root.$digest();
                                $httpBackend.flush();
                            }));
                        });

                        describe('Parameters', function () {
                            var args;
                            beforeEach(inject(function (DataEndpoint, $q) {
                                spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallFake(function () {
                                    var deferred = $q.defer();
                                    deferred.resolve({});
                                    return deferred.promise;
                                });
                            }));
                            it('Should pass default pagination to the endpoint', inject(function (DataEndpoint, Themes) {
                                Themes.getThemes().then(function () {
                                });
                                scope.$root.$digest();
                                args = DataEndpoint.getTemplatedEndpoint.argsForCall[0][1];
                                expect(args[0].key).toBe('page');
                                expect(args[0].value).toBe(0);
                                expect(args[1].key).toBe('pageSize');
                                expect(args[1].value).toBe(20);
                                expect(args[2].key).toBe('includeAll');
                                expect(args[2].value).toBe(true);
                                expect(args[3].key).toBe('restrictToFavourites');
                                expect(args[3].value).toBe(false);
                                expect(args[4].key).toBe('forDNA');
                                expect(args[4].value).toBe(true);
                                expect(args[5].key).toBe('service');
                                expect(args[5].value).toEqual([]);
                                expect(args[6].key).toBe('type');
                                expect(args[6].value).toEqual([]);
                                expect(args[7].key).toBe('uri');
                                expect(args[7].value).toBeUndefined();
                                expect(args[10].key).toBe('region');
                                expect(args[10].value).toEqual([]);
                                expect(args[11].key).toBe('isFollowed');
                                expect(args[11].value).toBe(false);
                                expect(args[12].key).toBe('isFavourited');
                                expect(args[12].value).toBe(false);
                            }));
                          
                            it('Should pass pagination to the endpoint', inject(function (Themes, DataEndpoint) {
                                Themes.getThemes({
                                    page: 2,
                                    pageSize: 10
                                }).then(function () {
                                });
                                scope.$root.$digest();
                                args = DataEndpoint.getTemplatedEndpoint.argsForCall[0][1];
                                expect(args[0].key).toBe('page');
                                expect(args[0].value).toBe(2);
                                expect(args[1].key).toBe('pageSize');
                                expect(args[1].value).toBe(10);
                                expect(args[2].key).toBe('includeAll');
                                expect(args[2].value).toBe(true);
                                expect(args[3].key).toBe('restrictToFavourites');
                                expect(args[3].value).toBe(false);
                                expect(args[4].key).toBe('forDNA');
                                expect(args[4].value).toBe(true);
                            }));
                            
                            it('Should restrict to favourites', inject(function (Themes, DataEndpoint) {
                                Themes.getThemes({
                                   restrictToFavourites: true
                                }).then(function () {
                                });
                                scope.$root.$digest();
                                args = DataEndpoint.getTemplatedEndpoint.argsForCall[0][1];
                                expect(args[2].key).toBe('includeAll');
                                expect(args[2].value).toBe(true);
                                expect(args[3].key).toBe('restrictToFavourites');
                                expect(args[3].value).toBe(true);
                                expect(args[4].key).toBe('forDNA');
                                expect(args[4].value).toBe(true);
                            }));
                        });
                        
                    });

                    describe('When themes dont have creation date', function() {
                        beforeEach(inject(function (_$httpBackend_, $rootScope) {
                            expectedData = {
                                '@graph': [
                                    {
                                        childTheme: {
                                            '@set': [
                                                {
                                                    '@id': 'http://emii.data.com/themes/theme1',
                                                    created: '2013-07-20T09:00:00Z'
                                                },
                                                {
                                                    '@id': 'http://emii.data.com/themes/theme2',
                                                    created: '2013-07-19T09:00:00Z'
                                                },
                                                {
                                                    '@id': 'http://emii.data.com/themes/theme3',
                                                    created: '2013-07-21T09:00:00Z'
                                                }
                                            ]
                                        }
                                    }
                                ]
                            };
                            $httpBackend = _$httpBackend_;

                            $httpBackend.expectGET(endpointUrl)
                                .respond(expectedData);
                            scope = $rootScope.$new();
                        }));

                        it('the creation date should be the oldest created date of its child themes', inject(function (Themes) {
                            Themes.getThemes().then(function (data) {
                                expect(data['@graph'][0].created).toBe('2013-07-19T09:00:00Z');
                            });
                            scope.$root.$digest();
                            $httpBackend.flush();
                        }));
                    });
                    
                    describe('When themes dont have lastApplied date', function () {
                        describe('And all child themes have a lastApplied date', function() {
                            beforeEach(inject(function (_$httpBackend_, $rootScope) {
                                expectedData = {
                                    '@graph': [
                                        {
                                            childTheme: {
                                                '@set': [
                                                    {
                                                        '@id': 'http://emii.data.com/themes/theme1',
                                                        lastApplied: '2013-07-20T09:00:00Z'
                                                    },
                                                    {
                                                        '@id': 'http://emii.data.com/themes/theme2',
                                                        lastApplied: '2013-07-19T09:00:00Z'
                                                    },
                                                    {
                                                        '@id': 'http://emii.data.com/themes/theme3',
                                                        lastApplied: '2013-07-21T09:00:00Z'
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                };
                                $httpBackend = _$httpBackend_;

                                $httpBackend.expectGET(endpointUrl)
                                    .respond(expectedData);
                                scope = $rootScope.$new();
                            }));

                            it('the updated date should be the earliest lastApplied of its child themes', inject(function (Themes) {
                                Themes.getThemes().then(function (data) {
                                    expect(data['@graph'][0].lastApplied).toBe('2013-07-21T09:00:00Z');
                                });
                                scope.$root.$digest();
                                $httpBackend.flush();
                            }));
                        });
                        
                        describe('And not all child themes have a lastApplied date', function () {
                            beforeEach(inject(function (_$httpBackend_, $rootScope) {
                                expectedData = {
                                    '@graph': [
                                        {
                                            childTheme: {
                                                '@set': [
                                                    {
                                                        '@id': 'http://emii.data.com/themes/theme1',
                                                        lastApplied: '2013-07-20T09:00:00Z'
                                                    },
                                                    {
                                                        '@id': 'http://emii.data.com/themes/theme2'
                                                    },
                                                    {
                                                        '@id': 'http://emii.data.com/themes/theme3',
                                                        lastApplied: '2013-07-21T09:00:00Z'
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                };
                                $httpBackend = _$httpBackend_;

                                $httpBackend.expectGET(endpointUrl)
                                    .respond(expectedData);
                                scope = $rootScope.$new();
                            }));

                            it('the updated date should be the earliest lastApplied of its child themes', inject(function (Themes) {
                                Themes.getThemes().then(function (data) {
                                    expect(data['@graph'][0].lastApplied).toBe('2013-07-21T09:00:00Z');
                                });
                                scope.$root.$digest();
                                $httpBackend.flush();
                            }));
                        });
                    
                    });
                    
                    describe('When retrieving filtered themes', function () {
                        var filters;
                        beforeEach(function () {
                            filters =
                            {
                                services: [
                                    {
                                        key: 'House',
                                        label: 'HOUSE',
                                        uri: 'http://data.emii.com/bca/services/bcah',
                                        isSelected: true
                                    },
                                    {
                                        key: 'BCA',
                                        label: 'The Bank Credit Analyst',
                                        uri: 'http://data.emii.com/bca/services/bca',
                                        isSelected: true
                                    }
                                ],
                                assetClass:
                                [
                                    {
                                        key: 'Economy',
                                        label: 'Economy',
                                        isSelected: true,
                                        uri: 'http://data.emii.com/ontologies/economy/Economy',
                                        count: 0
                                    },
                                    {
                                        key: 'EquityMarket',
                                        label: 'Equity',
                                        isSelected: true,
                                        uri: 'http://data.emii.com/ontologies/economy/EquityMarket',
                                        count: 0
                                    }
                                ],
                                uri: {
                                    key: 'uri',
                                    value: 'http://data.emii.com/somUri'
                                },
                                impacts: [
                                   {
                                       key: 'Bearish',
                                       label: 'Bearish',
                                       isSelected: true
                                   },
                                   {
                                       key: 'Neutral',
                                       label: 'Neutral',
                                       isSelected: true
                                   },
                                   {
                                       key: 'Bullish',
                                       label: 'Bullish'
                                   }
                                ],
                                lastApplied: {
                                    key: 'lastApplied',
                                    value: 'LastMonth'
                                },
                                regions: [
                                    {
                                        key: 'Africa',
                                        label: 'Africa',
                                        uri: 'http://data.emii.com/locations/afr',
                                        isSelected: true
                                    },
                                    {
                                        key: 'Asia',
                                        label: 'Asia',
                                        uri: 'http://data.emii.com/locations/asi',
                                        isSelected: true
                                    },
                                     {
                                         key: 'Europe',
                                         label: 'Europe',
                                         uri: 'http://data.emii.com/locations/eur',
                                         isSelected: false
                                     }
                                ],
                                custom: [
                                     {
                                         key: 'favourites',
                                         label: 'Favourites',
                                         isSelected: true
                                     },
                                    {
                                        key: 'followed',
                                        label: 'Followed',
                                        isSelected: true
                                    }
                                ]
                            };
                        });
                        
                        it('Should pass filters with the request to the ISIS api', inject(function (Themes, DataEndpoint, $q) {
                            spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallFake(function (data) {
                                var deferred = $q.defer();
                                deferred.resolve({});
                                return deferred.promise;
                            });

                            Themes.getThemes({
                                filters: filters
                            }).then(function (data) {
                            });
                            scope.$root.$digest();

                            var args = DataEndpoint.getTemplatedEndpoint.argsForCall[0][1];
                            expect(args[0].key).toBe('page');
                            expect(args[0].value).toBe(0);
                            expect(args[1].key).toBe('pageSize');
                            expect(args[1].value).toBe(20);
                            expect(args[2].key).toBe('includeAll');
                            expect(args[2].value).toBe(true);
                            expect(args[3].key).toBe('restrictToFavourites');
                            expect(args[3].value).toBe(false);
                            expect(args[4].key).toBe('forDNA');
                            expect(args[4].value).toBe(true);
                            expect(args[5].key).toBe('service');
                            expect(args[5].value).toEqual(['http://data.emii.com/bca/services/bcah', 'http://data.emii.com/bca/services/bca']);
                            expect(args[6].key).toBe('type');
                            expect(args[6].value).toEqual(['http://data.emii.com/ontologies/economy/Economy', 'http://data.emii.com/ontologies/economy/EquityMarket']);
                            expect(args[7].key).toBe('uri');
                            expect(args[7].value).toBe('http://data.emii.com/somUri');
                            expect(args[8].key).toBe('impact');
                            expect(args[8].value).toEqual(['Bearish', 'Neutral']);
                            expect(args[9].key).toBe('lastApplied');
                            expect(args[9].value).toEqual('LastMonth');
                            expect(args[10].key).toBe('region');
                            expect(args[10].value).toEqual(['http://data.emii.com/locations/afr', 'http://data.emii.com/locations/asi']);
                            expect(args[11].key).toBe('isFollowed');
                            expect(args[11].value).toBe(true);
                            expect(args[12].key).toBe('isFavourited');
                            expect(args[12].value).toBe(true);
                        }));
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

                        it('Should pass a list of asset class to ISIS', inject(function (Themes, DataEndpoint, $q) {
                            spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallFake(function (data) {
                                var deferred = $q.defer();
                                deferred.resolve({});
                                return deferred.promise;
                            });

                            Themes.getThemes({
                                filters: filters
                            }).then(function (data) {
                            });
                            scope.$root.$digest();
                            

                            var args = DataEndpoint.getTemplatedEndpoint.argsForCall[0][1];
                            expect(args[6].key).toBe('type');
                            expect(args[6].value).toEqual(['http://data.emii.com/ontologies/economy/CurrencyMarket', 'http://data.emii.com/ontologies/economy/Currency']);
                        }));
                    });
                    
                    describe('When we calculate a theme impact', function () {
                       // underweight: 'WEAKER', 'SHORT', 'UNDERWEIGHT'
                       // neutral: 'FLAT', 'NEUTRAL'
                       // overweight: 'STRONGER', 'LONG', 'OVERWEIGHT'
                        describe('And a theme has 6 views: 3 views overweight, 2 neutral, and 1 underweight', function () {
                            var theme;
                            beforeEach(function () {
                                theme = {
                                    impactedView: {
                                        '@set': [
                                            {
                                                viewWeighting: {
                                                    canonicalLabel: 'overweight',
                                                    '@id': 'http://data.emii.com/view-weightings/overweight'
                                                }
                                            },
                                            {
                                                viewDirection: {
                                                    canonicalLabel: 'long',
                                                    '@id': 'http://data.emii.com/ontologies/bca/viewDirection/long'
                                                }
                                            },
                                            {
                                                economicPosition: {
                                                    canonicalLabel: 'stronger',
                                                    '@id': 'http://data.emii.com/economic-positions/stronger'
                                                }
                                            },
                                            {
                                                viewDirection: {
                                                    canonicalLabel: 'flat',
                                                    '@id': 'http://data.emii.com/ontologies/bca/viewDirection/flat'
                                                }
                                            },
                                            {
                                                 economicPosition: {
                                                     canonicalLabel: 'neutral',
                                                     '@id': 'http://data.emii.com/economic-positions/neutral'
                                                 }
                                             },
                                             {
                                                 viewWeighting: {
                                                     canonicalLabel: 'underweight',
                                                     '@id': 'http://data.emii.com/view-weightings/underweight'
                                                 }
                                             }
                                        ]
                                    }
                                };
                            });
                            it('impact should be bullish', inject(function(Themes) {
                                var result = Themes.calculateImpact(theme);
                                expect(result).toBe('bullish');
                            }));
                        });
                        
                        describe('And a theme has 3 views: 1 view overweight, 1 neutral, and 1 underweight', function () {
                            var theme;
                            beforeEach(function () {
                                theme = {
                                    impactedView: {
                                        '@set': [
                                            {
                                                viewWeighting: {
                                                    canonicalLabel: 'overweight',
                                                    '@id': 'http://data.emii.com/view-weightings/overweight'
                                                }
                                            },
                                            {
                                                viewDirection: {
                                                    canonicalLabel: 'flat',
                                                    '@id': 'http://data.emii.com/ontologies/bca/viewDirection/flat'
                                                }
                                            },
                                            {
                                                 viewWeighting: {
                                                     canonicalLabel: 'underweight',
                                                     '@id': 'http://data.emii.com/view-weightings/underweight'
                                                 }
                                            }
                                            
                                        ]
                                    }
                                };
                            });
                            it('impact should be neutral', inject(function (Themes) {
                                var result = Themes.calculateImpact(theme);
                                expect(result).toBe('neutral');
                            }));
                        });

                        describe('And a theme with child themes has 3 views: 1 view overweight, 1 neutral, and 1 underweight', function () {
                            var theme;
                            beforeEach(function () {
                                theme = {
                                    childTheme: {
                                        '@set': [
                                            {
                                                impactedView: {
                                                    '@set': [
                                                        {
                                                            viewWeighting: {
                                                                canonicalLabel: 'underweight',
                                                                '@id': 'http://data.emii.com/view-weightings/underweight'
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    },
                                    impactedView: {
                                        '@set': [
                                            {
                                                viewWeighting: {
                                                    canonicalLabel: 'overweight',
                                                    '@id': 'http://data.emii.com/view-weightings/overweight'
                                                }
                                            },
                                            {
                                                viewDirection: {
                                                    canonicalLabel: 'flat',
                                                    '@id': 'http://data.emii.com/ontologies/bca/viewDirection/flat'
                                                }
                                            }
                                        ]
                                    }
                                };
                            });
                            it('impact should be neutral', inject(function (Themes) {
                                var result = Themes.calculateImpact(theme);
                                expect(result).toBe('neutral');
                            }));
                        });
                        
                        describe('And a theme has 6 views: 1 view overweight, 2 neutral, and 3 underweight', function () {
                            var theme;
                            beforeEach(function () {
                                theme = {
                                    impactedView: {
                                        '@set': [
                                            {
                                                viewWeighting: {
                                                    canonicalLabel: 'overweight',
                                                    '@id': 'http://data.emii.com/view-weightings/overweight'
                                                }
                                            },
                                            {
                                                viewDirection: {
                                                    canonicalLabel: 'flat',
                                                    '@id': 'http://data.emii.com/ontologies/bca/viewDirection/flat'
                                                }
                                            },
                                            {
                                                economicPosition: {
                                                    canonicalLabel: 'neutral',
                                                    '@id': 'http://data.emii.com/economic-positions/neutral'
                                                }
                                            },
                                            {
                                                 viewWeighting: {
                                                     canonicalLabel: 'underweight',
                                                     '@id': 'http://data.emii.com/view-weightings/underweight'
                                                 }
                                            },
                                            {
                                                 viewWeighting: {
                                                     canonicalLabel: 'underweight',
                                                     '@id': 'http://data.emii.com/view-weightings/underweight'
                                                 }
                                            },
                                            {
                                                viewDirection: {
                                                    canonicalLabel: 'short',
                                                    '@id': 'http://data.emii.com/ontologies/bca/viewDirection/short'
                                                }
                                            }
                                        ]
                                    }
                                };
                            });
                            it('impact should be bearish', inject(function (Themes) {
                                var result = Themes.calculateImpact(theme);
                                expect(result).toBe('bearish');
                            }));
                        });
                        
                        describe('And a theme with child themes has: 1 view overweight, 2 neutral, and 3 underweight', function () {
                            var theme;
                            beforeEach(function () {
                                theme = {
                                    childTheme: {
                                        '@set': [
                                            {
                                                impactedView: {
                                                    '@set': [
                                                                {
                                                                    viewDirection: {
                                                                        canonicalLabel: 'flat',
                                                                        '@id': 'http://data.emii.com/ontologies/bca/viewDirection/flat'
                                                                    }
                                                                },
                                                                {
                                                                    viewWeighting: {
                                                                        canonicalLabel: 'underweight',
                                                                        '@id': 'http://data.emii.com/view-weightings/underweight'
                                                                    }
                                                                }

                                                            ]
                                                }
                                            },
                                            {
                                                impactedView: {
                                                    '@set': [
                                                         {
                                                             viewWeighting: {
                                                                 canonicalLabel: 'underweight',
                                                                 '@id': 'http://data.emii.com/view-weightings/underweight'
                                                             }
                                                         }
                                                    ]
                                                }

                                            }
                                        ]
                                    },
                                    impactedView: {
                                        '@set': [
                                            {
                                                economicPosition: {
                                                    canonicalLabel: 'neutral',
                                                    '@id': 'http://data.emii.com/economic-positions/neutral'
                                                }
                                            },
                                            {
                                                viewDirection: {
                                                    canonicalLabel: 'short',
                                                    '@id': 'http://data.emii.com/ontologies/bca/viewDirection/short'
                                                }
                                            },
                                            {
                                                viewWeighting: {
                                                    canonicalLabel: 'overweight',
                                                    '@id': 'http://data.emii.com/view-weightings/overweight'
                                                }
                                            }
                                        ]
                                    }
                                };
                            });
                            it('impact should be bearish', inject(function (Themes) {
                                var result = Themes.calculateImpact(theme);
                                expect(result).toBe('bearish');
                            }));
                        });
                    });

                    describe('When we calculate the market count', function () {
                        var theme;
                        beforeEach(function () {
                            theme = {
                                impactedView: {
                                    '@set': [
                                        {
                                            viewOn: {
                                                '@id': 'market1'
                                            }
                                        },
                                        {
                                             viewOn: {
                                                 '@id': 'market2'
                                             }
                                         }
                                    ]
                                },
                                childTheme: {
                                    '@set': [
                                        {
                                            impactedView: {
                                                '@set': [
                                                    {
                                                        viewOn: {
                                                            '@id': 'market1'
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            impactedView: {
                                                '@set': [
                                                    {
                                                        viewOn: {
                                                            '@id': 'market3'
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            };
                        });
                        it('should calculate the market count correctly', inject(function (Themes) {
                            var result = Themes.calculateMarketsCount(theme);
                            expect(result).toBe(3);
                        }));

                    });
                });
            });
        });