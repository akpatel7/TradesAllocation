define(['angular', 'underscore', 'App/app'], function (angular, _, app) {
    'use strict';
    var tile;
    app.run(['$templateCache', function ($templateCache) {
            $templateCache.put('theme-tile.html',
                        '<div class="brick" ng-click="handleClick($event)">' +
                            '<div class="theme-tile-header">' +
                                '<h5  class="title"  wrap-content content="{{theme.canonicalLabel}}" max-length="150" expandable="false"></h5>' +
                            '</div>' +
                         '</div>');
        }]);

    tile = function ($location) {
        return {
            restrict: 'EA',
            scope: {
                theme: '='
            },
            templateUrl: 'theme-tile.html',
            link: function (scope, element) {
                scope.handleClick = function($event) {
                    $location.path('/themes').search({
                        uri: scope.theme['@id']
                    });
                    $event.stopPropagation();
                };
            }
        };
    };

    tile.$inject = ['$location'];

    return tile;
});

