define(['angular', 'underscore', 'jquery'], function (angular, _, $) {
    'use strict';

    var controller = function ($scope, DataEndpoint, $http, UserService, Notifications, PerspectiveBuilder, Perspectives) {
        $scope.colleagues = [];
        $scope.hideForm = true;
        $scope.invalid = false;
        
        $scope.shareTrade = function (item) {
            $scope.tradeId = item.trade.trade_id;
            $scope.hideForm = false;
            $scope.invalid = false;
            $scope.message = '';

            _.each($scope.colleagues, function(user) {
                user.isSelected = false;
            });

            if (_.isEmpty($scope.colleagues)) {
                UserService.getCurrentUser()
                    .then(function(user) {
                        UserService.getCurrentUsersGroupMembers()
                            .then(function(users) {
                                var filterCurrentUser = function(u) {
                                    return u._id !== user._id;
                                };
                                var colleagues = [];
                                _.each(_.filter(users, filterCurrentUser), function(u) {
                                    colleagues.push({
                                        id: u._id,
                                        label: u._forename + ' ' + u._surname,
                                        isSelected: false
                                    });
                                });
                                $scope.colleagues = colleagues;
                            });
                    });                
            }
        };

        $scope.hasSelectedColleagues = function() {
            var recipients = _.filter($scope.colleagues, function (item) {
                return item.isSelected;
            });

            return !!_.isEmpty(recipients);
        };

        $scope.disableShare = function() {
            return !$scope.form.$dirty || $scope.invalid || $scope.form.message.$invalid;
        };

        $scope.submit = function () {
            if (!!$scope.hasSelectedColleagues()) {
                $scope.invalid = true;
                return;
            }
            
            if ($scope.form.message.$invalid) {
                $scope.form.message.$displayEmpty = $scope.form.message.$isEmpty();
                return;
            }

            var recipients = _.filter($scope.colleagues, function (item) {
                return item.isSelected;
            });

            PerspectiveBuilder.buildTradePerspective('shared', $scope.tradeId)
                .then(function(body) {
                    if (!_.isEmpty($scope.form.message.$modelValue)) {
                        body['trade-perspective'].description = $scope.form.message.$modelValue;
                    }
                    body['trade-perspective'].member = [];
                    _.each(recipients, function(recipient) {
                        body['trade-perspective'].member.push({ _id: recipient.id, _type: 'user' });
                    });
                    Perspectives.post(body)
                        .then(function () {
                            Notifications.success('Trade shared successfully.');
                            $scope.hideForm = true;
                        });
                });
        };
    };

    controller.$inject = ['$scope', 'DataEndpoint', '$http', 'UserService', 'Notifications', 'PerspectiveBuilder', 'Perspectives'];
    return controller;
});