define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var controller = function ($scope) {
        $scope.showFavouritesOnly = false;
        $scope.showFollowsOnly = false;
        
        $scope.myFavouritesView = $scope.renderAction === 'mybca.favourites.allocations' ? true : false;

        $scope.toggleFavouritesFilter = function () {
            $scope.showFavouritesOnly = !$scope.showFavouritesOnly;
            $scope.applyFavouritesFilter();
        };
        
        $scope.applyFavouritesFilter = function () {
            if ($scope.grid === undefined) {
                return;
            }

            var filter = $scope.showFavouritesOnly ? 'return Row["isFavourited"] ? 1 : 0' : '';
            $scope.grid.SetFilter($scope.renderAction + '-isFavourited', filter);
        };
        
        $scope.toggleFollowFilter = function () {
            if ($scope.grid === undefined) {
                return;
            }

            $scope.showFollowsOnly = !$scope.showFollowsOnly;
            var filter = $scope.showFollowsOnly ? 'return Row["isFollowed"] ? 1 : 0' : '';
            $scope.grid.SetFilter('isFollowed', filter);
        };
        
        $scope.setFilterState = function () {
            if ($scope.grid === undefined || $scope.grid.Rows.length === 0) {
                return;
            }

            var portfolios = _.filter($scope.grid.Rows, function (row) {
                return row.isPortfolio && row.Visible;
            });

            var filtered = _.chain($scope.grid.Rows)
                .filter(function (row) {
                    return row.Visible && row.isPortfolio !== undefined && !row.isPortfolio;
                })
                .groupBy(function (row) {
                    return row.Portfolio_Id;
                })
                .map(function (items, key) {
                    return _.union(
                        [_.find(portfolios, function (p) {
                            return p.originalId === parseInt(key, 10);
                        })],
                        _.filter(items, function (item) {
                            return item.isPortfolio !== undefined;
                        })
                    );
                })                
                .value();

            $scope.showFavouritesOnly = _.every(filtered, function(items) {
                return _.find(items, function(item) {
                    return item.isFavourited;
                }) !== undefined;
            });
            
            $scope.showFollowsOnly = _.every(filtered, function (items) {
                return _.find(items, function (item) {
                    return item.isFollowed;
                }) !== undefined;
            });
            
            if ($scope.showFavouritesOnly || $scope.showFollowsOnly) {
                _.each($scope.grid.Rows, function (row) {
                    if (row.isPortfolio !== undefined && (row.isFavourited || row.isFollowed)) {
                        $scope.grid.ExpandParents(row);
                    }
                });
            }
        };
        
        if ($scope.myFavouritesView) {
            $scope.showFavouritesOnly = true;
            $scope.applyFavouritesFilter();
        } else {
            $scope.grid.SetFilter('mybca.favourites.allocations-isFavourited', '');
        }
        
        $scope.setFilterState();
    };

    controller.$inject = ['$scope'];
    return controller;
});