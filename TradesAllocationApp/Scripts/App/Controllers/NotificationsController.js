define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var notificationsController = function ($scope, Notifications) {
        $scope.showNotifications = false;
        $scope.$watch('notifications', function(newVal, oldVal) {
            $scope.showNotifications = newVal.length > 0;
        }, true);
    };
    
    notificationsController.$inject = ['$scope', 'Notifications'];

    return notificationsController;
});