define([
        'angular'
], function (angular) {
    'use strict';   

    return function () {
        return {
            restrict: 'EA',
            scope: { themes: '=' },
            replace: true,
            template:
                '<ul class="bottom nav nav-pills">' +
                    '<li class="dropdown themes">' +
                        '<a href="#" class="dropdown-toggle" data-toggle="dropdown">{{themesCount}} <b class="icon-caret-down"></b></a>' +
                        '<ul class="dropdown-menu" ng-if="themes && themes.length > 0">' +
                            '<li class="theme" ng-repeat="theme in themes"><a href="#/themes?uri={{theme[\'@id\']}}">{{theme.canonicalLabel}}</a></li>' +
                        '</ul>' +
                    '</li>' +
                '</ul>',
            link: function (scope, element) {
                scope.$watch('themes', function (newVal, oldVal) {
                    scope.themesCount = newVal === undefined ? 0 : newVal.length;
                });                
            }
        };
    };
});