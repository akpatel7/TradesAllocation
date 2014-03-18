define(['angular'], function (angular) {
    'use strict';

    return function () {
        return {
            restrict: 'EA',
            template: '<div>' +
                    '<div>{{wrappedContent}}</div>' +
                    '<a ng-if="expandable" href="" ng-click="toggle()" class="hide">{{toggleText}} <i class="{{toggleClass}}"></i></a>' +
                '</div>',
            scope: {
                maxLength: '@',
                content: '@',
                expandable: '@'
            },
            link: function (scope, element, attrs) {
                scope.minimised = false;
                scope.$watch('content', function (value) {
                    if (value !== undefined) {
                        var length = (attrs.maxLength === '' || attrs.maxLength === undefined) ? 1000 : attrs.maxLength;
                        if (value.length > length) {
                            scope.wrappedContent = value.substring(0, length) + '...';
                            element.children().find('a').show();
                            scope.minimised = true;
                        } else {
                            scope.wrappedContent = value;
                        }
                    }
                });
                scope.$watch('minimised', function(value) {
                    if (value === true) {
                        scope.toggleText = 'MORE';
                        scope.toggleClass = 'icon-chevron-down';
                    } else {
                        scope.toggleText = 'LESS';
                        scope.toggleClass = 'icon-chevron-up';
                    }
                });
                scope.toggle = function () {
                    scope.minimised = !scope.minimised;
                    if (!scope.minimised) {
                        scope.wrappedContent = scope.content;
                    } else {
                        var length = (attrs.maxLength === '' || attrs.maxLength === undefined) ? 1000 : attrs.maxLength;
                        scope.wrappedContent = scope.content.substring(0, length) + '...';
                    }
                };
            }
        };
    };
});

