define(['angular'], function() {
    'use strict';

    var gridConfig = function(TreeGridLicenseKey) {
        return {
            getAllocationConfig : function () {
                return {
                    Cfg: {
                        id: 'AllocationsGrid',
                        SuppressCfg: 0,
                        Style: 'BCA',
                        CSS: 'BCA',
                        MainCol: 'Instrument',
                        SuppressMessage: 0,
                        SafeCSS: 1,
                        ConstHeight: 1,
                        ConstWidth: 1,
                        MaxHeight: 0,
                        MaxVScroll: 800,
                        NoVScroll: 0,
                        Editing: 0,
                        Sorting: 1,
                        Selecting: 0,
                        Deleting: 0,
                        Adding: 0,
                        Dragging: 0,
                        Filtering: 1,
                        CanMove: 2,
                        PersistentCfg: 1,
                        SaveExpanded: 2,                        
                        StandardFilter: 3,                        
                        SaveFilters: 1,
                        BorderCursors: 1,
                        PageLength: 5,
                        Paging: 2,
                        AllPages: 0,
                        Code: TreeGridLicenseKey
                    },
                    Def: [
                        { Name: 'R', Expanded: 0, HoverRow: 'Background' }
                    ],
                    Pager: {
                        Visible: 0
                    },
                    "Header": {
                        "MoreInfo": "",
                        "Actions": "",
                        "Instrument": "Instrument/Object",
                        "ServiceCode":
                            "Service",
                        "CurrentAllocation":
                            "Current Allocation/Weighting",
                        "PreviousAllocation":
                            "Previous Allocation/Weighting",
                        "CurrentBenchmark":
                            "Current Benchmark Weight/Range",
                        "PreviousBenchmark":
                            "Previous Benchmark Weight/Range",
                        "AbsolutePerformance":
                            "Absolute Performance",
                        "Benchmark":
                            "Performance Benchmark",
                        "Duration":
                            "Portfolio Duration",
                        "LastUpdated":
                            "Last Updated"
                    },

                    Head: [
                        {
                            Kind: 'Filter',
                            id: 'Filter1',
                            Height: 22,
                            ARange: 1,
                            AButton: "Defaults",
                            ADefaults: "|*FilterOff|*RowsAll",
                            A: "",
                            AFilter: 1,
                            ACanEdit: 0
                        }
                    ],
                    Toolbar:
                    {
                        Visible: 0,
                        Cells:
                            'ExpandAll,CollapseAll,Print,Columns,Export',
                        ExpandAllVisibleFormula:
                            1,
                        ExpandAllOnClick:
                            'ExpandAllCells',
                        ExpandAllTip:
                            'Expand all columns',
                        CollapseAllVisibleFormula:
                            1,
                        CollapseAllOnClick:
                            'CollapseAllCells',
                        CollapseAllTip:
                            'Collapse all columns'
                    },
                   
                    Cols: [
                        {
                            Name: "MoreInfo",
                            Width: 30,
                            MinWidth: 30,
                            CanFilter: 0,
                            CanSort: 0,
                            CanMove: 0,
                            Type: 'Html',
                            NoColor: 1,
                            CanExport: 0
                        },
                        {
                            Name: "Actions",
                            Width: 60,
                            MinWidth: 50,
                            CanFilter: 0,
                            CanSort: 0,
                            CanMove: 0,
                            Type: 'Html',
                            Class: 'actions',
                            NoColor: 1,
                            CanExport: 0
                        },
                        {
                            Name: "ServiceCode",
                            MinWidth: 40,
                            Width: 60,
                            Type: "Text",
                            CanSearch: 1,
                            CanFilter: 1,
                            NoColor: 1
                        },
                        {
                            Name: "Instrument",
                            MinWidth: 200,
                            Width: 500,
                            RelWidth: 1,
                            Type: "Text",
                            CanSearch: 1,
                            CanFilter: 1,
                            NoColor: 1
                        },
                        {
                            Name: "CurrentAllocation",
                            Width: 100,
                            MinWidth: 50,
                            Type: "Text",
                            CanSearch: 1,
                            NoColor: 1
                        },
                        {
                            Name: "PreviousAllocation",
                            Width: 100,
                            MinWidth: 50,
                            Type: "Text",
                            CanSearch: 1,
                            NoColor: 1
                        },
                        {
                            Name: "CurrentBenchmark",
                            Width: 150,
                            MinWidth: 50,
                            Type: "Text",
                            CanSearch: 1,
                            NoColor: 1
                        },
                        {
                            Name: "PreviousBenchmark",
                            Width: 150,
                            MinWidth: 50,
                            Type: "Text",
                            CanSearch: 1,
                            NoColor: 1
                        },
                        {
                            Name: "AbsolutePerformance",
                            Width: 100,
                            MinWidth: 50,
                            Type: "Text",
                            CanSearch: 1,
                            NoColor: 1
                        },
                        {
                            Name: "Benchmark",
                            Width: 200,
                            MinWidth: 40,
                            Type: "Text",
                            CanSearch: 1,
                            NoColor: 1
                        },
                        {
                            Name: "Duration",
                            Width: 175,
                            MinWidth: 100,
                            Type: "Text",
                            CanSearch: 1,
                            NoColor: 1
                        },
                        {
                            Name: "LastUpdated",
                            Width: 75,
                            MinWidth: 75,
                            Type: "Date",
                            Format: "MMM d, yyyy",
                            CanSearch: 1,
                            NoColor: 1
                        }
                    ]
                };
            }
        };
    };

    gridConfig.$inject = ['TreeGridLicenseKey'];
    return gridConfig;
});