define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var ResearchAllocationsController = function ($scope, AllocationsDataService, $location) {
        
        function loadMoreAllocations() {
            AllocationsDataService.getAllocations({ instrumentUri: $scope.viewable['@id'], pageSize: $scope.pageSize, page: $scope.page })
                .then(function (responseData) {
                    $scope.allocations = _.union($scope.allocations, responseData.allocations);
                    $scope.page = $scope.page + 1;
                    $scope.totalCount = responseData.totalCount;
                    $scope.loaded = true;
                });
        }

        function resetInitialValues() {
            $scope.allocations = [];
            $scope.page = 0;
            $scope.totalCount = undefined;
            $scope.canShowMore = undefined;
        }

        $scope.pageSize = 10;

        $scope.$watch('viewable', function (newVal) {
            if (newVal) {
                resetInitialValues();
                loadMoreAllocations();
            }
        });
        
        $scope.$watch('page', function (newVal) {
            $scope.canShowMore = $scope.page * $scope.pageSize < $scope.totalCount;
        });

        $scope.showMore = function() {
            loadMoreAllocations();
        };

        $scope.goToAllocation = function (allocation) {
            $location.path('/allocations').search({ Uri: allocation.Uri });
        };
    };
    
    ResearchAllocationsController.$inject = ['$scope', 'AllocationsDataService', '$location'];

    return ResearchAllocationsController;
});