define(['angular', 'underscore', 'jquery', 'amplify'], function(angular, _, $, amplify) {
    'use strict';

    var tradesColumnsService = function (_TRADE_MOVE_COLUMN_, _TRADE_TOGGLE_COLUMN_) {
        
        return {
            _getDefaultColumns: function () {
                var columns = {
                    "favourites": {
                        label: "Favourites",
                        key: "favourites",
                        isMandatory: true,
                        isDefault: true,
                        defaultOrdinal: 0,
                        defaultWidth: 20,
                        isExportable: false
                    },
                    "service_code": {
                        label: "Service",
                        key: "service_code",
                        isMandatory: true,
                        isDefault: true,
                        defaultOrdinal: 1,
                        maxWidth: 125,
                        defaultWidth: 80,
                        isExportable: true
                    },
                    "length_type_label": {
                        label: "Trade Type",
                        key: "length_type_label",
                        isMandatory: true,
                        isDefault: true,
                        defaultOrdinal: 2,
                        maxWidth: 150,
                        defaultWidth: 100,
                        isExportable: true
                    },
                    "structure_type_label": {
                        label: "Trade Structure",
                        key: "structure_type_label",
                        isMandatory: true,
                        isDefault: true,
                        defaultOrdinal: 3,
                        maxWidth: 150,
                        defaultWidth: 100,
                        isExportable: true
                    },
                    "trade_editorial_label": {
                        label: "Description / Label",
                        key: "trade_editorial_label",
                        isMandatory: true,
                        isDefault: true,
                        defaultOrdinal: 4,
                        maxWidth: 500,
                        defaultWidth: 350,
                        isExportable: true
                    },
                    "share": {
                        label: "Share",
                        key: "share",
                        isMandatory: true,
                        isDefault: true,
                        defaultOrdinal: 5,
                        defaultWidth: 20,
                        isExportable: false
                    },
                    "more_info": {
                        label: "More info",
                        key: "more_info",
                        isMandatory: true,
                        isDefault: true,
                        defaultOrdinal: 6,
                        defaultWidth: 20,
                        isExportable: false
                    },
                    "TradeLines/tradable_thing_class_editorial_label": {
                        label: "Asset Class",
                        key: "TradeLines/tradable_thing_class_editorial_label",
                        isMandatory: true,
                        isDefault: true,
                        defaultOrdinal: 7,
                        maxWidth: 300,
                        defaultWidth: 150,
                        isExportable: true
                    },
                    "TradeLines/position_label": {
                        label: "Direction",
                        key: "TradeLines/position_label",
                        isMandatory: true,
                        isDefault: true,
                        defaultOrdinal: 8,
                        maxWidth: 200,
                        defaultWidth: 100,
                        isExportable: true
                    },
                    "TradeLines/tradable_thing_label": {
                        label: "Instrument / Object",
                        key: "TradeLines/tradable_thing_label",
                        isMandatory: true,
                        isDefault: true,
                        defaultOrdinal: 9,
                        maxWidth: 500,
                        defaultWidth: 150,
                        isExportable: true
                    },
                    "TradeLines/tradable_thing_code": {
                        label: "Instrument Market Identifier",
                        key: "TradeLines/tradable_thing_code",
                        isMandatory: false,
                        isDefault: false,
                        defaultOrdinal: 10,
                        maxWidth: 150,
                        defaultWidth: 75,
                        isExportable: true
                    },
                    "TradeLines/location_label": {
                        label: "Location",
                        key: "TradeLines/location_label",
                        isMandatory: false,
                        isDefault: false,
                        defaultOrdinal: 11,
                        maxWidth: 500,
                        defaultWidth: 100,
                        isExportable: true
                    },
                    "hedge_label": {
                        label: "Hedge",
                        key: "hedge_label",
                        isMandatory: false,
                        isDefault: false,
                        defaultOrdinal: 12,
                        maxWidth: 300,
                        defaultWidth: 50,
                        isExportable: true
                    },
                    "instruction_type_label": {
                        label: "Instruction Type",
                        key: "instruction_type_label",
                        isMandatory: false,
                        isDefault: true,
                        defaultOrdinal: 13,
                        maxWidth: 300,
                        defaultWidth: 100,
                        isExportable: true
                    },
                    "instruction_label": {
                        label: "Instruction",
                        key: "instruction_label",
                        isMandatory: false,
                        isDefault: false,
                        defaultOrdinal: 14,
                        maxWidth: 300,
                        defaultWidth: 100,
                        isExportable: true
                    },
                    "instruction_entry": {
                        label: "Entry",
                        key: "instruction_entry",
                        isMandatory: false,
                        isDefault: true,
                        defaultOrdinal: 15,
                        maxWidth: 150,
                        defaultWidth: 50,
                        isExportable: true
                    },
                    "instruction_exit": {
                        label: "Exit",
                        key: "instruction_exit",
                        isMandatory: false,
                        isDefault: false,
                        defaultOrdinal: 16,
                        maxWidth: 150,
                        defaultWidth: 50,
                        isExportable: true
                    },
                    "instruction_entry_date": {
                        label: "Start Date",
                        key: "instruction_entry_date",
                        isMandatory: false,
                        isDefault: true,
                        defaultOrdinal: 17,
                        maxWidth: 200,
                        defaultWidth: 75,
                        isExportable: true
                    },
                    "instruction_exit_date": {
                        label: "Close Date",
                        key: "instruction_exit_date",
                        isMandatory: false,
                        isDefault: false,
                        defaultOrdinal: 18,
                        maxWidth: 200,
                        defaultWidth: 75,
                        isExportable: true
                    },
                    "absolute_performance": {
                        label: "Absolute Performance",
                        key: "absolute_performance",
                        isMandatory: false,
                        isDefault: true,
                        defaultOrdinal: 19,
                        maxWidth: 200,
                        defaultWidth: 95,
                        isExportable: true
                    },
                    "absolute_performance_ytd": {
                        label: "Absolute Performance - YTD",
                        key: "absolute_performance_ytd",
                        isMandatory: false,
                        isDefault: false,
                        defaultOrdinal: 20,
                        maxWidth: 200,
                        defaultWidth: 100,
                        isExportable: true
                    },
                    "relative_performance": {
                        label: "Relative Performance",
                        key: "relative_performance",
                        isMandatory: false,
                        isDefault: false,
                        defaultOrdinal: 21,
                        maxWidth: 200,
                        defaultWidth: 50,
                        isExportable: true
                    },
                    "relative_performance_ytd": {
                        label: "Relative Performance - YTD",
                        key: "relative_performance_ytd",
                        isMandatory: false,
                        isDefault: false,
                        defaultOrdinal: 22,
                        maxWidth: 200,
                        defaultWidth: 100,
                        isExportable: true
                    },
                    "benchmark_label": {
                        label: "Performance Benchmark",
                        key: "benchmark_label",
                        isMandatory: false,
                        isDefault: false,
                        defaultOrdinal: 23,
                        maxWidth: 500,
                        defaultWidth: 100,
                        isExportable: true
                    },
                    "comment_label": {
                        label: "Comments",
                        key: "comment_label",
                        isMandatory: false,
                        isDefault: false,
                        defaultOrdinal: 24,
                        maxWidth: 500,
                        defaultWidth: 100,
                        isExportable: true
                    },
                    "mark_to_market_rate": {
                        label: "Mark to Market",
                        key: "mark_to_market_rate",
                        isMandatory: false,
                        isDefault: false,
                        defaultOrdinal: 25,
                        maxWidth: 200,
                        defaultWidth: 50,
                        isExportable: true
                    },
                    "interest_rate": {
                        label: "Interest Rate ",
                        key: "interest_rate",
                        isMandatory: false,
                        isDefault: false,
                        defaultOrdinal: 26,
                        maxWidth: 200,
                        defaultWidth: 50,
                        isExportable: true
                    },
                    "last_updated": {
                        label: "Last Updated",
                        key: "last_updated",
                        isMandatory: true,
                        isDefault: true,
                        defaultOrdinal: 27,
                        maxWidth: 200,
                        defaultWidth: 75,
                        isExportable: true
                    },
                    "linked_trades": {
                        label: "Linked Trades",
                        key: "linked_trades",
                        isMandatory: false,
                        isDefault: false,
                        defaultOrdinal: 28,
                        maxWidth: 100,
                        defaultWidth: 50,
                        isExportable: false
                    },
                    "isOpen": {
                        label: "Status",
                        key: "isOpen",
                        isMandatory: false,
                        isDefault: false,
                        defaultOrdinal: 29,
                        maxWidth: 100,
                        defaultWidth: 50,
                        isExportable: true
                    }
                };
                _.each(columns, function(column) {
                    column.isSelected = column.isDefault;
                    column.width = column.defaultWidth;
                    column.ordinal = column.defaultOrdinal;
                });
                return columns;
            },
            saveColumns: function(columns) {
                amplify.store("tradeColumns", columns);
            },
            getSavedColumns: function() {
                return amplify.store("tradeColumns");
            },
            resetColumns: function() {
                this.saveColumns(this._getDefaultColumns());
                return this.getSavedColumns();
            },            
            getColumns: function() {
                var savedColumns = this.getSavedColumns();
                if (savedColumns !== undefined) {
                    return savedColumns;
                }
                return this._getDefaultColumns();
            },
            initTradesColumns: function (scope, initialLoad, rowsAppended) {
                var defaultColumns = this._getDefaultColumns();
                var sorted = _.sortBy(this.getColumns(), 'ordinal');
                _.each(sorted, function (col, index) {
                    if (defaultColumns[col.key].defaultOrdinal !== index) {
                        var oldIndex = defaultColumns[col.key].defaultOrdinal;
                        scope.$broadcast(_TRADE_MOVE_COLUMN_, { index: index , oldIndex: oldIndex, bodyRowsOnly: !initialLoad, rowsAppended: rowsAppended });
                    }
                    scope.$broadcast(_TRADE_TOGGLE_COLUMN_, { column: col.key, show: col.isSelected });
                });
            }
        };
    };

    tradesColumnsService.$inject = ['_TRADE_MOVE_COLUMN_', '_TRADE_TOGGLE_COLUMN_'];
    return tradesColumnsService;
});