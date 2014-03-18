define(['angular', 'jquery', 'underscore', 'App/Helpers/Browser', 'jquery-ui'], function (angular, $, _, browser) {
    'use strict';

    var directive = function ($timeout, $window, TradesColumns, _TRADE_SET_HEADER_WIDTHS_) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var updateFloatingHeaderAndTableWidth = function () {

                    //updates the floating header row created by sticky headers directive
                    //sets columns widths to match their counterparts in the 'real' trades table 
                    //amd updates the table width to match the sum of the columns (required for IE8)

                    var originalHeaderCells, floatingHeaderCells, filterHeaderCells;
                    if (!browser.isIE8()) {
                        originalHeaderCells = $(element).find('thead.tableFloatingHeaderOriginal tr.column-headers td');
                        floatingHeaderCells = $(element).find('thead.tableFloatingHeader tr.column-headers td');
                        filterHeaderCells = $(element).find('thead.tableFloatingHeader tr.filters td');
                    } else {
                        originalHeaderCells = $(element).find('thead > tr.column-headers td');
                        filterHeaderCells = $(element).find('thead > tr.filters td');
                    }                                        

                    var columnsAsSortedArray = _.sortBy(TradesColumns.getColumns(), 'ordinal');
                    var tableWidth = 0;

                    _.each(originalHeaderCells, function (originalHeaderCell, index) {
                        var colWidth = columnsAsSortedArray[index].width, $originalHeaderCell, $floatingHeaderCell, $filterHeaderCell;
                        
                        $originalHeaderCell = $(originalHeaderCell);
                        $filterHeaderCell = $(filterHeaderCells[index]);

                        $originalHeaderCell.width(colWidth); //angular does this when you add / remove a column - but not in IE8                        

                        $filterHeaderCell.width(colWidth);
                        $filterHeaderCell.css('min-width', colWidth);
                        $filterHeaderCell.css('max-width', colWidth);

                        if (floatingHeaderCells !== undefined) {
                            $floatingHeaderCell = $(floatingHeaderCells[index]);
                            $floatingHeaderCell.width(colWidth);
                            $floatingHeaderCell.css('min-width', colWidth); //sticky headers moves the min / max width settings - so we have to reset them ourselves
                            $floatingHeaderCell.css('max-width', colWidth);
                            
                            //as we hide / show columns, we ahve to update the floating headers accordingly
                            if ($originalHeaderCell.hasClass('ng-hide')) {
                                $floatingHeaderCell.addClass('ng-hide');
                            } else {
                                $floatingHeaderCell.removeClass('ng-hide');
                            }
                        }
                        
                        //as we hide / show columns, we ahve to update the floating headers accordingly
                        if ($originalHeaderCell.hasClass('ng-hide')) {
                            $filterHeaderCell.addClass('ng-hide');
                        } else {
                            $filterHeaderCell.removeClass('ng-hide');
                            tableWidth += colWidth + 17; //1 for the 1px border, 8px each for left and right padding
                        }

                    });

                    if (browser.isIE8()) {
                        $(element).width(tableWidth);
                    }
                };

                var $headerColumns = $(element).find("thead > tr.column-headers td:not(.non-resizable)");
                $headerColumns.resizable({
                    maxHeight: 20,
                    minWidth: 50,
                    maxWidth: 2000,
                    handles: 'se'
                });

                //jquery ui creates drag handle html elements in the td
                //we wrap these in an absolutely positioned div - so we can position them relative to the div, and therefore the td 
                $headerColumns.wrapInner('<div class="ui-resizable-handles-container"/>');

                $headerColumns.on("resizestop", function (event, ui) {
                    var columnName = ui.element.data('column');
                    var newWidth = ui.size.width;

                    var columns = TradesColumns.getColumns();
                    if (newWidth <= columns[columnName].maxWidth) {
                        columns[columnName].width = newWidth;                                              
                    } else {
                        columns[columnName].width = columns[columnName].maxWidth;
                    }
                    
                    TradesColumns.saveColumns(columns);
                    updateFloatingHeaderAndTableWidth();
                });

                scope.$on(_TRADE_SET_HEADER_WIDTHS_, function() {
                    $timeout(updateFloatingHeaderAndTableWidth);
                });
                
                if (!browser.isIE8()) {
                    //if we're using the sticky header, hide the resize handles, otherwise show them
                    var $header = $(element).find("thead.tableFloatingHeaderOriginal");
                    var $handles = $header.find('.ui-resizable-handle');
                    var isShowing = true;
                    
                    var throttled = _.throttle(function() {
                        var isSticky = ($header.css('position') === "fixed");
                        if (isSticky && isShowing) {
                            $handles.hide();
                            isShowing = false;
                        } else if (!isSticky && !isShowing) {
                            $handles.show();
                            isShowing = true;
                        }
                    }, 100);
                    $(window).scroll(throttled);
                }
            }
        };
    };
    
    directive.$inject = ['$timeout', '$window', 'TradesColumns', '_TRADE_SET_HEADER_WIDTHS_'];
    return directive;
});

