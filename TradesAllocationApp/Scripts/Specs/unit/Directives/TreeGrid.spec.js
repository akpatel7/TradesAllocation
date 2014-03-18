define(['jquery', 'underscore', 'App/Directives/TreeGrid', 'angular', 'mocks'], function ($, _, treeGrid) {
    'use strict';

    describe('TreeGrid directive', function () {
        var scope,
            element,
            data,
            _TREE_GRID_RESET_COLS_ = 'tree-grid:reset-cols',
            _TREE_GRID_TOGGLE_COL_ = 'tree-grid:toggle-col',
            _TREE_GRID_MOVE_COL_ = 'tree-grid:move-col',
            _TREE_GRID_RESIZE_INFO_ = 'tree-grid:resize-info';


        angular.module('TreeGrid.spec', [])
            .service('config', function () {
                return {
                    treeGridBasePath: 'http://localhost:9018/base/Lib/TreeGrid/'
                };
            })
            .directive('treeGrid', treeGrid);


        beforeEach(module('App'));
        beforeEach(module('TreeGrid.spec'));

        beforeEach(inject(function ($q, $rootScope, $compile, AllocationsDataService, treeGridConfig, $templateCache) {
            $templateCache.put('template/pagination/pagination.html', '<div></div>');
            scope = $rootScope.$new();

            data = {
                totalCount: 12,
                portfolios: [
                    {
                        Col1: 'One',
                        Col2: 'One',
                        Col3: 'One'
                    },
                    {
                        Col1: 'Two',
                        Col2: 'Two',
                        Col3: 'Two'
                    },
                    {
                        Col1: 'Three',
                        Col2: 'Three',
                        Col3: 'Three'
                    }
                ]
            };

            spyOn(treeGridConfig, 'getAllocationConfig').andCallFake(function () {
                return {
                    Cfg: {
                        id: 'TreeGrid',
                        SuppressCfg: 1,
                        Style: 'Standard',
                        MainCol: 'Col2',
                        SuppressMessage: 0,
                        SafeCSS: 1,
                        NoVScroll: 1,
                        NoHScroll: 1,
                        Editing: 0,
                        Sorting: 1,
                        Selecting: 0,
                        Deleting: 0,
                        Adding: 0,
                        Dragging: 0,
                        Filtering: 1,
                        Code: 'SGRERCDUUBTMMC'
                    },
                    Cols: [
                        {
                            Name: "Col1",
                            Width: 30,
                            CanFilter: 0,
                            CanSort: 0
                        },
                        {
                            Name: "Col2",
                            Width: 350,
                            Type: "Text"
                        },
                        {
                            Name: "Col3",
                            Width: 50,
                            Type: "Text"
                        }
                    ]
                };

            });

            spyOn(AllocationsDataService, 'getData').andCallFake(function () {
                var deferred = $q.defer();
                deferred.resolve(data);
                return deferred.promise;
            });
            element = $compile('<div id="tree-grid" tree-grid></div>')(scope);
            $('body').append(element);
            scope.$root.$digest();
        }));


        afterEach(function () {
            element.remove();
            scope.$broadcast('$destroy');
        });
        
        describe('When rendering the grid', function () {
            it('should render the data', function () {
                waitsFor(function () {
                    return element.children().find('.GridMain1').length > 0;
                }, 'Tree grid to render', 500);
                runs(function () {
                    expect(element.children().find('.GSDataRow').length).toBeGreaterThan(0);
                });
            });

            it('should fetch the data', inject(function (AllocationsDataService) {
                expect(AllocationsDataService.getData).toHaveBeenCalled();
            }));
        });

        describe('When resetting columns', function() {
            it('should restore the initial configuration', function() {
                waitsFor(function() {
                    return element.children().find('.GridMain1').length > 0;
                }, 'Tree grid to render', 500);

                runs(function() {
                    spyOn(scope.grid, 'RestoreCfg').andCallThrough();
                    scope.$broadcast(_TREE_GRID_RESET_COLS_);
                    scope.$root.$digest();

                    expect(scope.grid.RestoreCfg).toHaveBeenCalled();
                });
            });
        });
        
        describe('When toggling visibility of a column', function () {
            it('Should call the treegrid API to hide the column', function () {
                waitsFor(function () {
                    return element.children().find('.GridMain1').length > 0;
                }, 'Tree grid to render', 500);

                runs(function () {
                    spyOn(scope.grid, 'HideCol').andCallThrough();
                    spyOn(scope.grid, 'SaveCfg').andCallThrough();
                    
                    scope.$broadcast(_TREE_GRID_TOGGLE_COL_, { column: 'Col1', show: false });
                    scope.$root.$digest();

                    expect(scope.grid.HideCol).toHaveBeenCalledWith('Col1');
                    expect(scope.grid.SaveCfg).toHaveBeenCalled();
                });
            });
            it('Should call the treegrid API to show the column', function () {
                waitsFor(function () {
                    return element.children().find('.GridMain1').length > 0;
                }, 'Tree grid to render', 500);

                runs(function () {
                    spyOn(scope.grid, 'ShowCol').andCallThrough();
                    spyOn(scope.grid, 'SaveCfg').andCallThrough();
                    
                    scope.$broadcast(_TREE_GRID_TOGGLE_COL_, { column: 'Col1', show: true });
                    scope.$root.$digest();

                    expect(scope.grid.ShowCol).toHaveBeenCalledWith('Col1');
                    expect(scope.grid.SaveCfg).toHaveBeenCalled();
                });
            });
        });

        describe('When moving a column', function () {
            it('Should call the treegrid API to move the column', function () {
                waitsFor(function () {
                    return element.children().find('.GridMain1').length > 0;
                }, 'Tree grid to render', 500);

                runs(function () {
                    spyOn(scope.grid, 'MoveCol').andCallThrough();
                    spyOn(scope.grid, 'SaveCfg').andCallThrough();
                    
                    scope.$broadcast(_TREE_GRID_MOVE_COL_, { column: 'Col1', nextColumn: 'Col2' });
                    scope.$root.$digest();

                    expect(scope.grid.MoveCol).toHaveBeenCalledWith('Col1', 'Col2');
                    
                    scope.$broadcast(_TREE_GRID_MOVE_COL_, { column: 'Col1', prevColumn: 'Col2' });
                    scope.$root.$digest();
                    
                    expect(scope.grid.MoveCol).toHaveBeenCalledWith('Col1', 'Col2');
                    expect(scope.grid.SaveCfg).toHaveBeenCalled();
                });
            });
        });


        describe('When resizing the more info row', function() {
            it('Should call the TreeGrid API to resize the row height to that specified', function() {
                waitsFor(function () {
                    return element.children().find('.GridMain1').length > 0;
                }, 'Tree grid to render', 500);

                runs(function () {
                    var pretendRow = {
                        'row': 'pretend this a tree grid row'
                    };

                    spyOn(scope.grid, 'GetRowById').andReturn(pretendRow);
                    spyOn(scope.grid, 'UpdateRowHeight').andCallFake(angular.noop);

                    scope.$broadcast(_TREE_GRID_RESIZE_INFO_, { rowId: 'p-1', height: 300 });
                    scope.$root.$digest();

                    expect(scope.grid.GetRowById).toHaveBeenCalledWith('p-1-Details');
                    expect(pretendRow.Height).toBe(300);
                    expect(scope.grid.UpdateRowHeight).toHaveBeenCalledWith(pretendRow, true);
                });
            });
        });
        
        describe('When the directive is destroyed', function() {
            it('Should dispose the TreeGrid component as well', function () {
                scope.$broadcast('$destroy');
                _.each(Grids, function (grid) {
                    expect(grid).toBeNull();
                });
            });
        });

    });
});


