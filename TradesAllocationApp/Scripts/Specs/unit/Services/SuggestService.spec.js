define(['underscore',
        'App/Services/SuggestService',
        'angular',
        'mocks'], function(_) {
            describe('Suggest Service', function () {
                describe('Given we have a Suggest Service', function () {
                    var scope,
                        $httpBackend,
                        serverData,
                        endpointUrl = 'http://localhost/api/views';

                    angular.module('SuggestService.spec', []).service('DataEndpoint', ['$q', function ($q) {
                        return {
                            getTemplatedEndpoint: function() {
                                var deferred = $q.defer();
                                deferred.resolve(endpointUrl);
                                return deferred.promise;
                            }
                        };
                    }]);

                    beforeEach(function() {
                        module('App');
                        module('SuggestService.spec');
                    });

                    describe('When we get the suggestions', function() {
                        beforeEach(inject(function(_$httpBackend_, $rootScope) {
                            serverData = [
                                    'Equities',
                                    [
                                        'Advance Economies Advertising Equities',
                                        'Advance Economies Aerospace & Defense Equities',
                                        'Advance Economies Agricultural Products Equities'
                                    ],
                                    [
                                        'Equity Market',
                                        'Equity Market',
                                        'Equity Market'
                                    ],
                                    [
                                        'http://data.emii.com/equity-markets/ae/advertising',
                                        'http://data.emii.com/equity-markets/ae/aerospace-defense',
                                        'http://data.emii.com/equity-markets/ae/agricultural-products'
                                    ],
                                    [
                                        {
                                            'type': 'http://data.emii.com/ontologies/economy/EquityMarket'
                                        },
                                        {
                                            'type': 'http://data.emii.com/ontologies/economy/EquityMarket'
                                        },
                                        {
                                            'type': 'http://data.emii.com/ontologies/economy/EquityMarket'
                                        }
                                    ]
                                ];
                            $httpBackend = _$httpBackend_;

                            $httpBackend.expectGET(endpointUrl)
                                .respond(serverData);
                            scope = $rootScope.$new();
                        }));

                        it('suggestions should be returned', inject(function (Suggest) {
                            Suggest.suggest().then(function (data) {
                                expect(data).toBeDefined();
                                expect(data.length).toBe(3);
                                expect(data[0]).toEqual(
                                    {
                                        '@id': 'http://data.emii.com/equity-markets/ae/advertising',
                                        canonicalLabel: 'Advance Economies Advertising Equities',
                                        type: {
                                            '@id': 'http://data.emii.com/ontologies/economy/EquityMarket',
                                            canonicalLabel: 'Equity Market'
                                        }
                                    });
                                expect(data[1]).toEqual(
                                    {
                                        '@id': 'http://data.emii.com/equity-markets/ae/aerospace-defense',
                                        canonicalLabel: 'Advance Economies Aerospace & Defense Equities',
                                        type: {
                                            '@id': 'http://data.emii.com/ontologies/economy/EquityMarket',
                                            canonicalLabel: 'Equity Market'
                                        }
                                    });
                                expect(data[2]).toEqual(
                                   {
                                       '@id': 'http://data.emii.com/equity-markets/ae/agricultural-products',
                                       canonicalLabel: 'Advance Economies Agricultural Products Equities',
                                       type: {
                                           '@id': 'http://data.emii.com/ontologies/economy/EquityMarket',
                                           canonicalLabel: 'Equity Market'
                                       }
                                   });
                            });
                            scope.$root.$digest();
                            $httpBackend.flush();
                        }));
                    });
                    
                    describe('When we query the suggest endpoint', function() {
                        var args;
                        beforeEach(inject(function(DataEndpoint, $q) {
                            spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallFake(function() {
                                var deferred = $q.defer();
                                deferred.resolve({});
                                return deferred.promise;
                            });
                        }));

                        describe('And optional parameters are missing', function() {
                            it('should pass default parameters to the endpoint', inject(function(DataEndpoint, Suggest) {
                                Suggest.suggest({
                                    q: 'America'
                                }).then(function() {
                                });
                                scope.$root.$digest();
                                args = DataEndpoint.getTemplatedEndpoint.argsForCall[0][1];
                                expect(DataEndpoint.getTemplatedEndpoint).toHaveBeenCalledWith('suggest', [
                                    {
                                        key: 'q',
                                        value: 'America'
                                    }, {
                                        key: 'type',
                                        value: 'http://data.emii.com/ontologies/bca/ViewableThing'
                                    }, {
                                        key: 'limit',
                                        value: 100
                                    }
                                    ]
                                );
                            }));
                        });
                        
                        it('should pass parameters to the endpoint', inject(function (DataEndpoint, Suggest) {
                            Suggest.suggest({
                                q: 'America',
                                type: 'http://data.emii.com/ontologies/bca/View',
                                limit: 50
                            }).then(function () {
                            });
                            scope.$root.$digest();
                            args = DataEndpoint.getTemplatedEndpoint.argsForCall[0][1];
                            expect(args[0].key).toBe('q');
                            expect(args[0].value).toBe('America');
                            expect(args[1].key).toBe('type');
                            expect(args[1].value).toBe('http://data.emii.com/ontologies/bca/View');
                            expect(args[2].key).toBe('limit');
                            expect(args[2].value).toBe(50);
                        }));
                    });
                   
                });


            });
        });