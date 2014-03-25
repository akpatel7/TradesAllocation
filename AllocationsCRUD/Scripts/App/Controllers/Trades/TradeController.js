define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var controller = function ($scope, PerspectiveBuilder, Perspectives, Notifications) {

        $scope.toggleFavourite = function (trade, $event) {
            if (!trade.isFavourited) {
                PerspectiveBuilder.buildTradePerspective('bookmark', trade.trade_id)
                    .then(function (perspective) {
                        Perspectives.post(perspective).then(function (perspectiveId) {
                            Notifications.success('Trade successfully added to favourites.');
                            trade.perspectiveId = perspectiveId;
                            trade.isFavourited = true;
                        });
                    });
            } else {
                Perspectives.remove(trade.perspectiveId)
                    .then(function (result) {
                        if (result) {
                            Notifications.success('Trade successfully removed from favourites.');
                            trade.perspectiveId = undefined;
                            trade.isFavourited = false;
                        }
                    });
            }
            $event.stopPropagation();
        };
    };

    controller.$inject = ['$scope', 'PerspectiveBuilder', 'Perspectives', 'Notifications'];
    return controller;
});