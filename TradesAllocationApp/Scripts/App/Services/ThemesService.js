define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var themesService = function ($resource, $q, DataEndpoint, View) {
        var findUniqViewables = function (theme) {
            var viewables = [],
                impactedViews = [],
                viewsGroupedByViewable
                ;
            
            if (theme.impactedView !== undefined) {
                impactedViews = _.union(impactedViews, theme.impactedView['@set']);
            }
            if (theme.childTheme !== undefined) {
                _.each(theme.childTheme['@set'], function(childTheme) {
                    if (childTheme.impactedView !== undefined) {
                        impactedViews = _.union(impactedViews, childTheme.impactedView['@set']);
                    }
                });
            }

            viewsGroupedByViewable = _.groupBy(impactedViews, function(view) {
                return view.viewOn['@id'];
            });
            
            _.each(viewsGroupedByViewable, function (value, key) {
                var viewable = {},
                    lastUpdatedView = _.last(_.sortBy(value, function (view) {
                        return view.horizonStartDate;
                    })),
                    first =  _.first(value);
               
                _.extend(viewable, {
                    '@id': key,
                    canonicalLabel: first.viewOn.canonicalLabel,
                    lastUpdated: lastUpdatedView.horizonStartDate,
                    isFavourited: first.viewOn.isFavourited,
                    perspectiveId: first.viewOn.perspectiveId,
                    activeView: {
                        '@set': value
                    }
                });
                viewables.push(viewable);
            });
            return viewables;
        };
        return {
            getThemes: function(o, timeout) {
                var deferred = $q.defer(),
                    options = {
                        page: 0,
                        pageSize: 20,
                        restrictToFavourites: false
                    };
                _.extend(options, o);
                
                var query = {
                    service: [],
                    assetClass: [],
                    impact: [],
                    lastApplied: undefined,
                    uri: undefined,
                    region: [],
                    isFollowed: false,
                    isFavourited: false
                };
                
                function createdAddItemToQuery(uriArray) {
                    return function (item) {
                        if (item.isSelected) {
                            if (_.isArray(item.uri)) {
                                uriArray.push.apply(uriArray, item.uri);
                            }
                            else {
                                uriArray.push(item.uri);
                            }
                        }
                    };
                }
                
                if (options.filters !== undefined && options.filters !== null) {
                    if (options.filters.assetClass !== undefined) {
                        _.each(options.filters.assetClass, createdAddItemToQuery(query.assetClass));
                    }
                    if (options.filters.services !== undefined) {
                        _.each(options.filters.services, function (item) {
                            if (item.isSelected) {
                                query.service.push(item.uri);
                            }
                        });
                    }
                    if (options.filters.impacts !== undefined) {
                        _.each(options.filters.impacts, function (item) {
                            if (item.isSelected) {
                                query.impact.push(item.key);
                            }
                        });
                    }
                    if (options.filters.regions !== undefined) {
                        _.each(options.filters.regions, function (item) {
                            if (item.isSelected) {
                                query.region.push(item.uri);
                            }
                        });
                    }
                    if (options.filters.custom !== undefined) {
                        var restrictToFollowedFilter,
                            restrictToFavouritedFilter;
                            
                        restrictToFavouritedFilter = _.find(options.filters.custom, function (f) {
                            return f.key === 'favourites';
                        });
                        
                        restrictToFollowedFilter = _.find(options.filters.custom, function (f) {
                            return f.key === 'followed';
                        });
                        query.isFollowed = restrictToFollowedFilter !== null && restrictToFollowedFilter !== undefined && restrictToFollowedFilter.isSelected;
                        query.isFavourited = restrictToFavouritedFilter !== null && restrictToFavouritedFilter !== undefined && restrictToFavouritedFilter.isSelected;
                    }
                    query.lastApplied = options.filters.lastApplied !== undefined ? options.filters.lastApplied.value : undefined;
                    query.uri = options.filters.uri !== undefined ? options.filters.uri.value : undefined;
                }
                
                DataEndpoint.getTemplatedEndpoint('themes', [
                    { key: 'page', value: options.page },
                    { key: 'pageSize', value: options.pageSize },
                    { key: 'includeAll', value: true },
                    { key: 'restrictToFavourites', value: options.restrictToFavourites },
                    { key: 'forDNA', value: true },
                    { key: 'service', value: query.service },
                    { key: 'type', value: query.assetClass },
                    { key: 'uri', value: query.uri },
                    { key: 'impact', value: query.impact },
                    { key: 'lastApplied', value: query.lastApplied },
                    { key: 'region', value: query.region },
                    { key: 'isFollowed', value: query.isFollowed },
                    { key: 'isFavourited', value: query.isFavourited }
                ]).then(function (result) {
                    $resource(result, {}, {
                        get: {
                            method: 'GET',
                            timeout: timeout
                        }
                    }).get({}, function (data) {
                        _.each(data['@graph'], function (theme) {
                            var orderedChildThemes,
                                viewables = findUniqViewables(theme);
                            
                            if (theme.created === undefined) {
                                if (theme.childTheme !== undefined) {
                                    orderedChildThemes = _.sortBy(theme.childTheme['@set'], function(childTheme) {
                                        return childTheme.created;
                                    });
                                    if (orderedChildThemes.length > 0) {
                                        _.extend(theme, {
                                            created: _.first(orderedChildThemes).created
                                        });
                                    }
                                }
                            }
                            if (theme.updated === undefined) {
                                if (theme.childTheme !== undefined) {
                                    orderedChildThemes = _.reject(_.sortBy(theme.childTheme['@set'], function(childTheme) {
                                        return childTheme.lastApplied;
                                    }), function(current) {
                                        return current.lastApplied === undefined;
                                    });
                                    if (orderedChildThemes.length > 0) {
                                        _.extend(theme, {
                                            lastApplied: _.last(orderedChildThemes).lastApplied
                                        });
                                    }
                                }
                            }
                           
                            _.extend(theme, {
                                viewables: viewables
                            });
                        });
                        deferred.resolve(data);
                    });
                });
                return deferred.promise;
            },
            calculateImpact: function (theme) {
                var result,
                    calculateThemeImpactValue = function (currentTheme) {
                        var themeResult = 0;
                        _.each(currentTheme.impactedView['@set'], function(view) {
                            themeResult += View.getPosition(view);
                        });
                        return themeResult;
                    };
                result = calculateThemeImpactValue(theme);
                if (theme.childTheme !== undefined) {
                    _.each(theme.childTheme['@set'], function (childTheme) {
                        result += calculateThemeImpactValue(childTheme);
                    });
                }
               
                if (result > 0) {
                    return 'bullish';
                } else if (result < 0) {
                    return 'bearish';
                }
                return 'neutral';
            },
            calculateMarketsCount: function (theme) {
                var childThemeImpactedView = [],
                    impactedViews;

                if (theme.childTheme) {
                    _.each(theme.childTheme['@set'], function (t) {
                        childThemeImpactedView = _.union(childThemeImpactedView, t.impactedView['@set']);
                    });
                }

                impactedViews = _.union(theme.impactedView['@set'], childThemeImpactedView);
                var markets = _.uniq(impactedViews, false, function (view) {
                    return view.viewOn['@id'];
                });

                return markets.length;
            }
        };
    };

    themesService.$inject = ['$resource', '$q', 'DataEndpoint', 'View'];
    return themesService;
});