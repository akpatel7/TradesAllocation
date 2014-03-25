define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    function getResourceType(favouritableThing) {
        return favouritableThing.isPortfolio ? 'portfolio' : 'allocation';
    }
    function getName(favouritableThing) {
        return favouritableThing.Instrument || favouritableThing.Name;
    }
    var controller = function ($scope, $rootScope, PerspectiveBuilder, Perspectives, Notifications, Analytics) {
        function getPerspectiveBuilder(favouritableThing) {
            return favouritableThing.isPortfolio ? PerspectiveBuilder.buildPortfolioPerspective : PerspectiveBuilder.buildAllocationPerspective;
        }

        $scope.toggleFavourite = function (favouritableThing, $event) {
            
            if ($event !== undefined && $event !== null) {
                $event.stopPropagation();
            }

            var resourceType = getResourceType(favouritableThing);
            
            if (favouritableThing.perspectiveId) {
                Perspectives.remove(favouritableThing.perspectiveId)
                    .then(function() {
                        favouritableThing.perspectiveId = undefined;
                        favouritableThing.isFavourited = false;
                        Notifications.success('"' + getName(favouritableThing) + '" was removed from your favourite list.');
                    });
                Analytics.registerClick('DCSext.unfavourite' + resourceType, favouritableThing.Uri);
            } else {
                var builder = getPerspectiveBuilder(favouritableThing);
                builder('bookmark', favouritableThing.Uri)
                    .then(function(body) {
                        Perspectives.post(body)
                            .then(function(result) {
                                favouritableThing.perspectiveId = result;
                                favouritableThing.isFavourited = true;
                                Notifications.success('"' + getName(favouritableThing) + '" is now in your favourite list.');
                            });
                    });
                Analytics.registerClick('DCSext.favourite' + resourceType, favouritableThing.Uri);
            }
        };

        $scope.getFavouritedState = function (favouritableThing) {
            return favouritableThing.isFavourited === true || favouritableThing.isFavourited === 1 ? 'on' : 'off';
        };
        
    };

    controller.$inject = ['$scope', '$rootScope', 'PerspectiveBuilder', 'Perspectives', 'Notifications', 'Analytics'];

    return controller;
});