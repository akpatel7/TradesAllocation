define(['angular', 'jquery'], function (angular, $) {
    'use strict';

    var directive = function (_TRADE_MOVE_COLUMN_) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$on(_TRADE_MOVE_COLUMN_, function (e, args) {
                    var selector = attrs.rowSelector;
                    if (args.bodyRowsOnly) {
                        selector = 'tbody > ' + attrs.rowSelector;
                    }
                    
                    $(element).find(selector).each(function () {
                        var $row = $(this);
                        var ordered = $row.data('ordered') || {};
                        var key = args.index + '-' + args.oldIndex;
                        if ((!args.rowsAppended || args.rowsAppended === undefined) || (args.rowsAppended && ordered[key] === undefined)) {
                            var cells = $row.find('td');
                            if (args.isLeftMove) {
                                cells.eq(args.index).before(cells.eq(args.oldIndex));
                            } else {
                                cells.eq(args.index).after(cells.eq(args.oldIndex));
                            }
                            ordered[key] = true;
                            $row.data('ordered', ordered);
                        }
                    });
                });
            }
        };
    };
    
    directive.$inject = ['_TRADE_MOVE_COLUMN_'];
    return directive;
});

