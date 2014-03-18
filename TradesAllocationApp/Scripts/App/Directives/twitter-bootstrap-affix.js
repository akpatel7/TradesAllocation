define(['angular', 'jquery', 'bootstrap'], function (angular, $, bootstrap) {
    'use strict';

    var directive = function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                $(element).affix({
                    offset: { top: attrs['twitterBootstrapAffix'] }
                });

                $(element).after('<div class="affix-placeholder"></div>');
            }
        };
    };

    return directive;
});

