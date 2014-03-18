define(['angular', 'underscore'], function (angular, _) {
    'use strict';
  

    var allViewsController = function ($scope, $rootScope, Viewables, HouseViewServiceUri, DominantView, _FILTERS_CHANGED_, _FILTERS_UPDATEFACETS_, Like, ViewEvolution) {
        var filterChangedEventFn;
        $scope.activeFilters = undefined;
        $scope.restrictToFavourites = $scope.renderAction === 'mybca.favourites' ? true : false;

        $scope.processData = function (data) {
            _.each(data.viewables, function (viewable) {
                if (viewable.activeView !== undefined) {
                    _.each(viewable.activeView['@set'], function (view) {
                        _.extend(view, {
                            displayOrder: view.service['@id'] === HouseViewServiceUri ? 0 : 1
                        });
                    });
                    _.extend(viewable, {
                        dominantView: DominantView.getDominantView(viewable, $scope.restrictToFavourites)
                    });
                }
            });

            var dominantViews = _.compact(_.pluck(data.viewables, 'dominantView'));

            if (dominantViews.length) {
                var viewUris = _.pluck(dominantViews, '@id');
                ViewEvolution.getViewEvolution({ uri: viewUris, restrictToLatestInactiveEvolution: true })
                    .then(function (previousViews) {
                        _.each(previousViews['@graph'], function (previousView) {
                            _.each(data.viewables, function (viewable) {
                                
                                if (viewable.dominantView && viewable.dominantView['@id'] === previousView.queryId) {
                                    _.extend(viewable.dominantView, { 'previousView': previousView });
                                }
                            });
                        });
                    });
            }

           
        };

        filterChangedEventFn = $rootScope.$on(_FILTERS_CHANGED_, function (event, eventArguments) {
            $scope.activeFilters = eventArguments;
            $scope.filteringByViewableUri = !!(eventArguments.viewableUri && eventArguments.viewableUri.value);
            $scope.reset();
            $scope.fetchNextPageOfTiles(Viewables.getViewables, {
                filters: $scope.activeFilters,
                page: $scope.currentPage,
                pageSize: $scope.pageSize,
                includeFacetsCount: false,
                restrictToFavourites: $scope.restrictToFavourites
            }, $scope.processData, function (data) {
                return data.viewables;
            });
            Viewables.getViewablesFacetCount({ filters: $scope.activeFilters })
                .then(function(result) {
                    $rootScope.$broadcast(_FILTERS_UPDATEFACETS_, $.extend(true, {}, result.facets));
                });
        });

        $scope.fetchNextPage = function () {
            $scope.fetchNextPageOfTiles(Viewables.getViewables, {
                    filters: $scope.activeFilters,
                    page: $scope.currentPage,
                    pageSize: $scope.pageSize,
                    includeFacetsCount: false,
                    restrictToFavourites: $scope.restrictToFavourites
                }, $scope.processData, function(data) {
                    return data.viewables;
                });
        };
        
        $scope.$on('$destroy', function() {
            filterChangedEventFn();
        });
    };

    allViewsController.$inject = ['$scope', '$rootScope', 'Viewables', 'HouseViewServiceUri', 'DominantView', '_FILTERS_CHANGED_', '_FILTERS_UPDATEFACETS_', 'Like', 'ViewEvolution'];

    return allViewsController;
});