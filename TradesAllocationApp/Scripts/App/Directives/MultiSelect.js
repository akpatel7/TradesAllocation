define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var directive = function () {
        return {
            replace: false,
            restrict: 'EA',
            template: '<ul ng-class=" { \'empty\': !values || values.length == 0 } ">' +
                            '<li ng-repeat="value in values" ng-class=" { \'selected\' : value.isSelected } " >' +
                                '<a href="" ng-click="value.isSelected = !value.isSelected">{{value.label}} <span ng-if="showFacetCount" class="facet-count">({{value.count}})</span> <i ng-class=" { \'icon-remove\' : value.isSelected } "></i></a>' +
                            '</li>' +
                       '</ul>',
            scope: {
                values: '=',
                showFacetCount: '@'
            },
            link: function (scope, element, attrs) {
            }
        };
    };
    directive.$inject = [];
    return directive;
});

