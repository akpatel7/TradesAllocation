define(['underscore',
        'App/Services/FilterValues',
        'angular',
        'mocks'], function (_) {
            describe('FilterValues', function () {
                var regionsServerData = [
                    {
                        uri: 'http://data.emii.com/locations/afr',
                        label: 'Africa',
                        description: 'Location'
                    },
                    {
                        uri: 'http://data.emii.com/locations/asi',
                        label: 'Asia',
                        description: 'Location'
                    }
                ];
                beforeEach(function () {
                    module('App.services');
                });

                describe('Given we are on the views page', function () {
                    describe('When resolving the filters', function () {
                        var filters;
                        beforeEach(inject(function ($location, FilterValues, $rootScope, Collection) {
                            $location.path('/Views');
                            spyOn(Collection, 'get').andReturn({
                                then: function (expression) {
                                    expression(regionsServerData);
                                }
                            });
                            
                            FilterValues.resolve().then(function(data) {
                                filters = data;
                            });
                            
                            $rootScope.$digest();
                        }));
                        it('Should return 17 services', function () {
                            expect(filters.services.length).toBe(17);
                        });
                        it('Should return 6 asset classes', function () {
                            expect(filters.assetClass.length).toBe(6);
                        });
                        it('Should return 3 view convictions', function () {
                            expect(filters.viewConviction.length).toBe(3);
                        });
                       
                        it('Should return 3 positions', function() {
                            expect(filters.position.length).toBe(3);
                        });
                        
                        it('Positive positions should have 6 uris', function () {
                            expect(filters.position[0].uri.length).toBe(6);
                        });

                        it('Neutral positions should have 6 uris', function () {
                            expect(filters.position[1].uri.length).toBe(6);
                        });
                        
                        it('Negative positions should have 6 uris', function () {
                            expect(filters.position[2].uri.length).toBe(6);
                        });
                        it('Should return recommendation type', function () {
                            expect(filters.recommendationType).toBeDefined();
                        });
                        it('Should return view type', function () {
                            expect(filters.viewType).toBeDefined();
                            expect(filters.viewType[0].uri).toEqual(['http://data.emii.com/view-types/relative']);
                            expect(filters.viewType[1].uri).toEqual([
                                'http://data.emii.com/view-types/absolute',
                                'http://data.emii.com/view-types/economy',
                                'http://data.emii.com/view-types/fiscal-policies',
                                'http://data.emii.com/view-types/monetary-policy',
                                'http://data.emii.com/view-types/inflation',
                                'http://data.emii.com/view-types/interest-rate'
                            ]);
                        });
                        it('Should return last updated', function () {
                            expect(filters.lastUpdated).toBeDefined();
                        });
                        it('LastWeek should have a value of "Last week"', function () {
                            expect(filters.lastUpdated.values['LastWeek']).toBe('Last week');
                        });
                        it('Should return service', function () {
                            expect(filters.service).toBeDefined();
                        });
                        it('Should return viewable uri', function () {
                            expect(filters.viewableUri).toBeDefined();
                            expect(filters.viewableUri.display).not.toBe(false);
                        });
                        it('Should return view status', function () {
                            expect(filters.viewStatus).toBeDefined();
                        });
                        it('Should return My-Views options visible', function () {
                            expect(filters.custom).toBeDefined();
                        });
                        it('should have 5 uris for Economy', function() {
                            expect(filters.assetClass[0].uri).toEqual([
                                'http://data.emii.com/ontologies/economy/Economy',
                                'http://data.emii.com/ontologies/economy/FiscalPolicy',
                                'http://data.emii.com/ontologies/economy/MonetaryPolicy',
                                'http://data.emii.com/ontologies/economy/Inflation',
                                'http://data.emii.com/ontologies/economy/InterestRate'
                            ]);
                        });
                        
                        it('should have 5 serverKeys for economy', function () {
                            expect(filters.assetClass[0].serverKeys).toEqual([
                                'Economy',
                                'FiscalPolicy',
                                'InterestRate',
                                'Inflation',
                                'MonetaryPolicy'
                            ]);
                        });
                       
                    });

                });

                describe('Given we are on the themes page', function () {
                    beforeEach(inject(function ($location) {
                        $location.path('/Themes');
                    }));

                    describe('And regions have been loaded', function () {
                        var filters;
                        
                        beforeEach(inject(function (FilterValues, $rootScope) {
                            FilterValues._themesFilters.regions = [];
                            FilterValues.resolve().then(function (data) {
                                filters = data;
                            });
                            $rootScope.$digest();
                        }));

                        describe('When resolving the filters', function () {
                            it('Should return 17 services', function () {
                                expect(filters.services.length).toBe(17);
                            });
                            it('Should return 6 asset class', function () {
                                expect(filters.assetClass.length).toBe(6);
                            });
                            it('Should return no view conviction', function () {
                                expect(filters.viewConviction).toBeUndefined();
                            });
                            it('Should return 3 impacts', function () {
                                expect(filters.impacts.length).toBe(3);
                                expect(_.pluck(filters.impacts, 'label')).toEqual(['Bearish', 'Neutral', 'Bullish']);
                                expect(_.pluck(filters.impacts, 'isSelected')).toEqual([false, false, false]);
                            });
                            it('Should return 4 last applied filters', function () {
                                expect(filters.lastApplied.values.LastWeek.label).toBe('Last week');
                                expect(filters.lastApplied.values.LastMonth.label).toBe('Last month');
                                expect(filters.lastApplied.values.LastQuarter.label).toBe('Last quarter');
                                expect(filters.lastApplied.values.LastYear.label).toBe('Last year');
                            });
                            it('should have custom filters', function() {
                                expect(filters.custom.length).toBe(2);
                            });
                            it('favourite filter should not be selected', function () {
                                expect(filters.custom[0].isSelected).toBe(false);
                            });
                            it('should have uri filter displayable', function () {
                                expect(filters.uri).toBeDefined();
                                expect(filters.uri.display).toBe(true);
                            });
                            
                        });
                    });
                    
                    describe('And regions have not been loaded', function () {
                        var filters;
                        beforeEach(inject(function(Collection, FilterValues, $rootScope) {
                            
                            spyOn(Collection, 'get').andReturn({
                                then: function(expression) {
                                    expression(regionsServerData);
                                }
                            });
                            FilterValues.resolve().then(function(data) {
                                filters = data;
                            });
                            $rootScope.$digest();
                        }));
                        it('should fetch the regions from isis', function () {
                            expect(filters.regions.length).toBe(2);
                            expect(filters.regions[0].key).toBe('Africa');
                            expect(filters.regions[0].label).toBe('Africa');
                            expect(filters.regions[0].uri).toBe('http://data.emii.com/locations/afr');
                            expect(filters.regions[0].isSelected).toBe(false);
                            expect(filters.regions[0].count).toBe(0);

                            expect(filters.regions[1].key).toBe('Asia');
                            expect(filters.regions[1].label).toBe('Asia');
                            expect(filters.regions[1].uri).toBe('http://data.emii.com/locations/asi');
                            expect(filters.regions[1].isSelected).toBe(false);
                            expect(filters.regions[1].count).toBe(0);
                        });
                    });
                    
                  

                });
                
                describe('Given we are on the favourite themes page', function () {
                    beforeEach(inject(function ($location) {
                        $location.path('/favourites/themes');
                    }));

                    describe('And regions have been loaded', function () {
                        var filters;

                        beforeEach(inject(function (FilterValues, $rootScope) {
                            FilterValues._themesFilters.regions = [];
                            FilterValues.resolve().then(function (data) {
                                filters = data;
                            });
                            $rootScope.$digest();
                        }));

                        describe('When resolving the filters', function () {
                            it('Should return filters', function () {
                                expect(_.isEmpty(filters)).toBe(false);
                            });
                           
                        });
                    });
                });
                
                describe('Given we are on the favourite views page', function () {
                    beforeEach(inject(function ($location) {
                        $location.path('/favourites');
                    }));

                    describe('And regions have been loaded', function () {
                        var filters;

                        beforeEach(inject(function (FilterValues, $rootScope) {
                            FilterValues._allViewsFilters.regions = [];
                            FilterValues.resolve().then(function (data) {
                                filters = data;
                            });
                            $rootScope.$digest();
                        }));

                        describe('When resolving the filters', function () {
                            it('Should return filters', function () {
                                expect(_.isEmpty(filters)).toBe(false);
                            });
                            it('favourite filter should be selected', function () {
                                expect(filters.custom[0].isSelected).toBe(true);
                            });
                           
                        });
                    });
                    
                });

                describe('Given we want to know a query string', function () {
                    it('Should return filters for "Economy"', inject(function (FilterValues) {
                        expect(FilterValues.getFilterQueryString({ assetClass: 'Economy' })).toBe('Economy=http://data.emii.com/ontologies/economy/Economy');
                        expect(FilterValues.getFilterQueryString({ assetClass: 'FiscalPolicy' })).toBe('Economy=http://data.emii.com/ontologies/economy/Economy');
                        expect(FilterValues.getFilterQueryString({ assetClass: 'InterestRate' })).toBe('Economy=http://data.emii.com/ontologies/economy/Economy');
                        expect(FilterValues.getFilterQueryString({ assetClass: 'Inflation' })).toBe('Economy=http://data.emii.com/ontologies/economy/Economy');
                        expect(FilterValues.getFilterQueryString({ assetClass: 'MonetaryPolicy' })).toBe('Economy=http://data.emii.com/ontologies/economy/Economy');
                    }));
                    it('Should return filters for "EquityMarket"', inject(function (FilterValues) {
                        expect(FilterValues.getFilterQueryString({ assetClass: 'EquityMarket' })).toBe('EquityMarket=http://data.emii.com/ontologies/economy/EquityMarket');
                    }));
                    it('Should return filters for "FixedIncomeMarket"', inject(function (FilterValues) {
                        expect(FilterValues.getFilterQueryString({ assetClass: 'FixedIncomeMarket' })).toBe('FixedIncomeMarket=http://data.emii.com/ontologies/economy/FixedIncomeMarket');
                    }));
                    it('Should return filters for "CurrencyMarket"', inject(function (FilterValues) {
                        expect(FilterValues.getFilterQueryString({ assetClass: 'CurrencyMarket' })).toBe('CurrencyMarket=http://data.emii.com/ontologies/economy/CurrencyMarket');
                        expect(FilterValues.getFilterQueryString({ assetClass: 'Currency' })).toBe('CurrencyMarket=http://data.emii.com/ontologies/economy/CurrencyMarket');
                    }));
                    it('Should return filters for "CommodityMarket"', inject(function (FilterValues) {
                        expect(FilterValues.getFilterQueryString({ assetClass: 'CommodityMarket' })).toBe('CommodityMarket=http://data.emii.com/ontologies/economy/CommodityMarket');
                    }));
                    it('Should return filters for "RealEstateMarket"', inject(function (FilterValues) {
                        expect(FilterValues.getFilterQueryString({ assetClass: 'RealEstateMarket' })).toBe('RealEstateMarket=http://data.emii.com/ontologies/economy/RealEstateMarket');
                    }));
                    
                });
            });
        });
