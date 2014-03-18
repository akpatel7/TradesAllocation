define(['App/Controllers/Trades/PerformanceController',
        'underscore',
        'angular',
        'mocks',
        'App/Services/services',
        'App/Controllers/controllers'
], function (PerformanceController, _) {
    describe('PerformanceController', function () {
        var scope, $httpBackend, expectedPerformanceData, expectedPerformanceChartConfig, expectPerformanceQueryTo, flush, endpointUrl, listener, _TREE_GRID_RESIZE_INFO_ = 'tree-grid:resize-info';

        expectedPerformanceData = { "odata.metadata": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/bca/$metadata#Performance", "value": [{ "Id": 6, "ItemId": 1, "Value": "1.0", "Date": "2001-01-01T00:00:00", "MeasureTypeId": 1, "MeasureTypeLabel": "BPS", "CurrencyId": null, "CurrencyCode": null, "BenchmarkId": null, "BenchmarkLabel": null, "PerformanceType": "t" }, { "Id": 7, "ItemId": 1, "Value": "0.8", "Date": "2001-03-01T00:00:00", "MeasureTypeId": 1, "MeasureTypeLabel": "BPS", "CurrencyId": null, "CurrencyCode": null, "BenchmarkId": null, "BenchmarkLabel": null, "PerformanceType": "t" }, { "Id": 8, "ItemId": 1, "Value": "2.0", "Date": "2001-06-01T00:00:00", "MeasureTypeId": 1, "MeasureTypeLabel": "BPS", "CurrencyId": null, "CurrencyCode": null, "BenchmarkId": null, "BenchmarkLabel": null, "PerformanceType": "t" }, { "Id": 9, "ItemId": 1, "Value": "1.2", "Date": "2001-09-01T00:00:00", "MeasureTypeId": 1, "MeasureTypeLabel": "BPS", "CurrencyId": null, "CurrencyCode": null, "BenchmarkId": null, "BenchmarkLabel": null, "PerformanceType": "t" }, { "Id": 10, "ItemId": 1, "Value": "2.2", "Date": "2002-01-01T00:00:00", "MeasureTypeId": 1, "MeasureTypeLabel": "BPS", "CurrencyId": null, "CurrencyCode": null, "BenchmarkId": null, "BenchmarkLabel": null, "PerformanceType": "t" }, { "Id": 11, "ItemId": 1, "Value": "2.5", "Date": "2002-03-01T00:00:00", "MeasureTypeId": 1, "MeasureTypeLabel": "BPS", "CurrencyId": null, "CurrencyCode": null, "BenchmarkId": null, "BenchmarkLabel": null, "PerformanceType": "t" }, { "Id": 12, "ItemId": 1, "Value": "1.8", "Date": "2002-06-01T00:00:00", "MeasureTypeId": 1, "MeasureTypeLabel": "BPS", "CurrencyId": null, "CurrencyCode": null, "BenchmarkId": null, "BenchmarkLabel": null, "PerformanceType": "t" }, { "Id": 13, "ItemId": 1, "Value": "1.6", "Date": "2002-09-01T00:00:00", "MeasureTypeId": 1, "MeasureTypeLabel": "BPS", "CurrencyId": null, "CurrencyCode": null, "BenchmarkId": null, "BenchmarkLabel": null, "PerformanceType": "t" }, { "Id": 14, "ItemId": 1, "Value": "80", "Date": "2001-01-01T00:00:00", "MeasureTypeId": 3, "MeasureTypeLabel": "Percent", "CurrencyId": null, "CurrencyCode": null, "BenchmarkId": 1, "BenchmarkLabel": "S&P 500", "PerformanceType": "t" }, { "Id": 15, "ItemId": 1, "Value": "82", "Date": "2001-03-01T00:00:00", "MeasureTypeId": 3, "MeasureTypeLabel": "Percent", "CurrencyId": null, "CurrencyCode": null, "BenchmarkId": 1, "BenchmarkLabel": "S&P 500", "PerformanceType": "t" }, { "Id": 16, "ItemId": 1, "Value": "100", "Date": "2001-06-01T00:00:00", "MeasureTypeId": 3, "MeasureTypeLabel": "Percent", "CurrencyId": null, "CurrencyCode": null, "BenchmarkId": 1, "BenchmarkLabel": "S&P 500", "PerformanceType": "t" }, { "Id": 17, "ItemId": 1, "Value": "94", "Date": "2001-09-01T00:00:00", "MeasureTypeId": 3, "MeasureTypeLabel": "Percent", "CurrencyId": null, "CurrencyCode": null, "BenchmarkId": 1, "BenchmarkLabel": "S&P 500", "PerformanceType": "t" }, { "Id": 18, "ItemId": 1, "Value": "50", "Date": "2002-01-01T00:00:00", "MeasureTypeId": 3, "MeasureTypeLabel": "Percent", "CurrencyId": null, "CurrencyCode": null, "BenchmarkId": 1, "BenchmarkLabel": "S&P 500", "PerformanceType": "t" }, { "Id": 19, "ItemId": 1, "Value": "63", "Date": "2002-03-01T00:00:00", "MeasureTypeId": 3, "MeasureTypeLabel": "Percent", "CurrencyId": null, "CurrencyCode": null, "BenchmarkId": 1, "BenchmarkLabel": "S&P 500", "PerformanceType": "t" }, { "Id": 20, "ItemId": 1, "Value": "72", "Date": "2002-06-01T00:00:00", "MeasureTypeId": 3, "MeasureTypeLabel": "Percent", "CurrencyId": null, "CurrencyCode": null, "BenchmarkId": 1, "BenchmarkLabel": "S&P 500", "PerformanceType": "t" }, { "Id": 21, "ItemId": 1, "Value": "75", "Date": "2002-09-01T00:00:00", "MeasureTypeId": 3, "MeasureTypeLabel": "Percent", "CurrencyId": null, "CurrencyCode": null, "BenchmarkId": 1, "BenchmarkLabel": "S&P 500", "PerformanceType": "t" }] };
        expectedPerformanceChartConfig = { "absoluteLabel": "ABSOLUTE PERFORMANCE (BPS)", "relativePerformanceLabel": "RELATIVE PERFORMANCE", "versusLabel": "VS S&P 500 (%)", "isPerformanceEmpty": false, "chart": { "width": 1024, "marginLeft": 30, "marginRight": 30 }, "credits": { "enabled": false }, "exporting": { "enabled": false }, "rangeSelector": { "enabled": false }, "yAxis": [{ "id": "relative", "labels": { "style": { "color": "#041f5b" }, "x": -30, "y": 3 }, "opposite": false }, { "id": "absolute", "labels": { "style": { "color": "#000000" }, "x": 30, "y": 3 }, "opposite": true }], "tooltip": { "shared": true }, "series": [{ "name": "Relative Performance", "color": "#041f5b", "yAxis": "relative", "data": [[978307200000, 80], [983404800000, 82], [991353600000, 100], [999302400000, 94], [1009843200000, 50], [1014940800000, 63], [1022889600000, 72], [1030838400000, 75]], "tooltip": { "valueSuffix": "%" } }, { "name": "Absolute Performance", "color": "#000000", "yAxis": "absolute", "data": [[978307200000, 1], [983404800000, 0.8], [991353600000, 2], [999302400000, 1.2], [1009843200000, 2.2], [1014940800000, 2.5], [1022889600000, 1.8], [1030838400000, 1.6]], "tooltip": { "valueSuffix": "BPS" } }], "isStockChart": true, "minDate": 978307200000, "maxDate": 1030838400000 };
        endpointUrl = "/isis/bca/Performance?$filter=ItemId+eq+100+and+PerformanceType+eq+'t'&$orderby=Date";
        
        beforeEach(function () {
            module('App.services');
            module('App.controllers');
        });
                        
        describe('Given a PerformanceController', function() {
            
            beforeEach(inject(function ($q, DataEndpoint, Dates, _$httpBackend_, $rootScope, $controller) {
                scope = $rootScope.$new();                
                
                listener = jasmine.createSpy('listener');
                scope.$on(_TREE_GRID_RESIZE_INFO_, listener);

                $controller(PerformanceController, {
                    $scope: scope
                });
                
                $httpBackend = _$httpBackend_;
                
                expectPerformanceQueryTo = function (url) {
                    $httpBackend.expectGET(url).respond(expectedPerformanceData);
                };

                flush = function () {
                    scope.$root.$digest();
                    $httpBackend.flush();
                };
            }));            
            
            describe('When we want to view performance for a particular item', function() {
                var item;
                beforeEach(inject(function (PerformanceChartService, DataEndpoint, $q) {
                    spyOn(PerformanceChartService, 'getPerformanceChartConfiguration').andReturn(expectedPerformanceChartConfig);
                    spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallFake(function() {
                        var deferred = $q.defer();
                        deferred.resolve(endpointUrl);
                        return deferred.promise;
                    });

                    item = {
                        id: 100,
                        isInformationOpen: true,
                        performanceType: 't'
                    };

                    scope.row = {
                        id: 'p-1'
                    };

                    expectPerformanceQueryTo("/isis/bca/Performance?$filter=ItemId+eq+100+and+PerformanceType+eq+'t'&$orderby=Date");
                    
                    scope.init(item);
                    flush();
                }));
            

                it('Should now display the performance for a trade', function () {                                        
                    expect(item.config).toEqual(expectedPerformanceChartConfig);
                    expect(item.isPerformanceLoaded).toBe(true);
                });

                it('Should call the API to get the performance endpoint URL', inject(function(DataEndpoint) {
                    var query = [{
                        key: '$filter',
                        value: "ItemId eq 100 and PerformanceType eq 't'"                       
                    }, {
                        key: '$orderby',
                        value: 'Date'
                    }];
                    expect(DataEndpoint.getTemplatedEndpoint).toHaveBeenCalledWith(['bca-trades', 'performance'], query);
                }));
                
                it('Should tell the TreeGrid to resize the more info section containing the chart', function () {
                    expect(listener).toHaveBeenCalled();
                });
            });
                       
        });
    });
});

