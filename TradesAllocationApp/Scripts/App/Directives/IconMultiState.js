define(['angular', 'jquery'], function (angular, $) {
    'use strict';

    var directive = function () {

        return {
            replace: true,
            restrict: 'EA',
            template: '<i ng-show="isVisible" class="{{classValue}}" title="{{titleValue}}"></i>',
            scope: { iconMultiState: '=' },
            link: function (scope, element, attrs) {
                var setIcon = function(isHover) {
                    var key = scope.iconMultiState.toLowerCase() + (isHover ? '-hover-icon' : '-icon'),
                        icon;

                    icon = element.data(key);
                    if (icon !== undefined) {
                        scope.$apply(function() {
                            scope.classValue = icon;
                        });
                    }
                };

                element.bind('mouseenter', function () {
                    setIcon(true);
                });
                
                element.bind('mouseout', function () {
                    setIcon(false);
                });
               
                function getTitleAttributeValue(key) {
                    if (key) {
                        return element.data(key.toLowerCase() + '-title');
                    } else {
                        return null;
                    }
                }

                function getIconAttributeValue(key) {
                    if (key) {
                        return element.data(key.toLowerCase() + '-icon');
                    } else {
                        return null;
                    }
                }

                scope.$watch('iconMultiState', function (value) {
                    scope.classValue = getIconAttributeValue(value);
                    scope.titleValue = getTitleAttributeValue(value);
                    if (scope.classValue || (scope.classValue && scope.titleValue)) {
                        scope.isVisible = true;
                    } else if (value) {
                        scope.classValue = 'icon-stop';
                        scope.titleValue = 'UNKNOWN ICON STATE';
                        scope.isVisible = true;
                    } else {
                        scope.isVisible = false;
                    }
                });
            }
        };
    };

    directive.$inject = [];
    return directive;
});

