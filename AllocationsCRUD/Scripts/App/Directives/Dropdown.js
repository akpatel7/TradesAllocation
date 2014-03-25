define([
        'angular'
], function (angular) {
    'use strict';   

    return function () {
        return {
            restrict: 'EA',
            scope: {
                items: '=',
                title: '@',
                dropdownClick: '='
            },
            replace: true,
            template:
                '<ul class="bottom nav nav-pills">' +
                    '<li class="dropdown items">' +
                        '<a href="#" class="dropdown-toggle title" data-toggle="dropdown" ng-click="dropdownClick()">{{title}} {{renderCount(itemCount)}} <b class="icon-caret-down"></b></a>' +
                        '<ul class="dropdown-menu pull-right" ng-show="items && items.length > 0">' +
                            '<li class="item" ng-repeat="item in items"><a href="{{item.url}}">{{item.canonicalLabel}}</a></li>' +
                        '</ul>' +
                    '</li>' +
                '</ul>',
            link: function (scope, element) {
                scope.$watch('items', function (newVal, oldVal) {
                    scope.itemCount = newVal === undefined || newVal === null ? undefined : newVal.length;
                });

                scope.renderCount = function (count) {
                    return count === undefined ? '' : '(' + count + ')';
                };
            }
        };
    };
});