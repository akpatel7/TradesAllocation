define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var service = function ($resource, $q, DataEndpoint, ViewableThingUri, $http) {

        return {
            suggest: function(o) {
                var deferred = $q.defer(),
                    options = {
                        q: '',
                        type: ViewableThingUri,
                        limit: 100
                    };
                _.extend(options, o);

                var params = [];
                var addIfPresent = function(key, value) {
                    if (value) {
                        params.push({key: key, value: value});
                    }
                };
                
                addIfPresent('q', options.q);
                addIfPresent('type', options.type);
                addIfPresent('limit', options.limit);
                addIfPresent('orderby', options.orderBy);
                
                DataEndpoint.getTemplatedEndpoint('suggest', params).then(function(result) {
                    var headers = $.extend({}, $http.defaults.headers.common);
                    $.extend(headers, { "Accept": "application/x-suggestions+json" });

                    $http({
                        method: 'GET',
                        url: result,
                        headers: headers
                    }).success(function (data) {
                        var suggestions = [],
                            i,
                            length = data[1].length;

                        for (i = 0; i < length; i++) {
                            suggestions.push({
                                '@id': data[3][i],
                                canonicalLabel: data[1][i],
                                type: {
                                    '@id': data[4][i].type,
                                    canonicalLabel: data[2][i]
                                }
                            });
                        }
                        deferred.resolve(suggestions);
                    });
                });

                return deferred.promise;
            }
        };
    };

    service.$inject = ['$resource', '$q', 'DataEndpoint', 'ViewableThingUri', '$http'];
    return service;

});