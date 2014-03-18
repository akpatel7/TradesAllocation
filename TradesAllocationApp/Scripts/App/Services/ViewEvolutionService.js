define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var viewEvolutionService = function ($resource, $q, DataEndpoint) {
         return {
             getViewEvolution: function (o) {
                var deferred = $q.defer(),
                    options = {
                        uri: undefined,
                        retrictToLatestActiveEvolution: false
                    };
                _.extend(options, o);

                 DataEndpoint.getTemplatedEndpoint('view-evolution', [
                    { key: 'uri', value: options.uri },
                    { key: 'restrictToLatestInactiveEvolution', value: options.restrictToLatestInactiveEvolution }
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

    viewEvolutionService.$inject = ['$resource', '$q', 'DataEndpoint'];
    return viewEvolutionService;
});