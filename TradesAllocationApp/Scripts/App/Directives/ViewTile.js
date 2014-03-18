define(['angular', 'underscore', 'App/app'], function (angular, _, app) {
    'use strict';
    var tile;
    app.run(['$templateCache', function ($templateCache) {
            $templateCache.put('view-tile.html',
                         '<div class="brick" ng-click="handleClick($event)">' +
                             '<div class="view-tile-header">' +
                                '<h5  class="title"  wrap-content content="{{view.viewOn.canonicalLabel}}" max-length="50" expandable="false"></h5>' +
                                '<span ng-if="view.viewRelativeTo" class="sub-title" wrap-content content="VS: {{view.viewRelativeTo.canonicalLabel}}" max-length="30" expandable="false"></span>' +
                                
                            '</div>' +
                            '<div class="created">' +
                                '<span class="context-label">Created: </span>' +
                                '<span date="view.horizonStartDate"></span>' +
                            '</div>' +
                             '<div class="last-update">' +
                                '<span class="context-label">Last updated: </span>' +
                                '<span date="view.horizonStartDate"></span>' +
                            '</div>' +
                             '<div>' +
                                '<div view-position view="view" mode="graphic"></div>' +
                                '<div conviction view-conviction="view.viewConviction" mode="graphic"></div>' +
                                '<div view-horizon="view.viewHorizon"></div>' +
                                '<div class="service-name" service-name service="view.service"></div>' +
                             '</div>' +
                        '</div>'
            );
        }]);

    tile = function ($location) {

        return {
            restrict: 'EA',
            scope: {
                view: '='
            },
            templateUrl: 'view-tile.html',
            link: function (scope, element) {
                scope.test = "fdsfds s ds fldksjf ds sdfdsfds  dsf sdf sdf dssdf dsfdsfsd dsf sd f";
                scope.handleClick = function ($event) {
                    $location.path('/views').search({
                        uri: scope.view.viewOn['@id']
                    });
                    $event.stopPropagation();
                };
            }
        };

    };
    tile.$inject = ['$location'];

    return tile;
});

