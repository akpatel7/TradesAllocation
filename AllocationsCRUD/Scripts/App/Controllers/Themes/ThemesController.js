define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var themesController = function ($scope, Themes, Like, _FILTERS_CHANGED_, _FILTERS_UPDATEFACETS_) {
        var filterChangedEventFn;
        $scope.activeFilters = undefined;
        $scope.restrictToFavourites = $scope.renderAction === 'mybca.favourites.themes' ? true : false;

        $scope.loadOpinionCount = function (themes, endpoint, propertyName) {
            var resources = _.pluck(themes, '@id');
            resources = _.map(resources, function (r) {
                return _.last(r.split('/'));
            });
           
            endpoint('theme', resources)
                .then(function (data) {
                    _.each(themes, function (theme) {
                        var resourceId = _.last(theme['@id'].split('/')),
                            newObj = {};
                        newObj[propertyName] = data[resourceId];
                        _.extend(theme, newObj);
                    });
                });
        };

        $scope.loadLikeCount = function (themes) {
            $scope.loadOpinionCount(themes, Like.getAggregatedLikeCount, 'likeCount');
        };
        $scope.loadDislikeCount = function (themes) {
            $scope.loadOpinionCount(themes, Like.getAggregatedDislikeCount, 'dislikeCount');
        };

        $scope.postProcessPageOfData = function (data) {
            $scope.loadLikeCount(data['@graph']);
            $scope.loadDislikeCount(data['@graph']);
            $scope.$root.$broadcast(_FILTERS_UPDATEFACETS_, $.extend(true, {}, data.facets));
        };
        
        $scope.fetchNextPage = function () {
            var filters = $scope.activeFilters;
            if (filters === undefined && $scope.restrictToFavourites) {
                filters = _.extend({},
                    {
                        custom: [
                            {
                                key: 'favourites',
                                isSelected: true
                            }
                        ]
                    }
                );
            }
            $scope.fetchNextPageOfTiles(Themes.getThemes, {
                filters: filters,
                page: $scope.currentPage,
                restrictToFavourites: $scope.restrictToFavourites
            }, $scope.postProcessPageOfData, function (data) {
                return data['@graph'];
            });
        };
        
        filterChangedEventFn = $scope.$root.$on(_FILTERS_CHANGED_, function (event, eventArguments) {
            $scope.activeFilters = eventArguments;
            
            $scope.reset();
            $scope.fetchNextPageOfTiles(Themes.getThemes, {
                    filters: $scope.activeFilters,
                    page: $scope.currentPage,
                    pageSize: $scope.pageSize,
                    restrictToFavourites: $scope.restrictToFavourites
                }, $scope.postProcessPageOfData, function(data) {
                    return data['@graph'];
                });
        });
        
        // Initialize state
        if ($scope.restrictToFavourites === true) {
            $scope.fetchNextPage();
        }
        
        $scope.$on('$destroy', function () {
            filterChangedEventFn();
        });
    };

    themesController.$inject = ['$scope', 'Themes', 'Like', '_FILTERS_CHANGED_', '_FILTERS_UPDATEFACETS_'];

    return themesController;
});