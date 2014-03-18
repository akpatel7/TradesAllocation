define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var pagePaginationController = function ($scope) {
        $scope.pagination = {
            currentPage: 1,
            pageSize: 10
        };
        
        $scope.pagination.getMore = function () {
            $scope.pagination.currentPage = $scope.pagination.currentPage + 1;
        };
        
        $scope.pagination.getMoreTotalCount = function () {
            return $scope.pagination.currentPage * $scope.pagination.pageSize;
        };

        $scope.pagination.isGetMoreAvailable = function (totalCountOfItems) {
            return totalCountOfItems > $scope.pagination.getMoreTotalCount();
        };
    };

    pagePaginationController.$inject = ['$scope'];

    return pagePaginationController;
});