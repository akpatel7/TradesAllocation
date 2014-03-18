define(['App/Controllers/FilterController',
        'underscore',
        'angular',
        'resource',
        'mocks',
        'route',
        'App/Controllers/controllers'
    ], function(FilterController, _) {
        describe('FilterController', function() {
            var _FILTERS_CHANGED_ = 'changed',
                _FILTERS_UPDATEFACETS_ = 'facets_have_changed';

            beforeEach(module('ngRoute'));
            beforeEach(module('App'));
            beforeEach(
                // setup some test routes
                module(function($routeProvider) {
                    $routeProvider
                        .when('/views', {
                            action: 'home.views'
                        })
                        .when('/themes', {
                            action: 'home.themes'
                        })
                        .otherwise(
                            {
                                redirectTo: '/views'
                            }
                        );
                }));

            beforeEach(module(function($provide) {
                $provide.constant('_FILTERS_CHANGED_', _FILTERS_CHANGED_);
                $provide.constant('_FILTERS_UPDATEFACETS_', _FILTERS_UPDATEFACETS_);
            }));

            describe('Given we have a FilterController for all views', function() {
                var controller,
                    scope;

                beforeEach(inject(function($controller, $rootScope, FilterValues) {
                    scope = $rootScope.$new();
                    spyOn($rootScope, '$broadcast').andCallThrough();
                    spyOn(FilterValues, 'resolve').andReturn({
                        then: function(expression) {
                            expression(FilterValues._allViewsFilters);
                        }
                    });
                    controller = $controller(FilterController, { $scope: scope });
                }));

                it('Should not have any filters applied when initialised', function() {
                    _.each(_.union(scope.filters.assetClass, scope.filters.viewConviction, scope.filters.services, scope.filters.viewType), function(item) {
                        expect(item.isSelected).toBe(false);
                    });
                    expect(scope.filters.lastUpdated.value).toBeUndefined();
                    expect(scope.filters.recommendationType.value).toBeUndefined();
                    expect(scope.hasFiltersApplied).toBe(false);
                });
                
                it('should not wait for filters to be loaded', function () {
                    expect(scope.waitForFilters).toBe(false);
                });
               
                it('Should all filters in arrays have label', function() {
                    _.each(scope.filters, function(filterItem) {
                        if (filterItem instanceof Array) {
                            _.each(filterItem, function(item) {
                                expect(item.label).toBeDefined();
                                expect(item.label).not.toBe(null);
                                expect(item.label).not.toBe('');
                            });
                        }
                    });
                });

                it('should broadcast _FILTER_LOADED_ event', inject(function ($rootScope, FilterValues) {
                    expect($rootScope.$broadcast).toHaveBeenCalledWith(_FILTERS_CHANGED_, FilterValues._allViewsFilters);
                }));
                
                describe('When we choose to filter by asset class', function() {
                    it('Should have filters selected', function() {
                        scope.filters.assetClass[1].isSelected = true;
                        scope.$root.$digest();
                        expect(scope.hasFiltersApplied).toBe(true);
                    });
                });

                describe('When we choose to filter by service', function() {
                    it('Should have filters selected', function() {
                        scope.filters.services[1].isSelected = true;
                        scope.$root.$digest();
                        expect(scope.hasFiltersApplied).toBe(true);
                    });
                });

                describe('When we choose to filter by view conviction', function() {
                    it('Should have filters selected', function() {
                        scope.filters.viewConviction[1].isSelected = true;
                        scope.$root.$digest();
                        expect(scope.hasFiltersApplied).toBe(true);
                    });
                });

                describe('When we choose to filter by view type', function() {
                    it('Should have filters selected', function() {
                        scope.filters.viewType[0].isSelected = true;
                        scope.$root.$digest();
                        expect(scope.hasFiltersApplied).toBe(true);
                    });
                });

                describe('When we choose to filter by last updated', function() {
                    it('Should have filters selected', function() {
                        scope.filters.lastUpdated.value = 'LastYear';
                        scope.$root.$digest();
                        expect(scope.hasFiltersApplied).toBe(true);
                    });
                });

                describe('When we choose to filter by recommendation type', function() {
                    it('Should have filters selected', function() {
                        scope.filters.recommendationType.value = 'http://someuri/absolute';
                        scope.$root.$digest();
                        expect(scope.hasFiltersApplied).toBe(true);
                    });
                });

                describe('When we choose to filter by position', function() {
                    it('Should have filters selected', function() {
                        scope.filters.position[0].isSelected = true;
                        scope.$root.$digest();
                        expect(scope.hasFiltersApplied).toBe(true);
                    });
                });

                describe('When initializing filters from search', function() {
                    describe('And we filter by CurrencyMarket, which has two possible values', function() {
                        it('should select the currency asset class filter', function() {
                            var search = {
                                CurrencyMarket: 'http://data.emii.com/ontologies/economy/CurrencyMarket'
                            };
                            scope.initFiltersFromSearch(search);
                            expect(scope.filters.assetClass[3].isSelected).toBe(true);
                        });
                    });

                    describe('And we filter by favourites', function() {
                        it('should select the favourites filter', function() {
                            var search = {
                                favourites: 'true'
                            };
                            scope.initFiltersFromSearch(search);
                            expect(scope.filters.custom[0].isSelected).toBe(true);
                            expect(scope.filters.custom[1].isSelected).toBe(false);
                        });
                    });

                    describe('And we filter by followed', function() {
                        it('should select the followed filter', function() {
                            var search = {
                                followed: 'true'
                            };
                            scope.initFiltersFromSearch(search);
                            expect(scope.filters.custom[0].isSelected).toBe(false);
                            expect(scope.filters.custom[1].isSelected).toBe(true);
                        });
                    });
                    
                    describe('And we filter by uri and it is hidden from UI', function () {
                        it('should select the uri filter', function () {
                            var search = {
                                uri: 'http://data.com/uri1'
                            };
                            scope.initFiltersFromSearch(search);
                            expect(scope.filters.viewableUri.value).toBe(search.uri);
                        });
                    });
                });

                describe('Given we apply filters from the UI', function() {
                    beforeEach(function() {
                        scope.filters.assetClass[1].isSelected = true;
                        scope.filters.viewConviction[1].isSelected = true;
                        scope.filters.lastUpdated.value = 'LastYear';
                        scope.filters.viewType[1].isSelected = true;
                        scope.filters.recommendationType.value = 'http://someuri/tactical';
                        scope.filters.services[2].isSelected = true;

                    });
                    it('Query should contain the selected filters', inject(function($location) {
                        var search;
                        scope.applyFilters(true);
                        scope.$root.$digest();

                        search = $location.$$search;
                        expect(scope.hasFiltersApplied).toBe(true);
                        expect(search.EquityMarket).toBe('http://data.emii.com/ontologies/economy/EquityMarket');
                        expect(search.CIS).toBe('http://data.emii.com/bca/services/cis');
                        expect(search.Medium).toBe('http://data.emii.com/view-convictions/medium');
                        expect(search.LastUpdated).toBe('LastYear');
                        expect(search.ViewType).toBe('http://data.emii.com/view-types/absolute');
                        expect(search.RecommendationType).toBe('http://someuri/tactical');
                    }));

                    it('should not broadcast an _FILTERS_CHANGED_ event', function() {
                        var eventTriggered = false;
                        // flush queue
                        scope.$root.$digest();
                        scope.$on(_FILTERS_CHANGED_, function() {
                            eventTriggered = true;
                        });
                        scope.applyFilters({});
                        scope.$root.$digest();
                        expect(eventTriggered).toBe(false);
                    });
                });

                describe('Given applied filter is hidden from UI', function() {
                    beforeEach(function() {
                        scope.filters.custom[0].isSelected = true;
                        scope.filters.custom[0].display = false;
                        scope.filters.custom[1].isSelected = true;
                        scope.filters.custom[1].display = false;
                    });
                    it('url should not contain filter value', inject(function($location) {
                        var search;
                        scope.applyFilters(true);
                        scope.$root.$digest();

                        search = $location.$$search;
                        expect(search).toEqual({});
                        expect(scope.hasFiltersApplied).toBe(false);
                    }));
                });

                describe('Given applied custom filter that is visible in UI', function() {
                    beforeEach(function() {
                        scope.filters.custom[0].isSelected = true;
                        scope.filters.custom[0].display = true;
                        scope.filters.custom[1].isSelected = true;
                        scope.filters.custom[1].display = true;
                    });
                    it('url should not contain filter value', inject(function($location) {
                        var search;
                        scope.applyFilters(true);
                        scope.$root.$digest();

                        search = $location.$$search;
                        expect(search.favourites).toBe('true');
                        expect(search.followed).toBe('true');
                    }));
                });

                describe('Given applied filter that is visible in UI', function() {

                    describe('Given we apply filters not from the UI', function() {
                        beforeEach(function() {
                            scope.filters.assetClass[1].isSelected = true;
                            scope.filters.viewConviction[1].isSelected = true;
                            scope.filters.lastUpdated.value = 'LastYear';
                            scope.filters.viewType[1].isSelected = true;
                            scope.filters.recommendationType.value = 'http://someuri/tactical';
                            scope.filters.services[2].isSelected = true;

                        });
                        it('should broadcast an _FILTERS_CHANGED_ event', function() {
                            var eventTriggered = false;
                            scope.$on(_FILTERS_CHANGED_, function() {
                                eventTriggered = true;
                            });
                            scope.applyFilters();
                            scope.$root.$digest();
                            expect(eventTriggered).toBe(true);
                        });
                    });

                    describe('Given we have selected filters', function() {
                        var $event;
                        beforeEach(function() {
                            scope.filters.assetClass[1].isSelected = true;
                            scope.filters.viewConviction[1].isSelected = true;
                            scope.filters.viewType[1].isSelected = true;
                            scope.filters.recommendationType.value = 'http://someuri/tactical';
                            scope.filters.lastUpdated.value = 'LastYear';
                            scope.filters.services[2].isSelected = true;
                            scope.$root.$digest();

                            $event = {
                                stopPropagation: function() {
                                }
                            };
                        });

                        it('Should have individual filter appplied for asset class', function() {
                            expect(scope.hasFilterApplied(scope.filters.assetClass)).toBe(true);
                        });

                        it('Should have individual filter appplied for view type', function () {
                            expect(scope.hasFilterApplied(scope.filters.viewType)).toBe(true);
                        });

                        it('Should have individual filter appplied for service', function() {
                            expect(scope.hasFilterApplied(scope.filters.services)).toBe(true);
                        });

                        describe('When we update the facet counts for asset class', function() {
                            it('Should aggregate the facet count when the asset has multiple server keys', function() {
                                var facets = {
                                    assetClass: [
                                        {
                                            "count": 10,
                                            "@type": "EquityMarket",
                                            "label": "Equity"
                                        },
                                        {
                                            "count": 20,
                                            "@type": "Economy",
                                            "label": "Economy"
                                        },
                                        {
                                            "count": 10,
                                            "@type": "FiscalPolicy",
                                            "label": "FiscalPolicy"
                                        },
                                        {
                                            "count": 11,
                                            "@type": "CommodityMarket",
                                            "label": "Commodity"
                                        }
                                    ]
                                };

                                expect(scope.filters.assetClass[0].count).toBe(0);
                                expect(scope.filters.assetClass[1].count).toBe(0);
                                expect(scope.filters.assetClass[4].count).toBe(0);

                                scope.updateFacets(facets);

                                expect(scope.filters.assetClass[0].count).toBe(30); // 20 + 10
                                expect(scope.filters.assetClass[1].count).toBe(10);
                                expect(scope.filters.assetClass[4].count).toBe(11);
                            });
                        });


                        describe('When we clear the asset class filter individually', function() {
                            it('Should set all items to be not selected', function() {
                                scope.clearFilter(scope.filters.assetClass, $event);
                                scope.$root.$digest();
                                _.each(scope.filters.assetClass, function(item) {
                                    expect(item.isSelected).toBe(false);
                                });
                            });
                        });

                        describe('When we clear the service filter individually', function() {
                            it('Should set all items to be not selected', function() {
                                scope.clearFilter(scope.filters.services, $event);
                                scope.$root.$digest();
                                _.each(scope.filters.services, function(item) {
                                    expect(item.isSelected).toBe(false);
                                });
                            });
                        });

                        describe('When we clear view type individually', function() {
                            it('Should set the value to be undefined', function() {
                                scope.clearFilter(scope.filters.viewType, $event);
                                scope.$root.$digest();
                                expect(scope.filters.viewType.value).toBeUndefined();
                            });
                        });

                        describe('When we clear filters after selection', function() {
                            beforeEach(function() {
                                scope.clearFilters(true);
                                scope.$root.$digest();
                            });
                            it('Should clear all selected filters', function() {
                                expect(scope.filters.viewType.value).toBeUndefined();
                                expect(scope.filters.lastUpdated.value).toBeUndefined();
                                expect(scope.filters.recommendationType.value).toBeUndefined();
                                _.each(_.union(scope.filters.assetClass, scope.filters.viewConviction,
                                        scope.filters.position, scope.filters.services), function(item) {
                                            expect(item.isSelected).toBe(false);
                                        });
                                expect(scope.hasFiltersApplied).toBe(false);
                            });

                            it('Should redirect the the current page', inject(function($location) {
                                expect($location.path()).toBe('');
                            }));
                        });
                    });


                    describe('When we toggle LastYear radio checkbox', function() {
                        beforeEach(function() {
                            scope.toggleRadio('lastUpdated', 'LastYear');
                            scope.$root.$digest();
                        });
                        it('Should have LastYear selected', function() {
                            expect(scope.hasFiltersApplied).toBe(true);
                            expect(scope.filters.lastUpdated.value).toBe('LastYear');
                        });

                        describe('And toggle LastYear 2-nd time', function() {
                            beforeEach(function() {
                                scope.toggleRadio('lastUpdated', 'LastYear');
                                scope.$root.$digest();
                            });
                            it('Should have nothing selected', function() {
                                expect(scope.hasFiltersApplied).toBe(false);
                                expect(scope.filters.lastUpdated.value).toBeUndefined();
                            });
                        });

                        describe('And toggle LastQuarter 2-nd time', function() {
                            beforeEach(function() {
                                scope.toggleRadio('lastUpdated', 'LastQuarter');
                                scope.$root.$digest();
                            });
                            it('Should have LastQuarter selected', function() {
                                expect(scope.hasFiltersApplied).toBe(true);
                                expect(scope.filters.lastUpdated.value).toBe('LastQuarter');
                            });
                        });
                    });

                });

            });


            describe('Given we have a FilterController for the themes', function() {
                var controller,
                    scope;

                beforeEach(inject(function($controller, $rootScope, FilterValues) {
                    scope = $rootScope.$new();
                    spyOn(FilterValues, 'resolve').andReturn({
                        then: function(expression) {
                            expression(FilterValues._themesFilters);
                        }
                    });
                    controller = $controller(FilterController, { $scope: scope });
                }));

                describe('When we update the facet counts for services', function() {
                    beforeEach(function() {
                        var facets = {
                            service: [
                                {
                                    "count": 10,
                                    "@service": "http://data.emii.com/bca/services/cis"
                                },
                                {
                                    "count": 9,
                                    "@service": "http://data.emii.com/bca/services/ces"
                                }
                            ]
                        };

                        expect(scope.filters.services[2].count).toBe(0);
                        expect(scope.filters.services[3].count).toBe(0);

                        scope.updateFacets(facets);
                    });
                    it('Should display the correct counts', function() {
                        expect(scope.filters.services[2].count).toBe(10);
                        expect(scope.filters.services[3].count).toBe(9);
                    });

                });

                describe('When we update the facet counts for impact', function() {
                    beforeEach(function() {
                        var facets = {
                            impact: [
                                {
                                    "count": 10,
                                    "@impact": "Bearish"
                                },
                                {
                                    "count": 9,
                                    "@impact": "Neutral"
                                }
                            ]
                        };
                        expect(scope.filters.impacts[0].count).toBe(0);
                        expect(scope.filters.impacts[1].count).toBe(0);
                        expect(scope.filters.impacts[2].count).toBe(0);

                        scope.updateFacets(facets);
                    });
                    it('Should display the correct counts', function() {
                        expect(scope.filters.impacts[0].count).toBe(10);
                        expect(scope.filters.impacts[1].count).toBe(9);
                        expect(scope.filters.impacts[2].count).toBe(0);
                    });
                });

                describe('When we update the facet counts for region', function() {
                    beforeEach(function() {
                        var facets = {
                            region: [
                                {
                                    "count": 10,
                                    "@type": "http://data.emii.com/locations/afr"
                                },
                                {
                                    "count": 5,
                                    "@type": "http://data.emii.com/locations/asi"
                                }
                            ]
                        };
                        scope.filters.regions = [{
                                uri: 'http://data.emii.com/locations/afr',
                                label: 'Africa',
                                description: 'Location'
                            },
                            {
                                uri: 'http://data.emii.com/locations/asi',
                                label: 'Asia',
                                description: 'Location'
                            }];

                        scope.updateFacets(facets);
                    });
                    it('Should display the correct counts', function() {
                        expect(scope.filters.regions[0].count).toBe(10);
                        expect(scope.filters.regions[1].count).toBe(5);
                    });
                });

                describe('When we update the facet counts for last applied', function() {
                    beforeEach(function() {
                        var facets = {
                            lastApplied: [
                                {
                                    "count": 10,
                                    "@lastApplied": "LastWeek"
                                },
                                {
                                    "count": 4,
                                    "@lastApplied": "LastMonth"
                                },
                                {
                                    "count": 1,
                                    "@lastApplied": "LastQuarter"
                                },
                                {
                                    "count": 0,
                                    "@lastApplied": "LastYear"
                                }
                            ]
                        };
                        expect(scope.filters.lastApplied.values.LastWeek.count).toBe(0);
                        expect(scope.filters.lastApplied.values.LastMonth.count).toBe(0);
                        expect(scope.filters.lastApplied.values.LastQuarter.count).toBe(0);
                        expect(scope.filters.lastApplied.values.LastYear.count).toBe(0);

                        scope.updateFacets(facets);
                    });
                    it('Should display the correct counts', function() {
                        expect(scope.filters.lastApplied.values.LastWeek.count).toBe(10);
                        expect(scope.filters.lastApplied.values.LastMonth.count).toBe(4);
                        expect(scope.filters.lastApplied.values.LastQuarter.count).toBe(1);
                        expect(scope.filters.lastApplied.values.LastYear.count).toBe(0);
                    });
                });
            });
            
            describe('Given we load the FilterController from url with filters applied', function() {
                var controller,
                    scope,
                    routeParams,
                    filterChangedEventSent,
                    newFilter;

                beforeEach(inject(function($controller, $rootScope, FilterValues) {
                    scope = $rootScope.$new();
                    routeParams = {
                        'Economy': 'http://data.emii.com/ontologies/economy/economy',
                        'CIS': 'http://data.emii.com/bca/services/cis',
                        'Medium': 'http://data.emii.com/view-convictions/medium',
                        'ViewType': 'http://data.emii.com/view-types/relative',
                        'LastUpdated': 'LastWeek',
                        'Positive': 'http://data.emii.com/view-directions/long',
                        'RecommendationType': 'http://someuri/tactical'
                    };

                    filterChangedEventSent = false;
                    newFilter = undefined;

                    $rootScope.$on(_FILTERS_CHANGED_, function(event, eventArg) {
                        filterChangedEventSent = true;
                        newFilter = eventArg;
                    });
                    spyOn(FilterValues, 'resolve').andReturn({
                        then: function(expression) {
                            expression(FilterValues._allViewsFilters);
                        }
                    });
                    controller = $controller(FilterController, { $scope: scope, $routeParams: routeParams });
                    scope.$root.$digest();
                }));

                it('should wait for filters to be loaded', function() {
                    expect(scope.waitForFilters).toBe(true);
                });
                
                describe('When we visit a bookmarked filter', function() {
                    it('Should contain the selected filters', function() {
                        expect(scope.hasFiltersApplied).toBe(true);
                        expect(scope.filters.assetClass[0].isSelected).toBe(true);
                        expect(scope.filters.viewConviction[1].isSelected).toBe(true);
                        expect(scope.filters.position[0].isSelected).toBe(true);
                        expect(scope.filters.viewType[0].isSelected).toBe(true);
                        expect(scope.filters.lastUpdated.value).toBe('LastWeek');
                        expect(scope.filters.recommendationType.value).toBe('http://someuri/tactical');
                        expect(scope.filters.services[2].isSelected).toBe(true);
                    });

                    it('Should send filters changed event with a copy of filters', function() {
                        expect(filterChangedEventSent).toBe(true);
                        expect(newFilter.assetClass[0].isSelected).toBe(true);
                        expect(newFilter.viewConviction[1].isSelected).toBe(true);
                        expect(newFilter.position[0].isSelected).toBe(true);
                        expect(newFilter.viewType[0].isSelected).toBe(true);
                        expect(newFilter.lastUpdated.value).toBe('LastWeek');
                        expect(newFilter.recommendationType.value).toBe('http://someuri/tactical');
                        expect(newFilter.services[2].isSelected).toBe(true);
                    });
                });

            });

            describe('Given we have a filter controller', function() {
                var controller,
                    scope,
                    uri = 'http://data.emii.com/economies/uk_automotive_tst',
                    filterChangedEventSent,
                    newFilter;

                beforeEach(inject(function($controller, $rootScope, FilterValues) {
                    scope = $rootScope.$new();
                    spyOn(FilterValues, 'resolve').andReturn({
                        then: function(expression) {
                            expression(FilterValues._allViewsFilters);
                        }
                    });
                    controller = $controller(FilterController, { $scope: scope });
                }));                
            });

            describe('When facets have changed', function() {
                var controller,
                    scope,
                    newFacets;
                beforeEach(inject(function($controller, $rootScope, FilterValues) {
                    newFacets = undefined;
                    scope = $rootScope.$new();
                    spyOn(FilterValues, 'resolve').andReturn({
                        then: function(expression) {
                            expression(FilterValues._allViewsFilters);
                        }
                    });
                    controller = $controller(FilterController, { $scope: scope });

                    scope.updateFacets = function(eventArg) {
                        newFacets = eventArg;
                    };

                    $rootScope.$broadcast(_FILTERS_UPDATEFACETS_, $.extend(true, {}, { data: 'some test value' }));

                    scope.$root.$digest();
                }));

                it('Should update facets', inject(function($route, $routeParams, $location) {
                    expect(newFacets.data).toBe('some test value');
                }));
            });

            describe('When searching for selected service', function() {
                var controller,
                    scope,
                    newFacets;
                beforeEach(inject(function($controller, $rootScope, FilterValues) {
                    newFacets = undefined;
                    scope = $rootScope.$new();
                    spyOn(FilterValues, 'resolve').andReturn({
                        then: function(expression) {
                            expression(FilterValues._allViewsFilters);
                        }
                    });
                    controller = $controller(FilterController, { $scope: scope });

                    scope.updateFacets = function(eventArg) {
                        newFacets = eventArg;
                    };

                    $rootScope.$broadcast(_FILTERS_UPDATEFACETS_, $.extend(true, {}, { data: 'some test value' }));

                    scope.$root.$digest();
                }));

                it('Should update facets', inject(function($route, $routeParams, $location) {
                    expect(newFacets.data).toBe('some test value');
                }));
            });

            describe('Given we have a FilterController for the favourites page', function () {
                var controller,
                    scope;

                beforeEach(inject(function ($controller, $rootScope, FilterValues) {
                    scope = $rootScope.$new();
                    scope.renderAction = 'someroute.favourites';
                    spyOn(FilterValues, 'resolve').andReturn({
                        then: function (expression) {
                            expression(FilterValues._allViewsFilters);
                        }
                    });
                    
                    controller = $controller(FilterController, { $scope: scope });
                }));

                it('should wait for filters to be loaded', function () {
                    expect(scope.waitForFilters).toBe(true);
                });

            });
        });
    });