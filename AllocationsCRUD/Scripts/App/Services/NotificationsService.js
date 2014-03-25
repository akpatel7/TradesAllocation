define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var service = function ($scope, $timeout) {
        $scope.notifications = [];
        
        $scope.addNotification = function (notification) {
            $scope.notifications.push(notification);
            $timeout(function() {
                var index = _.indexOf($scope.notifications, notification);
                $scope.notifications.splice(index, 1);
            }, 3000);
        };
        
        return {
           
            info: function (message) {
                $scope.addNotification({ message: message, type: 'info' });
            },
            success: function (message) {
                $scope.addNotification({ message: message, type: 'success' });
            },
            error: function (message) {
                $scope.addNotification({ message: message, type: 'error' });
            },
            warning: function (message) {
                $scope.addNotification({ message: message, type: 'warning' });
            }
        };
    };
    service.$inject = ['$rootScope', '$timeout'];
    return service;
});