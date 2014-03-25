define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var service = function (ODataFilterString) {
        return {
            buildFilter: function (filters) {
                var filter,
                    builder,
                    buildGroup = function(filterName) {
                        var f = filters[filterName];
                        if (f.isFreeText) {
                            var result = _.map(f.selected, function(name) {
                                return ODataFilterString.createContainsFilterItem(filterName, name);
                            });
                            return result;
                        } else if (f.isDate && f.date != null) {
                            return [ODataFilterString.createDateFilterItem(filterName, f.date, f.operator)];
                        } else {
                            return _.map(f.selected, function(name) {
                                return ODataFilterString.createEqualityFilterItem(filterName, name);
                            });
                        }
                    };

                builder = ODataFilterString.createFilterStringBuilder();
                for (var currentFilter in filters) {
                    builder.addFilterItemArray(buildGroup(currentFilter), filters[currentFilter].isFreeText);
                }
            
                filter = builder.buildFilterString();

                return filter;
            },
            buildOrderBy: function (options) {
                var result = [];

                if (options.orderby) {
                    result.push(options.orderby + ' ' + options.direction);
                }
                if (options.orderby !== 'last_updated') {
                    result.push('last_updated desc');
                }

                var orderByTradeLabel = _.find(result, function (item) {
                    return item.replace(/ (asc|desc)/gi, '').replace(/\+(asc|desc)/gi, '') === 'trade_editorial_label';
                }) !== undefined;
                if (!orderByTradeLabel) {
                    result.push('trade_editorial_label');
                }

                return result.join();
            },
            buildTradeIdFilter: function (trades) {
                return _.reduce(trades, function(filter, t, idx) {
                    return filter + "trade_id eq " + t.id + (idx < trades.length - 1 ? " or " : "");
                }, "");
            },
            /*
                filters: list of filters
                filter: odata query string
            */
            applyFilter: function (filters, filter) {
                var getName = function(o) {
                        return o.name;
                    },
                    isSelected = function (option) {
                        return (filter.indexOf(filterField + " eq " + ODataFilterString.odataFormatString(option.name)) !== -1);
                    };
                
                for (var filterField in filters) {
                    var f = filters[filterField];

                    if (!filter) {
                        if (!f.isDate) {
                            f.selected = [];
                        }
                        continue;
                    }

                    if (f.isFreeText) {
                        f.selected = ODataFilterString.getContainsParametersFromFilterString(filter, filterField);
                    } else if (f.isDate) {
                        var param = ODataFilterString.getDateParameterFromFilterString(filter, filterField);
                        if (param) {
                            f.date = param.date;
                            f.operator = param.operator;
                        }
                    } else {
                        //must be a fixed list
                        var selected = _.filter(f.options, isSelected);
                        f.selected = _.map(selected, getName);
                    }
                }
            }
        };      
    };

    service.$inject = ['ODataFilterString'];
    return service;
});