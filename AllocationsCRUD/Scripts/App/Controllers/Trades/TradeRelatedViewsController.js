define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var controller = function ($scope, DataEndpoint, $http, View) {
        $scope.relationType = 'views';
        $scope.parenthesis = function(str, n) {
            return str && str.length > n ? str.substring(0, n) + "..." : str;
        };

        $scope.init = function(item) {
            if (item.isInformationOpen && (item.relatedViews === undefined || item.relatedViews.length === 0)) {
                DataEndpoint.getTemplatedEndpoint('trade-relations', [{ key: 'uri', value: item.trade.trade_uri }])
                    .then(function(url) {
                        $http.get(url).success(function(data) {
                            _.each(data['@graph'], function(views) {
                                if (views.informedByView !== undefined) {
                                    if (_.isArray(views.informedByView['@set'])) {
                                        item.relatedViews = views.informedByView['@set'];
                                    } else {
                                        item.relatedViews = [views.informedByView];
                                    }
                                }

                                var appendTheme = function(theme) {
                                    var found = _.find(item.relatedThemes, function(item) {
                                        return theme['@id'] === item['@id'];
                                    }) !== undefined;

                                    if (!found) {
                                        if (item.relatedThemes === undefined) {
                                            item.relatedThemes = [];
                                        }
                                        item.relatedThemes.push(theme);
                                    }
                                };

                                _.each(item.relatedViews, function(view) {
                                    view.positionValue = View.getPosition(view) + 1;
                                    view.convictionValue = View.getConviction(view);

                                    if (view.informedByTheme !== undefined) {
                                        if (_.isArray(view.informedByTheme['@set'])) {
                                            _.each(view.informedByTheme['@set'], appendTheme);
                                        } else {
                                            appendTheme(view.informedByTheme);
                                        }
                                    }
                                });
                            });
                        });
                    });
            }
        };
    };

    controller.$inject = ['$scope', 'DataEndpoint', '$http', 'View'];
    return controller;
});