define(['angular', 'underscore', 'TreeGrid', 'jquery', 'App/Helpers/Browser'], function (angular, _, TreeGrid, $, browserHelper) {
    'use strict';

    var directive = function (config, AllocationsDataService, treeGridConfig, $compile, $timeout, _TREE_GRID_RESET_COLS_, _TREE_GRID_TOGGLE_COL_, _TREE_GRID_RENDERED_, _TREE_GRID_MOVE_COL_, _TREE_GRID_RESIZE_INFO_) {
        return {
            scope: false,
            replace: true,
            restrict: 'A',
            controller: 'AllocationsTreeGridController',
            template: '<div>' +
                '<div class="pull-right" >' +
                    '<i class="icon-download-alt" ng-click="Export()" title="Click to download all Portfolio\'s"></i>' +
                    '<div ng-if="totalCount > 0" pagination total-items="totalCount" items-per-page="pageSize" page="currentPage" max-size="5" boundary-links="showBoundaryLinks" on-select-page="onSelectPage(page)"></div>' +
                '</div>' +
                '<div class="tree-grid-container">' +
                    '<div id="allocations-grid" style="width: 100%;" ></div>' +
                '</div>' +
                '</div>',
            link: function (scope, element, attrs) {

                scope.grid = undefined;

                var moreInfoHtml = '<i class="icon-info-sign icon-large"></i>',
                    buildMoreInfo = function (currentGrid, row) {
                        var parent = row.Expanded === 1 ? row : row.parentNode,
                            next = row.Expanded === 1 ? row.firstChild : row.nextSibling,
                            newRow = currentGrid.AddRow(parent, next, true, row.id + '-Details', null),
                            newScope = scope.$new();

                        newScope.row = row;
                        newRow.MidHtml = "<div class=\"moreInfo\" allocation-more-info row=\"row\" id=\"moreInfo-" + row.id + "\" style=\"width: " + scope.$root.windowWidth + "px\" data-rowId=\"" + row.id + "\"></div>";
                        newRow.Height = 300;
                        newRow.isMoreInfo = true;
                        currentGrid.RefreshRow(newRow);
                        $compile(newRow.r1)(newScope);

                    },
                    onMoreInfoClick = function (currentGrid, row) {

                        var removeMoreInfo = function (rId, r) {
                            $('#moreInfo-' + rId).remove();
                            currentGrid.RemoveRow(r);
                            currentGrid.RefreshRow(r);
                            currentGrid.RefreshRow(row);
                            $(currentGrid.GetRowById(rId).r1).find('.icon-info-sign').removeClass('active');
                        };

                        var detailsRow = currentGrid.GetRowById(row.id + '-Details');

                        // Find other more infos not open
                        var moreInfo = $(".moreInfo");
                        var rowId = moreInfo.attr("data-rowId");
                        if (moreInfo.length > 0 && rowId !== row.id && browserHelper.isIE8()) {
                            removeMoreInfo(rowId, currentGrid.GetRowById(rowId + '-Details'));
                        }

                        if (detailsRow != null) {
                            removeMoreInfo(row.id, detailsRow);
                        } else {
                            // We need to create a details row and put it in the correct place
                            buildMoreInfo(currentGrid, row);
                            $(row.r1).find('.icon-info-sign').addClass('active');
                        }

                    },
                    onExpandClick = function (currentGrid, row) {
                        // We have to redraw the more info tab whenever we collapse/expand a row
                        var details = currentGrid.GetRowById(row.id + '-Details');

                        if (details != null) {
                            currentGrid.RemoveRow(details);
                            currentGrid.RefreshRow(details);
                            buildMoreInfo(currentGrid, row);
                        }
                        return false;
                    };

                AllocationsDataService.getData({
                    OnClickExpand: onExpandClick,
                    MoreInfo: moreInfoHtml,
                    MoreInfoOnClick: onMoreInfoClick,
                    Actions: '<div ng-class="{ \'compiled\': $parent.$id }">' + // add class so we now that the row markup has been compiled and linked
                                '<a class="favourite-action" ng-click="toggleFavourite(this.$parent.row, $event)" ng-controller="AllocationBookmarkController">' +
                                    '<i class="icon-star icon-star-{{getFavouritedState(this.$parent.row)}}"></i>' +
                                '</a>' +
                                '<a class="following-action pull-right" ng-click="toggleFollow(this.$parent.row, $event)"  ng-controller="AllocationFollowController" ng-init="grid = this.$parent.$parent.grid;">' +
                                    '<i icon-multi-state="getFollowedState(this.$parent.row)" ' +
                                        'data-on-icon="icon-arrow-right icon-arrow-right-on" data-on-hover-icon="icon-arrow-right icon-arrow-right-hover" data-on-title="Click to stop following allocation" ' +
                                        'data-off-icon="icon-arrow-right icon-arrow-right-off" data-off-hover-icon="icon-arrow-right icon-arrow-right-hover" data-off-title="Click to start following allocation" ' +
                                        'data-half-icon="icon-chevron-right icon-arrow-right-half" data-half-hover-icon="icon-arrow-right icon-arrow-right-hover" data-half-title="Click to start following allocation"></i> ' +
                                '</a>' +
                        '</div>'
                })
                    .then(function (data) {
                        if (scope.grid) {
                            scope.grid.Clear();
                            scope.grid.Dispose();
                        }
                        scope.grid = new TreeGrid({
                            BasePath: config.treeGridBasePath,
                            Layout: {
                                Data: treeGridConfig.getAllocationConfig()
                            },
                            Data: {
                                Data: { Body: [data.portfolios] }
                            },
                            Export: {
                                Url: 'Export/Index',
                                Type: 'xls'
                            }
                        }, 'allocations-grid');
                    });


                scope.$on('$destroy', function () {
                    if (scope.grid !== undefined) {
                        scope.grid.Clear();
                        scope.grid.Dispose();

                        scope.grid = undefined;
                    }
                });

                scope.$on(_TREE_GRID_RESET_COLS_, function () {
                    if (scope.grid !== undefined) {
                        scope.grid.RestoreCfg();
                    }
                });

                scope.$on(_TREE_GRID_TOGGLE_COL_, function (event, args) {
                    if (scope.grid !== undefined) {
                        if (args.show) {
                            scope.grid.ShowCol(args.column);
                        } else {
                            scope.grid.HideCol(args.column);
                        }
                        scope.grid.SaveCfg();
                    }
                });

                scope.$on(_TREE_GRID_MOVE_COL_, function (event, args) {
                    if (scope.grid !== undefined) {
                        if (args.nextColumn !== undefined) {
                            scope.grid.MoveCol(args.column, args.nextColumn);
                        } else {
                            scope.grid.MoveCol(args.column, args.prevColumn);
                        }
                        scope.grid.SaveCfg();
                    }
                });

                scope.$on(_TREE_GRID_RESIZE_INFO_, function (event, args) {
                    if (scope.grid !== undefined) {
                        var row = scope.grid.GetRowById(args.rowId + '-Details');
                        if (row !== null && row !== undefined) {
                            row.Height = args.height;
                            scope.grid.UpdateRowHeight(row, true);
                        }
                    }
                });

                Grids.OnRowFilter = function (g, row, show) {
                    if (show) {
                        g.ExpandParents(row);
                    }
                    return show;
                };

                Grids.OnRenderFinish = function (g) {
                    scope.$broadcast(_TREE_GRID_RENDERED_, { columns: g.Cols });
                    if (g.Filter !== undefined) {
                        var filter = '<div ng-controller="PortfolioAllocationFilterController">' +
                                '<a ng-if="!myFavouritesView" href="" ng-click="toggleFavouritesFilter()" class="favourites-filter"><i class="icon-star" ng-class="{\'on\': showFavouritesOnly, \'off\': !showFavouritesOnly }"></i></a>' +
                                '<a ng-if="!myFavouritesView" href="" ng-click="toggleFollowFilter()" class="follow-filter"><i class="icon-arrow-right" ng-class="{\'on\': showFollowsOnly, \'off\': !showFollowsOnly }"></i></a>' +
                            '</div>';
                        var actions = $(g.Filter.r1).find('td.actions');
                        actions.append($compile(filter)(scope.$new()));
                    }

                    var portfolios = _.filter(g.Rows, function (row) {
                        return row.isPortfolio && row.Visible;
                    });

                    scope.totalCount = portfolios.length;

                    scope.$apply(function () {
                        // force digest
                    });
                };


                Grids.OnExpand = function (g, row) {
                    if (row.Expanded) {
                        if (row.isPortfolio && row.nextSibling && row.nextSibling.Expanded === 0) {
                            $(row.nextSibling.r1).css('border-top', 'solid 1px #EAECF5');
                        }
                        if (row.isPortfolio && row.previousSibling) {
                            $(row.previousSibling.r1).css('border-bottom', 'solid 1px #EAECF5');
                        }
                        scope.grid.Collapse(row);
                    } else {
                        $(row.r1).css('border-bottom', 'solid 1px #EAECF5');
                        if (row.isPortfolio && row.nextSibling) {
                            $(row.nextSibling.r1).css('border-top', 'solid 1px #093981');
                        }
                        if (row.isPortfolio && row.previousSibling && row.previousSibling.Expanded === 0) {
                            $(row.previousSibling.r1).css('border-bottom', 'solid 1px #093981');
                        }
                        scope.grid.Expand(row);
                    }
                    return false;
                };

                Grids.OnRenderRow = function (grid, row, col) {
                    if (row.Kind === 'Data' && !row.isMoreInfo && $(row.r1).find('.compiled').length === 0) {
                        var newScope = scope.$new(true);
                        newScope.row = row;
                        $compile(row.r1)(newScope);
                    }
                    if (row.isPortfolio) {
                        $(row.r1).css('border-top', 'solid 1px #093981');
                        $(row.r1).css('font-weight', 'bold');
                    }
                };

                Grids.OnFilterFinish = function (g, type) {
                    var portfolios = _.filter(g.Rows, function (row) {
                        return row.isPortfolio && row.Visible;
                    });
                    scope.totalCount = portfolios.length;
                };
            }
        };
    };

    directive.$inject = ['config', 'AllocationsDataService', 'treeGridConfig', '$compile', '$timeout', '_TREE_GRID_RESET_COLS_', '_TREE_GRID_TOGGLE_COL_', '_TREE_GRID_RENDERED_', '_TREE_GRID_MOVE_COL_', '_TREE_GRID_RESIZE_INFO_'];
    return directive;
});