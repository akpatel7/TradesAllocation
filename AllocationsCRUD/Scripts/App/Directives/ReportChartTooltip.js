define(['angular', 'moment'], function (angular, moment) {
    'use strict';

    return function () {
        return {
            restrict: 'EA',
            template: '<div class="tooltip-container report-tooltip">' +
                            '<div class="title">{{annotation.annotationFor.title}}</div>' +
                            '<div class="tooltip-body">' +
                                '<span class="date-label">Published</span>' +
                                '<span class="date published-date" date="annotation.annotationFor.published"></span>' +
                                '<span class="date-label">Snippet</span>' +
                                '<div class="snippet">{{annotation.annotationText}}</div>' +
                            '</div>' +
                    '</div>',
            scope: { annotation: '=' },
            link: function (scope, element, attrs) {
            }
        };
    };
});

