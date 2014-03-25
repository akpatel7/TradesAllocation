define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var viewableTileController = function ($scope, Perspectives, PerspectiveBuilder, Notifications, Analytics, RelatedViewable, Annotations, Like, AnnotationsSupportUri, _TILE_SIZE_CHANGING_, View) {
        
        var getViewableState = function(viewable, property, perspectiveProperty) {
            if (viewable[property] === true && viewable[perspectiveProperty] !== undefined) {
                return 'on';
            } else {
                if (viewable[property] === true || (viewable.activeView !== undefined && _.some(viewable.activeView['@set'], function (item) {
                    return item[perspectiveProperty] !== undefined;
                }))) {
                    return 'half';
                } else {
                    return 'off';
                }
            }
        };
        
        $scope.$watch('viewable', function(value) {
            if (value) {
                
                $scope.view = value.dominantView;
                $scope.absoluteViewsCount = value.activeView !== undefined ? _.filter(value.activeView['@set'], function (view) {
                    return View.isViewRelative(view) === false;
                }).length : 0;
                $scope.relativeViewsCount = value.activeView !== undefined ? _.filter(value.activeView['@set'], function (view) {
                    return View.isViewRelative(view) === true;
                }).length : 0;
                $scope.servicesCount = value.activeView !== undefined ? _.uniq(value.activeView['@set'], function (view) {
                    return view.service['@id'];
                }).length : 0;

                $scope.researchPageUrl = '/#/research?uri=' + encodeURIComponent(value["@id"]);
                // Angular redirects user to path that has colon not urlEncoded
                $scope.researchPageUrl = $scope.researchPageUrl.replace('%3A', ':');

                if ($scope.viewable.activeView) {
                    $scope.viewable.isFollowed = $scope.viewable.followPerspectiveId !== undefined || _.some($scope.viewable.activeView['@set'], function (v) { return v.followPerspectiveId; });
                    $scope.viewable.isFavourited = $scope.viewable.perspectiveId !== undefined || _.some($scope.viewable.activeView['@set'], function (v) { return v.perspectiveId; });
                }
                $scope.viewable.isFavouritedState = getViewableState($scope.viewable, 'isFavourited', 'perspectiveId');
                $scope.viewable.isFollowedState = getViewableState($scope.viewable, 'isFollowed', 'followPerspectiveId');
            }
        }, false); // avoid deep checking

      
        // Favouriting
        $scope.toggleFavouriteViewable = function ($event) {
            if ($scope.viewable.isFavourited && $scope.viewable.perspectiveId !== undefined) {
                Perspectives.remove($scope.viewable.perspectiveId)
                    .then(function (result) {
                        $scope.viewable.perspectiveId = undefined;
                        if ($scope.viewable.activeView) {
                            $scope.viewable.isFavourited = _.filter($scope.viewable.activeView['@set'], function(v) {
                                return v.perspectiveId !== undefined;
                            }).length > 0;
                        } else {
                           
                            $scope.viewable.isFavourited = false;
                        }
                      
                        $scope.viewable.isFavouritedState = getViewableState($scope.viewable, 'isFavourited', 'perspectiveId');
                        Notifications.success('Market / Economy has been removed from your favourites.');
                    });
                Analytics.registerClick('DCSext.unfavouriteViewable', $scope.viewable['@id']);
            } else {
                PerspectiveBuilder.buildViewablePerspective('bookmark', $scope.viewable['@id'])
                    .then(function(body) {
                        Perspectives.post(body)
                            .then(function(result) {
                                $scope.viewable.perspectiveId = result;
                                $scope.viewable.isFavourited = true;
                                $scope.viewable.isFavouritedState = getViewableState($scope.viewable, 'isFavourited', 'perspectiveId');
                                Notifications.success('Market / Economy has been added to your favourites.');
                            });
                    });
                Analytics.registerClick('DCSext.favouriteViewable', $scope.viewable['@id']);
            }
            $event.stopPropagation();
        };
        
        $scope.$watch(function () {
            if ($scope.viewable && $scope.viewable.activeView) {
                return _.filter($scope.viewable.activeView['@set'], function (activeView) {
                    return activeView && activeView.perspectiveId;
                }).length;
            }
            return -1;
        }, function (newVal) {
            if (newVal !== -1) {
                if ($scope.viewable.activeView) {
                    $scope.viewable.isFavourited = $scope.viewable.perspectiveId !== undefined || _.some($scope.viewable.activeView['@set'], function (v) { return v.perspectiveId; });
                }
                $scope.viewable.isFavouritedState = getViewableState($scope.viewable, 'isFavourited', 'perspectiveId');
            }
        }, true);

        $scope.$watch('viewable.isFavourited + viewable.perspectiveId', function (newVal, oldVal) {
            if (newVal !== oldVal && $scope.viewable && $scope.viewable.activeView && $scope.viewable.activeView['@set']) {
                _.each($scope.viewable.activeView['@set'], function(item) {
                    if (item.perspectiveId === undefined) {
                        item.isFavourited = $scope.viewable.perspectiveId !== undefined;
                        item.isFavouritedState = getViewableState($scope.viewable, 'isFavourited', 'perspectiveId');
                    }
                });
            }
        });

        // Following
        $scope.toggleFollowViewable = function($event) {
            if ($scope.viewable.isFollowed && $scope.viewable.followPerspectiveId !== undefined) {
                Perspectives.remove($scope.viewable.followPerspectiveId)
                    .then(function(result) {
                        $scope.viewable.followPerspectiveId = undefined;
                        $scope.viewable.isFollowed = false;
                        $scope.viewable.isFollowedState = getViewableState($scope.viewable, 'isFollowed', 'followPerspectiveId');
                        Notifications.success('Market / Economy is no longer being followed.');
                    });
                Analytics.registerClick('DCSext.unfollowViewable', $scope.viewable['@id']);
            } else {
                PerspectiveBuilder.buildViewablePerspective('follow', $scope.viewable['@id'])
                    .then(function(body) {
                        Perspectives.post(body)
                            .then(function(result) {
                                $scope.viewable.followPerspectiveId = result;
                                $scope.viewable.isFollowed = true;
                                $scope.viewable.isFollowedState = getViewableState($scope.viewable, 'isFollowed', 'followPerspectiveId');
                                Notifications.success('Market / Economy is now being followed.');
                            });
                    });
                Analytics.registerClick('DCSext.followViewable', $scope.viewable['@id']);
            }
            $event.stopPropagation();
        };

        $scope.$watch('viewable.isFollowed + viewable.followPerspectiveId', function (newVal, oldVal) {
            if (newVal !== oldVal && $scope.viewable && $scope.viewable.activeView && $scope.viewable.activeView['@set']) {
                _.each($scope.viewable.activeView['@set'], function (item) {
                    if (item.followPerspectiveId === undefined) {
                        item.isFollowed = $scope.viewable.followPerspectiveId !== undefined;
                        item.isFollowedState = getViewableState($scope.viewable, 'isFollowed', 'followPerspectiveId');
                    }
                });
            }
        });
        
        $scope.$watch(function () {
            if ($scope.viewable && $scope.viewable.activeView) {
                return _.filter($scope.viewable.activeView['@set'], function (activeView) {
                    return activeView && activeView.followPerspectiveId;
                }).length;
            }
            return -1;
        }, function (newVal) {
            if (newVal !== -1) {
                if ($scope.viewable.activeView) {
                    $scope.viewable.isFollowed = $scope.viewable.followPerspectiveId !== undefined || _.some($scope.viewable.activeView['@set'], function (v) { return v.followPerspectiveId; });
                }
                $scope.viewable.isFollowedState = getViewableState($scope.viewable, 'isFollowed', 'followPerspectiveId');
            }
        }, true);

            
        $scope.fetchRelatedViewables = function() {
            if (!$scope.relatedViewables) {
                $scope.relatedViewables = [{ canonicalLabel: 'Loading...' }];
                RelatedViewable.getRelatedViewables({ relatedTo: $scope.viewable['@id'] })
                    .then(function(data) {
                        var relatedViewables = [];
                        relatedViewables.push.apply(relatedViewables, data['@graph']);
                        relatedViewables.push.apply(relatedViewables, $scope.viewable.related);
                        relatedViewables = _.uniq(relatedViewables, function(item) { return item['@id']; });
                        _.each(relatedViewables, function(related) {
                            related.url = '/#/views?uri=' + encodeURIComponent(related["@id"]);
                        });

                        $scope.relatedViewables = _.sortBy(relatedViewables, function(rv) { return rv.canonicalLabel || '\uFEFF'; });
                    });
            }
        };

        $scope.$on(_TILE_SIZE_CHANGING_, function () {
            $scope.viewable.tileSizeStateHash = Math.random();
        });
    };

    viewableTileController.$inject = ['$scope', 'Perspectives', 'PerspectiveBuilder', 'Notifications', 'Analytics', 'RelatedViewable', 'Annotations', 'Like', 'AnnotationsSupportUri', '_TILE_SIZE_CHANGING_', 'View'];

    return viewableTileController;
});
