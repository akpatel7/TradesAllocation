define(['App/Controllers/Allocations/AllocationsColumnsController',
        'underscore',
        'angular',
        'mocks',
        'App/Services/services',
        'App/Controllers/controllers'
], function (AllocationsColumnsController, _, angular) {
    describe('AllocationsColumnsController', function () {
        var scope, columns;

        columns = {
            ServiceCode: {
                key: 'ServiceCode',
                label: 'Service',
                isMoveable: false,
                isHideable: false,
                isDisabled: true,
                isSelected: true,
                ordinal: 0
            },
            Instrument: {
                key: 'Instrument',
                label: 'Instrument / Object',
                isMoveable: false,
                isHideable: false,
                isDisabled: true,
                isSelected: true,
                ordinal: 1
            },
            CurrentAllocation: {
                key: 'CurrentAllocation',
                label: 'Current Allocation / Weighting',
                isMoveable: true,
                isHideable: true,
                isDisabled: false,
                isSelected: true,
                ordinal: 2
            },
            PreviousAllocation: {
                key: 'PreviousAllocation',
                label: 'Previous Allocation / Weighting',
                isMoveable: true,
                isHideable: true,
                isDisabled: false,
                isSelected: true,
                ordinal: 3
            },
            CurrentBenchmark: {
                key: 'CurrentBenchmark',
                label: 'Current Benchmark Weight / Range',
                isMoveable: true,
                isHideable: true,
                isDisabled: false,
                isSelected: true,
                ordinal: 4
            },
            PreviousBenchmark: {
                key: 'PreviousBenchmark',
                label: 'Previous Benchmark Weight / Range',
                isMoveable: true,
                isHideable: true,
                isDisabled: false,
                isSelected: true,
                ordinal: 5
            },
            AbsolutePerformance: {
                key: 'AbsolutePerformance',
                label: 'Absolute Performance',
                isMoveable: true,
                isHideable: true,
                isDisabled: false,
                isSelected: true,
                ordinal: 6
            },
            Benchmark: {
                key: 'Benchmark',
                label: 'Performance Benchmark',
                isMoveable: true,
                isHideable: true,
                isDisabled: false,
                isSelected: true,
                ordinal: 7
            },
            Duration: {
                key: 'Duration',
                label: 'Portfolio Duration',
                isMoveable: true,
                isHideable: true,
                isDisabled: false,
                isSelected: true,
                ordinal: 8
            },
            LastUpdated: {
                key: 'LastUpdated',
                label: 'Last Updated',
                isMoveable: true,
                isHideable: true,
                isDisabled: false,
                isSelected: true,
                ordinal: 9
            }
        };

        beforeEach(function () {
            module('App.services');
            module('App.controllers');
        });
        
        describe('Given a AllocationsColumnsController', function () {

            beforeEach(inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();
                
                $controller(AllocationsColumnsController, {
                    $scope: scope
                });
            }));

            describe('When the user selects to hide Last Updated column', function() {
                var listener;
                beforeEach(function() {
                    listener = jasmine.createSpy('listener');
                    scope.$on('tree-grid:toggle-col', listener);
                    columns['CurrentAllocation'].isSelected = false;
                    scope.onColumnSelected(columns['CurrentAllocation']);
                    scope.$root.$digest();
                });

                it('Should broadcast the event so other components know to act on it', function () {
                    expect(listener).toHaveBeenCalled();
                });
            });
            
            describe('When the user selects to move Last Updated column', function () {
                var listener;
                beforeEach(function () {
                    listener = jasmine.createSpy('listener');
                    scope.$on('tree-grid:move-col', listener);
                    var args = {
                        current: {
                            key: 'LastUpdated'
                        },
                        next: {
                            key: 'Duration'
                        },
                        previous: {
                            key: 'Benchmark'
                        }
                    };
                    scope.onColumnMoved(args);
                    scope.$root.$digest();
                });

                it('Should broadcast the event so other components know to act on it', function () {
                    expect(listener).toHaveBeenCalled();
                });
            });

            describe('When the user selects to reset columns to their default state', function() {
                var listener;
                beforeEach(function () {
                    listener = jasmine.createSpy('listener');
                    scope.$on('tree-grid:reset-cols', listener);
                    scope.resetColumns();
                    scope.$root.$digest();
                });
                
                it('Should broadcast the event so other components know to act on it', function () {
                    expect(listener).toHaveBeenCalled();
                });

                it('Should reset columns to their default visibility and order', function() {
                    _.each(scope.columns, function(col) {
                        expect(col.isSelected).toBe(true);
                        expect(col.ordinal).toBe(col.defaultOrdinal);
                    });
                });
            });

            describe('When the tree grid is rendered', function () {
                beforeEach(function() {
                    scope.$broadcast('tree-grid:rendered', {
                        columns: [
                            {
                                Name: 'CurrentAllocation',
                                Visible: 0,
                                Pos: 3
                            }
                        ]
                    });
                    scope.$root.$digest();
                });

                it('Should update the columns current state of visibility', function () {
                    expect(scope.columns['CurrentAllocation'].isSelected).toBe(false);
                });
                
                it('Should update the columns current position in the table', function () {
                    expect(scope.columns['CurrentAllocation'].ordinal).toBe(2);
                });
            });
        });
    });
});