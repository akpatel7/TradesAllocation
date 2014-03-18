define(['angular', 'underscore'], function (angular, _) {
    'use strict';
    
    function getPageIndexes(values, pageSize) {
        return _.range(Math.ceil(values.length / pageSize));
    }

    var directive = function () {
        return {
            replace: false,
            restrict: 'EA',
            template:
                        '<ul ng-repeat="pageIndex in getPageIndexes(items, pageSize)">' +
                            '<li ng-repeat="item in items | startFrom: pageSize*pageIndex | limitTo: pageSize" ng-class=" { \'selected\' : item.isSelected } ">' +
                                '<a href="" ng-click="selectItem(item, $event)">{{item.label}} <span ng-if="showFacetCount" class="facet-count">({{item.count}})</span> <i ng-class=" { \'icon-remove\' : item.isSelected } "></i></a>' +
                            '</li>' +
                        '</ul>' +
                        '<ul ng-if="!items || items.length == 0" class="empty"></ul>',
            scope: {
                value: '=',
                showFacetCount: '@'
            },
            link: function (scope, element, attrs) {
                
                scope.items = [];
                scope.pageSize = 10;
                scope.getPageIndexes = getPageIndexes;
                
                scope.$watch('value', function (newVal) {
                    if (newVal) {
                        var items = [];
                        _.each(scope.value.values, function (v, key) {
                            if (typeof v !== 'object') {
                                items.push({
                                    key: key,
                                    label: v,
                                    isSelected: scope.value.value === key,
                                    count: 0
                                });
                            } else {
                                items.push({
                                    key: key,
                                    label: v.label,
                                    isSelected: scope.value.value === key,
                                    count: v.count
                                });
                            }
                           
                        });
                        scope.items = items;
                    }
                }, true);
                scope.selectItem = function (item, $event) {
                    
                    if (scope.value.value === item.key) {
                        scope.value.value = undefined;
                    } else {
                        scope.value.value = item.key;
                    }
                    
                    _.each(scope.items, function(current) {
                        current.isSelected = scope.value === current.key;
                    });

                };
            }
        };
    };
    directive.$inject = [];
    return directive;
});

