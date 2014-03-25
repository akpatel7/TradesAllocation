define(['angular'], function (angular) {
    'use strict';

    var directive = function (_REQUEST_STARTED_, _REQUEST_ENDED_) {
        return {
            restrict: "A",
            link: function(scope, element) {
                element.addClass('hide');

                scope.$on(_REQUEST_STARTED_, function () {
                    element.removeClass('hide').addClass('show');
                });

                scope.$on(_REQUEST_ENDED_, function () {
                    element.removeClass('show').addClass('hide');
                });
            }
        };
    };
    directive.$inject = ['_REQUEST_STARTED_', '_REQUEST_ENDED_'];
    return directive;
});

