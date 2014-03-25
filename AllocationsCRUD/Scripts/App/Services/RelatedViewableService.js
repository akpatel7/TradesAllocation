define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var relatedViewableService = function ($resource, $q, DataEndpoint) {
        return {            
             getRelatedViewables: function (o) {
                var deferred = $q.defer(),
                    options = {
                        relatedTo: undefined,
                        date: undefined
                    };
                _.extend(options, o);

                 DataEndpoint.getTemplatedEndpoint('viewables-related', [
                    { key: 'relatedTo', value: options.relatedTo },
                    { key: 'date', value: options.date }
                ]).then(function (result) {
                    $resource(result, {}, {
                        get: {
                            method: 'GET'
                        }
                    }).get({}, function (data) {
                        deferred.resolve(data);
                    });
                });
                return deferred.promise;
            }
        };
    };

    relatedViewableService.$inject = ['$resource', '$q', 'DataEndpoint'];
    return relatedViewableService;
});