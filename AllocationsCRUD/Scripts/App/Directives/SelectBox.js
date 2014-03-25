define(['angular', 'underscore'
], function (angular, _) {
    'use strict';   

    return function () {
        return {
            restrict: 'EA',
            scope: {
                items: '='
            },
            replace: true,
            template:
                '<ul>' +
                    '<li class="dropdown">' +
                        '<a href="#" class="dropdown-toggle" data-toggle="dropdown">{{activeItem.label}} <b class="icon-caret-down"></b></a>' +
                        '<ul class="dropdown-menu">' +
                            '<li ng-class="{\'active-dropdown\': item.active}" ng-repeat="item in items" >' +
                                '<a href="" ng-click="activate(item)">{{item.label}}</a>' +
                            '</li>' +
                        '</ul>' +
                '</li>' +
            '</ul>',
            link: function (scope, element) {
                scope.$watch('items', function(newVal) {
                    if (newVal) {
                        scope.activeItem = scope.items[0];
                        _.each(scope.items, function(item) {
                            _.extend(item, {
                                active: false
                            });
                        });
                    }
                });

                scope.activate = function(item) {
                    _.each(scope.items, function (current) {
                        current.active = false;
                    });
                    item.active = true;
                    scope.activeItem = item;
                };
            }
        };
    };
});