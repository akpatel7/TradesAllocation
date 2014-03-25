define(['angular', 'underscore', 'App/app'], function (angular, _, app) {
    'use strict';
    var tile;
    app.run(['$templateCache', function ($templateCache) {
            $templateCache.put('viewable-brick.html',
                    '<div class="tiles-tile">' +
                        '<div class="brick">' +
                            '<div class="brick-header">' +
                                '<div class="brick-title">' +
                                    '<h4>' +
                                        '{{viewable.canonicalLabel}}' +
                                    '</h4>' +
                                    '<span ng-if="selected" class="market-type">{{viewable.typeLabel}}</span>' +
                                '</div>' +

                                '<ul class="links">' +
                                    '<li><div icon state="viewable.selected" on-title="Minimize" off-title="Expand" on-icon="icon-minus" off-icon="icon-resize-full" ng-click="toggleSmall($event)"></div></li>' +
                                    '<li ng-if="viewable.selected"><div icon state="viewable.expanded" on-title="Minimize" off-title="Expand" on-icon="icon-resize-small" off-icon="icon-resize-full" ng-click="toggleBig($event)"></div></li>' +
                                    '<li><i class="icon-list" ng-class=" { \'selected\': tabs.market.open }" title="Market" ng-click="toggleMarket($event)"></i></li>' +
                                    '<li><i class="icon-time" ng-class=" { \'selected\': tabs.evolution.open }" title="View Evolutions" ng-click="toggleEvolution($event)"></i></li>' +
                                    '<li><a href="{{researchPageUrl}}"><i class="icon-desktop" title="Research Page"></i></a></li>' +
                                '</ul>' +
                                '<ul class="actions">' +
                                        '<li>' +
                                            '<a class="favourite-action" href="" ng-click="toggleFavouriteViewable($event)">' +
                                                '<i icon-multi-state="viewable.isFavouritedState" ' +
                                                    'data-on-icon="icon-star icon-star-on" data-on-hover-icon="icon-star icon-star-hover" ' +
                                                    'data-on-title="Click to remove item from favourites" ' +
                                                    'data-off-icon="icon-star icon-star-off" data-off-hover-icon="icon-star icon-star-hover"' +
                                                    'data-off-title="Click to add item to favourites" ' +
                                                    'data-half-icon="icon-star-half-empty icon-star-partial" data-half-hover-icon="icon-star icon-star-hover"' +
                                                    'data-half-title="Click to add item to favourites" ' +
                                                    '></i>' +
                                                '</a>' +
                                            '</li>' +
                                            '<li><a class="following-action" href="" ng-click="toggleFollowViewable($event)">' +
                                            '<i icon-multi-state="viewable.isFollowedState" ' +
                                                'data-on-icon="icon-arrow-right icon-arrow-right-on" data-on-hover-icon="icon-arrow-right icon-arrow-right-hover" ' +
                                                'data-on-title="Click to stop following market / economy" ' +
                                                'data-off-icon="icon-arrow-right icon-arrow-right-off" data-off-hover-icon="icon-arrow-right icon-arrow-right-hover"' +
                                                'data-off-title="Click to start following market / economy" ' +
                                                'data-half-icon="icon-chevron-right icon-arrow-right-half" data-half-hover-icon="icon-arrow-right icon-arrow-right-hover"' +
                                                'data-half-title="Click to start following market / economy" ' +
                                                '></i>' +
                                        '</a></li>' +
                                    '</ul>' +

                                '<div class="market-position" >' +
                                    '<div dominant-view="view" ng-class="{large: selected}"></div>' +
                                    '<div ng-if="selected">' +
                                        '<h6><a href="{{viewable.primarySupport.reportUrl}}">{{viewable.primarySupport.annotationFor.title}}</a></h6>' +
                                        '<div class="primary-support" wrap-content content="{{viewable.primarySupport.annotationText}}" max-length="400" expandable="false" ></div>' +
                                    '</div>' +
                                '</div>' +
                                // expanded tile section
                                '<div ng-if="selected">' +
                                    '<div class="market-summary">' +
                                        '<h6>ACROSS BCA:</h6>' +
                                        '<div class="row-fluid">' +
                                                '<div class="span6 column1">' +
                                                    '<span class="views-count"><span class="context-label">Views: </span>' +
                                                        '<span class="label absolute-views" ng-pluralize count="absoluteViewsCount" when="{\'0\': \'0 Absolute\', \'1\': \'1 Absolute\', \'other\': \'{} Absolutes\'}"></span> ' +
                                                        '<span class="label relative-views" ng-pluralize count="relativeViewsCount" when="{\'0\': \'0 Relative\', \'1\': \'1 Relative\', \'other\': \'{} Relatives\'}"></span>' +
                                                    '</span>' +

                                                '</div>' +
                                                '<div class="span6 column2">' +
                                                    '<div class="last-update">' +
                                                            '<span class="context-label">Latest Update: </span>' +
                                                            '<span date="viewable.latestHorizonStartDate"></span>' +
                                                    '</div>' +
                                                '</div>' +
                                        '</div>' +
                                        '<div class="row-fluid">' +
                                                '<div class="span6 column1">' +
                                                    '<p>' +
                                                        '<span class="services-count" ng-pluralize count="servicesCount" when="{\'0\': \'0 Services\', \'1\': \'1 Service\', \'other\': \'{} Services\'}"></span> ' +
                                                    '</p>' +
                                                    '<p>' +
                                                        '<span class="label conflict" ng-switch="viewable.hasConflicts">' +
                                                            '<span ng-switch-when="true"><i ng-class="{ \'icon-random\': viewable.hasConflicts }" title="Conflict"></i> Conflicts</span>' +
                                                        '</span>' +
                                                    '</p>' +
                                                '</div>' +
                                                '<div class="span6 column2">' +
                                                    '<div class="related-viewables" dropdown title="Related Markets/Economies" items="relatedViewables" dropdown-click="fetchRelatedViewables"></div>' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        // end expanded tile section
                        '<div ng-if="tabs.market.open" class="views-list">' +
                                '<div ng-include src="\'/Templates/AllViews/MarketEconomiesTab.html\'" ></div>' +
                        '</div>' +
                        '<div class="brick-body">' +
                             '<div ng-if="tabs.evolution.open" class="views-evolution">' +
                                   '<div ng-include src="\'/Templates/AllViews/ViewHistoryTab.html\'" ></div>' +
                            '</div>' +
                        '</div>' +
                    '</div>');
        }]);

    tile = function (Annotations, AnnotationsSupportUri, UrlProvider) {

        return {
            restrict: 'EA',
            scope: {
                viewable: '=',
                selected: '@'
            },
            templateUrl: 'viewable-brick.html',
            controller: 'ViewableTileController',
            link: function (scope) {
                scope.tabs = {
                    market: {
                        open: false
                    },
                    evolution: {
                        open: false
                    }
                };
                scope.toggleMarket = function () {
                    scope.tabs['market'].open = true;
                    scope.tabs['evolution'].open = false;
                    scope.viewable.expanded = scope.viewable.selected = true;
                };

                scope.toggleEvolution = function () {
                    scope.tabs['market'].open = false;
                    scope.tabs['evolution'].open = true;
                    scope.viewable.expanded = scope.viewable.selected = true;
                };
                scope.toggleSmall = function ($event) {
                    if (scope.viewable.selected !== true) {
                        scope.viewable.selected = true;
                    } else {
                        scope.viewable.selected = false;
                        scope.viewable.expanded = false;
                        scope.tabs.market.open = false;
                        scope.tabs.evolution.open = false;
                    }

                    $event.stopPropagation();
                };
                
                scope.toggleBig = function ($event) {
                    scope.viewable.expanded = !scope.viewable.expanded;
                    scope.tabs.evolution.open = false;
                    scope.tabs.market.open = scope.viewable.expanded;
                   
                    $event.stopPropagation();
                };
                
                scope.$watch('viewable.selected', function (newVal) {
                    if (newVal) {
                        if (scope.viewable.dominantView !== undefined && scope.viewable.dominantView !== null && scope.viewable.primarySupport === undefined) {
                            Annotations.getAnnotations({
                                conceptUri: scope.viewable.dominantView['@id']
                            }).then(function (annotations) {
                                var supports = _.find(annotations, function (ann) {
                                    return ann.key === AnnotationsSupportUri;
                                }),
                                    firstSupport;

                                firstSupport = _.first(supports.values);
                                if (firstSupport) {
                                    _.extend(firstSupport, {
                                        reportUrl: UrlProvider.getLiveReportUrl(firstSupport.annotationFor['@id'])
                                    });
                                }

                                _.extend(scope.viewable, {
                                    primarySupport: firstSupport
                                });
                            });
                        }
                    }
                });
            }
        };

    };
    tile.$inject = ['Annotations', 'AnnotationsSupportUri', 'UrlProvider'];

    return tile;
});

