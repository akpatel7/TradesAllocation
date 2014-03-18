define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var controller = function ($scope, Annotations, _TREE_GRID_RESIZE_INFO_) {
        Annotations.getAnnotations({
            conceptUri: $scope.item.uri
        }).then(function (data) {
            $scope.annotations = data;
            $scope.$emit(_TREE_GRID_RESIZE_INFO_, { rowId: $scope.row.id, height: 300 });
        });
    };

    controller.$inject = ['$scope', 'Annotations', '_TREE_GRID_RESIZE_INFO_'];
    return controller;
});