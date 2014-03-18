define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var controller = function ($scope, userService) {

        function formatUserName(user) {
            if (user.forename && user.surname) {
                return user.forename + ' ' + user.surname;
            }
            else if (user.forename) {
                return user.forename;
            }
            else if (user.surname) {
                return user.surname;
            } else {
                return 'User';
            }
        }

        userService.getCurrentUser()
            .then(function (data) {
                $scope.name = formatUserName(data);
        });
    };

    controller.$inject = ['$scope', 'UserService'];
    return controller;
});