define(['angular', 'underscore'], function (angular, _) {
    'use strict';


    var annotationsController = function ($scope, AnnotationsCounterArgumentUri, AnnotationsScenarioUri, AnnotationsSupportUri, AnnotationsMentionUri, UrlProvider, StrategicViewUri, AnnotationsTabService) {
        $scope.activeAnnotation = undefined;
       
        $scope.activate = function (annotations, annotationsTab, $event) {
            $scope.annotations = annotations;

            if (annotationsTab === null || annotationsTab === undefined) {
                $scope.activeAnnotation = AnnotationsTabService.activate($scope.annotations, AnnotationsSupportUri, AnnotationsScenarioUri, AnnotationsCounterArgumentUri, AnnotationsMentionUri);
                $scope.annotationsVisible = !$scope.annotationsVisible;
            } else {
                var uri = annotationsTab.key;
               
                if ($event !== undefined && $event !== null) {
                    $event.stopPropagation();
                }

                if ($scope.annotationsVisible && $scope.activeAnnotation !== undefined && $scope.activeAnnotation.key === uri) {
                    $scope.annotationsVisible = false;
                    $scope.activeAnnotation = undefined;
                } else {
                    $scope.activeAnnotation = AnnotationsTabService.activate(annotations, uri);

                    $scope.annotationsVisible = true;
                }
            }
        };


        $scope.$watch('annotations', function (newVal) {
            if (newVal) {
                var count = function (items, uri) {
                    var annotations = _.find(items, function (item) {
                        return item.key === uri;
                    });
                    if (annotations !== undefined && annotations !== null && annotations.values !== undefined) {
                        return annotations.values.length;
                    }
                    return 0;
                };
                $scope.supportsCount = count(newVal, AnnotationsSupportUri);
                $scope.scenariosCount = count(newVal, AnnotationsScenarioUri);
                $scope.countersCount = count(newVal, AnnotationsCounterArgumentUri);
                $scope.mentionsCount = count(newVal, AnnotationsMentionUri);
                
                _.each($scope.annotations, function (annotations) {
                    var hasPermission = _.find(annotations.values, function(annotation) {
                        return annotation.hasPermission;
                    }) !== undefined;
                    _.extend(annotations, {
                        hasPermission: hasPermission
                    });
                    
                    _.each(annotations.values, function (annotation) {
                        var liveReport = UrlProvider.getLiveReportUrl(annotation.annotationFor['@id']);
                        _.extend(annotation, {
                            liveReportUrl: liveReport
                        });
                        if (annotation.annotationFor !== undefined) {
                            UrlProvider.getReportUrl(annotation.annotationFor['@id'])
                                .then(function (url) {
                                    _.extend(annotation, {
                                        reportUrl: url
                                    });
                                });
                        }

                    });
                    
                   
                });
                
                if ($scope.activeAnnotation === undefined) {
                    $scope.activeAnnotation = AnnotationsTabService.activate($scope.annotations, AnnotationsSupportUri, AnnotationsScenarioUri, AnnotationsCounterArgumentUri, AnnotationsMentionUri);
                }
            }
        });
        
        $scope.$watch(function() {
            return {
                values: _.pluck($scope.annotations, 'active')
            };
        }, function (newVal) {
            $scope.activeAnnotation = _.find($scope.annotations, function (annotation) {
                return annotation.active;
            });
        }, true);
       
    };

    annotationsController.$inject = ['$scope', 'AnnotationsCounterArgumentUri', 'AnnotationsScenarioUri', 'AnnotationsSupportUri', 'AnnotationsMentionUri', 'UrlProvider', 'StrategicViewUri', 'AnnotationsTabService'];

    return annotationsController;
});