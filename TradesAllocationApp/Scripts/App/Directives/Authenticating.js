define(['angular'], function () {
    'use strict';

    var directive = function (authorisationService, redirectService) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                if (authorisationService.isAuthorised()) {
                    element.removeClass('authenticating');
                } else {
                    redirectService.unauthorised();
                }
            }
        };
    };

    directive.$inject = ['authorisationService', 'redirectService'];
    return directive;
});

