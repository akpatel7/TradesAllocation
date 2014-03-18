define(['angular', 'underscore', 'App/app'], function (angular, _, app) {
    'use strict';
    var directive;
    app.run(['$templateCache', function ($templateCache) {
            $templateCache.put('FavouritesTabs.html',
                '<div>' +
                        '<ul class="nav nav-tabs">' +
                            '<li ng-class="{ \'active\': renderAction === \'mybca.favourites.themes\'}" >' +
                                '<a href="/#/favourites/themes" >Themes</a>' +
                            '</li>'+
                             '<li ng-class="{ \'active\': renderAction === \'mybca.favourites\'}">' +
                                '<a href="/#/favourites" >Markets & Economies</a>' +
                            '</li>' +
                            '<li ng-class="{ \'active\': renderAction === \'mybca.favourites.trades\'}">' +
                                '<a href="/#/favourites/trades" >Trades</a>' +
                            '</li>' +
                            '<li ng-class="{ \'active\': renderAction === \'mybca.favourites.allocations\'}">' +
                                '<a href="/#/favourites/allocations" >Allocations</a>' +
                            '</li>' +
                             '<li>' +
                                '<a ng-href="{{ favouriteReportsUrl }}">Reports</a>' +
                            '</li>' +
                            '<li>' +
                                '<a ng-href="{{ favouriteChartsUrl }}">Charts</a>' +
                            '</li>' +
                        '</ul>'+
                 '</div>'
            );
        }]);

    directive = function (config) {


        return {
            restrict: 'EA',
            templateUrl: 'FavouritesTabs.html',
            link: function (scope, element, attrs) {
                function appendPath(baseUrl, path) {
                    return baseUrl + (baseUrl.indexOf('/', baseUrl.length - 1) !== -1 ? '' : '/') + path;
                }
                
                scope.favouriteReportsUrl = appendPath(config.reportsBaseUrl, "#/reports/favourites/Reports");
                scope.favouriteChartsUrl = appendPath(config.reportsBaseUrl, "#/reports/favourites/Charts");
            }

        };

    };
    directive.$inject = ['config'];

    return directive;
});

