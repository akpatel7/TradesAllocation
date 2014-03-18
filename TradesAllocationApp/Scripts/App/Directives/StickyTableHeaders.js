define(['angular', 'jquery', 'App/Helpers/Browser', 'stickyTableHeaders'], function (angular, $, browser) {
    'use strict';

    var directive = function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                if (!browser.isIE8()) {
                    $(element).stickyTableHeaders({ fixedOffset: $(document).find('header > div') });
                }
            }
        };
    };

    return directive;
});

