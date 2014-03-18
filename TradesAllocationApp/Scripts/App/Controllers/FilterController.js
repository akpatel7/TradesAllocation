define(['angular', 'underscore', 'jquery'], function (angular, _, $) {
    'use strict';

    var filterController = function ($scope, $location, $routeParams, _FILTERS_CHANGED_, _FILTERS_UPDATEFACETS_, FilterValues, $q) {
        var updateFacetEventFn,
            allFilters = [],
            resetFilter = function () {
                var deferred = $q.defer();
                FilterValues.resolve().then(function(data) {
                    $scope.filters = $.extend(true, {}, data);
                    $scope.hasFiltersApplied = false;
                    allFilters = [];
                    _.each($scope.filters, function (filter) {
                        if (_.isArray(filter)) {
                            allFilters = _.union(allFilters, filter);
                        } else {
                            allFilters.push(filter);
                        }
                    });
                    deferred.resolve(true);
                });
           
                return deferred.promise;
            },
            checkIfFilterApplied = function() {
                $scope.hasFiltersApplied = false;
                _.each(allFilters, function (item) {
                    if (item.hasOwnProperty('isSelected') && item.display !== false) {
                        if (item.isSelected) {
                            $scope.hasFiltersApplied = true;
                        }
                    } else if (item.hasOwnProperty('value') && item.display !== false) {
                        if (item.value !== undefined) {
                            $scope.hasFiltersApplied = true;
                        }
                    }
                });
            };
        
        $scope.initFiltersFromSearch = function (search) {
            if (search !== undefined) {
                var find = function(property, value) {
                    var found = _.find(allFilters, function(f) {
                        if (f.key === property) {
                            if (f.hasOwnProperty('uri')) {
                                var uri = _.isArray(f.uri) ? f.uri[0] : f.uri;
                                if (uri.toLowerCase() === value.toLowerCase()) {
                                    return true;
                                }
                            } else {
                                return true;
                            }
                        }
                        return false;
                    });
                    return found;
                };
                _.each(search, function (val, key) {
                    var filters = val.split(',');
                    _.each(filters, function(filterValue) {
                        var item = find(key, filterValue);
                        if (item !== undefined && item !== null) {
                            if (item.hasOwnProperty('isSelected')) {
                                item.isSelected = true;
                            } else {
                                item.value = val;
                            }
                        }
                    });
                });
            }
        };

        $scope.clearFilter = function (filter, $event) {
            if (_.isArray(filter)) {
                _.each(filter, function(item) {
                    item.isSelected = false;
                });
            } else {
                filter.value = undefined;
            }
            $scope.applyFilters($event);
            $event.stopPropagation();
        };

        $scope.hasFilterApplied = function (filter) {
            if (filter !== undefined && filter !== null) {
                if (_.isArray(filter)) {
                    var filtered = _.find(filter, function (item) {
                        return item.isSelected === true && item.display !== false;
                    });
                    return filtered !== undefined;
                } else {
                    return filter.value !== undefined;
                }
            }
            return false;
        };

        $scope.clearFilters = function ($event) {
            resetFilter().then(function(data) {
                $scope.applyFilters($event);
            });
        };
        
        $scope.$watch('filters', function (newVal, oldVal) {
            checkIfFilterApplied();
        }, true);

        $scope.$root.$on(_FILTERS_CHANGED_, function () {
            checkIfFilterApplied();
        });
        
        $scope.applyFilters = function(event) {
            var query = {},
                selectedFilters = [],
                groupedFilters;

            if (event) {
                _.each(allFilters, function(filter) {
                    if (filter.hasOwnProperty('display')) {
                        if (filter.display === false) {
                            filter.value = undefined;
                        }
                    }
                });
            }

            _.each(allFilters, function (f) {
                if (f.hasOwnProperty('isSelected') && f.isSelected && f.display !== false) {
                    var value = _.isArray(f.uri) ? f.uri[0] : f.uri;
                    selectedFilters.push({
                        key: f.key,
                        value: value
                    });
                } else if (f.value !== undefined) {
                    selectedFilters.push({
                        key: f.key,
                        value: f.value
                    });
                }
            });

            groupedFilters = _.groupBy(selectedFilters, 'key');
            
            _.each(groupedFilters, function (filter, key) {
                query[key] = _.pluck(filter, 'value').join();
            });
            
            if (event) {
                $location.search(query);
            } else {
                $scope.$root.$broadcast(_FILTERS_CHANGED_, $.extend(true, {}, $scope.filters));
            }
        };

        $scope.updateFacets = function (facets) {
            //Currently the only facets we receive are for asset class, long term though Brendan B will aggregate all facets into one
            //Plato endpoint so we will have to inspect the object graph and find the right facets for the right filter

            if (_.isEmpty($scope.filters)) {
                return;
            }

            var updateFacets = function(filters, facetUri, facetCount) {
                var filter = _.find(filters, function(f) {
                    return f.uri === facetUri;
                });
                if (filter !== undefined && filter !== null) {
                    filter.count = facetCount;
                }
            };
            _.each($scope.filters.assetClass, function (filter) {
                var filterFacets = _.filter(facets.assetClass, function(facet) {
                    return filter.serverKeys ? _.contains(filter.serverKeys, facet['@type']) : filter.key === facet['@type'];
                });

                filter.count = _.reduce(filterFacets, function (total, facet) {
                    return total + (+facet.count);
                }, 0);
            });
            _.each(facets.service, function (facet) {
                updateFacets($scope.filters.services, facet['@service'], facet.count);
            });
            _.each(facets.impact, function (facet) {
                updateFacets($scope.filters.impacts, facet['@impact'], facet.count);
            });
            _.each(facets.region, function (facet) {
                updateFacets($scope.filters.regions, facet['@type'], facet.count);
            });
            _.each(facets.lastApplied, function(facet) {
                var filter = $scope.filters.lastApplied.values[facet['@lastApplied']];
                if (filter !== undefined && filter !== null) {
                    filter.count = facet.count;
                }
            });
        };
        
        updateFacetEventFn = $scope.$root.$on(_FILTERS_UPDATEFACETS_, function (event, eventArguments) {
            $scope.updateFacets(eventArguments);
        });

        $scope.toggleRadio = function (filtersFieldName, value) {
            if ($scope.filters[filtersFieldName].value === value) {
                $scope.filters[filtersFieldName].value = undefined;
            } else {
                $scope.filters[filtersFieldName].value = value;
            }
        };

        $scope.$on('$destroy', function() {
            updateFacetEventFn();
        });
        
        $scope.waitForFilters = (_.keys($routeParams).length > 0 || ($scope.renderAction !== undefined && $scope.renderAction.indexOf('favourites') !== -1));
        
        // Initialize state
        resetFilter().then(function (data) {
            if ($scope.waitForFilters) {
                $scope.initFiltersFromSearch($routeParams);
                $scope.applyFilters();
            }
        });
       
        if (!$scope.waitForFilters) {
            $scope.initFiltersFromSearch($routeParams);
            $scope.applyFilters();
        }

    };
    
    filterController.$inject = ['$scope', '$location', '$routeParams', '_FILTERS_CHANGED_', '_FILTERS_UPDATEFACETS_', 'FilterValues', '$q'];

    return filterController;
});