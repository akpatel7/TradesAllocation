define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var tradeService = function ($resource, $q, DataEndpoint, $http) {
        var buildIsisQuery = function (options) {

            var query = {
                '$orderby': options.orderBy,
                '$skip': options.page * options.pageSize,
                '$top': options.pageSize,
                '$inlinecount': 'allpages'
            };
            if (options.filter) {
                query['$filter'] = options.filter;
            }
            if (options.expand && options.expand.length > 0) {
                query['$expand'] = options.expand.join();
            }
            return query;
        };

        function concatField(tradeLines, fieldName) {
            return _.reduce(tradeLines, function(memo, value, idx) {
                if (value[fieldName]) {
                    return memo + value[fieldName] + (idx < (tradeLines.length - 1) && (tradeLines[idx + 1][fieldName] && tradeLines[idx + 1][fieldName].length) ? ", " : "");
                } else {
                    return memo;
                }
            }, "");
        }

        function transformTradesData(data) {
            var totalCount = parseInt(data['odata.count'], 10);
            var trades = [];

            _.each(data.value, function(item) {

                var trade = {
                    id: item.trade_id,
                    trade: item,
                    isPerformanceEmpty: true,
                    isPerformanceLoaded: false,
                    performanceType: 't',
                    relatedViews: [],
                    relatedThemes: [],
                    linkedTrades: {
                        count: item.LinkedTrade ? item.LinkedTrade.length : "",
                        items: _.map(item.LinkedTrade, function(n) {
                            return {
                                id: n.related_trade_id,
                                title: n.trade_editorial_label
                            };
                        })
                    }
                };

                if (item.TradeLines.length > 1) {
                    
                    var tradeGroups = _.groupBy(item.TradeLines, function(group) {
                        return group.trade_line_group_id + '|' + group.trade_line_group_type_label + '|' + group.trade_line_group_editorial_label;
                    });
                    trade.groups = _.map(tradeGroups, function(lineItems, key) {
                        var group = key.split('|');
                        return {
                            isVisible: false,
                            group_id: group[0],
                            group_type_label: group[1],
                            group_editorial_label: group[2],
                            lines: _.sortBy(_.map(lineItems, function (lineItem) {
                                return {
                                    trade_line_id: lineItem.trade_line_id,
                                    tradable_thing_class_editorial_label: lineItem.tradable_thing_class_editorial_label,
                                    position_label: lineItem.position_label,
                                    tradable_thing_label: lineItem.tradable_thing_label,
                                    location_label: lineItem.location_label,
                                    tradable_thing_code: lineItem.tradable_thing_code
                                };
                            }), 'trade_line_id')
                        };
                    });
                    trade.groups = _.sortBy(trade.groups, "group_id");
                } else if (item.TradeLines.length === 1) {
                    var tradeLine = item.TradeLines[0];
                    _.extend(trade.trade, {
                        trade_line_id: tradeLine.trade_line_id,
                        tradable_thing_class_editorial_label: tradeLine.tradable_thing_class_editorial_label,
                        position_label: tradeLine.position_label,
                        tradable_thing_label: tradeLine.tradable_thing_label,
                        location_label: tradeLine.location_label
                    });
                }
                
                _.extend(trade.trade, {
                    tradable_thing_code: concatField(item.TradeLines, 'tradable_thing_code')
                });

                switch (trade.trade.absolute_measure_type) {
                    case 'Percent':
                        trade.trade.absolute_performance += ' %';
                        trade.trade.absolute_performance_ytd += ' %';
                        break;
                    case 'Currency':
                        trade.trade.absolute_performance += ' ' + trade.trade.absolute_currency_code;
                        trade.trade.absolute_performance_ytd += ' ' + trade.trade.absolute_currency_code;
                        break;
                    case 'BPS':
                        trade.trade.absolute_performance += ' BPS';
                        trade.trade.absolute_performance_ytd += ' BPS';
                        break;
                }

                switch (trade.trade.relative_measure_type) {
                    case 'Percent':
                        trade.trade.relative_performance += ' %';
                        trade.trade.relative_performance_ytd += ' %';
                        break;
                    case 'Currency':
                        trade.trade.relative_performance += ' ' + trade.trade.relative_currency_code;
                        trade.trade.relative_performance_ytd += ' ' + trade.trade.relative_currency_code;
                        break;
                    case 'BPS':
                        trade.trade.relative_performance += ' BPS';
                        trade.trade.relative_performance_ytd += ' BPS';
                        break;
                }

                trades.push(trade);
            });

            return { totalCount: totalCount, trades: trades };
        }

        function loadTrades (params, transformResponseFn) {
            var deferred = $q.defer(), tradesUrl;
             
            DataEndpoint.getTemplatedEndpoint(['bca-trades', 'trades']).then(function (url) {
                tradesUrl = url;
                $http({
                    method: 'GET',
                    url: url,
                    params: params,
                    timeout: deferred.promise
                }).success(function (data) {
                    var response = data;
                    if (transformResponseFn) {
                        response = transformResponseFn(data);
                    }

                    deferred.resolve({ data: response, tradesBaseUrl: tradesUrl });
                }).error(function(errorResponse) {
                    deferred.reject(errorResponse);
                });
            });
            return deferred.promise;
        }
        return {
            loadTrades: function (o) {
                var options = {
                    orderBy: 'last_updated desc',
                    page: 0,
                    pageSize: 25,
                    expand: '',
                    filter: ''
                };
                _.extend(options, o);
                return loadTrades(buildIsisQuery(options));
            },
            
            getTransformedTrades: function (options) {
                return loadTrades(options, transformTradesData);
            }
            
        };
    };

    tradeService.$inject = ['$resource', '$q', 'DataEndpoint', '$http'];
    return tradeService;
});