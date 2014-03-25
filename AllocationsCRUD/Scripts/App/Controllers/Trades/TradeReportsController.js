define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var controller = function ($scope, Annotations, DataEndpoint, UrlProvider, authorisationService, IsisConsumerId) {
        var lineItem;

        $scope.reportType = 'support';
        
        var getValues = function(data, type, target) {
            var values = _.find(data, function (i) { return i.key === "http://data.emii.com/annotation-types/" + type; });
            if (values !== undefined && values !== null) {
                target[type] = _.sortBy(values.values, function (ann) {
                    return ann.annotationFor.published;
                }).reverse();
            }
        };

        function loadAnnotations() {
            if (lineItem.isInformationOpen) {
                Annotations.getAnnotations({
                    conceptUri: lineItem.trade.trade_uri
                }).then(function (data) {
                    var reports = {};

                    getValues(data, 'support', reports);
                    getValues(data, 'counter-argument', reports);
                    getValues(data, 'scenario', reports);
                    getValues(data, 'mention', reports);

                    _.each(_.union(reports['support'], reports['counter-argument'], reports['scenario'], reports['mention']), function (report) {
                        report.liveReportUrl = UrlProvider.getLiveReportUrl(report['@id']);
                        DataEndpoint.getTemplatedEndpoint(['documents', 'pdf'], [{ key: 'id', value: UrlProvider._extractDocumentId(report['@id']).replace(new RegExp('#[0-9]*', 'gm'), '') }])
                            .then(function (url) {
                                report.pdfUrl = url + '?auth=' + authorisationService.getAuthorisationToken(true) + '&consumerid=' + IsisConsumerId;
                            });
                    });

                    lineItem.tradeReports.reports = reports;
                });
            }
        }

        $scope.init = function (item) {
            lineItem = item;

            if (lineItem.tradeReports === undefined) {
                lineItem.tradeReports = {};
            }
            $scope.tradeReports = lineItem.tradeReports;

            loadAnnotations();
        };
    };

    controller.$inject = ['$scope', 'Annotations', 'DataEndpoint', 'UrlProvider', 'authorisationService', 'IsisConsumerId'];
    return controller;
});