define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var service = function ($location, Collection, LocationTypeUri, LocationTypeRegionUri, LocationUri, $q) {
        var services = [
            {
                key: 'BCAH',
                label: 'HOUSE',
                uri: 'http://data.emii.com/bca/services/bcah',
                isSelected: false,
                count: 0
            },
            {
                key: 'BCA',
                label: 'The Bank Credit Analyst',
                uri: 'http://data.emii.com/bca/services/bca',
                isSelected: false,
                count: 0
            },
            {
                key: 'CIS',
                label: 'China Investment Strategy',
                uri: 'http://data.emii.com/bca/services/cis',
                isSelected: false,
                count: 0
            },
            {
                key: 'CES',
                label: 'Commodity & Energy Strategy',
                uri: 'http://data.emii.com/bca/services/ces',
                isSelected: false,
                count: 0
            },
            {
                key: 'DI',
                label: 'Daily Insights',
                uri: 'http://data.emii.com/bca/services/di',
                isSelected: false,
                count: 0
            },
            {
                key: 'EMS',
                label: 'Emerging Markets Strategy',
                uri: 'http://data.emii.com/bca/services/ems',
                isSelected: false,
                count: 0
            },
            {
                key: 'EIS',
                label: 'European Investment Strategy',
                uri: 'http://data.emii.com/bca/services/eis',
                isSelected: false,
                count: 0
            },
            {
                key: 'FES',
                label: 'Foreign Exchange Strategy',
                uri: 'http://data.emii.com/bca/services/fes',
                isSelected: false,
                count: 0
            },
            {
                key: 'GPS',
                label: 'Geopolitical Strategy',
                uri: 'http://data.emii.com/bca/services/gps',
                isSelected: false,
                count: 0
            },
            {
                key: 'GAA',
                label: 'Global Asset Allocation',
                uri: 'http://data.emii.com/bca/services/gaa',
                isSelected: false,
                count: 0
            },
            {
                key: 'GFIS',
                label: 'Global Fixed Income Strategy',
                uri: 'http://data.emii.com/bca/services/gfis',
                isSelected: false,
                count: 0
            },
            {
                key: 'GIS',
                label: 'Global Investment Strategy',
                uri: 'http://data.emii.com/bca/services/gis',
                isSelected: false,
                count: 0
            },
             {
                 key: 'GISM',
                 label: 'Global Investment Strategy Model',
                 uri: 'http://data.emii.com/bca/services/gism',
                 isSelected: false,
                 count: 0
             },
            {
                key: 'GRES',
                label: 'Global Real Estate Strategy',
                uri: 'http://data.emii.com/bca/services/gres',
                isSelected: false,
                count: 0
            },
            {
                key: 'USBS',
                label: 'U.S. Bond Strategy',
                uri: 'http://data.emii.com/bca/services/usbs',
                isSelected: false,
                count: 0
            },
            {
                key: 'USES',
                label: 'U.S. Equity Strategy',
                uri: 'http://data.emii.com/bca/services/uses',
                isSelected: false,
                count: 0
            },
            {
                key: 'USIS',
                label: 'U.S. Investment Strategy',
                uri: 'http://data.emii.com/bca/services/usis',
                isSelected: false,
                count: 0
            }
        ],
            assetClass = [
                {
                    key: 'Economy',
                    label: 'Economy',
                    isSelected: false,
                    uri: [  'http://data.emii.com/ontologies/economy/Economy',
                            'http://data.emii.com/ontologies/economy/FiscalPolicy',
                            'http://data.emii.com/ontologies/economy/MonetaryPolicy',
                            'http://data.emii.com/ontologies/economy/Inflation',
                            'http://data.emii.com/ontologies/economy/InterestRate'
                    ],
                    // server keys is used to aggregate facet counts, returned for each uri
                    serverKeys: [
                                'Economy',
                                'FiscalPolicy',
                                'InterestRate',
                                'Inflation',
                                'MonetaryPolicy'],
                    count: 0
                },
                {
                    key: 'EquityMarket',
                    label: 'Equity',
                    isSelected: false,
                    uri: 'http://data.emii.com/ontologies/economy/EquityMarket',
                    count: 0
                },
                {
                    key: 'FixedIncomeMarket',
                    label: 'Fixed Income',
                    isSelected: false,
                    uri: 'http://data.emii.com/ontologies/economy/FixedIncomeMarket',
                    count: 0
                },
                {
                    key: 'CurrencyMarket',
                    label: 'Currency',
                    isSelected: false,
                    uri: ['http://data.emii.com/ontologies/economy/CurrencyMarket', 'http://data.emii.com/ontologies/economy/Currency'],
                    serverKeys : ['CurrencyMarket', 'Currency'],
                    count: 0
                },
                {
                    key: 'CommodityMarket',
                    label: 'Commodity',
                    isSelected: false,
                    uri: 'http://data.emii.com/ontologies/economy/CommodityMarket',
                    count: 0
                },
                {
                    key: 'RealEstateMarket',
                    label: 'Real Estate',
                    isSelected: false,
                    uri: 'http://data.emii.com/ontologies/economy/RealEstateMarket',
                    count: 0
                }
            ];
        var custom = [
            {
                key: 'favourites',
                label: 'Favourites',
                uri: 'true',
                isSelected: false
            },
            {
                key: 'followed',
                label: 'Followed',
                uri: 'true',
                isSelected: false
            }
        ];
        var allViewsFilters = {
            services: services,
            assetClass: assetClass,
            viewConviction:
            [
                {
                    key: 'Low',
                    label: 'Low',
                    isSelected: false,
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
                     isSelected: false,
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
            recommendationType:
            {
                key: 'RecommendationType',
                value:
                    undefined,
                values:
                {
                    'http://data.emii.com/view-recommendation-types/tactical': 'Tactical',
                    'http://data.emii.com/view-recommendation-types/strategic': 'Strategic'
                }
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
                    isSelected: false,
                    uri: [
                        'http://data.emii.com/view-types/absolute',
                        'http://data.emii.com/view-types/economy',
                        'http://data.emii.com/view-types/fiscal-policies',
                        'http://data.emii.com/view-types/monetary-policy',
                        'http://data.emii.com/view-types/inflation',
                        'http://data.emii.com/view-types/interest-rate'
                    ]
                }
            ],
            lastUpdated: {
                key: 'LastUpdated',
                value:
                    undefined,
                values:
                {
                    LastWeek: 'Last week',
                    LastMonth: 'Last month',
                    LastQuarter: 'Last quarter',
                    LastYear: 'Last year'
                }
            },
            viewStatus: {
                key: 'ViewStatus',
                value: undefined,
                values: {
                    'false': 'Include Inactive Views',
                    'true': 'Active views only'
                }
            },
            service: {
                key: 'Service',
                value:
                    undefined
            },
            viewableUri: {
                display: true,
                key: 'uri',
                value: undefined
            },
            custom: custom
        };

        var themesFilters = {
            services: services,
            assetClass: assetClass,
            impacts: [
                {
                    key: 'Bearish',
                    label: 'Bearish',
                    uri: 'Bearish',
                    isSelected: false,
                    count: 0
                },
                {
                    key: 'Neutral',
                    label: 'Neutral',
                    uri: 'Neutral',
                    isSelected: false,
                    count: 0
                },
                {
                    key: 'Bullish',
                    label: 'Bullish',
                    uri: 'Bullish',
                    isSelected: false,
                    count: 0
                }
            ],
            lastApplied: {
                key: 'LastApplied',
                value: undefined,
                values:
                {
                    LastWeek: {
                        label: 'Last week',
                        count: 0
                    },
                    LastMonth: {
                        label: 'Last month',
                        count: 0
                    },
                    LastQuarter: {
                        label: 'Last quarter',
                        count: 0
                    },
                    LastYear: {
                        label: 'Last year',
                        count: 0
                    }
                }
            },
            uri: {
                display: true,
                key: 'uri',
                value: undefined
            },
            custom: custom
        };

        var tradesFilters = {
            services: _.without(services, _.findWhere(services, { key: 'BCAH' })),
            assetClass: assetClass
        };

        function getFilterQueryString(value) {
            var filter = [],
                queryString = '';

            if (value.assetClass) {
                var found = _.find(assetClass, function(c) {
                    if (c.serverKeys !== undefined) {
                        var key = _.find(c.serverKeys, function(k) {
                            return k === value.assetClass;
                        });
                        if (key !== undefined) {
                            return true;
                        }
                    } else {
                        return c.key === value.assetClass;
                    }
                    return false;
                });
                if (found !== undefined && found !== null) {
                    filter.push({
                        key: found.key,
                        uri: _.isArray(found.uri) ? _.first(found.uri) : found.uri
                    });
                }
            }
            
            queryString = _.reduce(filter, function(memo, item) {
                return memo + item.key + '=' + item.uri + '&';
            }, queryString).slice(0, -1);

            return queryString;
        }

        return {
            _allViewsFilters: allViewsFilters,
            _themesFilters: themesFilters,
            _tradesFilters: tradesFilters,
            getFilterQueryString: getFilterQueryString,
            resolve: function () {
                var deferred = $q.defer(),
                    filters= {},
                    loadRegions = function (filter) {
                        var d = $q.defer();
                        Collection.get({
                            limit: 100,
                            joiningPredicate: LocationTypeUri,
                            joiningResource: LocationTypeRegionUri,
                            type: LocationUri
                        }).then(function(data) {
                            var regionFilters;
                            regionFilters = _.map(data, function(region) {

                                return {
                                    key: region.label,
                                    label: region.label,
                                    uri: region.uri,
                                    isSelected: false,
                                    count: 0
                                };
                            });
                            _.extend(filter, {
                                regions: regionFilters
                            });
                            
                            d.resolve(true);
                        });
                        return d.promise;
                    };
                
                if ($location.$$path.toLowerCase() === '/views') {
                    filters = allViewsFilters;
                    filters.custom[0].isSelected = false;
                } else if ($location.$$path.toLowerCase() === '/themes') {
                    filters = themesFilters;
                    filters.custom[0].isSelected = false;
                } else if ($location.$$path.toLowerCase() === '/favourites/themes') {
                    filters = themesFilters;
                    filters.custom[0].isSelected = true;
                } else if ($location.$$path.toLowerCase() === '/favourites') {
                    filters = allViewsFilters;
                    filters.custom[0].isSelected = true;
                }

                if (_.isEmpty(filters) === false && filters.hasOwnProperty('regions') === false) {
                    loadRegions(filters)
                        .then(function() {
                            deferred.resolve(filters);
                        });
                } else {
                    deferred.resolve(filters);
                }
                return deferred.promise;
            }
        };
    };
    service.$inject = ['$location', 'Collection', 'LocationTypeUri', 'LocationTypeRegionUri', 'LocationUri', '$q'];
    return service;
});