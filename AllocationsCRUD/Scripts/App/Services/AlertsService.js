define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var service = function($resource, $q, DataEndpoint) {
        
        function markAlertsAsRead(alerts, isFullyRead) {
            var deferred = $q.defer();
            DataEndpoint.getTemplatedEndpoint(['users', 'alert-history'], [])
                .then(function (url) {
                    $resource(url, {}, { get: { method: 'GET' } })
                        .get({}, function(redirectData, headers) {
                            var redirectToLocation = DataEndpoint.internaliseApiUrl(headers('Location')),
                                request = {
                                    isFullyRead: isFullyRead
                                };
                            $resource(redirectToLocation, request, { put: { method: 'PUT' } })
                                .put({
                                    ids: alerts
                                }, function (data) {
                                    deferred.resolve(data);
                                });
                        });
                });

            return deferred.promise;
        }

        return {
            getAlerts: function(o) {
                var deferred = $q.defer(),
                    options = {
                        page: 0,
                        pageSize: 10
                    };
                _.extend(options, o);

                DataEndpoint.getTemplatedEndpoint(['users', 'alert-history' ], [
                    { key: 'page', value: options.page },
                    { key: 'pageSize', value: options.pageSize }
                ]).then(function (url) {
                    DataEndpoint.followEndpoint(url, true)
                        .then(function (data) {
                            deferred.resolve(data);
                        });
                });

                return deferred.promise;
            },
            markAlertsAsRead: function (alerts) {
                return markAlertsAsRead(alerts, false);
            },
            markAlertsAsFullyRead: function (alerts) {
                return markAlertsAsRead(alerts, true);
            },
            markAllAlertsAsRead: function () {
                return markAlertsAsRead([], false);
            },
            markAllAlertsAsFullyRead: function () {
                return markAlertsAsRead([], true);
            }
        };
    };

    service.$inject = ['$resource', '$q', 'DataEndpoint'];
    return service;
});