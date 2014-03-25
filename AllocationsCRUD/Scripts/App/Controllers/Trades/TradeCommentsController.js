define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var controller = function ($scope, DataEndpoint, $http) {
        var lineItem;

        function loadComments() {
            DataEndpoint.getEndpoint('trade-comments')
                .then(function (url) {
                    $http({
                        method: 'GET',
                        url: url,
                        params: {
                            '$filter': 'trade_id eq ' + lineItem.trade.trade_id,
                            '$orderby': 'created_on desc',
                            '$inlinecount': 'allpages',
                            '$top': lineItem.tradeComments.take,
                            '$skip': lineItem.tradeComments.skip
                        }
                    }).success(function (data) {
                        lineItem.tradeComments.comments = (lineItem.tradeComments.comments || []).concat(data.value);
                        lineItem.tradeComments.totalItems = parseInt(data['odata.count'], 10);
                        lineItem.tradeComments.skip = lineItem.tradeComments.comments.length;
                    });
                });
        }

        $scope.init = function (item) {
            lineItem = item;

            if (lineItem.tradeComments === undefined) {
                lineItem.tradeComments = {
                    skip: 0,
                    take: 5,
                    totalItems: 0
                };
            }

            $scope.tradeComments = lineItem.tradeComments;
            loadComments();
        };

        $scope.showMore = function () {
            lineItem.tradeComments.take += 10;
            loadComments();
        };
    };

    controller.$inject = ['$scope', 'DataEndpoint', '$http'];
    return controller;
});