define(['angular', 'underscore'], function (angular, _) {
    'use strict';
    
    function sanitiseUrlId(id) {
        return _.last(id.split('/'));
    }
    
    var service = function($resource, DataEndpoint, $q) {
        var getAggregatedOpinionCount = function(resourceType, resourceId, status) {
            var deferred = $q.defer();
            if (_.isArray(resourceId)) {
                if (resourceId.length > 0) {
                    DataEndpoint.getTemplatedEndpoint('opinions', [
                        { key: 'resourceType', value: resourceType },
                        { key: 'status', value: status },
                        { key: 'resource', value: resourceId }
                    ]).then(function(enpointUrl) {
                        $resource(enpointUrl, {}, {
                            get: {
                                method: 'GET'
                            }
                        }).get({}, function(countData) {
                            var result = {};
                            _.each(countData.OpinionsResults.Results.OpinionResult, function(r) {
                                result[r.ResourceId] = parseInt(r.Count, 10);
                            });
                            deferred.resolve(result);
                        });
                    });
                } else {
                    deferred.resolve({});
                }
            } else {
                DataEndpoint.getTemplatedEndpoint('likes', [
                { key: 'resourceType', value: resourceType },
                { key: 'resourceId', value: resourceId },
                { key: 'status', value: status }
                ]).then(function (enpointUrl) {
                    $resource(enpointUrl, {}, {
                        get: {
                            method: 'GET'
                        }
                    }).get({}, function (countData) {
                        deferred.resolve(countData);
                    });
                });
            }
            
            return deferred.promise;
        };
        return {
            like: function (resourceType, resourceId, vote) {
                return DataEndpoint.getTemplatedEndpoint(
                    ['users', 'likes', 'like'],
                    {
                        'relatedResourceType': resourceType,
                        'id': sanitiseUrlId(resourceId)
                    }
                ).then(function(result) {
                    var resource = $resource(result, {}, { put: { method: 'PUT' } });
                    return resource.put(vote);
                });
            },
            getAggregatedLikeCount: function (resourceType, resourceId) {
                return getAggregatedOpinionCount(resourceType, resourceId, 'like');
            },
            getAggregatedDislikeCount: function(resourceType, resourceId) {
                return getAggregatedOpinionCount(resourceType, resourceId, 'dislike');
            }
        };
    };

    service.$inject = ['$resource', 'DataEndpoint', '$q'];
    return service;
});