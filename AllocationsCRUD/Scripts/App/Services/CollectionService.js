define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var service = function($http, $q, DataEndpoint) {
        return {
            get: function(o) {
                var deferred = $q.defer(),
                    options = {
                        type: '',
                        joiningPredicate: '',
                        joiningResource: '',
                        limit: 50
                    };
                _.extend(options, o);

                DataEndpoint.getTemplatedEndpoint('collection', [
                    { key: 'type', value: options.type },
                    { key: 'joining-predicate', value: options.joiningPredicate },
                    { key: 'joining-resource', value: options.joiningResource },
                    { key: 'limit', value: options.limit }
                ])
                    .then(function (result) {
                        $http({
                                method: 'GET',
                                url: result
                        }).success(function (data) {
                            deferred.resolve(data);
                        });
                    });


                return deferred.promise;
            }
        };
    };

    service.$inject = ['$http', '$q', 'DataEndpoint'];
    return service;
});