define(['angular', 'underscore', 'jquery'], function (angular, _, $) {
    'use strict';

    var controller = function ($scope, DataEndpoint, $http, UserService, Notifications, PerspectiveBuilder, Perspectives) {
        var followForm = $scope.followForm = {};
        var originalField;

        followForm.showFollowTradeForm = function (item, $event) {
            originalField = item;
            followForm.trade = _.clone(originalField.trade);
            followForm.mainActionName = followForm.getFollowState(item) === 'off' ? 'FOLLOW' : 'APPLY';
            followForm.tradableThings = _.map(originalField.trade.TradeLines, function (tradeLineItem) {
                return _.clone(tradeLineItem);
            });
            if ($event) {
                $event.stopPropagation();
            }
        };

        followForm.submit = function ($event) {
            
            if (followForm.trade.isFollowed === false && followForm.trade.followPerspectiveId !== undefined) {
                Perspectives.remove(followForm.trade.followPerspectiveId)
                    .then(function (result) {
                        originalField.trade.followPerspectiveId = undefined;
                        originalField.trade.isFollowed = false;
                        Notifications.success('"' + originalField.trade.trade_editorial_label + '" is no longer followed.');
                    });
            } else if (followForm.trade.isFollowed === true && followForm.trade.followPerspectiveId === undefined) {
                PerspectiveBuilder.buildTradePerspective('follow', followForm.trade.trade_id)
                    .then(function (body) {
                        Perspectives.post(body)
                            .then(function (result) {
                                originalField.trade.followPerspectiveId = result;
                                originalField.trade.isFollowed = true;
                                Notifications.success('"' + originalField.trade.trade_editorial_label + '" is now followed.');
                            });
                    });
            }

            _.each(followForm.tradableThings, function (tradableThing, index) {
                if (tradableThing.isFollowed === false && tradableThing.followPerspectiveId !== undefined) {
                    Perspectives.remove(tradableThing.followPerspectiveId)
                        .then(function (result) {
                            originalField.trade.TradeLines[index].followPerspectiveId = undefined;
                            originalField.trade.TradeLines[index].isFollowed = false;
                            Notifications.success('"' + originalField.trade.TradeLines[index].tradable_thing_label + '" is no longer followed.');
                        });
                } else if (tradableThing.isFollowed === true && tradableThing.followPerspectiveId === undefined) {
                    PerspectiveBuilder.buildTradableThingPerspective('follow', tradableThing.tradable_thing_uri)
                        .then(function (body) {
                            Perspectives.post(body)
                                .then(function (result) {
                                    originalField.trade.TradeLines[index].followPerspectiveId = result;
                                    originalField.trade.TradeLines[index].isFollowed = true;
                                    Notifications.success('"' + originalField.trade.TradeLines[index].tradable_thing_label + '" is now followed.');
                                });
                        });
                }
            });
            
            $scope.hide();
            if ($event) {
                $event.stopPropagation();
            }
        };
        
        followForm.hide = function ($event) {
            $scope.hide();
            if ($event) {
                $event.stopPropagation();
            }
        };

        followForm.getFollowState = function (item) {
            var isFollowingAllTradableThings = _.all(item.trade.TradeLines, function (tradableThing) {
                return tradableThing.isFollowed === true;
            });
            if (isFollowingAllTradableThings === true && item.trade.isFollowed === true) {
                return 'on';
            }

            var isFollowingAnyTradableThings = _.any(item.trade.TradeLines, function (tradableThing) {
                return tradableThing.isFollowed === true;
            });
            if (isFollowingAnyTradableThings === true || item.trade.isFollowed === true) {
                return 'half';
            }

            return 'off';
        };
        
        followForm.formClick = function ($event) {
            $event.stopPropagation();
        };
    };

    controller.$inject = ['$scope', 'DataEndpoint', '$http', 'UserService', 'Notifications', 'PerspectiveBuilder', 'Perspectives'];
    return controller;
});