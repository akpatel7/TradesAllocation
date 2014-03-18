define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var HouseViewsController = function ($scope, HouseViews, Dates) {
        var selectFilter = function (list, filterKey, value) {
            var filter = _.find(list, function (item) {
                return item.key === filterKey;
            });
            _.each(list, function (item) {
                if (item.key !== value) {
                    item.isSelected = false;
                }
            });
            filter.isSelected = value;
        },
            aggregateThemes = function (views) {
                var visibleViews = _.filter(views, function (view) { return view.isVisible | true; }),
                    visibleThemes = _.pluck(visibleViews, 'themes');
                visibleThemes = _.union.apply(_, visibleThemes);
                visibleThemes = _.reject(visibleThemes, function (theme) {
                    return theme === undefined || theme === null;
                });
                visibleThemes = _.uniq(visibleThemes, function (theme) {
                    return theme['@id'];
                });
                return visibleThemes;
            };

        $scope.viewName = "House views";
        $scope.views = [];
        $scope.filteredViews = [];
        $scope.filters = {
            types: [
                {
                    key: 'Economy',
                    label: 'Economy',
                    isSelected: false,
                    dataTrackingAction: 'filter_houseview_economy'
                },
            {
                key: 'EquityMarket',
                label: 'Equity',
                isSelected: false,
                dataTrackingAction: 'filter_houseview_market'
            }, {
                key: 'FixedIncome',
                label: 'Fixed Income',
                isSelected: false,
                dataTrackingAction: 'filter_houseview_fixed_income'
            }, {
                key: 'Currency',
                label: 'Currency',
                isSelected: false,
                dataTrackingAction: 'filter_houseview_currency'
            }, {
                key: 'CommodityMarket',
                label: 'Commodity',
                isSelected: false,
                dataTrackingAction: 'filter_houseview_commodity'
            }, {
                key: 'RealEstate',
                label: 'Real Estate',
                isSelected: false,
                dataTrackingAction: 'filter_houseview_real_estate'
            }
            ],
            benchmark: [
                {
                    key: 'Relative',
                    label: 'Relative',
                    isSelected: false,
                    dataTrackingAction: 'filter_houseview_relative'
                },
                {
                    key: 'Absolute',
                    label: 'Absolute',
                    isSelected: false,
                    dataTrackingAction: 'filter_houseview_absolute'
                }
            ],
            lastUpdated: [
                 {
                     key: 'LastWeek',
                     label: 'Last week',
                     isSelected: false,
                     dataTrackingAction: 'filter_houseview_updated_1week'
                 },
                {
                    key: 'LastMonth',
                    label: 'Last month',
                    isSelected: false,
                    dataTrackingAction: 'filter_houseview_updated_1month'
                }, {
                    key: 'LastQuarter',
                    label: 'Last quarter',
                    isSelected: false,
                    dataTrackingAction: 'filter_houseview_updated_1quarter'
                },
                {
                    key: 'LastYear',
                    label: 'Last year',
                    isSelected: false,
                    dataTrackingAction: 'filter_houseview_updated_1year'
                }
            ]
        };
        $scope.configuration = {
            allViewsExpanded: false
        };
        $scope.hasFiltersApplied = false;

        $scope.clearFilters = function () {
            var allFilters = _.union(_.union($scope.filters.types, $scope.filters.benchmark), $scope.filters.lastUpdated);
            _.each(allFilters, function (filter) {
                filter.isSelected = false;
            });
        };

        $scope.selectBenchmark = function (filterKey, value) {
            selectFilter($scope.filters.benchmark, filterKey, value);
        };

        $scope.selectLastUpdated = function (filterKey, value) {
            selectFilter($scope.filters.lastUpdated, filterKey, value);
        };

        HouseViews.getViews()
                .then(function (data) {
                    $scope.views = data;
                    _.each($scope.views, function (view) {
                        function isViewsVisible(viewsInViewable) {
                            return _.some(viewsInViewable, function (viewItem) {
                                return viewItem.isVisible;
                            });
                        }
                        function isViewsVisibleIterator(viewsInViewable) {
                            return function() {
                                return isViewsVisible(viewsInViewable);
                            };
                        }

                        _.each(_.union(view.views.shortTermViews, view.views.longTermViews), function (currentView) {
                            _.extend(currentView, {
                                isVisible: true
                            });
                        });
                        _.extend(view, {
                            isExpanded: false,
                            isVisible: true
                        });
                        _.extend(view.views, {
                            hasLongTermView: isViewsVisibleIterator(view.views.longTermViews),
                            hasShortTermView: isViewsVisibleIterator(view.views.shortTermViews)
                        });
                    });                    
                });

        $scope.$watch('views', function (value) {
            $scope.filteredViews = value;
        });

        $scope.$watch('configuration.allViewsExpanded', function (value) {
            _.each($scope.filteredViews, function (view) {
                view.isExpanded = value;
            });
        });

        $scope.$watch('filters', function (newValue) {
            var allFilters = _.union(_.union(newValue.types, newValue.benchmark), newValue.lastUpdated),
                appliedFilter = _.find(allFilters, function (filter) {
                    return filter.isSelected === true;
                });
            $scope.hasFiltersApplied = appliedFilter !== undefined;
        }, true);

        $scope.$watch('filters', function (newValue) {
            var appliedTypeFilters,
                selectedBenchmarkFilter,
                selectedLastUpdatedFilter;

            appliedTypeFilters = _.filter(newValue.types, function (filterValue) {
                return filterValue.isSelected === true;
            });
            if (appliedTypeFilters.length === 0) {
                $scope.filteredViews = $scope.views;
            } else {
                $scope.filteredViews = _.filter($scope.views, function (view) {
                    var matching = _.find(appliedTypeFilters, function (selectedFilter) {
                        return view.type === selectedFilter.key;
                    });
                    return matching !== undefined;
                });
            }
            
            // reset views state
            _.each($scope.filteredViews, function (filteredView) {
                _.each(_.union(filteredView.views.shortTermViews, filteredView.views.longTermViews), function (view) {
                    view.isVisible = true;
                });
            });

            selectedBenchmarkFilter = _.find(newValue.benchmark, function (benchmarkFilter) {
                return benchmarkFilter.isSelected === true;
            });
            if (selectedBenchmarkFilter !== undefined) {
                $scope.filteredViews = _.filter($scope.filteredViews, function (view) {
                    var hasRelativeViews,
                        hasAbsoluteViews,
                        allViews = _.union(view.views.shortTermViews, view.views.longTermViews);

                    // TODO: Add filtering for contained views.
                    if (selectedBenchmarkFilter.key === 'Relative') {
                        hasRelativeViews = _.filter(allViews, function (currentView) {
                            var isVisible = currentView.viewWeighting !== undefined;
                            currentView.isVisible = currentView.isVisible && isVisible;
                            return isVisible;
                        }).length > 0;
                        return hasRelativeViews === true;
                    } else { // default absolute
                        hasAbsoluteViews = _.filter(allViews, function (currentView) {
                            var isVisible = currentView.viewWeighting === undefined;
                            currentView.isVisible = currentView.isVisible && isVisible;
                            return isVisible;
                        }).length > 0;
                        return hasAbsoluteViews === true;
                    }
                });
            }

            selectedLastUpdatedFilter = _.find(newValue.lastUpdated, function (filterValue) {
                return filterValue.isSelected === true;
            });

            if (selectedLastUpdatedFilter !== undefined) {
                $scope.filteredViews = _.filter($scope.filteredViews, function (view) {
                    var allViews = _.union(view.views.shortTermViews, view.views.longTermViews),
                        now = Dates.now(),
                        filteredResult = _.filter(allViews, function (currentView) {
                            var lastUpdatedDate = Dates.toDate(currentView.lastUpdated),
                                result = false;
                            switch (selectedLastUpdatedFilter.key) {
                                case 'LastWeek':
                                    result = Dates.calculateDifferenceInWeeks(lastUpdatedDate, now) === 0;
                                    break;
                                case 'LastMonth':
                                    result = Dates.calculateDifferenceInMonths(lastUpdatedDate, now) < 1;
                                    break;
                                case 'LastQuarter':
                                    result = Dates.calculateDifferenceInMonths(lastUpdatedDate, now) < 4;
                                    break;
                                case 'LastYear':
                                    result = Dates.calculateDifferenceInMonths(lastUpdatedDate, now) < 12;
                                    break;
                                default:
                                    break;
                            }
                            currentView.isVisible = currentView.isVisible && result;
                            return result;
                        });
                    return filteredResult.length > 0;
                });
            }
        }, true);

        $scope.$watch('filteredViews', function (value) {
            _.each(value, function (row) {
                row.views.shortTermThemes = aggregateThemes(row.views.shortTermViews);
                row.views.longTermThemes = aggregateThemes(row.views.longTermViews);
            });
        });
    };
    HouseViewsController.$inject = ['$scope', 'HouseViews', 'Dates'];

    return HouseViewsController;
});