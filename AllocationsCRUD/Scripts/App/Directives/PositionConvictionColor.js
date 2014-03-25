define([
        'angular'
    ], function(angular) {
        'use strict';

        var directive = function (PositionConvictionValue) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    scope.$watch(scope, function () {
                        PositionConvictionValue.setPositionAndConvictionValues(scope);
                    });
                }
            };
        };

        directive.$inject = ['PositionConvictionValue'];
        return directive;
    });

