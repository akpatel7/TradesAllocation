define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var ResearchTradesController = function ($scope, Trades) {
        $scope.trades = [];
        $scope.page = 0;
        var loadPageOfTrades = function() {
            Trades.loadTrades({
                filter: 'isOpen eq true and TradeLines/any(x:x/tradable_thing_uri eq \'' + $scope.viewable['@id'] + '\')',
                page: $scope.page,
                pageSize: $scope.pageSize
            }).then(function (data) {
                var pageOfTrades = _.map(data.data.value, function (v) {
                    return {
                        type: v.length_type_label,
                        tradeStructure: v.structure_type_label,
                        description: v.trade_editorial_label,
                        service: v.service_code,
                        performance: v.absolute_performance !== null ? v.absolute_performance + ' ' + v.absolute_measure_type : '',
                        lastUpdated: v.last_updated,
                        url: '#/trade/' + v.trade_id
                    };
                });
                $scope.trades = _.union($scope.trades, pageOfTrades);
                $scope.page++;
                $scope.totalCount = parseInt(data.data['odata.count'], 0);
                $scope.loaded = true;
            });
        };
        $scope.$watch('viewable', function (newVal) {
            if (newVal) {
                $scope.page = 0;
                loadPageOfTrades();
            }
        });
        $scope.$watch('page', function (newVal) {
            $scope.canShowMore = $scope.page * $scope.pageSize < $scope.totalCount;
        });
        
        $scope.$watch('showAuthorisedContentOnly', function () {
        });

        $scope.showMore = function () {
            if ($scope.canShowMore) {
                loadPageOfTrades();
            }
        };
    };
    ResearchTradesController.$inject = ['$scope', 'Trades'];

    return ResearchTradesController;
});