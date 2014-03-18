define(['angular', 'underscore', 'App/Helpers/Math'], function (angular, _, mathHelper) {
    'use strict';

    var controller = function ($scope, $rootScope, TradesColumns, _TRADE_MOVE_COLUMN_, _TRADE_SET_HEADER_WIDTHS_, _TOGGLING_TRADE_FILTER_, _TRADE_TOGGLE_COLUMN_, _TRADE_BUILD_EXPORT_URL_) {
        $scope.columns = {};
        $scope.columnsAsSortedArray = [];
        var orderChanged = false, start, stop, isLeftMove = false;

        var removeFilter = function (filterName) {
            var removed = false, filter = $scope.filters[filterName];

            if (filter.isDate && filter.date != null) {
                filter.date = null;
                filter.operator = mathHelper.equalityOperators.equalTo;
                removed = true;
            } else if (filter.selected && filter.selected.length > 0) {
                filter.selected = [];
                removed = true;
            }
            return removed;
        };
        
        var removeFiltersForUnselectedColumns = function () {
            var reload = false;

            for (var name in $scope.filters) {
                var column = $scope.columns[name];
                if (column !== undefined && !column.isSelected) {
                    var isRemoved = removeFilter(name);
                    if (isRemoved) {
                        reload = true;
                    }
                }
            }

            if (reload) {
                $scope.onFiltersChanged();
            }
        };

        $scope.$watchCollection('columnsAsSortedArray', function (newOrderedCols) {                        
            if (orderChanged) {
                _.each(newOrderedCols, function (col, index) {
                    var oldIndex = $scope.columns[col.key].ordinal;
                    if (oldIndex !== index) {
                        $scope.$broadcast(_TRADE_MOVE_COLUMN_, { index: index, oldIndex: oldIndex, bodyRowsOnly: false, isLeftMove: isLeftMove });                        
                    }
                    $scope.columns[col.key].ordinal = index;
                });
                
                TradesColumns.saveColumns($scope.columns);
                orderChanged = false;
            }
            $scope.$broadcast(_TRADE_SET_HEADER_WIDTHS_);
        });

        $scope.$on('popover-shown', function () {
            $rootScope.$broadcast(_TOGGLING_TRADE_FILTER_);
        });

        $scope.resetColumns = function () {
            var prevCols = _.extend($scope.columns, {});
            $scope.columns = TradesColumns.resetColumns();
            $scope.columnsAsSortedArray = _.sortBy($scope.columns, 'ordinal');
            removeFiltersForUnselectedColumns();
            
            _.each($scope.columnsAsSortedArray, function (col, index) {
                var oldIndex = prevCols[col.key].ordinal;
                if (oldIndex !== index) {
                    $scope.$broadcast(_TRADE_MOVE_COLUMN_, { index: index, oldIndex: oldIndex });
                    _.each(prevCols, function(item) {
                        if (item.key !== col.key && item.ordinal > index && item.ordinal < oldIndex) {
                            item.ordinal = item.ordinal + 1;
                        }
                    });
                    prevCols[col.key].ordinal = index;
                }
                if (prevCols[col.key].isSelected !== col.isSelected) {
                    $scope.$broadcast(_TRADE_TOGGLE_COLUMN_, { column: col.key, show: col.isSelected });
                }
            });

            $scope.$broadcast(_TRADE_SET_HEADER_WIDTHS_);
            $scope.$emit(_TRADE_BUILD_EXPORT_URL_);
        };
        
        $scope.toggleSelect = function (column) {
            if (column.isMandatory) {
                return;
            }
            column.isSelected = !column.isSelected;

            TradesColumns.saveColumns($scope.columns);
            removeFiltersForUnselectedColumns();
            $scope.$broadcast(_TRADE_TOGGLE_COLUMN_, { column: column.key, show: column.isSelected });

            $scope.$broadcast(_TRADE_SET_HEADER_WIDTHS_);
            $scope.$emit(_TRADE_BUILD_EXPORT_URL_);
        };

        $scope.sortableOptions = {
            axis: 'y',
            start: function(event, ui) {
                start = ui.originalPosition.top;
            },
            update: function(e, ui) {
                orderChanged = true;
                stop = ui.position.top;
                isLeftMove = (stop < start);                
            }
        };

        $scope.columns = TradesColumns.getColumns();
        $scope.columnsAsSortedArray = _.sortBy($scope.columns, 'ordinal');
    };

    controller.$inject = ['$scope', '$rootScope', 'TradesColumns', '_TRADE_MOVE_COLUMN_', '_TRADE_SET_HEADER_WIDTHS_', '_TOGGLING_TRADE_FILTER_', '_TRADE_TOGGLE_COLUMN_', '_TRADE_BUILD_EXPORT_URL_'];
    return controller;
});