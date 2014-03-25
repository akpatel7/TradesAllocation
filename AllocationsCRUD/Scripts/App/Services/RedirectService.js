define(['angular'], function () {
    'use strict';

    var service = function ($window, config) {
        
        function redirectToLogout() {
            if (config.logoutUrl) {
                $window.location.href = config.logoutUrl;
            }
        }
        function redirectToForbidden() {
            if (config.forbiddenUrl) {
                $window.location.href = config.forbiddenUrl;
            }
        }
        function redirectToLoginPage() {
            if (config.loginUrl) {
                $window.location.href = config.loginUrl + "?returnURL=" + $window.encodeURIComponent($window.location.href);
            }
        }
        
        function redirectTo(url) {
            $window.location.href = url;
        }

        return {
            logout: redirectToLogout,
            forbidden: redirectToForbidden,
            unauthorised: redirectToLoginPage,
            redirectTo: redirectTo
        };
    };
    service.$inject = ['$window', 'config'];
    return service;
});