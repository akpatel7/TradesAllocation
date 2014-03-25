define(['angular', 'underscore', 'moment', 'jquery'], function(angular, _, moment, $) {
    'use strict';

    var service = function ($rootScope) {

        return {
            getPerformanceChartConfiguration: function(data) {
                var yAxis = [];
                var series = [];
                var chart = {
                    isPerformanceEmpty: true
                };
                var absoluteLabel, relativePerformanceLabel, versusLabel;

                var getColor = function(isAbs) {
                    return isAbs ? '#444' : '#486899';
                };

                var getAxisName = function(isAbs) {
                    return isAbs ? 'absolute' : 'relative';
                };

                var addAxis = function(onLeft, isAbsolute) {

                    var axis = {
                        id: getAxisName(isAbsolute),
                        labels: {
                            style: {
                                color: getColor(isAbsolute)
                            },
                            x: onLeft ? -30 : 30,
                            y: 3
                        },
                        opposite: !onLeft
                    };

                    yAxis.push(axis);

                };

                if (data.value.length > 0) {

                    var createSeries = function(p, q, r) {
                        var getValueSuffix = function(item) {
                            var measure = item['MeasureTypeLabel'];
                            if (item.isAbsolute) {
                                return measure === 'Currency' ? item['CurrencyCode'] : (measure === 'Percent' ? '%' : measure);
                            } else {
                                return measure === 'Percent' ? '%' : measure;
                            }
                        };

                        var valueSuffix = getValueSuffix(p);

                        series.push({
                            name: p.isAbsolute ? 'Absolute Performance' : 'Relative Performance',
                            color: getColor(p.isAbsolute),
                            yAxis: getAxisName(p.isAbsolute),
                            data: p.items,
                            tooltip: {
                                valueSuffix: valueSuffix
                            }
                        });

                        addAxis(!p.isAbsolute, p.isAbsolute);

                        // Place symmetrical axis
                        if (r.length === 1) {
                            addAxis(p.isAbsolute, p.isAbsolute);
                        }

                        if (p.isAbsolute) {
                            absoluteLabel = 'ABSOLUTE PERFORMANCE (' + valueSuffix + ')';
                        } else {
                            relativePerformanceLabel = 'RELATIVE PERFORMANCE';
                            versusLabel = 'VS ' + p['BenchmarkLabel'].toUpperCase() + ' (' + valueSuffix + ')';
                        }
                    };

                    var dates = _.chain(data.value)
                        .pluck("Date")
                        .map(function(d) {
                            return moment.utc(d).toDate().getTime();
                        }).value();

                    var minDate = _.min(dates);
                    var maxDate = _.max(dates);


                    _.chain(data.value)
                        .groupBy('BenchmarkId')
                        .map(function(items, key) {
                            return {
                                isAbsolute: key === "null",
                                BenchmarkLabel: items[0]["BenchmarkLabel"],
                                MeasureTypeLabel: items[0]["MeasureTypeLabel"],
                                CurrencyCode: items[0]["CurrencyCode"],
                                items: _.map(items, function(o) {
                                    return [moment.utc(o['Date']).toDate().getTime(), Number(o['Value'])];
                                })
                            };
                        }).each(createSeries);

                    
                    chart = {
                        absoluteLabel: absoluteLabel,
                        relativePerformanceLabel: relativePerformanceLabel,
                        versusLabel: versusLabel,
                        isPerformanceEmpty: data.value.length === 0,
                        chart: {
                            backgroundColor: '#eaecf5',
                            width: $rootScope.windowWidth <= 1024 ? 850 : 1024,
                            marginLeft:
                                30,
                            marginRight:
                                30
                        },
                        credits: {
                            enabled: false
                        },
                        exporting: {
                            enabled: false
                        },
                        rangeSelector: {
                            enabled: false
                        },
                        xAxis: {
                            ordinal: false                            
                        },
                        yAxis: _.sortBy(yAxis, 'id'),
                        tooltip: {
                            shared: true
                        },
                        series: _.sortBy(series, 'name'),
                        isStockChart: true,
                        minDate: minDate,
                        maxDate: maxDate
                    };
                }
                
                
                return chart;
            }
        };
    };

    service.$inject = ['$rootScope'];

    return service;
});
