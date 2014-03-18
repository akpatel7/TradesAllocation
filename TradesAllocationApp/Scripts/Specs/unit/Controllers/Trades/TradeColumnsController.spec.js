define(['App/Controllers/Trades/TradeColumnsController',
        'underscore',
        'angular',
        'mocks',
        'App/Services/services',
        'App/Controllers/controllers'
], function (TradeColumnsController, _, angular) {
    describe('TradeColumnsController', function () {
        var scope, columns, defaultColumns;

        columns = {
            "structure_type_label": {
                label: "Trade Structure",
                key: "structure_type_label",
                isMandatory: false,
                isDefault: false,
                ordinal: 0
            },
            "favourites": {
                label: "Favourites",
                key: "favourites",
                isMandatory: true,
                isDefault: true,
                ordinal: 1
            },
            "service_code": {
                label: "Service",
                key: "service_code",
                isMandatory: true,
                isDefault: false,
                ordinal: 2
            },
            "length_type_label": {
                label: "Trade Type",
                key: "length_type_label",
                isMandatory: false,
                isDefault: true,
                ordinal: 3
            }
        };

        defaultColumns = {
            "structure_type_label": {
                label: "Trade Structure",
                key: "structure_type_label",
                isMandatory: false,
                isDefault: false,
                ordinal: 0
            },
            "favourites": {
                label: "Favourites",
                key: "favourites",
                isMandatory: true,
                isDefault: true,
                ordinal: 1
            },
            "service_code": {
                label: "Service",
                key: "service_code",
                isMandatory: true,
                isDefault: false,
                ordinal: 2
            },
            "length_type_label": {
                label: "Trade Type",
                key: "length_type_label",
                isMandatory: false,
                isDefault: true,
                ordinal: 3
            }
        };

        beforeEach(function () {
            module('App.services');
            module('App.controllers');
        });
        
        describe('Given a TradeColumnsController', function () {

            beforeEach(inject(function ($rootScope, $controller, TradesColumns) {
                spyOn(TradesColumns, 'getColumns').andReturn(columns);
                spyOn(TradesColumns, 'resetColumns').andReturn(defaultColumns);
                spyOn(TradesColumns, 'saveColumns').andCallFake(angular.noop);

                scope = $rootScope.$new();
                scope.onFiltersChanged = function() {
                };
                
                scope.filters = {
                    "service_code": {
                        options: [],
                        selected: []
                    },
                    "length_type_label": {
                        options: []
                    },
                    "trade_editorial_label": {
                        isFreeText: true,
                        options: []
                    },
                    "TradeLines/tradable_thing_class_editorial_label": {
                        options: []
                    },
                    "instruction_label": {
                        isFreeText: true,
                        options: []
                    },
                    "isOpen": {
                        options: [],
                        placeholderField: 'label'
                    },

                    "benchmark_label": {
                        options: []
                    },
                    "instruction_type_label": {
                        options: []
                    },
                    "TradeLines/position_label": {
                        options: []
                    },
                    "structure_type_label": {
                        options: []
                    },
                    "TradeLines/tradable_thing_label": {
                        options: [],
                        isFreeText: true
                    },
                    "instruction_entry_date": {
                        isDate: true
                    },
                    "instruction_exit_date": {
                        isDate: true
                    },
                    "last_updated": {
                        isDate: true
                    }
                };
                
                $controller(TradeColumnsController, {
                    $scope: scope
                });
            }));

            it('Should be loaded with the available collection of columns for the table', inject(function(TradesColumns) {
                expect(TradesColumns.getColumns).toHaveBeenCalled();
                expect(scope.columns).toEqual(columns);
                expect(scope.columnsAsSortedArray).toEqual(_.sortBy(columns, 'ordinal'));
            }));

            describe('When removing the Trade Structure column', function () {
                var exportListener;
                beforeEach(function () {
                    exportListener = jasmine.createSpy('listener');
                    scope.$on('trade:build-export', exportListener);

                    scope.filters['structure_type_label'].selected = ['SINGLE'];
                    scope.filters['service_code'].selected = ['GIS'];
                    scope.onFiltersChanged = angular.noop;
                    spyOn(scope, 'onFiltersChanged');
                    
                    scope.toggleSelect(columns['structure_type_label']);
                });
                it('Should no longer be visible on the table', inject(function(TradesColumns) {
                    expect(columns['structure_type_label'].isSelected).toBe(true);
                    expect(TradesColumns.saveColumns).toHaveBeenCalledWith(columns);
                    expect(scope.onFiltersChanged).toHaveBeenCalled();
                    expect(exportListener).toHaveBeenCalled();
                }));
                describe('When we set the Trade Structure column to be visible again', function() {
                    it('Should then be visible again', inject(function(TradesColumns) {
                        expect(columns['structure_type_label'].isSelected).toBe(false);
                        expect(TradesColumns.saveColumns).toHaveBeenCalledWith(columns);
                        expect(scope.onFiltersChanged).toHaveBeenCalled();
                    }));                    
                });
            });

            describe('When removing the Service column (which is a mandatory column)', function() {
                var exportListener;
                beforeEach(function () {
                    exportListener = jasmine.createSpy('listener');
                    scope.$on('trade:build-export', exportListener);

                    scope.onFiltersChanged = angular.noop;
                    spyOn(scope, 'onFiltersChanged');

                    scope.toggleSelect(columns['service_code']);
                });
                it('Should do nothing', inject(function(TradesColumns) {
                    expect(TradesColumns.saveColumns).not.toHaveBeenCalled();
                    expect(scope.onFiltersChanged).not.toHaveBeenCalled();
                    expect(exportListener).not.toHaveBeenCalled();
                }));
            });

            describe('When re-ordering columns', function () {
                var listener, reOrderedCols;
                beforeEach(function () {
                    listener = jasmine.createSpy('listener');
                    scope.$on('trade:move-column', listener);
                    scope.columnsAsSortedArray = _.sortBy(scope.columns, 'ordinal').reverse();
                    scope.sortableOptions.update({}, {
                        position: {
                            top: 100
                        }
                    });
                    scope.$root.$digest();

                    reOrderedCols = _.extend(columns, {});
                    reOrderedCols['structure_type_label'].ordinal = 0;
                    reOrderedCols['favourites'].ordinal = 3;
                    reOrderedCols['service_code'].ordinal = 2;
                    reOrderedCols['length_type_label'].ordinal = 1;
                });
                it('Should persist the columns collection in the new order', inject(function(TradesColumns) {
                    expect(TradesColumns.saveColumns).toHaveBeenCalledWith(reOrderedCols);
                }));
                it('Should broadcast the new order of the columns so they can be applied', function() {
                    expect(listener).toHaveBeenCalled();
                    expect(listener.callCount).toBe(4);
                });
            });

            describe('When we reset the columns to the default state', function () {
                var reOrderedCols, moveListener, toggleListener, exportListener;
                beforeEach(function () {
                    moveListener = jasmine.createSpy('listener');
                    scope.$on('trade:move-column', moveListener);
                    
                    toggleListener = jasmine.createSpy('listener');
                    scope.$on('trade:toggle-column', toggleListener);
                    
                    exportListener = jasmine.createSpy('listener');
                    scope.$on('trade:build-export', exportListener);
                    
                    scope.filters['structure_type_label'].selected = ['SINGLE'];
                    scope.filters['service_code'].selected = ['GIS'];
                    scope.onFiltersChanged = angular.noop;
                    spyOn(scope, 'onFiltersChanged');

                    reOrderedCols = _.extend(columns, {});
                    reOrderedCols['structure_type_label'].ordinal = 0;
                    reOrderedCols['favourites'].ordinal = 3;
                    reOrderedCols['service_code'].ordinal = 2;
                    reOrderedCols['length_type_label'].ordinal = 1;
                    reOrderedCols['length_type_label'].isSelected = false;

                    scope.columns = reOrderedCols;
                    scope.resetColumns();
                });
                it('Should return the columns to the default order and visibility state', inject(function(TradesColumns) {
                    expect(TradesColumns.resetColumns).toHaveBeenCalled();                    
                    expect(scope.columns).toEqual(defaultColumns);
                    expect(scope.columnsAsSortedArray).toEqual(_.sortBy(defaultColumns, 'ordinal'));
                    expect(scope.onFiltersChanged).toHaveBeenCalled();
                    expect(moveListener).toHaveBeenCalled();
                    expect(moveListener.callCount).toBe(3);
                    expect(toggleListener).toHaveBeenCalled();
                    expect(toggleListener.callCount).toBe(2);
                    expect(exportListener).toHaveBeenCalled();
                }));
            });

            describe('WHen the columns menu is displayed', function() {
                var listener;
                beforeEach(function () {
                    listener = jasmine.createSpy('listener');
                    scope.$on('trade:toggle-filter', listener);
                    scope.$broadcast('popover-shown');
                    scope.$root.$digest();
                });
                it('Should close any open filters', function () {
                    expect(listener).toHaveBeenCalled();
                });
            });           
        });
    });
});