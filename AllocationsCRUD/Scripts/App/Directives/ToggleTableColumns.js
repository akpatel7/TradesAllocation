define(['angular', 'jquery'], function (angular, $) {
    'use strict';

    var directive = function (_TRADE_TOGGLE_COLUMN_) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$on(_TRADE_TOGGLE_COLUMN_, function (e, args) {
                    var cell = $(element).find('tr > td[data-column="' + args.column + '"]');
                    if (args.show) {
                        cell.show();
                    } else {
                        cell.hide();
                    }
                });
            }
        };
    };
    
    directive.$inject = ['_TRADE_TOGGLE_COLUMN_'];
    return directive;
});

