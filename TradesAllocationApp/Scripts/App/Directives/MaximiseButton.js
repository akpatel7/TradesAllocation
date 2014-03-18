define(['angular', 'moment'], function (angular, moment) {
    'use strict';

    return function () {
        return {
            replace: true,
            restrict: 'EA',
            template: '<div class="minimise {{extraClasses}}" title="{{title}}" ng-click="toggle()"><i class="{{toggleClass}}"></i></div>',
            scope: {
                maximised: '=',
                maximiseTitle: '@',
                minimiseTitle: '@',
                isButton: '@'
            },
            link: function (scope, element, attrs) {
                var minimiseClass = 'icon-resize-small',
                    maximiseClass = 'icon-resize-full';
                scope.extraClasses = '';
                
                if (attrs.isButton) {
                    scope.extraClasses = 'btn btn-mini';
                }
                scope.toggle = function() {
                    scope.maximised = !scope.maximised;
                };
                scope.$watch('maximised', function (value) {
                    if (value) {
                        scope.toggleClass = minimiseClass;
                        scope.title = attrs.minimiseTitle;
                    } else {
                        scope.toggleClass = maximiseClass;
                        scope.title = attrs.maximiseTitle;
                    }
                });
            }
        };
    };
});

