define(['angular', 'underscore'], function(angular, _) {
    'use strict';
    var breadcrumbDirective,
        templateHtml;
    
    templateHtml = '' +
        '<ul class="breadcrumb" ng-show="breadcrumbs.length > 0">' +
        ' <li ng-repeat="breadcrumb in breadcrumbs">' +
        '  <span ng-hide="breadcrumb.link" ng-bind-template="{{breadcrumb.name}}"></span>' +
        '  <a ng-show="breadcrumb.link" ng-click="click(breadcrumb.link)" href="" data-tracking-action="breadcrumb">{{breadcrumb.name}}</a>' +
        '  <span ng-show="breadcrumb.link" class="icon-caret-right"></span>' +
        ' </li>' +
        '</ul>';

    breadcrumbDirective = function($location, Page) {
        return {
            restrict: 'EA',
            template: templateHtml,
            link: function(scope, element) {
                scope.$on('$routeChangeSuccess', function (event, current, last) {

                    if (current.action) {
                        scope.breadcrumbs = Page.getBreadcrumbs(current.action);
                    }
                });

                scope.click = function (url) {
                    $location.url(url);
                };
            }
        };
    };

    breadcrumbDirective.$inject = ['$location', 'Page'];
    return breadcrumbDirective;
});
