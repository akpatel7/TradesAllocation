define(['angular', 'underscore', 'jquery', 'App/Helpers/String'], function (angular, _, $, String) {
    'use strict';

    var urlProvider = function ($q, dataEndpointService, authorisationService, config, IsisConsumerId) {
        return {
            _extractDocumentId: function (uri) {
                var index;

                if (uri.indexOf('http') >= 0) {
                    index  = _.lastIndexOf(uri, '/'); 
                }
                else {
                    index = _.lastIndexOf(uri, ':');
                }

                return uri.substring(index + 1, uri.length);
            },
            getBanUrl: function(chartId) {
                return config.banBaseUrl + '/charts/' + chartId;
            },
            getLiveReportUrl: function(reportId) {
                var documentId = this._extractDocumentId(reportId);
                
                return String.trimEnd(config.reportsBaseUrl, '/') + '/#/reports/' + documentId;
            },
            getReportUrl: function (reportId) {
                var deferred = $q.defer(),
                    documentId = this._extractDocumentId(reportId);

                dataEndpointService.getTemplatedEndpoint('document', [
                    { key: 'id', value: documentId }
                ]).then(function (result) {
                    var encodedAuth = authorisationService.getAuthorisationToken(true),
                        url = result + '/pdf?auth=' + encodedAuth + '&consumerid=' + IsisConsumerId;
                    deferred.resolve(url);
                });
                return deferred.promise;
            },
            getDocumentImageUrl: function (documentUri) {
                var deferred = $q.defer(),
                    documentId = this._extractDocumentId(documentUri);

                dataEndpointService.getTemplatedEndpoint('document', [{ key: 'id', value: documentId }])
                    .then(function(result) {
                        var encodedAuth = authorisationService.getAuthorisationToken(true),
                            url = result + '/thumb?auth=' + encodedAuth + '&consumerid=' + IsisConsumerId;
                        deferred.resolve(url);
                    });
                return deferred.promise;
            },
            getChartImageUrl: function(chartId) {
                var deferred = $q.defer();

                dataEndpointService.getTemplatedEndpoint(['charts', 'chart'], [
                    { key: 'id', value: chartId }
                ]).then(function (result) {
                    var encodedAuth = authorisationService.getAuthorisationToken(true),
                        url = result + '/image?auth=' + encodedAuth + '&consumerid=' + IsisConsumerId;
                    deferred.resolve(url);
                });
                return deferred.promise;
            },
            getViewHistoryExcelExportUrl: function (viewableIds, recommendationType, categories, showAll) {
                var deferred = $q.defer();

                dataEndpointService.getTemplatedEndpoint('views', [
                    { key: 'on', value: viewableIds },
                    { key: 'includeAnnotations', value: true },
                    { key: 'recommendationType', value: recommendationType },
                    { key: 'format', value: 'xlsx' },
                    { key: 'categories', value: categories, complex : true },
                    { key: 'includeEvolvedViews', value: showAll },
                    { key: 'defaultViewRecommendationType', value: true }
                ]).then(function (result) {
                    var encodedAuth = authorisationService.getAuthorisationToken(true),
                        url = result + '&auth=' + encodedAuth + '&consumerid=' + IsisConsumerId;

                    deferred.resolve(url);
                });
                return deferred.promise;
            },
            getTradesExportUrl: function(baseUrl, params, columns) {
                var exportOptions = {
                    '$orderby': params['$orderby'] || 'last_updated desc',
                    '$filter': params['$filter'],
                    '$expand': params['$expand'],
                    'showFavouritesOnly': params.showFavouritesOnly,
                    'showFollowsOnly': params.showFollowsOnly,
                    'export': true,
                    'auth': authorisationService.getAuthorisationToken(true),
                    'consumerid': IsisConsumerId
                };

                return baseUrl + '?' + $.param(exportOptions) + '&columns=' + columns.join(',');
            }
        };
    };

    urlProvider.$inject = ['$q', 'DataEndpoint', 'authorisationService', 'config', 'IsisConsumerId'];
    
    return urlProvider;
});