define(['angular', 'underscore', 'App/Services/services'], function (angular, _) {
    'use strict';
    // Source: http://codingsmackdown.tv/blog/2013/04/20/using-response-interceptors-to-show-and-hide-a-loading-widget-redux/
    var service = function ($httpProvider, _REQUEST_STARTED_, _REQUEST_ENDED_, IsisConsumerId) {
        $httpProvider.interceptors.push(function ($q, $injector) {
            var $http, rootScope;
            return {
                'request': function(request) {
                    rootScope = rootScope || $injector.get('$rootScope');
                    rootScope.$broadcast(_REQUEST_STARTED_);
                    return request;
                },
                'response': function(response) {
                    // get $http via $injector because of circular dependency problem
                    $http = $http || $injector.get('$http');
                    // don't send notification until all requests are complete
                    if ($http.pendingRequests.length < 1) {
                        // get $rootScope via $injector because of circular dependency problem
                        rootScope = rootScope || $injector.get('$rootScope');
                        // send a notification requests are complete
                        rootScope.$broadcast(_REQUEST_ENDED_);
                    }
                    return response;
                },
                'responseError': function(rejection) {
                    $http = $http || $injector.get('$http');
                    if ($http.pendingRequests.length < 1) {
                        rootScope = rootScope || $injector.get('$rootScope');
                        rootScope.$broadcast(_REQUEST_ENDED_);
                    }
                    return $q.reject(rejection);
                }
            };
        });
        // current angular version does not support request interceptors
        $httpProvider.defaults.headers.common = _.extend($httpProvider.defaults.headers.common || {}, { 'Consumer-Id': IsisConsumerId });

    };
    service.$inject = ['$httpProvider', '_REQUEST_STARTED_', '_REQUEST_ENDED_', 'IsisConsumerId'];
    return service;
});