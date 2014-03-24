define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var controller = function ($scope, _TREE_GRID_TOGGLE_COL_, _TREE_GRID_RESET_COLS_, _TREE_GRID_RENDERED_, _TREE_GRID_MOVE_COL_) {
        $scope.columns = {
            ServiceCode: {
                key: 'ServiceCode',
                label: 'Service',
                isMoveable: false,
                isHideable: false,
                isDisabled: true,
                isSelected: true,
                ordinal: 0,
                defaultOrdinal: 0
            },
            Instrument: {
                key: 'Instrument',
                label: 'Instrument / Object',
                isMoveable: false,
                isHideable: false,
                isDisabled: true,
                isSelected: true,
                ordinal: 1,
                defaultOrdinal: 1
            },
            CurrentAllocation: {
                key: 'CurrentAllocation',
                label: 'Current Allocation / Weighting',
                isMoveable: true,
                isHideable: true,
                isDisabled: false,
                isSelected: true,
                ordinal: 2,
                defaultOrdinal: 2
            },
            PreviousAllocation: {
                key: 'PreviousAllocation',
                label: 'Previous Allocation / Weighting',
                isMoveable: true,
                isHideable: true,
                isDisabled: false,
                isSelected: true,
                ordinal: 3,
                defaultOrdinal: 3
            },
            CurrentBenchmark: {
                key: 'CurrentBenchmark',
                label: 'Current Benchmark Weight / Range',
                isMoveable: true,
                isHideable: true,
                isDisabled: false,
                isSelected: true,
                ordinal: 4,
                defaultOrdinal: 4
            },
            PreviousBenchmark: {
                key: 'PreviousBenchmark',
                label: 'Previous Benchmark Weight / Range',
                isMoveable: true,
                isHideable: true,
                isDisabled: false,
                isSelected: true,
                ordinal: 5,
                defaultOrdinal: 5
            },
            AbsolutePerformance: {
                key: 'AbsolutePerformance',
                label: 'Absolute Performance',
                isMoveable: true,
                isHideable: true,
                isDisabled: false,
                isSelected: true,
                ordinal: 6,
                defaultOrdinal: 6
            },
            Benchmark: {
                key: 'Benchmark',
                label: 'Performance Benchmark',
                isMoveable: true,
                isHideable: true,
                isDisabled: false,
                isSelected: true,
                ordinal: 7,
                defaultOrdinal: 7
            },
            Duration: {
                key: 'Duration',
                label: 'Portfolio Duration',
                isMoveable: true,
                isHideable: true,
                isDisabled: false,
                isSelected: true,
                ordinal: 8,
                defaultOrdinal: 8
            },
            LastUpdated: {
                key: 'LastUpdated',
                label: 'Last Updated',
                isMoveable: true,
                isHideable: true,
                isDisabled: false,
                isSelected: true,
                ordinal: 9,
                defaultOrdinal: 9
            }
        };

        $scope.onColumnSelected = function (column) {
            $scope.$root.$broadcast(_TREE_GRID_TOGGLE_COL_, { column: column.key, show: column.isSelected });
        };

        $scope.onColumnMoved = function (args) {
            $scope.$root.$broadcast(_TREE_GRID_MOVE_COL_, {
                column: args.current.key,
                nextColumn: args.next !== undefined ? args.next.key : undefined,
                prevColumn: args.previous !== undefined ? args.previous.key : undefined
            });
        };

        $scope.resetColumns = function () {
            $scope.$root.$broadcast(_TREE_GRID_RESET_COLS_);
            _.each($scope.columns, function (col) {
                if (!col.isDisabled) {
                    col.isSelected = true;
                    col.ordinal = col.defaultOrdinal;
                }
            });
        };

        $scope.$on(_TREE_GRID_RENDERED_, function (event, args) {
            _.each(args.columns, function (col) {
                if ($scope.columns[col.Name] !== undefined) {
                    $scope.columns[col.Name].isSelected = col.Visible === 1;
                    $scope.columns[col.Name].ordinal = col.Pos - 1;
                }
            });
        });
    };

    controller.$inject = ['$scope', '_TREE_GRID_TOGGLE_COL_', '_TREE_GRID_RESET_COLS_', '_TREE_GRID_RENDERED_', '_TREE_GRID_MOVE_COL_'];
    return controller;
});