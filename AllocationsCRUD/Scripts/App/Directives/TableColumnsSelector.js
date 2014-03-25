define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var directive = function () {
        return {
            restrict: 'A',
            scope: {
                columns: '=',
                selectCallback: '&',
                moveCallback: '&'
            },
            priority: 100,
            template:
                    '<ul class="columns-list">' +
                        '<li ng-repeat="item in disabledColumns" class="selected disabled">' +
                            '<label class="checkbox">' +
                                '<input type="checkbox" ng-model="item.isSelected" ng-disabled="item.isDisabled" />' +
                                '{{item.label}}' +
                            '</label>' +
                        '</li>' +
                        '<li class="divider"></li>' +
                    '</ul>' +
                    '<ul class="columns-list" ui-sortable="sortableOptions" ng-model="sortedColumns">' +                        
                        '<li ng-repeat="item in sortedColumns" ng-class="{ selected: item.isSelected }">' +
                            '<label class="checkbox">' +                                
                                '<input type="checkbox" ng-model="item.isSelected" ng-disabled="item.isDisabled" ng-change="onChange(item)" />' +
                                '<span class="pull-left">{{item.label}}</span>' +
                                '<i class="icon-reorder pull-right"></i>' +
                            '</label>' +                            
                        '</li>' +
                      '</ul>',
            link: function (scope, element, attrs) {
                var currentItem;
                scope.sortedColumns = _.chain(scope.columns)
                    .sortBy('ordinal')
                    .filter(function(col) {
                        return !col.isDisabled;
                    })
                    .value();

                scope.disabledColumns = _.chain(scope.columns)
                    .sortBy('ordinal')
                    .filter(function(col) {
                        return col.isDisabled;
                    })
                    .value();
                
                scope.onChange = function (item) {
                    scope.$eval(scope.selectCallback({ column: item }));
                };

                scope.$watchCollection('sortedColumns', function (newOrderedCols) {
                    if (currentItem !== undefined) {
                        _.each(newOrderedCols, function (col, index) {
                            scope.columns[col.key].ordinal = (index + scope.disabledColumns.length);
                        });

                        var args = {
                            previous: scope.sortedColumns[currentItem.ordinal - scope.disabledColumns.length - 1],
                            current: currentItem,
                            next: scope.sortedColumns[currentItem.ordinal - scope.disabledColumns.length + 1]
                        };
                        scope.$eval(scope.moveCallback({ args: args }));
                        currentItem = undefined;
                    }
                });

                scope.sortableOptions = {
                    axis: 'y',
                    update: function (e, ui) {
                        currentItem = ui.item.scope().item;
                    }
                };
            }
        };
    };
    
    directive.$inject = [];
    return directive;
});

