define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var service = function ($resource, $q, DataEndpoint) {
        return {            
            getPortfolioRelatedViews: function (options) {
                 var deferred = $q.defer();

                DataEndpoint.getTemplatedEndpoint(['bca-trades', 'allocation-related-views'], [
                    { key: 'uri', value: options.uri }
                ]).then(function (result) {
                    $resource(result, {}, {
                        get: {
                            method: 'GET'
                        }
                    }).get({}, function (data) {
                        var views = [];
                        if (_.isArray(data['@graph'])) {
                            if (data['@graph'][0].informedByView['@set'] !== undefined) {
                                views = data['@graph'][0].informedByView['@set'];
                            } else {
                                views = [data['@graph'][0].informedByView];
                            }
                            _.each(views, function (view) {
                                if (view.informedByTheme === undefined) {
                                    _.extend(view, {
                                        informedByTheme: {
                                            '@set': []
                                        }
                                    });
                                } else if (view.informedByTheme['@set'] === undefined) {
                                    _.extend(view.informedByTheme, {
                                        '@set': [view.informedByTheme]
                                    });
                                }
                            });
                        }
                        
                        deferred.resolve(views);
                    });
                });
                return deferred.promise;
            }
        };
    };

    service.$inject = ['$resource', '$q', 'DataEndpoint'];
    return service;
});