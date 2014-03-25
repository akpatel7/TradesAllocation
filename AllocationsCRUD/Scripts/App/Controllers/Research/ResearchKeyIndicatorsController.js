define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var ResearchKeyIndicators = function ($scope, KeyIndicators, UrlProvider) {
        $scope.indicators = [];
        $scope.page = 1;
        $scope.totalCount = 0;
        $scope.indicatorsToShow = $scope.pageSize;
        var loadIndicators = function () {
            KeyIndicators.get({
                viewable: $scope.viewable['@id'],
                page: $scope.page,
                pageSize: $scope.pageSize
            }).then(function (data) {
                _.each(data.indicators, function (indicator) {
                    var chartId = _.last(indicator.link._href.split('/'));

                    _.extend(indicator, {
                        banUrl: UrlProvider.getBanUrl(chartId)
                    });
                    
                    UrlProvider.getChartImageUrl(chartId)
                        .then(function (url) {
                            _.extend(indicator, {
                                image: url
                            });
                        });
                });
                $scope.indicators = $scope.indicators.concat(data.indicators);
                $scope.totalCount = data.totalCount;
            });
        };
       
        $scope.$watch('viewable', function (viewable) {
            if (viewable) {
                $scope.loaded = false;
                loadIndicators();
            }
        });


        $scope.showMore = function () {
            $scope.page++;
            if ($scope.indicators.length < $scope.totalCount) {
                loadIndicators();
            }
        };

    };
    ResearchKeyIndicators.$inject = ['$scope', 'KeyIndicators', 'UrlProvider'];

    return ResearchKeyIndicators;
});