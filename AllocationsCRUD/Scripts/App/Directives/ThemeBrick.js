define(['angular', 'underscore', 'App/app'], function (angular, _, app) {
    'use strict';
    var tile;
    app.run(['$templateCache', function ($templateCache) {
            $templateCache.put('theme-brick.html',
                        '<div class="tiles-tile" ng-click="maximize($event)">' +
                            '<div class="brick">' +
                                '<div class="brick-header" data-theme-id="{{theme[\'@id\']}}">' +
                                    '<h5 ng-if="theme.expanded" class="brick-title"  wrap-content content="{{theme.canonicalLabel}}" max-length="1000" expandable="false"></h5>' +
                                    '<h5 ng-if="!theme.expanded" class="brick-title"  wrap-content content="{{theme.canonicalLabel}}" max-length="150" expandable="false"></h5>' +
                                    '<ul class="links">' +
                                        '<li><div icon state="theme.expanded" on-title="Minimize" off-title="Expand" on-icon="icon-resize-small" off-icon="icon-resize-full" ng-click="minimize($event)"></div></li>' +
                                        '<li><i class="icon-list" ng-class=" { \'selected\': tabs.theme.open }" title="Details" ng-click="toggleServiceThemes($event)"></i></li>' +
                                        '<li><i class="icon-th" ng-class=" { \'selected\': tabs.market.open }" title="Market" ng-click="toggleRelatedMarkets($event)"></i></li>' +
                                    '</ul>' +
                                    '<ul class="actions">' +
                                        '<li>' +
                                              '<a class="favourite-action" href="" ng-click="toggleFavourite($event)">' +
                                              '<i icon state="theme.isFavourited" ' +
                                                    'on-icon="icon-star icon-star-on" ' +
                                                    'on-title="Click to remove item from favourites" data-on-hover-icon="icon-star icon-star-off"' +
                                                    'off-icon="icon-star icon-star-off"  data-off-hover-icon="icon-star icon-star-off"' +
                                                    'off-title="Click to add item to favourites" ' +
                                                    '></i>' +
                                               '</a>' +
                                        '</li>' +
                                        '<li>' +
                                             '<a class="following-action" href="" ng-click="toggleFollow($event)">' +
                                                    '<i icon state="theme.isFollowed" ' +
                                                        'on-icon="icon-arrow-right icon-arrow-right-on" ' +
                                                        'on-title="Click to stop following theme" data-on-hover-icon="icon-arrow-right icon-arrow-right-off"' +
                                                        'off-icon="icon-arrow-right icon-arrow-right-off" data-off-hover-icon="icon-arrow-right icon-arrow-right-off"' +
                                                        'off-title="Click to start following theme" ' +
                                                        '></i>' +
                                                '</a>' +
                                        '</li>' +
                                    '</ul>' +
                                  
                                    '<div class="actions" voting state="theme.vote" resource-id="theme[\'@id\']" resource-type="theme" like-count="theme.likeCount" dislike-count="theme.dislikeCount" show-count="{{theme.expanded}}"/>' +
                                    '<div class="theme-summary" ng-switch="theme.expanded">' +
                                        // minimized mode
                                        '<div ng-switch-default>' +
                                            '<div class="row-fluid">' +
                                                    '<div class="span5 column1">' +
                                                       '<div class="last-update">' +
                                                            '<span date="theme.lastApplied"></span>' +
                                                        '</div>' +

                                                    '</div>' +
                                                    '<div class="span7 column2">' +
                                                        '<p ng-show="childThemeCount" ng-switch on="childThemeCount">' +
                                                            '<span ng-switch-default><span class="child-theme-count">{{childThemeCount}}</span> Child Themes</span>' +
                                                            '<span ng-switch-when="1"><span class="child-theme-count">1</span> Child Theme</span>' +
                                                        '</p>' +

                                                    '</div>' +
                                            '</div>' +
                                            '<div class="row-fluid">' +
                                                    '<div class="span5 column1">' +
                                                        '<div class="{{theme.impact}} box"></div>' +
                                                        '<p class="impact"><b>{{theme.impact | uppercase }}</b></p>' +

                                                    '</div>' +
                                                    '<div class="span7 column2">' +
                                                        '<p><span class="markets-count">{{marketsCount}}</span> Markets/Economies</p>' +
                                                    '</div>' +
                                            '</div>' +
                                        '</div>' +
                                        
                                        // expanded mode
                                        '<div ng-switch-when="true">' +
                                            '<h5>ACROSS <span service-name service="theme.service"></span>: <span class="impact"><div class="{{theme.impact}} box"></div>{{theme.impact | uppercase }}</span></h5>' +
                                            '<div class="row-fluid">' +
                                                    '<div class="span5 column1">' +
                                                        '<p><span class="markets-count">{{marketsCount}}</span> Markets/Economies</p>' +
                                                    '</div>' +
                                                    '<div class="span7 column2">' +
                                                        '<div class="last-update">' +
                                                            '<span class="context-label">Latest applied: </span><span date="theme.lastApplied"></span>' +
                                                        '</div>' +
                                                    '</div>' +
                                            '</div>' +
                                            '<div class="row-fluid">' +
                                                    '<div class="span5 column1">' +
                                                        '<p ng-show="childThemeCount" ng-switch on="childThemeCount">' +
                                                            '<span ng-switch-default><span class="child-theme-count">{{childThemeCount}}</span> Child Themes</span>' +
                                                            '<span ng-switch-when="1"><span class="child-theme-count">1</span> Child Theme</span>' +
                                                        '</p>' +
                                                    '</div>' +
                                                    '<div class="span7 column2">' +
                                                       '<div class="created">' +
                                                            '<span class="context-label">Created: </span><span date="theme.created"></span>' +
                                                        '</div>' +
                                                    '</div>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div ng-if="theme.expanded" class="theme-info">' +
                                        '<div class="description" wrap-content content="{{theme.description}}" max-length="200" expandable="false" ></div>' +
                                    '</div>' +
                                '</div>' +
                               
                            '</div>' +
                               
                             '<div ng-if="tabs.theme.open" class="brick-body">' +
                                '<div ng-include src="\'/Templates/Themes/ServiceThemes.html\'" ></div>' +
                            '</div>' +
                             '<div ng-if="tabs.market.open" class="brick-body">' +
                                '<hr />' +
                                '<div ng-include src="\'/Templates/Themes/RelatedMarkets.html\'" ></div>' +
                            '</div>' +
                         '</div>');
        }]);

    tile = function (Themes, Perspectives, PerspectiveBuilder, Notifications, Analytics, _TILE_SIZE_CHANGING_) {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                theme: '='
            },
            templateUrl: 'theme-brick.html',
            link: function (scope, element) {
                scope.tabs = {
                    market: {
                        open: false
                    },
                    theme: {
                        open: false
                    }
                };
                
                scope.$watch('theme', function (newVal, oldValue) {
                    scope.childThemeCount = 0;
                    if (newVal.childTheme) {
                        scope.childThemeCount = newVal.childTheme['@set'].length;
                    }

                    scope.marketsCount = Themes.calculateMarketsCount(newVal);
                });
                
                scope.toggleFavourite = function ($event) {
                    if (scope.theme.isFavourited) {
                        var ids = [];
                        if (scope.theme.perspectiveId !== undefined) {
                            ids.push(scope.theme.perspectiveId);
                        }
                        if (scope.theme.childTheme !== undefined) {
                            _.each(scope.theme.childTheme['@set'], function (childTheme) {
                                if (childTheme.perspectiveId !== undefined) {
                                    ids.push(childTheme.perspectiveId);
                                }
                            });
                        }
                      
                        _.each(ids, function(perspectiveId) {
                            Perspectives.remove(perspectiveId)
                                .then(function(result) {
                                    scope.theme.perspectiveId = undefined;
                                    scope.theme.isFavourited = false;
                                    Notifications.success('‘' + scope.theme.canonicalLabel + '’ has been removed from your favourites.');
                                });
                        });
                       
                        Analytics.registerClick('DCSext.unfavouriteTheme', scope.theme['@id']);
                    } else {
                        PerspectiveBuilder.buildPerspective('theme', 'bookmark', scope.theme['@id'])
                            .then(function (body) {
                                Perspectives.post(body)
                                    .then(function (result) {
                                        scope.theme.perspectiveId = result;
                                        scope.theme.isFavourited = true;
                                        Notifications.success('‘' + scope.theme.canonicalLabel + '’ has been added to your favourites.');
                                    });
                            });
                        Analytics.registerClick('DCSext.favouriteTheme', scope.theme['@id']);
                    }
                   
                    $event.stopPropagation();
                };
                
                scope.toggleFollow = function ($event) {
                    if (scope.theme.isFollowed) {
                        var ids = [];
                        if (scope.theme.followPerspectiveId !== undefined) {
                            ids.push(scope.theme.followPerspectiveId);
                        }
                        if (scope.theme.childTheme !== undefined) {
                            _.each(scope.theme.childTheme['@set'], function (childTheme) {
                                if (childTheme.followPerspectiveId !== undefined) {
                                    ids.push(childTheme.followPerspectiveId);
                                }
                            });
                        }

                        _.each(ids, function (perspectiveId) {
                            Perspectives.remove(perspectiveId)
                                .then(function (result) {
                                    scope.theme.perspectiveId = undefined;
                                    scope.theme.isFollowed = false;
                                    Notifications.success('‘' + scope.theme.canonicalLabel + '’ is no longer being followed.');
                                });
                        });

                        Analytics.registerClick('DCSext.unfollowTheme', scope.theme['@id']);
                    } else {
                        PerspectiveBuilder.buildPerspective('theme', 'follow', scope.theme['@id'])
                            .then(function (body) {
                                Perspectives.post(body)
                                    .then(function (result) {
                                        scope.theme.followPerspectiveId = result;
                                        scope.theme.isFollowed = true;
                                        Notifications.success('‘' + scope.theme.canonicalLabel + '’ is now being followed.');
                                    });
                            });
                        Analytics.registerClick('DCSext.followTheme', scope.theme['@id']);
                    }

                    $event.stopPropagation();
                };
                
                scope.minimize = function ($event) {
                    scope.theme.expanded = !scope.theme.expanded;
                    if (scope.theme.expanded) {
                        scope.tabs.theme.open = true;
                    } else {
                        scope.tabs.theme.open = false;
                        scope.tabs.market.open = false;
                    }
                    $event.stopPropagation();
                };
                
                scope.maximize = function ($event) {
                    
                    if (scope.theme.expanded !== true) {
                        scope.theme.expanded = true;
                        scope.tabs.theme.open = true;
                        $event.stopPropagation();
                    }
                };

                scope.toggleServiceThemes = function ($event) {
                    scope.tabs['theme'].open = true;
                    scope.tabs['market'].open = false;
                    scope.theme.expanded = true;
                    $event.stopPropagation();
                };
                
                scope.toggleRelatedMarkets = function ($event) {
                    scope.tabs['theme'].open = false;
                    scope.tabs['market'].open = true;
                    scope.theme.expanded = true;
                    $event.stopPropagation();
                };
                
                scope.$on(_TILE_SIZE_CHANGING_, function () {
                    scope.theme.tileSizeStateHash = Math.random();
                });
            }
        };
    };

    tile.$inject = ['Themes', 'Perspectives', 'PerspectiveBuilder', 'Notifications', 'Analytics', '_TILE_SIZE_CHANGING_'];

    return tile;
});

