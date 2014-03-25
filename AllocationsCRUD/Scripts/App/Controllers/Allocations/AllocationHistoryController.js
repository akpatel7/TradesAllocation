define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var controller = function ($scope, DataEndpoint, $http, _TREE_GRID_RESIZE_INFO_, AllocationsDataService) {

        $scope.options = {
            skip: 0,
            take: 5
        };
        
        $scope.totalItems = 0;


        function loadHistory() {
            var filter = 'AllocationId eq ' + $scope.item.id;
            DataEndpoint.getTemplatedEndpoint(['bca-trades', 'allocation-history'])
                .then(function (url) {
                    $http({
                        method: 'GET',
                        url: url,
                        params: {
                            '$filter': filter,
                            '$orderby': 'LastUpdated desc',
                            '$inlinecount': 'allpages',
                            '$top': $scope.options.take,
                            '$skip': $scope.options.skip
                        }
                    }).success(function (data) {
                        _.each(data.value, function (v) {                           
                            AllocationsDataService.formatAllocation(v);
                        });
                        $scope.history = ($scope.history || []).concat(data.value);
                        $scope.totalItems = parseInt(data['odata.count'], 10);
                        $scope.options.skip = $scope.history.length;
                        var height = $scope.history.length > 0 ? 350 : 300;
                        $scope.$emit(_TREE_GRID_RESIZE_INFO_, { rowId: $scope.row.id, height: height });
                    });
                });
        }
        
        $scope.showMore = function () {
            $scope.options.take += 10;
            loadHistory();
        };

        loadHistory();
    };

    controller.$inject = ['$scope', 'DataEndpoint', '$http', '_TREE_GRID_RESIZE_INFO_', 'AllocationsDataService'];
    return controller;
});