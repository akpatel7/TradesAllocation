define(['angular'], function(angular) {
    'use strict';

    var controller = function($scope, $http, DataEndpoint, $q) {
        var tradeLine;
        var queryOptions = {
            firstTake: 5,
            subsequentTake: 10
        };
        
        $scope.isLoading = false;

        function getTake() {
            if (tradeLine.tradeHistory.takeCount > 0) {
                return queryOptions.subsequentTake;
            }
            return queryOptions.firstTake;
        }

        function loadData(append) {
            $scope.isLoading = true;
            var take = getTake();
            
            DataEndpoint.getEndpoint('trade-history')
                .then(function (url) {
                    $http({
                        method: 'GET',
                        url: url,
                        params: {
                            '$filter': 'trade_id eq ' + tradeLine.trade.trade_id,
                            '$orderby': 'date desc',
                            '$top': take,
                            '$skip': tradeLine.tradeHistory.data ? tradeLine.tradeHistory.data.length : 0,
                            '$inlinecount': 'allpages'
                        }
                    }).success(function(data) {
                        if (!append || tradeLine.tradeHistory.data === undefined) {
                            tradeLine.tradeHistory.data = [];
                        }
                        tradeLine.tradeHistory.data = tradeLine.tradeHistory.data.concat(data.value);
                        tradeLine.tradeHistory.totalCount = parseInt(data['odata.count'], 10);
                        tradeLine.tradeHistory.takeCount += 1;
                        $scope.isLoading = false;
                    });

                });
        }

        $scope.init = function(item) {
            tradeLine = item;
            
            if (tradeLine.tradeHistory === undefined) {
                tradeLine.tradeHistory = {
                    data: undefined, 
                    totalCount: 0, 
                    takeCount: 0
                };
            }

            $scope.tradeHistory = tradeLine.tradeHistory;
            
            if (tradeLine.tradeHistory.data === undefined) {
                loadData();
            }
        };

        $scope.fetchNextPage = function() {
            if ($scope.isLoading || $scope.hasMoreResults() === false) {
                return;
            }
            loadData(true);
        };

        $scope.hasMoreResults = function () {
            return tradeLine.tradeHistory.totalCount > tradeLine.tradeHistory.data.length;
        };
    };

    controller.$inject = ['$scope', '$http', 'DataEndpoint', '$q'];
    return controller;
});