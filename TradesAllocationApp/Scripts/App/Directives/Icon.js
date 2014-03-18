define(['angular', 'moment'], function (angular, moment) {
    'use strict';

    return function () {
        return {
            replace: true,
            restrict: 'EA',
            template: '<i class="{{toggleClass}}" title="{{title}}"><span ng-transclude/></i>',
            transclude: true,
            scope: {
                state: '=',
                onTitle: '@',
                offTitle: '@',
                onIcon: '@',
                onHoverIcon: '@',
                offIcon: '@',
                offHoverIcon: '@',
                content: '&'
            },
            link: function (scope, element, attrs) {
                
                element.bind('mouseenter', function () {
                    if (scope.state === true && attrs.onHoverIcon) {
                        scope.$apply(function () {
                            scope.toggleClass = attrs.onHoverIcon;
                        });
                    } else if (scope.state === false && attrs.offHoverIcon) {
                        scope.$apply(function () {
                            scope.toggleClass = attrs.offHoverIcon;
                        });
                    }
                });

                element.bind('mouseout', function () {
                    if (scope.state === true && attrs.onIcon) {
                        scope.$apply(function () {
                            scope.toggleClass = attrs.onIcon;
                        });
                    } else if (scope.state === false && attrs.offIcon) {
                        scope.$apply(function () {
                            scope.toggleClass = attrs.offIcon;
                        });
                    }
                });
                
                scope.$watch('state', function (value) {
                    if (value) {
                        scope.toggleClass = attrs.onIcon;
                        scope.title = attrs.onTitle;                        
                    } else {
                        scope.toggleClass = attrs.offIcon;
                        scope.title = attrs.offTitle;
                    }
                });
            }
        };
    };
});

