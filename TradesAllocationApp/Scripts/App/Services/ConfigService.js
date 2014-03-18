define(['angular'], function() {
    'use strict';

    var service = function ($window) {
        return {
            isisRootApi: $window.config !== undefined ? $window.config.isisRootApi : '',
            clientServicePath: $window.config !== undefined ? $window.config.clientServicePath : '',
            logoutUrl: $window.config !== undefined ? $window.config.logoutUrl : '',
            forbiddenUrl: $window.config !== undefined ? $window.config.forbiddenUrl : '',
            loginUrl: $window.config !== undefined ? $window.config.loginUrl : '',
            reportsBaseUrl: $window.config !== undefined ? $window.config.reportsBaseUrl : '',
            banBaseUrl: $window.config !== undefined ? $window.config.banBaseUrl : '',
            treeGridBasePath: $window.config !== undefined ? $window.config.dashboardBaseUrl + '/Scripts/Lib/TreeGrid/' : ''
        };
    };
    service.$inject = ['$window'];
    return service;
});