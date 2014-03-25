define(['angular', 'jquery'], function (angular, $) {
    'use strict';

    return function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                $('body').on('click', function (e) {
                    function hidePopover() {
                        if (element.popover) {
                            element.popover('hide');
                        }
                        else {
                            $('.popover').remove();
                        }
                    }
                    // base on http://stackoverflow.com/questions/11703093/how-to-dismiss-a-twitter-bootstrap-popover-by-clicking-outside
                    // the 'is' for buttons that trigger popups
                    // the 'has' for icons within a button that triggers a popup
                    if (!$(element).is(e.target) && element.has(e.target).length === 0) {
                        if ($('.popover').has(e.target).length === 0) {
                            hidePopover();
                        } else {
                            var href = $(e.target).closest('a').attr('href');

                            if (href && href !== '#') {
                                hidePopover();
                            }
                        }
                    }
                });
            }
        };
    };
});

