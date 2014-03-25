define(['angular', 'underscore', 'moment', 'highstock'], function (angular, _) {
    'use strict';

    var controller = function ($scope, $http, PerformanceChartService, DataEndpoint, _TREE_GRID_RESIZE_INFO_) {
            
        $scope.init = function (item) {
            if (item.isInformationOpen) {
                
                item.isPerformanceLoaded = false;

                var query = [
                    {
                        key: '$filter',
                        value: 'ItemId eq ' + item.id + ' and PerformanceType eq \'' + item.performanceType + '\''
                    },
                    {
                        key: '$orderby',
                        value: 'Date'
                    }
                ];

                DataEndpoint.getTemplatedEndpoint(['bca-trades', 'performance'], query)
                    .then(function(endpointUrl) {
                        $http({
                            method: 'GET',
                            url: endpointUrl
                        }).success(function (data) {
                            item.config = PerformanceChartService.getPerformanceChartConfiguration(data);
                            item.isPerformanceLoaded = true;
                            if ($scope.row !== undefined) {
                                var height = item.config.isPerformanceEmpty ? 300 : 500;
                                $scope.$emit(_TREE_GRID_RESIZE_INFO_, { rowId: $scope.row.id, height: height });
                            }
                        });
                    });                               
            }
        };
    };

    controller.$inject = ['$scope', '$http', 'PerformanceChartService', 'DataEndpoint', '_TREE_GRID_RESIZE_INFO_'];
    return controller;
});