define(['angular', 'underscore'], function (angular, _) {
    'use strict';


    var viewableController = function ($scope, $rootScope, PerspectiveBuilder, Perspectives, Notifications, Views, Annotations, Analytics, Like, Dates, _TILE_SIZE_CHANGING_) {
        // markets and economies
        function getViewId(view) {
            return view.viewOrigin && view.viewOrigin['@id'] ? view.viewOrigin['@id'] : view['@id'];
        }

        // views are sorted by display order, and then by descending last updated date
        $scope.sortViews = function (view) {
            var diff = Dates.calculateDifferenceInDays('2099-12-31', view.lastUpdatedDate);
            return (view.displayOrder || 0).toString() + diff;
        };
        
        $scope.toggleFavouriteView = function (view, $event) {
            if ($event !== undefined && $event !== null) {
                $event.stopPropagation();
            }
            if ($scope.viewable.perspectiveId === undefined) {
                if (view.perspectiveId) {
                    Perspectives.remove(view.perspectiveId)
                        .then(function () {
                            view.perspectiveId = undefined;
                            view.isFavourited = false;
                            Notifications.success('The view has been removed from your favourites.');
                        });
                    Analytics.registerClick('DCSext.unfavouriteView', view['@id']);
                } else {
                    PerspectiveBuilder.buildViewPerspective('bookmark', getViewId(view), $scope.viewable['@id'])
                        .then(function(body) {
                            Perspectives.post(body)
                                .then(function(result) {
                                    view.perspectiveId = result;
                                    view.isFavourited = true;
                                    Notifications.success('The view has been added to your favourites.');
                                });
                        });
                    Analytics.registerClick('DCSext.favouriteView', view['@id']);
                }
            } else {
                Notifications.warning('You are unable to favourite this service view because \'' + $scope.viewable.canonicalLabel + '\' is already favourited.');
            }
        };
        
        $scope.toggleFollowView = function (view, $event) {
            if ($event !== undefined && $event !== null) {
                $event.stopPropagation();
            }
            if ($scope.viewable.followPerspectiveId === undefined) {
                if (view.followPerspectiveId) {
                    Perspectives.remove(view.followPerspectiveId)
                        .then(function () {
                            view.followPerspectiveId = undefined;
                            view.isFollowed = false;
                            Notifications.success(view.service.canonicalLabel + ': Market / Economy is no longer being followed.');
                        });
                    Analytics.registerClick('DCSext.unfollowView', view['@id']);
                } else {
                    PerspectiveBuilder.buildViewPerspective('follow', getViewId(view), $scope.viewable['@id'])
                        .then(function (body) {
                            Perspectives.post(body)
                                .then(function (result) {
                                    view.followPerspectiveId = result;
                                    view.isFollowed = true;
                                    Notifications.success(view.service.canonicalLabel + ': Market / Economy is now being followed.');
                                });
                        });
                    Analytics.registerClick('DCSext.followView', view['@id']);
                }
            } else {
                Notifications.warning('You are unable to follow this service view because \'' + $scope.viewable.canonicalLabel + '\' is already being followed.');
            }
        };

        // annotations
        $scope.$watch('viewable', function (newVal) {
            if (newVal) {
                if ($scope.viewable.annotationsLoaded === undefined) {

                    var viewUris = _.pluck($scope.viewable.activeView['@set'], '@id');
                    _.extend($scope.viewable, {
                        annotationsLoaded: true
                    });
                    Annotations.getAnnotations({
                        conceptUri: viewUris,
                        onlyOneAnnotationPerDocument: true
                    }).then(function (annotations) {
                            _.each($scope.viewable.activeView['@set'], function (view) {
                                _.extend(view, {
                                    annotations: annotations[view['@id']]
                                });
                            });
                            $scope.$root.$broadcast(_TILE_SIZE_CHANGING_);
                        });
                }
                if ($scope.viewable.userContextLoaded === undefined) {
                    var resources = _.pluck($scope.viewable.activeView['@set'], '@id');
                    resources = _.map(resources, function (r) {
                        return _.last(r.split('/'));
                    });
                    _.extend($scope.viewable, {
                        userContextLoaded: true
                    });
                    Like.getAggregatedLikeCount('view', resources)
                        .then(function (data) {
                            
                            _.each($scope.viewable.activeView['@set'], function (view) {
                                var resourceId = _.last(view['@id'].split('/'));
                                _.extend(view, {
                                    likeCount: data[resourceId]
                                });
                            });
                        });
                    
                    Like.getAggregatedDislikeCount('view', resources)
                       .then(function (data) {
                           _.each($scope.viewable.activeView['@set'], function (view) {
                               var resourceId = _.last(view['@id'].split('/'));
                               _.extend(view, {
                                   dislikeCount: data[resourceId]
                               });
                           });
                       });
                }
            }
        });
    };

    viewableController.$inject = ['$scope', '$rootScope', 'PerspectiveBuilder', 'Perspectives', 'Notifications', 'Views', 'Annotations', 'Analytics', 'Like', 'Dates', '_TILE_SIZE_CHANGING_'];

    return viewableController;
});