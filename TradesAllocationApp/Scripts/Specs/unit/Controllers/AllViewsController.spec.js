define(['App/Controllers/AllViews/AllViewsController',
        'underscore',
        'moment',
        'angular',
        'resource',
        'mocks',
        'App/Controllers/controllers'], function (AllViewsController, _) {
            describe('All Views Controller', function () {
                var controller,
                    scope,
                    fakeViewables,
                    _FILTERS_CHANGED_ = 'changed';

                angular.module('AllViewsController.spec', [])
                    .service('ViewEvolution', ['$q', function ($q) {
                    return {
                        getViewEvolution: function () {
                            var deferred = $q.defer(),
                                    evolvedViewData = { '@graph': [{ '@id': "http://data.emii.com/bca/views/h-06-1", 'queryId': "http://data.emii.com/bca/views/h-06" }] };
                            deferred.resolve(evolvedViewData);
                            return deferred.promise;
                        }
                    };
                }]);

                beforeEach(function () {
                    module('App');
                    module('AllViewsController.spec');
                });

                beforeEach(module(function ($provide) {
                    $provide.constant('_FILTERS_CHANGED_', _FILTERS_CHANGED_);
                }));
                
                describe('Given we have a AllViewsController', function () {
                    describe('And views are included with the viewables', function () {
                        beforeEach(inject(function ($rootScope, $controller) {
                            scope = $rootScope.$new();
                            scope.fetchNextPageOfTiles = function () {
                            };
                            controller = $controller(AllViewsController, {
                                $scope: scope
                            });

                            scope.activeFilters = {
                                restrictToFavourites: function () {
                                    return false;
                                }
                            };
                        }));

                        describe('When processing the data', function () {
                            var viewables,
                                dominantViewService;
                            
                            beforeEach(inject(function (DominantView) {
                                dominantViewService = DominantView;
                                spyOn(dominantViewService, 'filterFavourited');
                                viewables = {
                                    viewables:
                                    [
                                        {
                                            "activeView": {
                                                "@set": [
                                                    {
                                                        "viewRecommendationType": {
                                                            "@type": "ViewRecommendationType",
                                                            "@id": "http://data.emii.com/view-recommendation-types/strategic",
                                                            "canonicalLabel": "Strategic"
                                                        },
                                                        "viewHorizon": "P6M",
                                                        "@type": "View",
                                                        "horizonEndDate": "2013-12-05",
                                                        "viewType": {
                                                            "@type": "ViewType",
                                                            "@id": "http://data.emii.com/view-types/economy",
                                                            "canonicalLabel": "Economy"
                                                        },
                                                        "canonicalLabel": "France Economy",
                                                        "horizonStartDate": "2013-06-20",
                                                        "informedByTheme": {
                                                            "@type": "Theme",
                                                            "@id": "http://data.emii.com/bca/themes/c2px1vnk1zd3",
                                                            "canonicalLabel": "Europe's Saints versus Sinners Narrative is Flawed"
                                                        },
                                                        "economicPosition": {
                                                            "@type": "EconomicPosition",
                                                            "@id": "http://data.emii.com/economic-positions/stronger",
                                                            "canonicalLabel": "Stronger"
                                                        },
                                                        "viewConviction": {
                                                            "@type": "ViewConviction",
                                                            "@id": "http://data.emii.com/view-convictions/high",
                                                            "canonicalLabel": "High"
                                                        },
                                                        "description": "This is 300 characters long. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only",
                                                        "service": {
                                                            "@type": "Service",
                                                            "description": "GIS service.",
                                                            "@id": "http://data.emii.com/bca/services/gis",
                                                            "canonicalLabel": "GIS"
                                                        },
                                                        "@id": "http://data.emii.com/bca/views/h-03"
                                                    },
                                                    {
                                                        "viewRecommendationType": {
                                                            "@type": "ViewRecommendationType",
                                                            "@id": "http://data.emii.com/view-recommendation-types/strategic",
                                                            "canonicalLabel": "Strategic"
                                                        },
                                                        "viewHorizon": "P24M",
                                                        "@type": "View",
                                                        "horizonEndDate": "2015-05-05",
                                                        "viewType": {
                                                            "@type": "ViewType",
                                                            "@id": "http://data.emii.com/view-types/economy",
                                                            "canonicalLabel": "Economy"
                                                        },
                                                        "canonicalLabel": "France Economy",
                                                        "horizonStartDate": "2013-05-05",
                                                        "economicPosition": {
                                                            "@type": "EconomicPosition",
                                                            "@id": "http://data.emii.com/economic-positions/flat",
                                                            "canonicalLabel": "Flat"
                                                        },
                                                        "viewConviction": {
                                                            "@type": "ViewConviction",
                                                            "@id": "http://data.emii.com/view-convictions/medium",
                                                            "canonicalLabel": "Medium"
                                                        },
                                                        "description": "This is very short comment",
                                                        "service": {
                                                            "@type": "Service",
                                                            "description": "BCA House service.",
                                                            "@id": "http://data.emii.com/bca/services/bcah",
                                                            "canonicalLabel": "BCA House"
                                                        },
                                                        "relativePerspective": {
                                                            "@type": "RelativePerspective",
                                                            "@id": "http://data.emii.com/relative-perspectives/contrarian",
                                                            "canonicalLabel": "Contrarian"
                                                        },
                                                        "@id": "http://data.emii.com/bca/views/h-02"
                                                    }
                                                ]
                                            },
                                            "@type": "Economy",
                                            "@id": "http://data.emii.com/economies/fra",
                                            "canonicalLabel": "France Economy"
                                        },
                                        {
                                            "activeView": {
                                                "@set": [
                                                    {
                                                        "viewRelativeTo": {
                                                            "@type": "Currency",
                                                            "@id": "http://data.emii.com/currencies/eur",
                                                            "canonicalLabel": "Euro"
                                                        },
                                                        "informedByTheme": {
                                                            "@set": [
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
                                                                }
                                                            ]
                                                        },
                                                        "viewHorizon": "P4M",
                                                        "@type": "View",
                                                        "service": {
                                                            "@type": "Service",
                                                            "description": "BCA House service.",
                                                            "@id": "http://data.emii.com/bca/services/bcah",
                                                            "canonicalLabel": "BCA House"
                                                        },
                                                        "viewWeighting": {
                                                            "@type": "ViewWeighting",
                                                            "@id": "http://data.emii.com/view-weightings/overweight",
                                                            "canonicalLabel": "Overweight"
                                                        },
                                                        "horizonEndDate": "2013-10-05",
                                                        "@id": "http://data.emii.com/bca/views/h-10",
                                                        "viewType": {
                                                            "@type": "ViewType",
                                                            "@id": "http://data.emii.com/view-types/relative",
                                                            "canonicalLabel": "Relative"
                                                        },
                                                        "canonicalLabel": "Chinese Yuan",
                                                        "horizonStartDate": "2013-06-05"
                                                    },
                                                    {
                                                        "viewRelativeTo": {
                                                            "@type": "Currency",
                                                            "@id": "http://data.emii.com/currencies/eur",
                                                            "canonicalLabel": "Euro"
                                                        },
                                                        "informedByTheme": {
                                                            "@type": "Theme",
                                                            "@id": "http://data.emii.com/bca/themes/c2px1vnk1zbw",
                                                            "canonicalLabel": "Equities will outperform bonds over a medium-term horizon"
                                                        },
                                                        "viewHorizon": "P12M",
                                                        "@type": "View",
                                                        "service": {
                                                            "@type": "Service",
                                                            "description": "BCA House service.",
                                                            "@id": "http://data.emii.com/bca/services/bcah",
                                                            "canonicalLabel": "BCA House"
                                                        },
                                                        "viewWeighting": {
                                                            "@type": "ViewWeighting",
                                                            "@id": "http://data.emii.com/view-weightings/overweight",
                                                            "canonicalLabel": "Overweight"
                                                        },
                                                        "relativePerspective": {
                                                            "@type": "RelativePerspective",
                                                            "@id": "http://data.emii.com/relative-perspectives/contrarian",
                                                            "canonicalLabel": "Contrarian"
                                                        },
                                                        "horizonEndDate": "2014-06-05",
                                                        "@id": "http://data.emii.com/bca/views/h-09",
                                                        "viewType": {
                                                            "@type": "ViewType",
                                                            "@id": "http://data.emii.com/view-types/relative",
                                                            "canonicalLabel": "Relative"
                                                        },
                                                        "canonicalLabel": "Chinese Yuan",
                                                        "horizonStartDate": "2013-07-05"
                                                    }
                                                ]
                                            },
                                            "@type": "Currency",
                                            "@id": "http://data.emii.com/currencies/cny",
                                            "canonicalLabel": "Chinese yuan"
                                        },
                                        {
                                            "isFavourited": true,
                                            "activeView": {
                                                "@set": [
                                                    {
                                                        "viewHorizon": "P24M",
                                                        "isFavourited": false,
                                                        "hasPermission": true,
                                                        "@type": "View",
                                                        "description": "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum",
                                                        "viewConviction": {
                                                            "@type": "ViewConviction",
                                                            "@id": "http://data.emii.com/view-convictions/high",
                                                            "canonicalLabel": "High"
                                                        },
                                                        "service": {
                                                            "@type": "Service",
                                                            "description": "BCA House service.",
                                                            "@id": "http://data.emii.com/bca/services/bcah",
                                                            "canonicalLabel": "BCA House"
                                                        },
                                                        "horizonEndDate": "2015-06-05",
                                                        "viewDirection": {
                                                            "@type": "ViewDirection",
                                                            "@id": "http://data.emii.com/view-directions/long",
                                                            "canonicalLabel": "Long"
                                                        },
                                                        "@id": "http://data.emii.com/bca/views/h-06",
                                                        "viewType": {
                                                            "@type": "ViewType",
                                                            "@id": "http://data.emii.com/view-types/absolute",
                                                            "canonicalLabel": "Absolute"
                                                        },
                                                        "canonicalLabel": "European Union Equities",
                                                        "horizonStartDate": "2013-06-05"
                                                    },
                                                    {
                                                        "viewRelativeTo": {
                                                            "@type": "Currency",
                                                            "@id": "http://data.emii.com/currencies/eur",
                                                            "canonicalLabel": "Euro"
                                                        },
                                                        "viewRecommendationType": {
                                                            "@type": "ViewRecommendationType",
                                                            "@id": "http://data.emii.com/view-recommendation-types/strategic",
                                                            "canonicalLabel": "Strategic"
                                                        },
                                                        "viewHorizon": "P6M",
                                                        "@type": "View",
                                                        "viewConviction": {
                                                            "@type": "ViewConviction",
                                                            "@id": "http://data.emii.com/view-convictions/low",
                                                            "canonicalLabel": "Low"
                                                        },
                                                        "service": {
                                                            "@type": "Service",
                                                            "description": "BCA House service.",
                                                            "@id": "http://data.emii.com/bca/services/bcah",
                                                            "canonicalLabel": "BCA House"
                                                        },
                                                        "viewWeighting": {
                                                            "@type": "ViewWeighting",
                                                            "@id": "http://data.emii.com/view-weightings/underweight",
                                                            "canonicalLabel": "Underweight"
                                                        },
                                                        "relativePerspective": {
                                                            "@type": "RelativePerspective",
                                                            "@id": "http://data.emii.com/relative-perspectives/mainstream",
                                                            "canonicalLabel": "Mainstream"
                                                        },
                                                        "horizonEndDate": "2013-12-05",
                                                        "@id": "http://data.emii.com/bca/views/h-08",
                                                        "viewType": {
                                                            "@type": "ViewType",
                                                            "@id": "http://data.emii.com/view-types/relative",
                                                            "canonicalLabel": "Relative"
                                                        },
                                                        "isFavourited": false,
                                                        "hasPermission": true,
                                                        "canonicalLabel": "European Union Equities",
                                                        "horizonStartDate": "2013-06-05"
                                                    },
                                                    {
                                                        "viewHorizon": "P6M",
                                                        "@type": "View",
                                                        "viewConviction": {
                                                            "@type": "ViewConviction",
                                                            "@id": "http://data.emii.com/view-convictions/high",
                                                            "canonicalLabel": "High"
                                                        },
                                                        "service": {
                                                            "@type": "Service",
                                                            "description": "BCA House service.",
                                                            "@id": "http://data.emii.com/bca/services/bcah",
                                                            "canonicalLabel": "BCA House"
                                                        },
                                                        "horizonEndDate": "2013-12-05",
                                                        "viewDirection": {
                                                            "@type": "ViewDirection",
                                                            "@id": "http://data.emii.com/view-directions/long",
                                                            "canonicalLabel": "Long"
                                                        },
                                                        "@id": "http://data.emii.com/bca/views/h-07",
                                                        "viewType": {
                                                            "@type": "ViewType",
                                                            "@id": "http://data.emii.com/view-types/absolute",
                                                            "canonicalLabel": "Absolute"
                                                        },
                                                        "isFavourited": false,
                                                        "hasPermission": true,
                                                        "canonicalLabel": "European Union Equities",
                                                        "horizonStartDate": "2013-06-05"
                                                    }
                                                ]
                                            },
                                            "@type": "EquityMarket",
                                            "@id": "http://data.emii.com/equity-markets/eu",
                                            "canonicalLabel": "European Union Equities"
                                        },
                                        {
                                            "activeView": {
                                                "@set": [
                                                    {
                                                        "viewRecommendationType": {
                                                            "@type": "ViewRecommendationType",
                                                            "@id": "http://data.emii.com/view-recommendation-types/tactical",
                                                            "canonicalLabel": "Tactical"
                                                        },
                                                        "viewHorizon": "P4M",
                                                        "@type": "View",
                                                        "viewConviction": {
                                                            "@type": "ViewConviction",
                                                            "@id": "http://data.emii.com/view-convictions/medium",
                                                            "canonicalLabel": "Medium"
                                                        },
                                                        "service": {
                                                            "@type": "Service",
                                                            "description": "BCA House service.",
                                                            "@id": "http://data.emii.com/bca/services/bcah",
                                                            "canonicalLabel": "BCA House"
                                                        },
                                                        "horizonEndDate": "2013-10-05",
                                                        "viewDirection": {
                                                            "@type": "ViewDirection",
                                                            "@id": "http://data.emii.com/view-directions/neutral",
                                                            "canonicalLabel": "Neutral"
                                                        },
                                                        "@id": "http://data.emii.com/bca/views/h-05",
                                                        "viewType": {
                                                            "@type": "ViewType",
                                                            "@id": "http://data.emii.com/view-types/absolute",
                                                            "canonicalLabel": "Absolute"
                                                        },
                                                        "canonicalLabel": "Gold Market",
                                                        "horizonStartDate": "2013-06-05"
                                                    },
                                                    {
                                                        "viewRecommendationType": {
                                                            "@type": "ViewRecommendationType",
                                                            "@id": "http://data.emii.com/view-recommendation-types/strategic",
                                                            "canonicalLabel": "Strategic"
                                                        },
                                                        "viewHorizon": "P12M",
                                                        "@type": "View",
                                                        "service": {
                                                            "@type": "Service",
                                                            "description": "BCA House service.",
                                                            "@id": "http://data.emii.com/bca/services/bcah",
                                                            "canonicalLabel": "BCA House"
                                                        },
                                                        "horizonEndDate": "2013-12-05",
                                                        "viewDirection": {
                                                            "@type": "ViewDirection",
                                                            "@id": "http://data.emii.com/view-directions/short",
                                                            "canonicalLabel": "Short"
                                                        },
                                                        "@id": "http://data.emii.com/bca/views/h-04",
                                                        "viewType": {
                                                            "@type": "ViewType",
                                                            "@id": "http://data.emii.com/view-types/absolute",
                                                            "canonicalLabel": "Absolute"
                                                        },
                                                        "canonicalLabel": "Gold Market",
                                                        "horizonStartDate": "2013-01-05"
                                                    }
                                                ]
                                            },
                                            "@type": "CommodityMarket",
                                            "@id": "http://data.emii.com/commodities-markets/gold",
                                            "canonicalLabel": "Gold"
                                        },
                                        {
                                            "activeView": {
                                                "viewRecommendationType": {
                                                    "@type": "ViewRecommendationType",
                                                    "@id": "http://data.emii.com/view-recommendation-types/strategic",
                                                    "canonicalLabel": "Strategic"
                                                },
                                                "viewHorizon": "P36M",
                                                "@type": "View",
                                                "horizonEndDate": "2016-06-05",
                                                "viewType": {
                                                    "@type": "ViewType",
                                                    "@id": "http://data.emii.com/view-types/economy",
                                                    "canonicalLabel": "Economy"
                                                },
                                                "canonicalLabel": "Hong Kond Finance and Insurance",
                                                "horizonStartDate": "2013-02-05",
                                                "economicPosition": {
                                                    "@type": "EconomicPosition",
                                                    "@id": "http://data.emii.com/economic-positions/weaker",
                                                    "canonicalLabel": "Weaker"
                                                },
                                                "viewConviction": {
                                                    "@type": "ViewConviction",
                                                    "@id": "http://data.emii.com/view-convictions/low",
                                                    "canonicalLabel": "Low"
                                                },
                                                "description": "Buy technology stocks to prove your convictions before Internet reaches sentience circa 2019",
                                                "service": {
                                                    "@type": "Service",
                                                    "description": "BCA House service.",
                                                    "@id": "http://data.emii.com/bca/services/bcah",
                                                    "canonicalLabel": "BCA House"
                                                },
                                                "relativePerspective": {
                                                    "@type": "RelativePerspective",
                                                    "@id": "http://data.emii.com/relative-perspectives/mainstream",
                                                    "canonicalLabel": "Mainstream"
                                                },
                                                "@id": "http://data.emii.com/bca/views/h-01"
                                            },
                                            "@type": "Economy",
                                            "@id": "http://data.emii.com/economies/hkg/finance-and-insurance",
                                            "canonicalLabel": "Hong Kong Finance and Insurance"
                                        }
                                    ]
                                };
                                
                            }));

                            it('BCA House View should have a display order of 0', function () {
                                scope.processData(viewables);
                                expect(viewables.viewables[0].activeView['@set'][1].displayOrder).toBe(0); // BCA House View
                            });

                            it('Other View should have a display order of 1', function () {
                                scope.processData(viewables);
                                expect(viewables.viewables[0].activeView['@set'][0].displayOrder).toBe(1); // GIS
                            });

                            it('Viewables should contain dominant service', function () {
                                scope.processData(viewables);
                                expect(viewables.viewables[0].dominantView).toBeDefined();
                                expect(viewables.viewables[1].dominantView).toBeDefined();
                                expect(viewables.viewables[2].dominantView).toBeDefined();
                                expect(viewables.viewables[3].dominantView).toBeDefined();
                                expect(viewables.viewables[4].dominantView).toBeDefined();
                            });

                            it('Should not restrict just to favourited views', function () {
                                scope.processData(viewables);
                                expect(dominantViewService.filterFavourited).not.toHaveBeenCalled();
                            });

                            describe('And we are fetching the previous view evolution', function () {
                                var viewEvolution;
                                beforeEach(inject(function (ViewEvolution) {
                                    viewEvolution = ViewEvolution;
                                    spyOn(viewEvolution, 'getViewEvolution').andCallThrough();

                                }));

                                it('Should assign the previous view to each dominant view', function () {
                                    scope.processData(viewables);
                                    scope.$root.$digest();
                                    expect(viewEvolution.getViewEvolution).toHaveBeenCalled();
                                    expect(viewables.viewables[2].dominantView.previousView).toBeDefined();
                                    expect(viewables.viewables[2].dominantView.previousView['@id']).toEqual("http://data.emii.com/bca/views/h-06-1");
                                });
                            });

                            describe('And we are on my favourites page', function () {
                                beforeEach(function() {
                                    scope.restrictToFavourites = true;
                                });
                                it('Should calculate dominant views only from favourited views', function () {
                                    scope.processData(viewables);
                                    expect(dominantViewService.filterFavourited).toHaveBeenCalled();
                                });
                            });

                        });

                    });

                    describe('And we have applied some filters', function () {
                        var filters;
                        
                        beforeEach(inject(function ($rootScope, $controller, $q) {
                            fakeViewables = {
                                getViewables: function () {
                                    var deferred = $q.defer();
                                    deferred.resolve({
                                        viewables: []
                                    });
                                    return deferred.promise;
                                },
                                getViewablesFacetCount: function () {
                                    var deferred = $q.defer();
                                    deferred.resolve({
                                        facets: []
                                    });
                                    return deferred.promise;
                                }
                            };
                           
                            scope = $rootScope.$new();
                            filters = {
                                someFilter: 'value',
                                restrictToFavourites: function () {
                                    return true;
                                }
                            };
                            scope.fetchNextPageOfTiles = function () { };
                            scope.reset = function () { };
                            controller = $controller(AllViewsController, {
                                $scope: scope,
                                Viewables: fakeViewables
                            });
                            spyOn(fakeViewables, 'getViewablesFacetCount').andCallThrough();
                            $rootScope.$broadcast(_FILTERS_CHANGED_, $.extend(true, {}, filters));
                        }));

                        describe('When applying the filters', function () {
                            var resetCalled = false,
                                loadPageCalled = false,
                                loadPageArgs;
                            
                            beforeEach(inject(function ($rootScope) {
                                resetCalled = false;
                                loadPageCalled = false;
                                loadPageArgs = undefined;
                                
                                filters = {
                                    someFilter: {}
                                };
                                scope.currentPage = 0;
                                scope.pageSize = 10;
                                scope.reset = function () {
                                    resetCalled = true;
                                };
                                scope.fetchNextPageOfTiles = function() {
                                    loadPageCalled = true;
                                    loadPageArgs = arguments;
                                };
                                scope.restrictToFavourites = true;
                               
                                $rootScope.$broadcast(_FILTERS_CHANGED_, filters);
                                scope.$root.$digest();
                            }));

                            it('Should reset the controllers state', function() {
                                expect(resetCalled).toBe(true);
                            });
                            
                            it('Should load page with the correct arguments', function () {
                                var expectedResult = {
                                    viewables: []
                                };
                                expect(loadPageCalled).toBe(true);
                                expect(typeof loadPageArgs[0]).toBe('function');
                                expect(loadPageArgs[1].filters).toEqual(filters);
                                expect(loadPageArgs[1].page).toBe(0);
                                expect(loadPageArgs[1].pageSize).toBe(scope.pageSize);
                                expect(loadPageArgs[1].restrictToFavourites).toBe(true);
                                expect(typeof loadPageArgs[2]).toBe('function');
                                expect(loadPageArgs[3](expectedResult)).toEqual([]);
                            });

                            it('Should detect that we are not filtering by viewable', function () {
                                expect(scope.filteringByViewableUri).toBe(false);
                            });

                            it('should load the viewables facets',function () {
                                expect(fakeViewables.getViewablesFacetCount).toHaveBeenCalled();
                            });

                            describe('When filtering by viewable', function() {

                                beforeEach(inject(function($rootScope) {
                                    filters = {
                                        viewableUri: { value: 'viewable1' }
                                    };
                                     scope.reset = function() {
                                    };
                                    scope.fetchNextPageOfTiles = function() {
                                    };
                                    $rootScope.$broadcast(_FILTERS_CHANGED_, filters);
                                    scope.$root.$digest();
                                }));

                                it('Should detect that we are filtering by viewable', function () {
                                    expect(scope.filteringByViewableUri).toBe(true);
                                });

                            });
                            describe('When changing individual filters without applying them', function () {
                                beforeEach(function () {
                                    resetCalled = false;
                                    loadPageCalled = false;
                                    filters.someFilter = {
                                        value: 'newValue'
                                    };
                                    scope.$root.$digest();
                                });

                                it('Should reset the controllers state', function () {
                                    expect(resetCalled).toBe(false);
                                });
                            });
                            
                        });
                       
                        describe('When fetching the next page', function () {
                            var passedArgs,
                                resetCalled;
                            
                            beforeEach(inject(function($rootScope) {
                                scope.fetchNextPageOfTiles = function () {
                                    passedArgs = arguments;
                                };
                                scope.reset = function () {
                                    resetCalled = true;
                                };
                                scope.restrictToFavourites = true;
                                scope.currentPage = 0;
                                scope.pageSize = 10;
                                $rootScope.$broadcast(_FILTERS_CHANGED_, filters);
                                scope.fetchNextPage();
                                scope.$root.$digest();
                            }));
                            
                            it('Should get the next page of tiles with the right parameters', inject(function ($q) {
                                var expectedResult = {
                                    viewables: []
                                };
                                expect(passedArgs).toBeDefined();
                                expect(typeof passedArgs[0]).toBe('function');
                                expect(passedArgs[1].filters).toBe(filters);
                                expect(passedArgs[1].page).toBe(0);
                                expect(passedArgs[1].pageSize).toBe(scope.pageSize);
                                expect(passedArgs[1].restrictToFavourites).toBe(true);
                                expect(typeof passedArgs[2]).toBe('function');
                                expect(passedArgs[3](expectedResult)).toEqual([]);
                            }));
                            
                        });
                    });
                });

            });
        });