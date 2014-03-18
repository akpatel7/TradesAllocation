define(['angular', 'moment'], function (angular, moment) {
    'use strict';

    return function () {
        return {
            replace: true,
            restrict: 'EA',
            template: '<div class="minimise {{extraClasses}}" title="{{title}}" ng-click="toggle()"><i class="{{toggleClass}}"></i></div>',
            scope: {
                expanded: '=',
                expandTitle: '@',
                collapseTitle: '@',
                isDouble: '@',
                isButton: '@'
            },
            link: function (scope, element, attrs) {
                var collapseClass = 'icon-minus',
                    expandClass = 'icon-plus';
                scope.extraClasses = '';
                
                if (attrs.isDouble) {
                    collapseClass = 'icon-double-angle-down';
                    expandClass = 'icon-double-angle-up';
                }
                
                if (attrs.isButton) {
                    scope.extraClasses = 'btn btn-mini';
                }
                scope.toggle = function() {
                    scope.expanded = !scope.expanded;
                };
                scope.$watch('expanded', function (value) {
                    if (value) {
                        scope.toggleClass = collapseClass;
                        scope.title = attrs.collapseTitle;
                    } else {
                        scope.toggleClass = expandClass;
                        scope.title = attrs.expandTitle;
                    }
                });
            }
        };
    };
});

