define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var controller = function ($scope, DataEndpoint, $http, _TREE_GRID_RESIZE_INFO_) {
        $scope.options = {
            skip: 0,
            take: 5
        };
        $scope.totalItems = 0;

        function loadComments() {
            var filter = ($scope.item.isPortfolio ? 'Portfolio_Id eq ' : 'Allocation_Id eq ') + $scope.item.id;
            DataEndpoint.getTemplatedEndpoint(['bca-trades', 'portfolio-comments'])
                .then(function (url) {
                    $http({
                        method: 'GET',
                        url: url,
                        params: {
                            '$filter': filter,
                            '$orderby': 'CreatedOn desc',
                            '$inlinecount': 'allpages',
                            '$top': $scope.options.take,
                            '$skip': $scope.options.skip
                        }
                    }).success(function (data) {
                        $scope.comments = ($scope.comments || []).concat(data.value);
                        $scope.totalItems = parseInt(data['odata.count'], 10);
                        $scope.options.skip = $scope.comments.length;
                        var height = $scope.comments.length > 0 ? 350 : 300;
                        $scope.$emit(_TREE_GRID_RESIZE_INFO_, { rowId: $scope.row.id, height: height });
                    });
                });
        }
        
        $scope.showMore = function () {
            $scope.options.take += 10;
            loadComments();
        };

        loadComments();
    };

    controller.$inject = ['$scope', 'DataEndpoint', '$http', '_TREE_GRID_RESIZE_INFO_'];
    return controller;
});