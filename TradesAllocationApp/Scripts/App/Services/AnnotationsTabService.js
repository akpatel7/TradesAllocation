define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var service = function (AnnotationsSupportUri, AnnotationsScenarioUri, AnnotationsCounterArgumentUri, AnnotationsMentionUri) {
        return {
            convertToUri: function (contentType) {
                var uri;
                switch (contentType) {
                    case 'supports':
                        uri = AnnotationsSupportUri;
                        break;
                    case 'scenarios':
                        uri = AnnotationsScenarioUri;
                        break;
                    case 'counters':
                        uri = AnnotationsCounterArgumentUri;
                        break;
                    case 'mentions':
                        uri = AnnotationsMentionUri;
                        break;
                    case AnnotationsCounterArgumentUri:
                    case AnnotationsScenarioUri:
                    case AnnotationsSupportUri:
                    case AnnotationsMentionUri:
                        uri = contentType;
                        break;
                    default:
                        uri = undefined;
                        break;
                }
                return uri;
            },
            activate: function () {
                var annotations = arguments[0],
                    uri = arguments[1];
                
                var activeAnnotation;

                _.each(annotations, function (annotation) {
                    annotation.active = false;
                });
                activeAnnotation = _.find(annotations, function (annotation) {
                    return annotation.key === uri;
                });
                
                if (activeAnnotation !== undefined && activeAnnotation !== null && activeAnnotation.values.length > 0) {
                    activeAnnotation.active = true;
                    return activeAnnotation;
                } else {
                    if (arguments.length > 2) {
                        var newArgs = _.without(arguments, arguments[1]);
                        return this.activate.apply(this, newArgs);
                    }
                }
                return undefined;
            }
        };
    };
    service.$inject = ['AnnotationsSupportUri', 'AnnotationsScenarioUri', 'AnnotationsCounterArgumentUri', 'AnnotationsMentionUri'];
    return service;
});