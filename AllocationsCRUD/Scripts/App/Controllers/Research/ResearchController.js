define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var ResearchController = function ($scope, Viewables, $routeParams, Page, $cookies, Suggest, DominantView, Annotations, AnnotationsSupportUri, FilterValues, ViewEvolution, UrlProvider, $location) {

        $scope.$watch('viewableId', function (viewableId) {
            $scope.viewable = undefined;
            $scope.allViewsUrl = undefined;

            if (viewableId) {
                $scope.allViewsUrl = '/#/views?uri=' + encodeURIComponent(viewableId);
                Viewables.getViewables({
                    includeFacetsCount: false,
                    filters:
                        { 'viewableUri': { 'value': viewableId } }
                }).then(function (data) {
                    $scope.viewable = data.viewables[0];

                    if ($scope.viewable) {
                        _.extend($scope.viewable, {
                            dominantView: DominantView.getDominantView($scope.viewable, false)
                        });

                        if ($scope.viewable.dominantView) {
                            Annotations.getAnnotations({
                                conceptUri: $scope.viewable.dominantView['@id']
                            }).then(function (annotations) {
                                    var supports = _.find(annotations, function(ann) {
                                        return ann.key === AnnotationsSupportUri;
                                    });
                                    if (supports && supports.values && supports.values.length > 0) {
                                        var primarySupport = _.first(supports.values);
                                        _.extend(primarySupport, { liveReportUrl: UrlProvider.getLiveReportUrl(primarySupport.annotationFor['@id']) });
                                        _.extend($scope.viewable, {
                                            primarySupport: primarySupport
                                        });
                                    }
                                });
                            ViewEvolution.getViewEvolution({ uri: [$scope.viewable.dominantView['@id']], restrictToLatestInactiveEvolution: true })
                                .then(function (previousViews) {
                                    _.each(previousViews['@graph'], function(previousView) {
                                        _.extend($scope.viewable.dominantView, { 'previousView': previousView });
                                    });
                                });
                            
                            var viewsByStartDate = _.sortBy($scope.viewable.activeView['@set'], 'lastUpdatedDate').reverse();
                            _.each(viewsByStartDate, function (view, index) {
                                _.extend(view, { displayOrder: index });
                            });

                            var viewUris = _.pluck($scope.viewable.activeView['@set'], '@id');
                            _.extend($scope.viewable, {
                                annotationsLoaded: true
                            });
                            if (_.some(viewUris)) {
                                Annotations.getAnnotations({
                                    conceptUri: viewUris
                                }).then(function(annotations) {
                                        _.each($scope.viewable.activeView['@set'], function(view) {
                                            _.extend(view, {
                                                annotations: annotations[view['@id']]
                                            });
                                        });
                                    });
                            }

                        }
                        
                        Page.setTitle($scope.viewable.canonicalLabel);
                        Page.setLastBreadcrumbs([
                            { name: $scope.viewable.typeLabel, link: '/views?' + FilterValues.getFilterQueryString({ assetClass: $scope.viewable['@type'] }) },
                            { name: $scope.viewable.canonicalLabel }
                        ], true);
                    }
                    else {
                        // viewable api currently doesn't return viewables which have never had any views
                        $scope.viewable = { '@id': viewableId };
                    }
                });
            }
        });

        $scope.$on('$routeChangeStart', function (event, current) {
            $scope.viewableId = current.params.uri;
        });

        $scope.viewableId = $routeParams.uri;
        $scope.showAuthorisedContentOnly = $cookies.showAuthorisedContentOnly === "true";
        $scope.pageSize = 10;

        $scope.toggleShowAuthorisedContentOnly = function () {
            $scope.showAuthorisedContentOnly = !$scope.showAuthorisedContentOnly;
            $cookies.showAuthorisedContentOnly = $scope.showAuthorisedContentOnly.toString();
        };
    };
    ResearchController.$inject = ['$scope', 'Viewables', '$routeParams', 'Page', '$cookies', 'Suggest', 'DominantView', 'Annotations', 'AnnotationsSupportUri', 'FilterValues', 'ViewEvolution', 'UrlProvider', '$location'];

    return ResearchController;
});