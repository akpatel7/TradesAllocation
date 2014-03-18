define(['underscore',
        'App/Services/PerformanceChartService',
        'angular',
        'moment',
        'mocks',
        'App/Services/services'], function(_) {
            describe('PerformanceChartService', function () {
                var rootScope, resetWidth;
                
                beforeEach(function () {
                    
                    this.addMatchers({
                        toEqualData: function (expected) {
                            return angular.equals(this.actual, expected);
                        }
                    });
                });
                
                beforeEach(function() {
                    module('App.services');
                });
                
                

                describe('Given we have some performance data', function() {
                    var expectedConfig, performanceData;
                    beforeEach(inject(function($rootScope) {

                        rootScope = $rootScope;
                        resetWidth = rootScope.windowWidth;
                        
                        performanceData = {
                            "odata.metadata": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/bca/$metadata#Trades",
                            "value": [
                                {
                                    "Id": 1,
                                    "MeasureTypeId": 3,
                                    "MeasureTypeLabel": "Currency",
                                    "CurrencyId": 3,
                                    "CurrencyCode": "AUD",
                                    "BenchmarkId": null,
                                    "BenchmarkLabel": null,
                                    "Value": "1.2",
                                    "Date": "2000-01-01T12:00:00.000",
                                    "PerformanceType": 't'
                                },
                                {
                                    "Id": 1,
                                    "MeasureTypeId": 3,
                                    "MeasureTypeLabel": "Currency",
                                    "CurrencyId": 3,
                                    "CurrencyCode": "AUD",
                                    "BenchmarkId": null,
                                    "BenchmarkLabel": null,
                                    "Value": "1.0",
                                    "Date": "2000-03-01T12:00:00.000",
                                    "PerformanceType": 't'
                                },
                                {
                                    "Id": 1,
                                    "MeasureTypeId": 1,
                                    "MeasureTypeLabel": "Percent",
                                    "CurrencyId": null,
                                    "CurrencyCode": null,
                                    "BenchmarkId": 1,
                                    "BenchmarkLabel": "S&P500",
                                    "Value": "5.5",
                                    "Date": "2000-05-01T12:00:00.000",
                                    "PerformanceType": "t"
                                }
                            ],
                            "$promise": {},
                            "$resolved": true
                        };

                        expectedConfig = {
                            absoluteLabel: 'ABSOLUTE PERFORMANCE (AUD)',
                            relativePerformanceLabel: 'RELATIVE PERFORMANCE',
                            versusLabel: 'VS S&P500 (%)',
                            isPerformanceEmpty: false,
                            chart: {
                                backgroundColor: '#eaecf5',
                                width: 1024,
                                marginLeft: 30,
                                marginRight: 30
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
                            yAxis: [
                                {
                                    id: "absolute",
                                    labels: {
                                        style: {
                                            color: "#444"
                                        },
                                        x: 30,
                                        y: 3
                                    },
                                    opposite: true
                                },
                                {
                                    id: "relative",
                                    labels: {
                                        style: {
                                            color: "#486899"
                                        },
                                        x: -30,
                                        y: 3
                                    },
                                    opposite: false
                                }],                            
                            tooltip: {
                                shared: true
                            },
                            series: [
                                    {
                                        name: 'Absolute Performance',
                                        color: '#444',
                                        yAxis: 'absolute',
                                        data: [[946728000000, 1.2], [951912000000, 1.0]],
                                        tooltip: {
                                            valueSuffix: 'AUD'
                                        }
                                    },
                                    {
                                        name: 'Relative Performance',
                                        color: '#486899',
                                        yAxis: 'relative',
                                        data: [[957182400000, 5.5]],
                                        tooltip: {
                                            valueSuffix: '%'
                                        }
                                    }
                               ],
                            isStockChart: true,
                            minDate: 946728000000,
                            maxDate: 957182400000
                        };
                    }));

                    it('Should return the configuration correctly', inject(function (PerformanceChartService) {
                        rootScope.windowWidth = 1025;
                        var result = PerformanceChartService.getPerformanceChartConfiguration(performanceData);
                        expect(result).toEqualData(expectedConfig);
                    }));
                    
                    it('Should now show narrower chart', inject(function (PerformanceChartService) {
                        rootScope.windowWidth = 1023;
                        
                        var result = PerformanceChartService.getPerformanceChartConfiguration(performanceData);
                        expect(result.chart.width).toEqual(850);
                       
                    }));

                    afterEach(function() {
                        rootScope.windowWidth = resetWidth;
                    });
                });
            });
        });