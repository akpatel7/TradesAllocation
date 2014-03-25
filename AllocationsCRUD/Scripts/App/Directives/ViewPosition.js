define(['angular'], function() {
        'use strict';

        var directive = function (View) {
            return {
                restrict: 'A',
                replace: true,
                scope: { view: '=', mode: '@', previousView: '=' },
                template: '' +
                    '<span class="view-position" data-canonical-label="{{viewPositionName}}">' +
                    '    <span ng-if="prevPositionValue !== null" class="position-change view-position-change-icon-{{prevPositionValue}}-{{viewPositionValue}}"></span>' +
                    '    <span class="view-position-icon view-position-icon-{{viewPositionValue}}"></span>' +
                    '</span>',
                link: function (scope, element, attrs) {
                    scope.viewPositionName = null;
                    scope.viewPositionValue = null;
                    scope.prevPositionValue = null;

                    scope.$watch('view', function () {
                        if (scope.view) {
                            var currentPosition = View.getPositionWithName(scope.view);

                            scope.viewPositionName = currentPosition.name;
                            scope.viewPositionValue = currentPosition.value + 1;
                        }
                    });

                    scope.$watch('previousView', function() {
                        if (scope.previousView) {
                            var previousPosition = View.getPositionWithName(scope.previousView);
                            scope.prevPositionValue = previousPosition.value + 1;
                        }
                    });
                }
            };
        };

        directive.$inject = ['View'];
        return directive;

    });

