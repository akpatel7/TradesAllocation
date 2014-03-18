define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var service = function (TradesFilter, TradesColumns, UrlProvider) {
        return {
            buildDashboardQuery: function(options) {
                var newOptions = {
                    orderby: 'last_updated',
                    direction: 'desc'
                },
                    query = {},
                    filter = '';

                _.extend(newOptions, options);
                
                if (options && options.orderby) {
                    newOptions.direction = options.direction;
                    newOptions.orderby = options.orderby;
                }

                if (options && options.filterExpression) {
                    filter = options.filterExpression;
                }

                _.extend(query, {
                    showFollowsOnly: options.showFollowsOnly,
                    showFavouritesOnly: options.showFavouritesOnly
                });

                if (filter !== '') {
                    _.extend(query, {
                        '$filter': filter
                    });
                }

                _.extend(query, {
                    $orderby: newOptions.orderby + ' ' + newOptions.direction
                });

                return query;
            },
            buildExportUrl: function(tradesBaseUrl, options) {
                var columns = _.chain(TradesColumns.getColumns())
                        .filter(function (col) { return col.isSelected && col.isExportable; })
                        .pluck('key')
                        .map(function (col) {
                            return col.replace(/TradeLines\//gi, '');
                        })
                        .value();

                return UrlProvider.getTradesExportUrl(tradesBaseUrl, options, columns);
            }
        };
    };

    service.$inject = ['TradesFilter', 'TradesColumns', 'UrlProvider'];
    return service;
});