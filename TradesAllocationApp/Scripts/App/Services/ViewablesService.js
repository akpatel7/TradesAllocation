define(['angular', 'underscore', 'moment', 'App/Helpers/String'], function (angular, _, moment, string) {
    'use strict';

    var viewables = function ($resource, $q, DataEndpoint, View, Dates) {

        function getBooleanCustomFilterValue(filterObjects, key) {
            var first = _.find(filterObjects, function (item) {
                return item.key === key;
            });

            if (first) {
                return first.isSelected;
            }

            return false;
        }

        function buildQuery(options) {
            var query = {
                service: [],
                types: [],
                viewType: [],
                date: '',
                viewConviction: [],
                recommendationType: '',
                viewPosition: [],
                locations: [],
                viewableUri: '',
                viewStatus: true,
                isFollowed: false,
                isFavourited: false
            };

            function createdAddItemToQuery(uriArray) {
                return function (item) {
                    if (item.isSelected) {
                        if (_.isArray(item.uri)) {
                            uriArray.push.apply(uriArray, item.uri);
                        } else {
                            uriArray.push(item.uri);
                        }
                    }
                };
            }

            if (options.filters !== undefined && options.filters !== null) {

                if (options.filters.assetClass !== undefined) {
                    _.each(options.filters.assetClass, createdAddItemToQuery(query.types));
                }
                if (options.filters.viewConviction !== undefined) {
                    _.each(options.filters.viewConviction, createdAddItemToQuery(query.viewConviction));
                }

                if (options.filters.position !== undefined) {
                    _.each(options.filters.position, function (position) {
                        if (position.isSelected) {
                            _.each(position.uri, function (uri) {
                                query.viewPosition.push(uri);
                            });
                        }
                    });
                }

                if (options.filters.viewType) {
                    _.each(options.filters.viewType, createdAddItemToQuery(query.viewType));
                }
                if (options.filters.lastUpdated !== undefined && options.filters.lastUpdated.value !== undefined) {
                    query.date = Dates.parseFilter(options.filters.lastUpdated.value, moment());
                }
                if (options.filters.recommendationType !== undefined && options.filters.recommendationType.value !== undefined) {
                    query.recommendationType = options.filters.recommendationType.value;
                }
                if (options.filters.services !== undefined) {
                    _.each(options.filters.services, createdAddItemToQuery(query.service));
                }
                if (options.filters.regions !== undefined) {
                    _.each(options.filters.regions, createdAddItemToQuery(query.locations));
                }
                if (options.filters.viewableUri !== undefined && options.filters.viewableUri.value !== undefined) {
                    query.viewableUri = options.filters.viewableUri.value;
                }
                if (options.filters.viewStatus !== undefined && options.filters.viewStatus.value !== undefined) {
                    query.viewStatus = options.filters.viewStatus.value;
                }
                if (options.filters.viewStatus !== undefined && options.filters.viewStatus.value !== undefined) {
                    query.viewStatus = options.filters.viewStatus.value;
                }
                if (options.filters.custom !== undefined) {
                    query.isFollowed = getBooleanCustomFilterValue(options.filters.custom, 'followed');
                    query.isFavourited = getBooleanCustomFilterValue(options.filters.custom, 'favourites');
                }
            }
            return query;
        }

        function getViewables(o, timeout) {
            var deferred = $q.defer(),
                options = {
                    filters: undefined,
                    page: 0,
                    pageSize: 20,
                    includeFacetsCount: true,
                    restrictToFavourites: false
                },
                query;
            _.extend(options, o);

            query = buildQuery(options);

            if (query.viewableUri && options.page > 0) {
                deferred.resolve({ viewables: [] });
            } else {
                DataEndpoint.getTemplatedEndpoint('viewables', [
                    { key: 'service', value: query.service },
                    { key: 'type', value: query.types },
                    { key: 'page', value: options.page },
                    { key: 'pageSize', value: options.pageSize },
                    { key: 'restrictToFavourites', value: options.restrictToFavourites },
                    { key: 'viewType', value: query.viewType },
                    { key: 'conviction', value: query.viewConviction },
                    { key: 'recommendationType', value: query.recommendationType },
                    { key: 'date', value: query.date },
                    { key: 'viewPosition', value: query.viewPosition },
                    { key: 'uri', value: query.viewableUri },
                    { key: 'location', value: query.locations },
                    { key: 'includeFacetsCount', value: options.includeFacetsCount },
                    { key: 'onlyViewablesWithActiveViews', value: query.viewStatus },
                    { key: 'isFollowed', value: query.isFollowed },
                    { key: 'isFavourited', value: query.isFavourited }
                ])
                    .then(function (result) {
                        $resource(result, {}, {
                            get: {
                                method: 'GET',
                                timeout: timeout
                            }
                        }).get({}, function (data) {
                            _.each(data.viewables, function (item) {

                                if (item.canonicalLabel && item.canonicalLabel['@set']) {
                                    return;
                                }

                                item.canonicalLabel = string.trim(item.canonicalLabel.replace(new RegExp('(economy$)', 'gi'), ''));

                                if (item.activeView !== undefined) {
                                    _.each(item.activeView['@set'], function (view) {
                                        _.extend(view, {
                                            relativeViewLabel: View.getRelativeViewLabel(view)
                                        });
                                    });

                                    var allAvailableHorizons = _.pluck(item.activeView['@set'], 'lastUpdatedDate');
                                    allAvailableHorizons = _.compact(allAvailableHorizons);
                                    allAvailableHorizons = _.sortBy(allAvailableHorizons, function (horizonItem) {
                                        return horizonItem;
                                    });
                                    _.extend(item, { latestHorizonStartDate: _.some(allAvailableHorizons) ? _.last(allAvailableHorizons) : '' });
                                }
                            });
                            deferred.resolve(data);
                        });
                    });
            }

            return deferred.promise;
        }

        function getViewablesFacetCount(options) {
            var deferred = $q.defer(),
                query = buildQuery(options);

            DataEndpoint.getTemplatedEndpoint('viewables-facets', [
                { key: 'service', value: query.service },
                { key: 'type', value: query.types },
                { key: 'viewType', value: query.viewType },
                { key: 'conviction', value: query.viewConviction },
                { key: 'recommendationType', value: query.recommendationType },
                { key: 'date', value: query.date },
                { key: 'viewPosition', value: query.viewPosition },
                { key: 'uri', value: query.viewableUri },
                { key: 'location', value: query.locations },
                { key: 'onlyViewablesWithActiveViews', value: query.viewStatus }
            ])
                .then(function (result) {
                    $resource(result, {}, {
                        get: {
                            method: 'GET'
                        }
                    }).get({}, function (data) {
                        deferred.resolve(data);
                    });
                });
            return deferred.promise;
        }

        return {
            getViewables: getViewables,
            getViewablesFacetCount: getViewablesFacetCount
        };
    };

    viewables.$inject = ['$resource', '$q', 'DataEndpoint', 'View', 'Dates'];
    return viewables;
});