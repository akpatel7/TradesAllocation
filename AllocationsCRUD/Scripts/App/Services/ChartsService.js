define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var service = function($resource, $q, DataEndpoint, UserService) {
        return {
            getChart: function(o) {
                var deferred = $q.defer(),
                    options = {
                       id: ''
                    };
                _.extend(options, o);
                UserService.isCurrentUserAuthorisedToSeeCharts().then(function (isCurrentUserAuthorisedToSeeCharts) {
                    if (isCurrentUserAuthorisedToSeeCharts) {
                        DataEndpoint.getTemplatedEndpoint(['charts', 'chart'], [
                            { key: 'id', value: options.id }
                        ]).then(function(result) {
                            $resource(result).get({}, function(data) {
                                deferred.resolve(data.chart);
                            }, function(data) {
                                deferred.reject(data);
                            });
                        });

                    } else {
                        deferred.reject('User not subscribed to chart.');
                    }
                });
               
                return deferred.promise;
            }
        };
    };

    service.$inject = ['$resource', '$q', 'DataEndpoint', 'UserService'];
    return service;
});