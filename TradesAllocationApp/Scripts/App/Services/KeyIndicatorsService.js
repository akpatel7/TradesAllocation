define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var keyIndicatorsService = function ($resource, $q, DataEndpoint, UserService) {
        return {            
            get: function (o) {
                var deferred = $q.defer(),
                    options = {
                        relatedTo: undefined,
                        date: undefined,
                        page: 1,
                        pageSize: 10
                    };
                _.extend(options, o);
                UserService.isCurrentUserAuthorisedToSeeCharts().then(function(isCurrentUserAuthorisedToSeeCharts) {
                    if (isCurrentUserAuthorisedToSeeCharts) {
                        DataEndpoint.getTemplatedEndpoint(['charts', 'indicators'], [
                            { key: 'viewable', value: options.viewable },
                            { key: 'page', value: options.page },
                            { key: 'pageSize', value: options.pageSize }
                        ]).then(function(result) {
                            $resource(result, {}, {
                                get: {
                                    method: 'GET'
                                }
                            }).get({}, function(data) {
                                var indicators = data.indicators.indicator;
                                if (!_.isArray(indicators)) {
                                    indicators = [indicators];
                                }

                                _.each(indicators, function(indicator) {
                                    _.extend(indicator, {
                                        isUp: parseFloat(indicator.trend) > 0
                                    });
                                    if (!_.isArray(indicator.viewable.service)) {
                                        indicator.viewable.service = [indicator.viewable.service];
                                    }
                                    _.extend(indicator, {
                                        formattedServices: _.map(indicator.viewable.service, function(s) { return _.last(s._resource.split('/')).toUpperCase(); }).join(', ')
                                    });
                                });
                                deferred.resolve({
                                    totalCount: parseInt(data.indicators.totalResults, 10),
                                    indicators: indicators
                                });
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

    keyIndicatorsService.$inject = ['$resource', '$q', 'DataEndpoint', 'UserService'];
    return keyIndicatorsService;
});