define(['angular', 'underscore'], function (angular, _) {
    'use strict';
    
    var perspectives = function ($resource, $q, DataEndpoint) {
        return {
            post: function(body) {
                var deferred = $q.defer();
                DataEndpoint.getEndpoint(['users', 'saved'])
                        .then(function (result) {
                            $resource(result, {}).save(body, function (content, headers) {
                                var location = DataEndpoint.internaliseApiUrl(headers('Location')).split('/');
                                deferred.resolve(_.last(location));
                            });
                        });                
                return deferred.promise;
            },
            remove: function (id) {
                var deferred = $q.defer();
                DataEndpoint.getTemplatedEndpoint(['users', 'saved', 'saved-resources-by-id'], [{ key: 'id', value: id }])
                    .then(function(result) {
                        $resource(result, {}).get({}, function(response, headers) {
                            var location = DataEndpoint.internaliseApiUrl(headers('Location'));
                            $resource(location, {}).remove({}, function() {
                                deferred.resolve(true);
                            });
                        });
                    });
                
                return deferred.promise;
            }
        };        
    };

    perspectives.$inject = ['$resource', '$q', 'DataEndpoint'];
    return perspectives;
});