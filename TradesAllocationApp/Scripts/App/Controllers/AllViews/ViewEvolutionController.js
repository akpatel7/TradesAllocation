define(['angular', 'underscore'], function (angular, _) {
    'use strict';


    var controller = function ($scope, Notifications, Views, Annotations, Suggest, ViewableThingUri, _TILE_SIZE_CHANGING_) {
        $scope.canAddRelatedMarket = function() {
            return $scope.viewEvolutions.relatedViewable === undefined;
        };
        $scope.autosuggest = {
            selected: ''
        };
       
        $scope.viewEvolutions = {
            views: [],
            relatedViewable: undefined
        };

        $scope.loadViewsEvolutions = function (viewableUri) {
            Views.getViews({
                filters: {
                    uri: viewableUri
                }
            }).then(function (data) {
                var views = data['@graph'];
                if (views !== undefined && views !== null) {
                    var authorizedViews = _.filter(views, function(view) {
                            return view.hasPermission === true;
                        }),
                        viewUris;

                    if (views.length === 0) {
                        Notifications.info('No views found for this market or economy.');
                    } else if (authorizedViews.length === 0) {
                        Notifications.info('Please contact your account manager to subscribe to this content.');
                    } else {
                        viewUris = _.pluck(authorizedViews, '@id');

                        Annotations.getAnnotations({
                            conceptUri: viewUris
                        }).then(function(annotations) {
                                var newViews;
                                _.each(authorizedViews, function(view) {
                                    _.extend(view, {
                                        annotations: annotations[view['@id']]
                                    });
                                });
                                
                                newViews = _.union($scope.viewEvolutions.views, authorizedViews);
                                $scope.viewEvolutions.views = newViews;
                            });
                      
                    }
                } else {
                    Notifications.info('No views found for this market or economy.');
                }
            });
        };

        $scope.getSuggestedItems = function (value) {
            return Suggest.suggest({
                q: value,
                type: ViewableThingUri
            });
        };

        $scope.selectSuggestedItem = function (item) {
            if ($scope.canAddRelatedMarket() && item['@id'] !== $scope.viewable['@id']) {
                $scope.loadViewsEvolutions(item['@id']);
                $scope.viewEvolutions.relatedViewable = item;
            }
            $scope.autosuggest.selected = '';
           
        };

        $scope.$watch('viewable', function(newVal) {
            if (newVal) {
                $scope.viewEvolutions.views = [];
                $scope.loadViewsEvolutions(newVal['@id']);
            }
        });
        

        $scope.removeViewable = function (viewable) {
            if (viewable['@id'] !== $scope.viewable['@id']) {
                $scope.viewEvolutions.views = _.filter($scope.viewEvolutions.views, function (view) {
                    return view.viewOn['@id'] !== viewable['@id'];
                });
                $scope.viewEvolutions.relatedViewable = undefined;
            }
        };

        $scope.chartCreatedCallback = function() {
            $scope.$emit(_TILE_SIZE_CHANGING_);
        };
    };

    controller.$inject = ['$scope', 'Notifications', 'Views', 'Annotations', 'Suggest', 'ViewableThingUri', '_TILE_SIZE_CHANGING_'];

    return controller;
});