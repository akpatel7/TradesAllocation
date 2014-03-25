define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var controller = function ($scope, Portfolio, _TREE_GRID_RESIZE_INFO_) {
        $scope.init = function (item) {
            $scope.item = item;
        };

        $scope.$watch('item.uri', function (newVal) {
            if (newVal) {
                if ($scope.item.relatedViews === undefined) {
                    Portfolio.getPortfolioRelatedViews({
                        uri: newVal
                    }).then(function (data) {
                        var relatedThemes = [];
                        _.each(data, function (view) {
                            relatedThemes = relatedThemes.concat(view.informedByTheme['@set']);
                        });
                        _.extend($scope.item, {
                            relatedViews: data,
                            relatedThemes: _.uniq(relatedThemes, function (theme) {
                                return theme['@id'];
                            })
                        });
                    });
                }

            }

            $scope.$emit(_TREE_GRID_RESIZE_INFO_, { rowId: $scope.row.id, height: 300 });
        });
    };

    controller.$inject = ['$scope', 'Portfolio', '_TREE_GRID_RESIZE_INFO_'];

    return controller;
});