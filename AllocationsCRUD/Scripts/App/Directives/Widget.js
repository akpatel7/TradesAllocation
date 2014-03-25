define(['angular', 'App/app'], function (angular, app) {
    'use strict';
    var widget;
   app.run(['$templateCache', function($templateCache) {
            $templateCache.put('widget.html',
                 '<div class="{{width}} widget minimised">' +
                    '<div class="clearfix widget-header">' +
                        '<h3 class="pull-left">{{title}}</h3>' +
                        '<div class="pull-right widgetButtons">' +
                            '<span ng-switch="showExpandButton"><span expand-button expanded="$parent.isOpen" is-button="true" ng-switch-when="true"></span></span>' +
                            '<span ng-switch="showMaximiseButton"><span maximise-button maximised="$parent.isMaximised" is-button="true" ng-switch-when="true"></span></span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="widget-body-container">' +
                        '<div class="widget-body" ng-transclude>' +
                        '</div>' +
                    '</div>' +
                '</div>');
        }]);

                           
    widget = function () {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            scope: {
                title: '@widgetTitle',
                width: '@widgetWidth',
                toggleTime: '@',
                showExpandButton: '@widgetShowExpandButton',
                showMaximiseButton: '@widgetShowMaximiseButton',
                isOpen: '=?',
                isMaximised: '=?'
            },
            templateUrl: 'widget.html',
            link: function (scope, element, attrs) {
                scope.isOpen = true;
                scope.isMaximised = false;
                scope.showExpandButton = true;
                attrs.$observe('toggleTime', function(val) {
                    if (!angular.isDefined(val)) {
                        scope.toggleTime = 200;
                    }
                });

                scope.$watch('isOpen', function (value, oldValue) {
                    if (value !== oldValue) {
                        element.find('.widget-body').slideToggle(scope.toggleTime);
                    }
                });
                scope.$watch('isMaximised', function (value, oldValue) {
                    if (value !== oldValue) {
                        var position;
                        if (value) {
                            position = scope.elementPosition = element.position();
                            scope.elementWidth = element.width();
                            element.offsetParent().css({ 'minHeight': element.offsetParent().height() });
                            element.css({ 'left': position.left, 'top': position.top }).
                                    removeClass('minimised').addClass('maximised').animate({ 'left': 0, 'top': 0, 'right': 0, 'bottom': 0 }, scope.toggleTime);
                            $('html, body').animate({
                                scrollTop: 0
                            }, 0);
                        }
                        else {
                            position = scope.elementPosition;
                            element.animate({ 'left': position.left, 'top': position.top, 'right': 'auto', 'bottom': 'auto', 'width': scope.elementWidth }, scope.toggleTime,
                                        function () { element.css({ 'left': 'auto', 'top': 'auto', 'width': 'auto' }); }).
                                    removeClass('maximised').addClass('minimised');
                            element.offsetParent().css({ 'minHeight': 'auto' });
                        }
                    }
                });
            }
        };
    };
    
    widget.$inject = [];
    return widget;
});

