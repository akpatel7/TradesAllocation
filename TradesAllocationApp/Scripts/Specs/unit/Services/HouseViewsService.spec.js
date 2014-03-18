define(['underscore',
        'App/Services/HouseViewsService',
        'angular',
        'mocks',
        'App/Services/services'], function (_) {
            describe('HouseViewsService', function () {
                describe('Given we have a HouseViewsService', function () {
                    var scope,
                        $httpBackend,
                        expectedData;

                    angular.module('HouseViewsService.Spec', []).service('DataEndpoint', ['$q', function ($q) {
                        return {
                            getTemplatedEndpoint: function () {
                                var deferred = $q.defer();
                                deferred.resolve('http://localhost/api/house-views');
                                return deferred.promise;
                            }
                        };
                    }]);
                                    
                    beforeEach(function () {
                        module('App');
                        module('HouseViewsService.Spec');
                    });

                    beforeEach(function () {
                        this.addMatchers({
                            toEqualData: function (expected) {
                                return angular.equals(this.actual, expected);
                            }
                        });
                    });
                    beforeEach(inject(function (_$httpBackend_, $rootScope) {

                        expectedData = {
                            "viewables": [
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
                                                "horizonEndDate": "2013-12-29",
                                                "viewType": {
                                                    "@type": "ViewType",
                                                    "@id": "http://data.emii.com/view-types/economy",
                                                    "canonicalLabel": "Economy"
                                                },
                                                "canonicalLabel": "France Economy",
                                                "horizonStartDate": "2013-07-14",
                                                "informedByTheme": {
                                                    "@type": "Theme",
                                                    "@id": "http://data.emii.com/bca/themes/c2px1vnk1zd3",
                                                    "canonicalLabel": "Europe’s Saints versus Sinners Narrative is Flawed",
                                                    "@set": []
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
                                                    "description": "BCA House service.",
                                                    "@id": "http://data.emii.com/bca/services/bcah",
                                                    "canonicalLabel": "BCA House"
                                                },
                                                "@id": "http://data.emii.com/bca/views/h-03",
                                                "hasPermission": true,
                                                "lastUpdatedDate": "2013-07-14",
                                                "isFavourited": false
                                            },
                                            {
                                                "viewRecommendationType": {
                                                    "@type": "ViewRecommendationType",
                                                    "@id": "http://data.emii.com/view-recommendation-types/strategic",
                                                    "canonicalLabel": "Strategic"
                                                },
                                                "viewHorizon": "P24M",
                                                "@type": "View",
                                                "horizonEndDate": "2015-05-29",
                                                "viewType": {
                                                    "@type": "ViewType",
                                                    "@id": "http://data.emii.com/view-types/economy",
                                                    "canonicalLabel": "Economy"
                                                },
                                                "canonicalLabel": "France Economy",
                                                "horizonStartDate": "2013-05-29",
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
                                                "@id": "http://data.emii.com/ces/views/h-02",
                                                "informedByTheme": {
                                                    "@set": []
                                                },
                                                "hasPermission": true,
                                                "lastUpdatedDate": "2013-05-29",
                                                "isFavourited": false
                                            },
                                            {
                                                "viewRecommendationType": {
                                                    "@type": "ViewRecommendationType",
                                                    "@id": "http://data.emii.com/view-recommendation-types/strategic",
                                                    "canonicalLabel": "Strategic"
                                                },
                                                "viewHorizon": "P6M",
                                                "@type": "View",
                                                "horizonEndDate": "2013-12-29",
                                                "viewType": {
                                                    "@type": "ViewType",
                                                    "@id": "http://data.emii.com/view-types/economy",
                                                    "canonicalLabel": "Economy"
                                                },
                                                "canonicalLabel": "France Economy",
                                                "horizonStartDate": "2013-07-14",
                                                "informedByTheme": {
                                                    "@type": "Theme",
                                                    "@id": "http://data.emii.com/bca/themes/c2px1vnk1zd3",
                                                    "canonicalLabel": "Europe’s Saints versus Sinners Narrative is Flawed",
                                                    "@set": []
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
                                                    "description": "CES",
                                                    "@id": "http://data.emii.com/bca/services/ces",
                                                    "canonicalLabel": "CES"
                                                },
                                                "@id": "http://data.emii.com/bca/views/h-03",
                                                "hasPermission": true,
                                                "lastUpdatedDate": "2013-07-14",
                                                "isFavourited": false
                                            },
                                            {
                                                "viewRecommendationType": {
                                                    "@type": "ViewRecommendationType",
                                                    "@id": "http://data.emii.com/view-recommendation-types/strategic",
                                                    "canonicalLabel": "Strategic"
                                                },
                                                "viewHorizon": "P24M",
                                                "@type": "View",
                                                "horizonEndDate": "2015-05-29",
                                                "viewType": {
                                                    "@type": "ViewType",
                                                    "@id": "http://data.emii.com/view-types/economy",
                                                    "canonicalLabel": "Economy"
                                                },
                                                "canonicalLabel": "France Economy",
                                                "horizonStartDate": "2013-05-29",
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
                                                    "description": "GIS",
                                                    "@id": "http://data.emii.com/bca/services/gis",
                                                    "canonicalLabel": "GIS"
                                                },
                                                "relativePerspective": {
                                                    "@type": "RelativePerspective",
                                                    "@id": "http://data.emii.com/relative-perspectives/contrarian",
                                                    "canonicalLabel": "Contrarian"
                                                },
                                                "@id": "http://data.emii.com/ces/views/h-02",
                                                "informedByTheme": {
                                                    "@set": []
                                                },
                                                "hasPermission": true,
                                                "lastUpdatedDate": "2013-05-29",
                                                "isFavourited": false
                                            }
                                        ]
                                    },
                                    "@type": "Economy",
                                    "@id": "http://data.emii.com/economies/fra",
                                    "canonicalLabel": "France Economy",
                                    "hasConflicts": false,
                                    "isFavourited": false
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
                                                    "@type": "Theme",
                                                    "@id": "http://data.emii.com/bca/themes/c2px1vnk1zbw",
                                                    "canonicalLabel": "Equities will outperform bonds over a medium-term horizon",
                                                    "@set": []
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
                                                "horizonEndDate": "2014-06-29",
                                                "@id": "http://data.emii.com/bca/views/h-09",
                                                "viewType": {
                                                    "@type": "ViewType",
                                                    "@id": "http://data.emii.com/view-types/relative",
                                                    "canonicalLabel": "Relative"
                                                },
                                                "canonicalLabel": "Chinese Yuan",
                                                "horizonStartDate": "2013-06-29",
                                                "hasPermission": true,
                                                "lastUpdatedDate": "2013-06-29",
                                                "isFavourited": false
                                            },
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
                                                            "canonicalLabel": "Europe’s Saints versus Sinners Narrative is Flawed"
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
                                                "horizonEndDate": "2013-10-29",
                                                "@id": "http://data.emii.com/bca/views/h-10",
                                                "viewType": {
                                                    "@type": "ViewType",
                                                    "@id": "http://data.emii.com/view-types/relative",
                                                    "canonicalLabel": "Relative"
                                                },
                                                "canonicalLabel": "Chinese Yuan",
                                                "horizonStartDate": "2013-06-29",
                                                "hasPermission": true,
                                                "lastUpdatedDate": "2013-06-29",
                                                "isFavourited": false
                                            }
                                        ]
                                    },
                                    "@type": "Currency",
                                    "@id": "http://data.emii.com/currencies/cny",
                                    "canonicalLabel": "Chinese yuan",
                                    "hasConflicts": false,
                                    "isFavourited": false
                                },
                                {
                                    "activeView": {
                                        "@set": [
                                            {
                                                "viewHorizon": "P24M",
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
                                                "horizonEndDate": "2015-06-29",
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
                                                "horizonStartDate": "2013-06-29",
                                                "informedByTheme": {
                                                    "@set": []
                                                },
                                                "hasPermission": true,
                                                "lastUpdatedDate": "2013-06-29",
                                                "isFavourited": false
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
                                                "horizonEndDate": "2013-12-29",
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
                                                "canonicalLabel": "European Union Equities",
                                                "horizonStartDate": "2013-06-29",
                                                "informedByTheme": {
                                                    "@set": []
                                                },
                                                "hasPermission": true,
                                                "lastUpdatedDate": "2013-06-29",
                                                "isFavourited": false
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
                                                "horizonEndDate": "2013-12-29",
                                                "@id": "http://data.emii.com/bca/views/h-08",
                                                "viewType": {
                                                    "@type": "ViewType",
                                                    "@id": "http://data.emii.com/view-types/relative",
                                                    "canonicalLabel": "Relative"
                                                },
                                                "canonicalLabel": "European Union Equities",
                                                "horizonStartDate": "2013-06-29",
                                                "informedByTheme": {
                                                    "@set": []
                                                },
                                                "hasPermission": true,
                                                "lastUpdatedDate": "2013-06-29",
                                                "isFavourited": false
                                            }
                                        ]
                                    },
                                    "@type": "EquityMarket",
                                    "@id": "http://data.emii.com/equity-markets/eu",
                                    "canonicalLabel": "European Union Equities",
                                    "hasConflicts": false,
                                    "isFavourited": false
                                },
                                {
                                    "activeView": {
                                        "@set": [
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
                                                "horizonEndDate": "2013-12-29",
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
                                                "horizonStartDate": "2013-01-29",
                                                "informedByTheme": {
                                                    "@set": []
                                                },
                                                "hasPermission": true,
                                                "lastUpdatedDate": "2013-01-29",
                                                "isFavourited": false
                                            },
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
                                                "horizonEndDate": "2013-10-29",
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
                                                "horizonStartDate": "2013-06-29",
                                                "informedByTheme": {
                                                    "@set": []
                                                },
                                                "hasPermission": true,
                                                "lastUpdatedDate": "2013-06-29",
                                                "isFavourited": false
                                            }
                                        ]
                                    },
                                    "@type": "CommodityMarket",
                                    "@id": "http://data.emii.com/commodities-markets/gold",
                                    "canonicalLabel": "Gold",
                                    "hasConflicts": false,
                                    "isFavourited": false
                                },
                                {
                                    "activeView": {
                                        "@set": [
                                            {
                                                "viewRecommendationType": {
                                                    "@type": "ViewRecommendationType",
                                                    "@id": "http://data.emii.com/view-recommendation-types/strategic",
                                                    "canonicalLabel": "Strategic"
                                                },
                                                "viewHorizon": "P36M",
                                                "@type": "View",
                                                "horizonEndDate": "2016-06-29",
                                                "viewType": {
                                                    "@type": "ViewType",
                                                    "@id": "http://data.emii.com/view-types/economy",
                                                    "canonicalLabel": "Economy"
                                                },
                                                "canonicalLabel": "Hong Kond Finance and Insurance",
                                                "horizonStartDate": "2013-02-28",
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
                                                "@id": "http://data.emii.com/bca/views/h-01",
                                                "informedByTheme": {
                                                    "@set": []
                                                },
                                                "hasPermission": true,
                                                "lastUpdatedDate": "2013-02-28",
                                                "isFavourited": false
                                            }
                                        ]
                                    },
                                    "@type": "Economy",
                                    "@id": "http://data.emii.com/economies/hkg/finance-and-insurance",
                                    "canonicalLabel": "Hong Kong Finance Economy and Insurance",
                                    "hasConflicts": false,
                                    "isFavourited": false
                                }
                            ],
                            "facets": [
                                {
                                    "count": "1",
                                    "@type": "CommodityMarket",
                                    "label": "Commodity Market"
                                },
                                {
                                    "count": "1",
                                    "@type": "Currency",
                                    "label": "Currency"
                                },
                                {
                                    "count": "2",
                                    "@type": "Economy",
                                    "label": "Economy"
                                },
                                {
                                    "count": "1",
                                    "@type": "EquityMarket",
                                    "label": "Equity Market"
                                }
                            ],
                            "totalCount": 5
                        };
                        $httpBackend = _$httpBackend_;

                        $httpBackend.expectGET('http://localhost/api/house-views')
                                  .respond(expectedData);
                        scope = $rootScope.$new();
                    }));
               
                    describe('When we query the service', function () {
                        it('should not load facets count, and get the first 100 markets/economies', inject(function (HouseViews, DataEndpoint) {
                            spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallThrough();
                            
                            HouseViews.getViews().then(function(data) {
                            });
                            
                            expect(DataEndpoint.getTemplatedEndpoint).toHaveBeenCalledWith('viewables', [
                                { key: 'service', value: 'http://data.emii.com/bca/services/bcah' },
                                { key: 'includeFacetsCount', value: false },
                                { key: 'page', value: 0 },
                                { key: 'pageSize', value: 100 }
                            ]);
                        }));
                        it('should return house views data', inject(function (HouseViews) {
                            HouseViews.getViews().then(function (data) {                                
                                var findKey = function(key) {
                                    var result = _.find(data, function(item) {
                                        return item.key === key;
                                    });
                                    return result;
                                };
                                
                                expect(data.length).toBe(5);
                                expect(findKey('http://data.emii.com/equity-markets/eu')).toBeDefined();
                                expect(findKey('http://data.emii.com/economies/fra')).toBeDefined();
                                expect(findKey('http://data.emii.com/currencies/cny')).toBeDefined();
                                expect(findKey('http://data.emii.com/commodities-markets/gold')).toBeDefined();
                                expect(findKey('http://data.emii.com/economies/hkg/finance-and-insurance')).toBeDefined();
                            });
                            scope.$root.$digest();
                            // http needs to be flushed, otherwise the promise wont be resolved, and the test wont be executed
                            $httpBackend.flush();
                        }));
                        
                        it('Should return the service for each viewable things', inject(function (HouseViews) {
                            HouseViews.getViews().then(function (data) {
                                expect(data[0].key).toBe('http://data.emii.com/economies/fra');
                                expect(data[1].key).toBe('http://data.emii.com/economies/hkg/finance-and-insurance');
                                expect(data[2].key).toBe('http://data.emii.com/equity-markets/eu');
                                expect(data[2].key).toBe('http://data.emii.com/equity-markets/eu');
                                expect(data[3].key).toBe('http://data.emii.com/currencies/cny');
                                expect(data[4].key).toBe('http://data.emii.com/commodities-markets/gold');
                            });
                            scope.$root.$digest();
                            $httpBackend.flush();
                        }));
                        
                        it('Views should have a value for lastUpdated', inject(function (HouseViews) {
                            HouseViews.getViews().then(function (data) {
                                expect(data[1].views.longTermViews[0].lastUpdated).toBeDefined();
                            });
                            scope.$root.$digest();
                            $httpBackend.flush();
                        }));
                        
                        it('should sort the views correctly', inject(function (HouseViews) {
                            HouseViews.getViews().then(function (data) {
                                expect(data[0].type).toBe('Economy');
                                expect(data[1].type).toBe('Economy');
                                expect(data[2].type).toBe('EquityMarket');
                                expect(data[3].type).toBe('Currency');
                                expect(data[4].type).toBe('CommodityMarket');
                            });
                            scope.$root.$digest();
                            // http needs to be flushed, otherwise the promise wont be resolved, and the test wont be executed
                            $httpBackend.flush();
                        }));

                        it('should link to the research page', inject(function (HouseViews) {
                            HouseViews.getViews().then(function (data) {
                                expect(data[0].url).toBe('/#/research?uri=' + encodeURIComponent('http://data.emii.com/economies/fra'));
                            });
                            scope.$root.$digest();
                            // http needs to be flushed, otherwise the promise wont be resolved, and the test wont be executed
                            $httpBackend.flush();
                        }));

                        it('should remove "economy" word from the end of the label for Economies', inject(function (HouseViews) {
                            HouseViews.getViews().then(function (data) {
                                var fra = _.find(data, function (item) {
                                    return item.key === 'http://data.emii.com/economies/fra';
                                });
                                var hkg = _.find(data, function (item) {
                                    return item.key === 'http://data.emii.com/economies/hkg/finance-and-insurance';
                                });
                                expect(fra.label).toBe('France');
                                expect(hkg.label).toBe('Hong Kong Finance Economy and Insurance');
                            });
                            scope.$root.$digest();
                            // http needs to be flushed, otherwise the promise wont be resolved, and the test wont be executed
                            $httpBackend.flush();                            
                        }));
                        
                        it('should exclude active views which are not from BCA', inject(function (HouseViews) {
                            HouseViews.getViews().then(function (data) {
                                expect(expectedData.viewables[0].activeView['@set'].length).toBe(4);
                                expect(data[0].views.shortTermViews.length).toBe(1);
                                expect(data[0].views.longTermViews.length).toBe(1);
                            });
                            scope.$root.$digest();
                            $httpBackend.flush();
                        }));
                    });

                    describe('When sorting the views', function () {
                        var result,
                            items = [
                            {
                                label: 'view equity',
                                type: 'EquityMarket'
                            },
                            {
                                label: 'view commodity',
                                type: 'CommodityMarket'
                            },
                            {
                                label: 'unknown',
                                type: 'unknown'
                            },
                            {
                                label: 'undefined type'
                            },
                            {
                                label: 'view currency',
                                type: 'Currency'
                            },
                            {
                                label: 'view real estate',
                                type: 'RealEstate'
                            },
                            {
                                label: 'view fixed income',
                                type: 'FixedIncome'
                            },
                            {
                                label: 'view economy',
                                type: 'Economy'
                            }
                        ];

                        
                        it('views should sorted correctly', inject(function(HouseViews) {
                            result = HouseViews._sortViews(items);
                            expect(result[0].type).toBe('Economy');
                            expect(result[1].type).toBe('EquityMarket');
                            expect(result[2].type).toBe('FixedIncome');
                            expect(result[3].type).toBe('Currency');
                            expect(result[4].type).toBe('CommodityMarket');
                            expect(result[5].type).toBe('RealEstate');
                            expect(result[6].type).toBe(undefined);
                            expect(result[7].type).toBe('unknown');
                        }));
                    });
                    
                  
                });
        });
    });