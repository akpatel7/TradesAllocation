define(['angular'], function (angular) {
    'use strict';
    var service = function ($httpProvider) {
        var interceptor = ['$q', '$injector', '$location', 'config', 'redirectService', function ($q, $injector, $location, config, redirectService) {
            
            function success(response) {
                return response;
            }
            
            function error(response) {
                if (response.status === 401) {
                    redirectService.unauthorised();
                } else if (response.status === 403) {
                    redirectService.forbidden();
                }
                return $q.reject(response);
            }

            return function(promise) {
                return promise.then(success, error);
            };
        }];

        $httpProvider.responseInterceptors.push(interceptor);
    };
    service.$inject = ['$httpProvider'];
    return service;
});