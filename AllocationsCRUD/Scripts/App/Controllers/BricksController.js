define(['angular', 'underscore'], function(angular, _) {
    'use strict';
    
    var bricksController = function ($scope, Analytics, _FAVOURITES_TOTAL_COUNT_, $q) {
        
        var initialValues = {
            lastPageLength: 1,
            currentPage: 0,
            totalCount: undefined
        };
        $scope.requests = [];
        $scope.tiles = [];
        $scope.currentPage = initialValues.currentPage;
        $scope.pageSize = 30;
        $scope.lastPageLength = initialValues.lastPageLength;
        $scope.totalCount = initialValues.totalCount;

        $scope.reset = function () {
            var requestInProgress = _.last($scope.requests);
            if (requestInProgress) {
                requestInProgress.resolve();
                $scope.busy = false;
                $scope.requests.pop();
            }
            $scope.currentPage = initialValues.currentPage;
            $scope.lastPageLength = initialValues.lastPageLength;
            $scope.totalCount = initialValues.totalCount;
            $scope.tiles = [];
        };

        $scope.busy = false;
        $scope.fetchNextPageOfTiles = function (endpoint, options, callback, getter) {
            if (!$scope.busy && $scope.lastPageLength > 0) {
                var deferred = $q.defer();
                $scope.requests.push(deferred);
                $scope.busy = true;
                $scope.currentPage += 1;
                
                endpoint(options, deferred.promise).then(function (data) {
                       var results = getter(data);
                       if (callback !== undefined) {
                           callback(data);
                       }
                       $scope.tiles.push.apply($scope.tiles, results);
                       $scope.busy = false;
                       $scope.lastPageLength = results.length;
                       if ($scope.totalCount === initialValues.totalCount) {
                           $scope.totalCount = data.totalCount;
                       }
                }, function() {
                        $scope.busy = false;
                    });
                
                Analytics.registerClick('nextPage', $scope.currentPage);
            }
        };
        
        $scope.$on('$routeChangeStart', function () {
            //!!! used for themes favourites !!!
            $scope.reset();
        });

        $scope.$root.$on(_FAVOURITES_TOTAL_COUNT_, function ($event, count) {
            $scope.totalCount = count;
        });
       
    };

    bricksController.$inject = ['$scope', 'Analytics', '_FAVOURITES_TOTAL_COUNT_', '$q'];


    return bricksController;
});