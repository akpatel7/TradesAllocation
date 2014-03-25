define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var views = function($resource, $q, DataEndpoint) {
        return {
            getViews: function(o) {
                var deferred = $q.defer(),
                    options = {
                        filters: {
                            uri: ''
                        }
                    };
                _.extend(options, o);

                DataEndpoint.getTemplatedEndpoint('views', [
                    { key: 'on', value: options.filters.uri },
                    { key: 'defaultViewRecommendationType', value: true }
                ])
                    .then(function(result) {
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

    views.$inject = ['$resource', '$q', 'DataEndpoint'];
    return views;
});