define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var controller = function ($scope, $routeParams) {
        $scope.totalCount = 0;
        $scope.currentPage = 0;
        $scope.pageSize = 5;
        $scope.showBoundaryLinks = false;

        $scope.onSelectPage = function (newPage) {
            var page = $scope.grid.GetPage(newPage - 1);
            $scope.grid.GoToPage(page);
        };

        $scope.$watch('totalCount', function (newVal) {
            $scope.showBoundaryLinks = $scope.totalCount / $scope.pageSize > 5;
            $scope.currentPage = 1;
        });
        
        $scope.$watch('grid', function (newVal) {
            if (newVal) {
                var uri;
                if ($routeParams.Uri) {
                    uri = $routeParams.Uri;
                } else if ($routeParams.uri) {
                    uri = $routeParams.uri;
                }
                if (uri) {
                    newVal.SetFilter('Uri', 'return Row["Uri"] === "' + uri + '" ? 1 : 0', null, 0); // If we dont pass 0, it will default to 2, and save the filter, causing an error
                } else {
                    newVal.SetFilter('Uri', 'return 1', null, 0);
                }
            }
           
        });

        $scope.Export = function() {
            $scope.grid.ActionExport();
        };
    };

    controller.$inject = ['$scope', '$routeParams'];
    return controller;
});