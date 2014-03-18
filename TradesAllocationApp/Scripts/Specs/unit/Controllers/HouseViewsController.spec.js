define(['App/Controllers/HouseViews/HouseViewsController',
        'underscore',
        'moment',
        'angular',
        'resource',
        'mocks',
        'App/Controllers/controllers'], function (HouseViewsController, _, moment) {
            describe('House Views Controller', function () {
                describe('Given we have a HouseViewsController', function () {
                    var controller,
                        scope,
                        findView = function(key) {
                            return _.find(scope.filteredViews, function(view) {
                                return view.key === key;
                            });
                        },
                        getTypeFilter = function(filter) {
                            return _.find(scope.filters.types, function(current) {
                                return current.key === filter;
                            });
                        },
                        getBenchmarkFilter = function(filter) {
                            return _.find(scope.filters.benchmark, function(current) {
                                return current.key === filter;
                            });
                        },
                        getLastUpdatedFilter = function(filter) {
                            return _.find(scope.filters.lastUpdated, function(current) {
                                return current.key === filter;
                            });
                        };

                    beforeEach(function () {
                        module('App');
                    });

                    beforeEach(inject(function ($rootScope, $controller, $q) {
                        var fakeHouseViews = {
                            getViews: function() {
                                var deferred = $q.defer();
                                deferred.resolve([
                                    {
                                        key: 'http://data.emii.com/economies/fra',
                                        activeViews: 5,
                                        type: 'Economy',
                                        views: {
                                            shortTermViews: [{
                                                    lastUpdated: moment().subtract('days', 2).format('YYYY-MM-DD'),
                                                    viewWeighting: {}
                                                },
                                                {
                                                    lastUpdated: moment().subtract('days', 2).format('YYYY-MM-DD'),
                                                    viewDirection: {}
                                                }],
                                            longTermViews: [{
                                                lastUpdated: moment().subtract('months', 1).format('YYYY-MM-DD')
                                            }]
                                        }
                                    },
                                    {
                                        key: 'http://data.emii.com/economies/hkg/finance-and-insurance',
                                        activeViews: 2,
                                        type: 'Economy',
                                        views: {
                                            shortTermViews: [],
                                            longTermViews: [{
                                                lastUpdated: moment().subtract('weeks', 3).format('YYYY-MM-DD')
                                            }]
                                        }
                                    },
                                    {
                                        key: 'EquityMarket/European Union Equities/',
                                        service: 'http://data.emii.com/equity-markets/eu',
                                        type: 'EquityMarket',
                                        views: {
                                            shortTermViews: [{
                                                    lastUpdated: moment().subtract('weeks', 6).format('YYYY-MM-DD'),
                                                    themes: [{
                                                            "@type": "Theme",
                                                            "@id": "http://data.emii.com/bca/themes/c2px1vnk1zd3",
                                                            "canonicalLabel": "Europe's Saints versus Sinners Narrative is Flawed"
                                                        },
                                                        {
                                                            "@type": "Theme",
                                                            "@id": "http://data.emii.com/bca/themes/c2px1vnk1zd3",
                                                            "canonicalLabel": "Europe's Saints versus Sinners Narrative is Flawed"
                                                        },
                                                        {
                                                            "@type": "Theme",
                                                            "@id": "http://data.emii.com/bca/themes/c2px1vnk1zbt",
                                                            "canonicalLabel": "China will experience a soft-landing"
                                                        },
                                                        {
                                                            "@type": "Theme",
                                                            "@id": "http://data.emii.com/bca/themes/c2px1vnk1zd3",
                                                            "canonicalLabel": "Europe's Saints versus Sinners Narrative is Flawed"
                                                        },
                                                        {
                                                            "@type": "Theme",
                                                            "@id": "http://data.emii.com/bca/themes/c2px1vnk1zbw",
                                                            "canonicalLabel": "Equities will outperform bonds over a medium-term horizon"
                                                        }]
                                                },
                                                {
                                                    lastUpdated: moment().subtract('weeks', 6).format('YYYY-MM-DD'),
                                                    themes: [{
                                                            "@type": "Theme",
                                                            "@id": "http://data.emii.com/bca/themes/c2px1vnk1zd3",
                                                            "canonicalLabel": "Europe's Saints versus Sinners Narrative is Flawed"
                                                        },
                                                        {
                                                            "@type": "Theme",
                                                            "@id": "http://data.emii.com/bca/themes/c2px1aaaazbw",
                                                            "canonicalLabel": "aaaaaaaaaaaaaa"
                                                        }]
                                                }],
                                            longTermViews: [{
                                                lastUpdated: moment().subtract('months', 3).format('YYYY-MM-DD')
                                            }]
                                        }
                                    },
                                    {
                                        key: 'EquityMarket/European Union Equities/rel',
                                        service: 'http://data.emii.com/equity-markets/eu',
                                        type: 'EquityMarket',
                                        views: {
                                            shortTermViews: [{
                                                    lastUpdated: moment().subtract('months', 1).format('YYYY-MM-DD'),
                                                    viewWeighting: {},
                                                    themes: []
                                                },
                                                {
                                                    lastUpdated: moment().subtract('months', 20).format('YYYY-MM-DD'),
                                                    viewDirection: {},
                                                    themes: []
                                                }],
                                            longTermViews: []
                                        }
                                    },
                                    {
                                        key: 'http://data.emii.com/currencies/cny',
                                        type: 'Currency',
                                        views: {
                                            shortTermViews: [{
                                                lastUpdated: moment().subtract('months', 1).format('YYYY-MM-DD')
                                            }],
                                            longTermViews: [{
                                                lastUpdated: moment().subtract('months', 16).format('YYYY-MM-DD')
                                            }]
                                        }
                                    },
                                    {
                                        key: 'http://data.emii.com/commodities-markets/gold',
                                        type: 'CommodityMarket',
                                        views: {
                                            shortTermViews: [{
                                                lastUpdated: moment().subtract('months', 13).format('YYYY-MM-DD')
                                            }],
                                            longTermViews: [{
                                                lastUpdated: moment().subtract('months', 16).format('YYYY-MM-DD')
                                            }]
                                        }
                                    }
                                ]);
                                return deferred.promise;
                            }
                        };

                        scope = $rootScope.$new();
                        controller = $controller(HouseViewsController, {
                            $scope: scope,
                            HouseViews: fakeHouseViews
                        });
                        scope.$root.$digest();
                    }));

                    describe('When initializing the controller', function () {
                        it("Should have its view set to 'House views", function () {
                            expect(scope.viewName).toEqual('House views');
                        });

                        it('Should have 6 views', function () {
                            expect(scope.views.length).toBe(6);
                            expect(scope.filteredViews.length).toBe(6);
                        });

                        it('All the short term views should be visible by default', function () {
                            var shortTermViews = _.map(scope.views, function (item) {
                                return item.views.shortTermViews;
                            });
                            _.each(shortTermViews, function (views) {
                                _.each(views, function(view) {
                                    expect(view.isVisible).toBe(true);
                                });
                            });
                        });
                        
                        it('All the long term views should be visible by default', function () {
                            var longTermViews = _.map(scope.views, function (item) {
                                return item.views.shortTermViews;
                            });
                            _.each(longTermViews, function (views) {
                                _.each(views, function (view) {
                                    expect(view.isVisible).toBe(true);
                                });
                            });
                        });
                        
                        it('http://data.emii.com/economies/fra should have 5 active views', function () {
                            expect(findView('http://data.emii.com/economies/fra').activeViews).toBe(5);
                        });

                        it('http://data.emii.com/economies/hkg/finance-and-insurance should have 2 active views', function () {
                            expect(findView('http://data.emii.com/economies/hkg/finance-and-insurance').activeViews).toBe(2);
                        });

                        it('All the viewables things should be collapsed', function () {
                            _.forEach(scope.views, function (view) {
                                expect(view.isExpanded).toBe(false);
                            });
                        });

                        it('Should contain a list of asset class filters', function () {
                            expect(getTypeFilter('EquityMarket')).toBeDefined();
                            expect(getTypeFilter('FixedIncome')).toBeDefined();
                            expect(getTypeFilter('Currency')).toBeDefined();
                            expect(getTypeFilter('CommodityMarket')).toBeDefined();
                            expect(getTypeFilter('RealEstate')).toBeDefined();
                            expect(getTypeFilter('Economy')).toBeDefined();
                        });
                        
                        it('Each asset class filter should have a dataTrackingAction defined for webtrends purposes', function() {
                            expect(getTypeFilter('EquityMarket').dataTrackingAction).toBe('filter_houseview_market');
                            expect(getTypeFilter('FixedIncome').dataTrackingAction).toBe('filter_houseview_fixed_income');
                            expect(getTypeFilter('Currency').dataTrackingAction).toBe('filter_houseview_currency');
                            expect(getTypeFilter('CommodityMarket').dataTrackingAction).toBe('filter_houseview_commodity');
                            expect(getTypeFilter('RealEstate').dataTrackingAction).toBe('filter_houseview_real_estate');
                            expect(getTypeFilter('Economy').dataTrackingAction).toBe('filter_houseview_economy');
                        });

                        it('Should contain Relative and Absolute benchmark filters', function () {
                            expect(getBenchmarkFilter('Relative')).toBeDefined();
                            expect(getBenchmarkFilter('Absolute')).toBeDefined();
                        });

                        it('Each benchmark filter should have a dataTrackingAction defined for webtrends purposes', function() {
                            expect(getBenchmarkFilter('Relative').dataTrackingAction).toBe('filter_houseview_relative');
                            expect(getBenchmarkFilter('Absolute').dataTrackingAction).toBe('filter_houseview_absolute');
                        });
                        
                        it('should display list of themes grouped', function () {
                            var viewable = findView('EquityMarket/European Union Equities/');
                            expect(viewable.views.shortTermViews.length).toBe(2);
                            expect(viewable.views.shortTermThemes.length).toBe(4);
                        });
                        it('Should contain a list of Last Updated filters', function () {
                            expect(getLastUpdatedFilter('LastWeek')).toBeDefined();
                            expect(getLastUpdatedFilter('LastMonth')).toBeDefined();
                            expect(getLastUpdatedFilter('LastQuarter')).toBeDefined();
                            expect(getLastUpdatedFilter('LastYear')).toBeDefined();
                        });
                        
                        it('Each Last Updated filter should have a dataTrackingAction defined for webtrends purposes', function () {
                            expect(getLastUpdatedFilter('LastWeek').dataTrackingAction).toBe('filter_houseview_updated_1week');
                            expect(getLastUpdatedFilter('LastMonth').dataTrackingAction).toBe('filter_houseview_updated_1month');
                            expect(getLastUpdatedFilter('LastQuarter').dataTrackingAction).toBe('filter_houseview_updated_1quarter');
                            expect(getLastUpdatedFilter('LastYear').dataTrackingAction).toBe('filter_houseview_updated_1year');
                        });

                        it('Should have no filter selected', function () {
                            var allFilters = _.union(_.union(scope.filters.types, scope.filters.benchmark), scope.filters.types);
                            _.each(allFilters, function (filter) {
                                expect(filter.isSelected).toBe(false);
                            });
                        });
                        
                        it('HasFiltersApplied should be false', function () {
                            expect(scope.hasFiltersApplied).toBe(false);
                        });
                    });

                    describe('When clicking on expand/collapse all the views', function() {
                        it('Should expand all the views', function () {
                            scope.configuration.allViewsExpanded = true;
                            scope.$digest();
                            _.each(scope.filteredViews, function (view) {
                                expect(view.isExpanded).toBe(true);
                            });
                            
                            scope.configuration.allViewsExpanded = false;
                            scope.$digest();
                            _.each(scope.filteredViews, function (view) {
                                expect(view.isExpanded).toBe(false);
                            });
                        });
                    });
                    

                    describe('Filtering', function () {
                        describe('By asset class', function () {

                            it('Should have hasFiltersApplied should be true', function () {
                                getTypeFilter('EquityMarket').isSelected = true;
                                scope.$digest();
                                expect(scope.hasFiltersApplied).toBe(true);
                            });
                            
                            describe('When filtering by EquityMarket', function () {
                                it('Should display 2 results', function () {
                                    getTypeFilter('EquityMarket').isSelected = true;
                                    scope.$digest();
                                    expect(scope.filteredViews.length).toBe(2);
                                });
                            });

                            describe('When filtering by EquityMarket and Currency', function () {
                                it('Should display 3 results', function () {
                                    getTypeFilter('EquityMarket').isSelected = true;
                                    getTypeFilter('Currency').isSelected = true;
                                    scope.$digest();
                                    expect(scope.filteredViews.length).toBe(3);
                                });
                            });
                            describe('When filtering by CommodityMarket', function () {
                                it('Should display 1 results', function () {
                                    getTypeFilter('CommodityMarket').isSelected = true;
                                    scope.$digest();
                                    expect(scope.filteredViews.length).toBe(1);
                                });
                            });
                            describe('When filtering by Economy', function () {
                                it('Should display 2 results', function () {
                                    getTypeFilter('Economy').isSelected = true;
                                    scope.$digest();
                                    expect(scope.filteredViews.length).toBe(2);
                                });
                            });
                        });

                        describe('By benchmark', function () {
                            function countVisibleViews(views) {
                                return _.filter(views, function (view) {
                                    return view.isVisible === true;
                                }).length;
                            }
                            
                            it('Should have hasFiltersApplied should be true', function () {
                                scope.selectBenchmark('Absolute', true);
                                scope.$digest();
                                expect(scope.hasFiltersApplied).toBe(true);
                            });
                            
                            describe('When filtering by Absolute', function () {
                                it('Should display 6 results', function () {
                                    scope.selectBenchmark('Absolute', true);
                                    scope.$digest();
                                    expect(scope.filteredViews.length).toBe(6);
                                });
                            });

                            describe('When filtering by Relative', function () {
                                it('Should display 1 result', function () {
                                    scope.selectBenchmark('Relative', true);
                                    scope.$digest();
                                    expect(scope.filteredViews.length).toBe(2);

                                    var franceEconomyView = findView('http://data.emii.com/economies/fra');
                                    expect(countVisibleViews(franceEconomyView.views.shortTermViews)).toBe(1);
                                    expect(countVisibleViews(franceEconomyView.views.longTermViews)).toBe(0);

                                    var euEquityView = findView('EquityMarket/European Union Equities/rel');
                                    expect(countVisibleViews(euEquityView.views.shortTermViews)).toBe(1);
                                    expect(countVisibleViews(euEquityView.views.longTermViews)).toBe(0);
                                });
                            });
                            
                            describe('When filtering by Absolute and last month', function () {
                                it('Should display 2 results', function () {
                                    scope.selectLastUpdated('LastMonth', true);
                                    scope.selectBenchmark('Absolute', true);
                                    scope.$digest();
                                    expect(scope.filteredViews.length).toBe(2);
                                    var franceEconomyView = findView('http://data.emii.com/economies/fra');
                                    var hongKongEconomyView = findView('http://data.emii.com/economies/hkg/finance-and-insurance');

                                    expect(countVisibleViews(franceEconomyView.views.shortTermViews)).toBe(1);
                                    expect(countVisibleViews(franceEconomyView.views.longTermViews)).toBe(0);
                                    expect(countVisibleViews(hongKongEconomyView.views.shortTermViews)).toBe(0);
                                    expect(countVisibleViews(hongKongEconomyView.views.longTermViews)).toBe(1);
                                });
                            });

                            describe('Given the Absolute filter is selected', function () {
                                describe('When selecting the Relative filter', function () {
                                    it('Should unselect the Absolute filter', function () {
                                        scope.selectBenchmark('Absolute', true);
                                        scope.$digest();
                                        scope.selectBenchmark('Relative', true);
                                        scope.$digest();
                                        expect(getBenchmarkFilter('Absolute').isSelected).toBe(false);
                                        expect(getBenchmarkFilter('Relative').isSelected).toBe(true);
                                    });
                                });
                            });

                            describe('Given the Relative filter is selected', function () {
                                describe('When selecting the Absolute filter', function () {
                                    it('Should unselect the Relative filter', function () {
                                        scope.selectBenchmark('Relative', true);
                                        scope.$digest();
                                        scope.selectBenchmark('Absolute', true);
                                        scope.$digest();
                                        expect(getBenchmarkFilter('Relative').isSelected).toBe(false);
                                        expect(getBenchmarkFilter('Absolute').isSelected).toBe(true);
                                    });
                                });
                            });

                            describe('Given the Absolute filter is selected', function () {
                                describe('When selecting the Absolute filter again', function () {
                                    it('The Absolute filter should be deselected', function () {
                                        expect(getBenchmarkFilter('Absolute').isSelected).toBe(false);
                                        scope.selectBenchmark('Absolute', true);
                                        expect(getBenchmarkFilter('Absolute').isSelected).toBe(true);
                                        scope.selectBenchmark('Absolute', false);
                                        expect(getBenchmarkFilter('Absolute').isSelected).toBe(false);
                                    });
                                });
                            });
                        });

                        describe('By last updated', function () {
                            it('Should have hasFiltersApplied should be true', function () {
                                scope.selectLastUpdated('LastMonth', true);
                                scope.$digest();
                                expect(scope.hasFiltersApplied).toBe(true);
                            });
                            
                            describe('Given LastMonth is selected', function () {
                                it('The other date filters should be deselected', function () {
                                    scope.selectLastUpdated('LastMonth', true);
                                    scope.$digest();
                                    expect(getLastUpdatedFilter('LastWeek').isSelected).toBe(false);
                                    expect(getLastUpdatedFilter('LastMonth').isSelected).toBe(true);
                                    expect(getLastUpdatedFilter('LastQuarter').isSelected).toBe(false);
                                    expect(getLastUpdatedFilter('LastYear').isSelected).toBe(false);
                                });
                            });
                            describe('Given LastMonth is selected', function () {
                                describe('Selecting LastMonth again', function () {
                                    it('Should unselect LastMonth', function () {
                                        scope.selectLastUpdated('LastMonth', true);
                                        scope.$digest();
                                        scope.selectLastUpdated('LastMonth', false);
                                        scope.$digest();
                                        expect(getLastUpdatedFilter('LastMonth').isSelected).toBe(false);
                                    });
                                });
                            });

                            describe('Given we select last week', function() {
                                it('Should display 1 result', function() {
                                    scope.selectLastUpdated('LastWeek', true);
                                    scope.$digest();
                                    expect(scope.filteredViews.length).toBe(1);
                                });

                                describe('When removing a selected filter ', function () {
                                    beforeEach(function () {
                                        scope.selectLastUpdated('LastWeek', true);
                                        scope.$digest();
                                        scope.selectLastUpdated('LastWeek', false);
                                        scope.$digest();
                                    });
                                    it('Should display all the results', function () {
                                        expect(scope.filteredViews.length).toBe(6);
                                    });
                                    it('All the views should be visible', function () {
                                        _.each(scope.filteredViews, function(view) {
                                            _.each(view.views.shortTermViews, function(shortTermView) {
                                                expect(shortTermView.isVisible).toBe(true);
                                            });
                                            _.each(view.views.longTermViews, function (longTermView) {
                                                expect(longTermView.isVisible).toBe(true);
                                            });
                                        });
                                        
                                    });
                                });
                            });
                            
                            describe('Given we select last month', function () {
                                beforeEach(function() {
                                    scope.selectLastUpdated('LastMonth', true);
                                    scope.$digest();
                                });
                                
                                it('Should display 2 results', function () {
                                    expect(scope.filteredViews.length).toBe(2);
                                });
                                
                                it('Should display the short term view for http://data.emii.com/economies/fra', function () {
                                    var view = findView('http://data.emii.com/economies/fra');
                                    expect(view.views.shortTermViews[0].isVisible).toBe(true);
                                    expect(view.views.longTermViews[0].isVisible).toBe(false);
                                });
                                
                                it('http://data.emii.com/economies/fra Should have no long term view', function () {
                                    var view = findView('http://data.emii.com/economies/fra');
                                    expect(view.views.hasLongTermView()).toBe(false);
                                });
                                
                                it('http://data.emii.com/economies/fra Should have short term view', function() {
                                    var view = findView('http://data.emii.com/economies/fra');
                                    expect(view.views.hasShortTermView()).toBe(true);
                                });
                            });
                            
                            describe('Given we select last quarter', function () {
                                it('Should display 1 result', function () {
                                    scope.selectLastUpdated('LastQuarter', true);
                                    scope.$digest();
                                    expect(scope.filteredViews.length).toBe(5);
                                });
                            });
                            
                            describe('Given we select last year', function () {
                                it('Should display 5 results', function () {
                                    scope.selectLastUpdated('LastYear', true);
                                    scope.$digest();
                                    expect(scope.filteredViews.length).toBe(5);
                                });
                            });
                        });
                        
                        describe('By asset class, benchmark, and last updated', function () {
                            describe('Given Economy and Absolute is selected', function () {
                                it('Should display 2 results', function () {
                                    scope.selectBenchmark('Absolute', true);
                                    getTypeFilter('Economy').isSelected = true;
                                    scope.$digest();
                                    expect(scope.filteredViews.length).toBe(2);
                                });
                            });
                            describe('Given Economy and Relative is selected', function () {
                                it('Should display 1 result', function () {
                                    scope.selectBenchmark('Relative', true);
                                    getTypeFilter('Economy').isSelected = true;
                                    scope.$digest();
                                    expect(scope.filteredViews.length).toBe(1);
                                });
                            });
                            
                            describe('Given Economy, Absolute, and updated LastWeek is selected', function () {
                                it('Should display 0 result', function () {
                                    scope.selectBenchmark('Absolute', true);
                                    getTypeFilter('Economy').isSelected = true;
                                    scope.selectLastUpdated('LastWeek', true);
                                    scope.$digest();
                                    expect(scope.filteredViews.length).toBe(1);
                                });
                            });
                        });

                        describe('Clearing filters', function() {
                            describe('Given we have filters selected', function() {
                                describe('When clearing the filters', function() {
                                    it('Should unselect all the filters', function () {
                                        getTypeFilter('EquityMarket').isSelected = true;
                                        getTypeFilter('Currency').isSelected = true;
                                        scope.selectBenchmark('Absolute', true);
                                        scope.$digest();
                                        expect(scope.hasFiltersApplied).toBe(true);
                                        scope.clearFilters();
                                        scope.$digest();
                                        expect(scope.hasFiltersApplied).toBe(false);
                                    });
                                });
                            });
                        });

                    });
                });
            });
        });