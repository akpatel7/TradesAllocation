define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var ResearchPublicationsController = function ($scope, Annotations, UrlProvider) {

        var allAnnotations, allDocuments;

        function convertAnnotations(annotations, showAuthorisedContentOnly) {
            var documents = [];

            if (annotations) {
                if (showAuthorisedContentOnly) {
                    annotations = _.filter(annotations, function (annotation) { return annotation.hasPermission; });
                }

                var annotationsByDocument = _.groupBy(annotations, function (annotation) { return annotation.annotationFor['@id']; });

                documents = _.map(annotationsByDocument, function (docAnnotations) {
                    var authorisedAnnotations = _.filter(docAnnotations, function (annotation) { return annotation.hasPermission; });
                    return _.extend({
                        hasPermission: authorisedAnnotations.length > 0,
                        'snippet': _.first(_.flatten(_.map(_.sortBy(authorisedAnnotations, '@id'), function (annotation) { return _.isObject(annotation.annotationText) ? annotation.annotationText['@set'] : annotation.annotationText; })))
                    }, docAnnotations[0].annotationFor);
                });

                _.each(documents, function (document) {
                    UrlProvider.getReportUrl(document['@id']).then(function (url) { document.reportUrl = url; });
                    if (document.hasPermission) {
                        UrlProvider.getDocumentImageUrl(document['@id']).then(function (url) { document.reportImageUrl = url; });
                    }
                    document.liveReportUrl = UrlProvider.getLiveReportUrl(document['@id']);
                });

                documents = _.sortBy(documents, function (d) { return d.published + '_' + d['@id']; });
                documents.reverse();
            }

            return documents;
        }

        $scope.showMore = function () {

            $scope.pagesShown++;

            var documents = allDocuments, countToDisplay = $scope.pageSize * $scope.pagesShown;

            $scope.documents = _.first(allDocuments, countToDisplay);
            $scope.canShowMore = documents.length > countToDisplay;
        };

        $scope.$watch('viewable', function (viewable) {
            $scope.documents = [];
            $scope.canShowMore = false;
            $scope.loaded = false;

            if (viewable) {
                if (viewable.activeView) {
                    var viewUris = viewable.activeView['@set'] ? _.map(viewable.activeView['@set'], function (view) { return view['@id']; }) :
                                            [viewable.activeView['@id']];

                    Annotations.getAnnotations({
                        conceptUri: viewUris,
                        noGrouping: true
                    }).then(function (annotations) {
                        allAnnotations = annotations;
                        allDocuments = convertAnnotations(allAnnotations, $scope.showAuthorisedContentOnly);
                        $scope.pagesShown = 0;
                        $scope.showMore();
                        $scope.loaded = true;
                    });
                }
                else {
                    $scope.loaded = true;
                }
            }
        });

        $scope.$watch('showAuthorisedContentOnly', function (showAuthorisedContentOnly) {
            allDocuments = convertAnnotations(allAnnotations, showAuthorisedContentOnly);
            $scope.pagesShown = 0;
            $scope.showMore();
        });
    };
    ResearchPublicationsController.$inject = ['$scope', 'Annotations', 'UrlProvider'];

    return ResearchPublicationsController;
});