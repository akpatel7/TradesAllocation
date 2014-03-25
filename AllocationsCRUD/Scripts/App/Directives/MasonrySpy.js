define(['angular'], function (angular) {
    'use strict';

    var directive = function (_TILE_SIZE_CHANGING_) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                scope.$root.$broadcast(_TILE_SIZE_CHANGING_);
            }
        };
    };

    directive.$inject = ['_TILE_SIZE_CHANGING_'];
    return directive;
});

