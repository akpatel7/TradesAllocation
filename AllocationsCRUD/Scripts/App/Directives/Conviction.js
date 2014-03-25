define(['angular'], function() {
    'use strict';

    var directive = function(View) {
        return {
            restrict: 'A',
            scope: { viewConviction: '=', previousConviction: '=' },
            replace: true,
            template: '' +
                '<span class="view-conviction" ng-switch="selectedMode" data-canonical-label="{{viewConviction.canonicalLabel}}">' +
                '    <span class="view-conviction-icon view-conviction-icon-{{convictionValue}}"></span>' +
                '    <span ng-if="previousConvictionValue !== null" class="view-conviction-change-icon view-conviction-change-icon-{{previousConvictionValue}}-{{convictionValue}}"></span>' +
                '</span>',
            link: function(scope) {
                scope.convictionValue = 1;
                scope.previousConvictionValue = null;

                scope.$watch('viewConviction', function() {
                    if (scope.viewConviction) {
                        scope.convictionValue = View.getConviction({ viewConviction: scope.viewConviction });
                    }
                });

                scope.$watch('previousConviction', function() {
                    if (scope.previousConviction) {
                        scope.previousConvictionValue = View.getConviction({ viewConviction: scope.previousConviction });
                    }
                });
            }
        };
    };

    directive.$inject = ['View'];
    return directive;
});

