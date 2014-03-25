define(['angular', 'moment'], function (angular, moment) {
    'use strict';

    return function () {
        return {
            restrict: 'EA',
            link: function (scope, element, attrs) {
                var shown = scope.$eval(attrs['slideToggle']);
                element[shown ? "show" : "hide"](0);

                attrs.$observe('slideToggle', function (attrValue) {

                    scope.$watch(attrValue, function (value) {
                        var toggle = (shown !== value);
                        if (toggle) {
                            element.slideToggle();
                            shown = value;
                        }
                    });
                });
            }
        };
    };
});

