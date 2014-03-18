define(['angular', 'underscore'], function(angular, _) {
    'use strict';

    var AlertNotificationsController = function ($scope, Alerts, redirectService, $sce, config) {

        $scope.alertSettingsUrl = config.reportsBaseUrl + '/#/alerts/settings';
        $scope.alertHistoryUrl = config.reportsBaseUrl + '/#/alerts/history';

        function getAlerts() {
            Alerts.getAlerts({
                page: 0,
                pageSize: 11
            }).then(function (data) {
                var notifications = [];
                _.each(data, function(item) {
                    notifications.push(_.extend(item, { alertDescriptionHtml: $sce.trustAsHtml(item.AlertDescription) }));
                });
                $scope.notifications = notifications;
                
            });
        }

        getAlerts();

        setInterval(getAlerts, 300000);
        
        $scope.$watch('notifications', function(newVal) {
            if (newVal) {
                $scope.unreadNotificationsCount = _.filter(newVal, function (notification) {
                    return notification.ProcessedTimestamp === undefined || notification.ProcessedTimestamp === null;
                }).length;
            }
        }, true);

        $scope.openAlerts = function() {
            Alerts.markAllAlertsAsRead()
                .then(function() {
                    getAlerts();
                });
        };

        $scope.openNotification = function (notification) {
            if (notification.UserReadTimestamp === undefined || notification.UserReadTimestamp === null) {
                Alerts.markAlertsAsFullyRead([notification.Id]);
                notification.UserReadTimestamp = new Date();
            }
            redirectService.redirectTo(notification.ViewableResourceLink);
        };

        $scope.markAllAsRead = function() {
            Alerts.markAllAlertsAsFullyRead()
                 .then(function () {
                     _.each($scope.notifications, function(notification) {
                         notification.UserReadTimestamp = new Date();
                     });
                 });
        };
    };
    AlertNotificationsController.$inject = ['$scope', 'Alerts', 'redirectService', '$sce', 'config'];

    return AlertNotificationsController;
});