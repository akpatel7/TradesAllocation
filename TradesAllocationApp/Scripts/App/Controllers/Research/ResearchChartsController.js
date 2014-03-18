define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var ResearchChartsController = function ($scope, Annotations, Charts, $http, DataEndpoint, UrlProvider, UserService) {
        var parseChartId = function (annotation) {
            return _.last(annotation['@id'].split('/')).toLowerCase();
        };
        $scope.charts = [];
        $scope.visibleCharts = [];
        $scope.$watch('viewable', function (viewable) {
            $scope.loaded = false;
            if (viewable !== undefined) {
                var charts = [];
                Annotations.getAnnotations({
                    conceptUri: viewable['@id'],
                    noGrouping: true
                }).then(function(annotationResults) {
                        UserService.isCurrentUserAuthorisedToSeeCharts().then(function(isCurrentUserAuthorisedToSeeCharts) {
                            _.each(annotationResults, function(annotation) {
                                if (annotation.annotationFor.hasOwnProperty('@set')) {
                                    _.each(annotation.annotationFor['@set'], function(current) {
                                        if (_.find(charts, function(c) {
                                            return parseChartId(c.annotation) === parseChartId(current);
                                        }) === undefined) {
                                            charts.push({
                                                valid: true,
                                                annotation: current,
                                                hasPermission: current.hasPermission && isCurrentUserAuthorisedToSeeCharts
                                            });
                                        }

                                    });
                                } else {
                                    if (_.find(charts, function(c) {
                                        return parseChartId(c.annotation) === parseChartId(annotation.annotationFor);
                                    }) === undefined) {
                                        charts.push({
                                            valid: true,
                                            annotation: annotation.annotationFor,
                                            hasPermission: annotation.hasPermission && isCurrentUserAuthorisedToSeeCharts
                                        });
                                    }
                                }
                            });
                            $scope.charts = _.sortBy(charts, function(chart) {
                                return chart.annotation.published;
                            }).reverse();
                            $scope.chartsToShow = $scope.pageSize;
                            $scope.loaded = true;
                        });
                    });
            }

        });

        $scope.$watch(function() {
            return $scope.chartsToShow;
        }, function() {
            $scope.visibleCharts = $scope.charts.slice(0, $scope.chartsToShow);
        });

        $scope.$watch('visibleCharts', function () {
           
            _.each($scope.visibleCharts, function (chart) {
                if (!chart.hasOwnProperty('image')) {
                    var chartId = parseChartId(chart.annotation);
                    _.extend(chart, {
                        chartUrl: UrlProvider.getBanUrl(chartId)
                    });
                    if (chart.hasPermission === true) {
                        UrlProvider.getChartImageUrl(chartId)
                            .then(function(url) {
                                _.extend(chart, {
                                    image: url
                                });
                            });
                    }
                    
                    Charts.getChart({ id: chartId })
                        .then(function (chartData) {
                            var documentLink = DataEndpoint._findLink('document', chartData.link);
                            if (documentLink !== undefined && documentLink !== null && chart.hasPermission === true) {
                                $http({
                                    method: 'GET',
                                    url: documentLink._href
                                }).success(function (data) {
                                    if (data.document !== undefined) {
                                        _.extend(chart, {
                                            reportPublishedIn: data.document.entry.title,
                                            reportUrl: UrlProvider.getLiveReportUrl(data.document._id)
                                        });
                                    }
                                });
                            }
                            _.extend(chart, {
                                title: $scope._parseChartTitle(chartData)
                            });
                        }, function(data) {
                            _.extend(chart, {
                                valid: false
                            });
                        });
                }
                
            });
        });
       
        $scope._parseChartTitle = function (chartData) {
            if (_.isArray(chartData.title.text)) {
                return chartData.title.text[0];
            }
            return chartData.title.text;
        };

        $scope.showMore = function () {
            $scope.chartsToShow += $scope.pageSize;
        };

        $scope.$watch('[charts, chartsToShow]', function () {
            $scope.canShowMore = $scope.charts && ($scope.charts.length > $scope.chartsToShow);
        }, true);

    };
    ResearchChartsController.$inject = ['$scope', 'Annotations', 'Charts', '$http', 'DataEndpoint', 'UrlProvider', 'UserService'];

    return ResearchChartsController;
});