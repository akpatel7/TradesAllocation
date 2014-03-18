define(['underscore',
        'App/Services/AllocationsDataService',
        'angular',
        'mocks',
        'App/Services/services'], function(_) {
            describe('Allocations Data Service', function() {

                describe('Given we have an Allocations Data Service', function () {
                    var $httpBackend,
                       endpointUrl;

                    beforeEach(function() {
                        this.addMatchers({
                            toEqualData: function(expected) {
                                return angular.equals(this.actual, expected);
                            }
                        });
                    });
                
                    beforeEach(function () {
                        module('App.services');
                    });
                    
                    beforeEach(inject(function (_$httpBackend_, DataEndpoint, $q) {
                        $httpBackend = _$httpBackend_;

                        spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallFake(function () {
                            var deferred = $q.defer();
                            deferred.resolve(endpointUrl);
                            return deferred.promise;
                        });
                    }));

                    describe('When we retrieve Portfolios from the API', function () {
                        var expectedData,
                            transformedData;

                        beforeEach(function () {
                            endpointUrl = 'http://someapi/bca/Portfolios';

                            expectedData = {
                                "odata.metadata": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/bca/$metadata#Portfolios",
                                "odata.count": "1",
                                "value": [
                                    {
                                        "Allocations": [
                                            {
                                                "Id": 1236,
                                                "CurrentAllocation": 29.7705383,
                                                "PreviousAllocation": 0,
                                                "CurrentBenchmark": 22.1332035,
                                                "CurrentBenchmarkMin": 44.5825768,
                                                "CurrentBenchmarkMax": 69.47134,
                                                "PreviousBenchmark": 17.2674866,
                                                "PreviousBenchmarkMin": 49.0153046,
                                                "PreviousBenchmarkMax": 10.3283024,
                                                "Comments": "CASH_1",
                                                "AbsolutePerformance": '31.13',
                                                "LastUpdated": null,
                                                "ParentAllocation_Id": null,
                                                "Portfolio_Id": 96,
                                                "AbsolutePerformanceMeasure": 'Percent',
                                                "Currency": null,
                                                "Instrument": "CASH",
                                                "Uri": "http://data.emii.com/bca/allocation/1"
                                            },
                                            {
                                                "Id": 1237,
                                                "CurrentAllocation": 56.6809158,
                                                "PreviousAllocation": 0,                                                
                                                "CurrentBenchmark": 74.23554,
                                                "CurrentBenchmarkMin": 83.3681641,
                                                "CurrentBenchmarkMax": 25.6028538,
                                                "PreviousBenchmark": 59.0503769,
                                                "PreviousBenchmarkMin": 97.69267,
                                                "PreviousBenchmarkMax": 47.9963379,
                                                "Comments": "EQUITIES_1",
                                                "AbsolutePerformance": '33.15',
                                                "LastUpdated": null,
                                                "ParentAllocation_Id": null,
                                                "Portfolio_Id": 96,
                                                "AbsolutePerformanceMeasure": 'BPS',
                                                "Currency": null,
                                                "Instrument": "Equities",
                                                "Uri": "http://data.emii.com/bca/allocation/2",
                                                "isFavourited": true,
                                                "perspectiveId": "abcd",
                                                "isFollowed": true,
                                                "followPerspectiveId": "efgh"
                                            },
                                            {
                                                "Id": 1238,
                                                "CurrentAllocation": 83.59129,
                                                "PreviousAllocation": 0,
                                                "CurrentBenchmark": 26.3378849,
                                                "CurrentBenchmarkMin": 22.1537552,
                                                "CurrentBenchmarkMax": 81.73437,
                                                "PreviousBenchmark": 0.833262742,
                                                "PreviousBenchmarkMin": 46.37004,
                                                "PreviousBenchmarkMax": 85.6643753,
                                                "Comments": "BOND_1",
                                                "AbsolutePerformance": '35.17',
                                                "LastUpdated": null,
                                                "ParentAllocation_Id": null,
                                                "Portfolio_Id": 96,
                                                "AbsolutePerformanceMeasure": 'Currency',
                                                "Currency": 'Pounds',
                                                "Instrument": "Bond",
                                                "Uri": "http://data.emii.com/bca/allocation/3"
                                            },
                                            {
                                                "Id": 1239,
                                                "CurrentAllocation": 53.7740746,
                                                "PreviousAllocation": 0,
                                                "CurrentBenchmark": 90.41464,
                                                "CurrentBenchmarkMin": 51.2429466,
                                                "CurrentBenchmarkMax": 73.83301,
                                                "PreviousBenchmark": 7.17042875,
                                                "PreviousBenchmarkMin": 32.878067,
                                                "PreviousBenchmarkMax": 88.9154053,
                                                "Comments": "Comment on_US",
                                                "AbsolutePerformance": null,
                                                "LastUpdated": null,
                                                "ParentAllocation_Id": 1237,
                                                "Portfolio_Id": 96,
                                                "AbsolutePerformanceMeasure": null,
                                                "Currency": null,
                                                "Instrument": "US",
                                                "Uri": "http://data.emii.com/bca/allocation/4"
                                            }
                                        ],
                                        "Service": "Global Investment Strategy",
                                        "ServiceCode": "GIS",
                                        "Type": "Absolute",
                                        "Benchmark": "Germany 10-year Bonds",
                                        "Status": "Ready for Publish",
                                        "Duration": "Below Average",
                                        "Id": 96,
                                        "Name": "Model Low Risk Portfolio",
                                        "LastUpdated": "2014-01-16T11:53:46.493",
                                        "Comments": "Auto generated",
                                        "PerformanceModel": "Ahmad ?",
                                        "Uri": "http://data.emii.com/bca/portfolio/gis-fixed-income-sector",
                                        "isFavourited": true,
                                        "perspectiveId": "abcd",
                                        "isFollowed": true,
                                        "followPerspectiveId": "efgh"
                                    }
                                ]
                            };

                            transformedData = {
                                "portfolios": [
                                  {
                                      "id": "p-96",
                                      "Uri": "http://data.emii.com/bca/portfolio/gis-fixed-income-sector",
                                      "originalId": 96,
                                      "isPortfolio": true,
                                      "ServiceCode": "GIS",
                                      "Instrument": "Model Low Risk Portfolio",
                                      "Benchmark": "Germany 10-year Bonds",
                                      "Duration": "Below Average",
                                      "LastUpdated": "2014-01-16T11:53:46.493",
                                      "CanExpand": "1",
                                      "Expanded": 1,
                                      "Items": [
                                        {
                                            "Id": 1236,
                                            "CurrentAllocation": "29.77 %",
                                            "CurrentBenchmark": "22.13 %",
                                            "CurrentBenchmarkMin": 44.5825768,
                                            "CurrentBenchmarkMax": 69.47134,
                                            "PreviousBenchmark": "17.27 %",
                                            "PreviousBenchmarkMin": 49.0153046,
                                            "PreviousBenchmarkMax": 10.3283024,
                                            "Comments": "CASH_1",
                                            "AbsolutePerformance": '31.13 %',
                                            "LastUpdated": null,
                                            "ParentAllocation_Id": null,
                                            "Portfolio_Id": 96,
                                            "AbsolutePerformanceMeasure": 'Percent',
                                            "Currency": null,
                                            "Instrument": "CASH",
                                            "Uri": "http://data.emii.com/bca/allocation/1",
                                            "id": "a-1236",
                                            "originalId": 1236,
                                            "isPortfolio": false,
                                            "Expanded": 0,
                                            "Visible": 1,
                                            "CanExpand": "1",
                                            "Items": [],
                                            "MoreInfo": "<i class=\"icon-info-sign icon-large\"></i>"
                                        },
                                        {
                                            "Id": 1237,
                                            "CurrentAllocation": "56.68 %",
                                            "CurrentBenchmark": "74.24 %",
                                            "CurrentBenchmarkMin": 83.3681641,
                                            "CurrentBenchmarkMax": 25.6028538,
                                            "PreviousBenchmark": "59.05 %",
                                            "PreviousBenchmarkMin": 97.69267,
                                            "PreviousBenchmarkMax": 47.9963379,
                                            "Comments": "EQUITIES_1",
                                            "AbsolutePerformance": '33.15 BPS',
                                            "LastUpdated": null,
                                            "ParentAllocation_Id": null,
                                            "Portfolio_Id": 96,
                                            "AbsolutePerformanceMeasure": 'BPS',
                                            "Currency": null,
                                            "Instrument": "Equities",
                                            "Uri": "http://data.emii.com/bca/allocation/2",
                                            "isFavourited": true,
                                            "perspectiveId": "abcd",
                                            "isFollowed": true,
                                            "followPerspectiveId": "efgh",
                                            "id": "a-1237",
                                            "originalId": 1237,
                                            "isPortfolio": false,
                                            "Expanded": 0,
                                            "Visible": 1,
                                            "CanExpand": "1",
                                            "Items": [
                                              {
                                                  "Id": 1239,
                                                  "CurrentAllocation": "53.77 %",
                                                  "CurrentBenchmark": "90.41 %",
                                                  "CurrentBenchmarkMin": 51.2429466,
                                                  "CurrentBenchmarkMax": 73.83301,
                                                  "PreviousBenchmark": "7.17 %",
                                                  "PreviousBenchmarkMin": 32.878067,
                                                  "PreviousBenchmarkMax": 88.9154053,
                                                  "Comments": "Comment on_US",
                                                  "AbsolutePerformance": null,
                                                  "LastUpdated": null,
                                                  "ParentAllocation_Id": 1237,
                                                  "Portfolio_Id": 96,
                                                  "AbsolutePerformanceMeasure": null,
                                                  "Currency": null,
                                                  "Instrument": "US",
                                                  "Uri": "http://data.emii.com/bca/allocation/4",
                                                  "id": "a-1239",
                                                  "originalId": 1239,
                                                  "isPortfolio": false,
                                                  "Expanded": 0,
                                                  "Visible": 1,
                                                  "CanExpand": "1",
                                                  "Items": [],
                                                  "MoreInfo": "<i class=\"icon-info-sign icon-large\"></i>"
                                              }
                                            ],
                                            "MoreInfo": "<i class=\"icon-info-sign icon-large\"></i>"
                                        },
                                        {
                                            "Id": 1238,
                                            "CurrentAllocation": "83.59 %",
                                            "CurrentBenchmark": "26.34 %",
                                            "CurrentBenchmarkMin": 22.1537552,
                                            "CurrentBenchmarkMax": 81.73437,
                                            "PreviousBenchmark": "0.83 %",
                                            "PreviousBenchmarkMin": 46.37004,
                                            "PreviousBenchmarkMax": 85.6643753,
                                            "Comments": "BOND_1",
                                            "AbsolutePerformance": '35.17 Pounds',
                                            "LastUpdated": null,
                                            "ParentAllocation_Id": null,
                                            "Portfolio_Id": 96,
                                            "AbsolutePerformanceMeasure": 'Currency',
                                            "Currency": 'Pounds',
                                            "Instrument": "Bond",
                                            "Uri": "http://data.emii.com/bca/allocation/3",
                                            "id": "a-1238",
                                            "originalId": 1238,
                                            "isPortfolio": false,
                                            "Expanded": 0,
                                            "Visible": 1,
                                            "CanExpand": "1",
                                            "Items": [],
                                            "MoreInfo": "<i class=\"icon-info-sign icon-large\"></i>"
                                        }
                                      ],
                                      "isFavourited": true,
                                      "perspectiveId": "abcd",
                                      "isFollowed": true,
                                      "followPerspectiveId": "efgh",
                                      "MoreInfo": "<i class=\"icon-info-sign icon-large\"></i>"
                                  }
                                ],
                                "totalCount": 1
                            };

                        });
                        
                        describe('And the server returns some data', function () {
                            
                            beforeEach(inject(function () {
                                $httpBackend.expectGET(endpointUrl)
                                    .respond(expectedData);
                            }));
                            
                            it('Should pass the right parameters to the server', inject(function (AllocationsDataService, DataEndpoint) {                                
                                AllocationsDataService.getData()
                                    .then(function (data) {
                                    });
                                
                                expect(DataEndpoint.getTemplatedEndpoint).toHaveBeenCalledWith(['bca-trades', 'portfolios'], [
                                           { key: '$expand', value: 'Allocations' },
                                           { key: '$inlinecount', value: 'allpages' },
                                           { key: '$orderby', value: 'ServiceCode, LastUpdated desc' }]);
                                $httpBackend.flush();                               
                            }));
                            
                            it('Should transform the data', inject(function (AllocationsDataService) {
                                AllocationsDataService.getData({
                                    MoreInfo: '<i class=\"icon-info-sign icon-large\"></i>'
                                })
                                    .then(function (data) {
                                        expect(data).toEqualData(transformedData);
                                    });
                                $httpBackend.flush();
                            }));
                        });
                    });

                    describe('When we retrieve Allocations from the API And the server returns some data', function () {
                        var allocationsResponse;

                        beforeEach(function() {
                            endpointUrl = 'http://someapi/bca/Allocations';

                            allocationsResponse = {
                                "odata.count": "1000",
                                value: [
                                    {
                                        "PortfolioSummary": {
                                            "Service": "China Investment Strategy",
                                            "ServiceCode": "CIS",
                                            "Type": "Absolute",
                                            "Benchmark": "S&P 500",
                                            "Status": "Published",
                                            "StatusId": 1,
                                            "Duration": "Below Average",
                                            "Id": 1,
                                            "Name": "Model Low Risk Portfolio",
                                            "LastUpdated": "2014-03-13T09:53:00.167",
                                            "FirstPublishedDate": null,
                                            "PerformanceModel": "Ahmad ?",
                                            "Uri": "http://data.emii.com/bca/portfolio/cis-low-risk-porfolio"
                                        },
                                        "Id": 1,
                                        "Uri": "http://data.emii.com/bca/allocation/1",
                                        "CurrentAllocation": 94.7194443,
                                        "CurrentAllocationWeighting": "Overweight",
                                        "PreviousAllocation": 29.8120232,
                                        "PreviousAllocationWeighting": null,
                                        "CurrentBenchmark": 85.113,
                                        "CurrentBenchmarkMin": null,
                                        "CurrentBenchmarkMax": null,
                                        "CurrentBenchmarkWeighting": null,
                                        "PreviousBenchmark": 84.331,
                                        "PreviousBenchmarkMin": null,
                                        "PreviousBenchmarkMax": null,
                                        "PreviousBenchmarkWeighting": null,
                                        "AbsolutePerformance": null,
                                        "LastUpdated": "2014-02-23T16:35:12.46",
                                        "FirstPublishedDate": "2014-02-23T16:35:12.46",
                                        "ParentAllocation_Id": null,
                                        "Portfolio_Id": 1,
                                        "AbsolutePerformanceMeasure": null,
                                        "Currency": null,
                                        "Instrument": "CASH",
                                        "InstrumentUri": "<http://data.emii.com/currency-pairs/cash>",
                                        "Status": "Published",
                                        "StatusId": 1
                                    },
                                    {
                                        "PortfolioSummary": {
                                            "Service": "China Investment Strategy",
                                            "ServiceCode": "CIS",
                                            "Type": "Absolute",
                                            "Benchmark": "Germany 10-year Bonds",
                                            "Status": "Published",
                                            "StatusId": 1,
                                            "Duration": "Average",
                                            "Id": 2,
                                            "Name": "Model Medium Risk Portfolio",
                                            "LastUpdated": "2014-03-10T09:53:00.167",
                                            "FirstPublishedDate": null,
                                            "PerformanceModel": "Ahmad ?",
                                            "Uri": "http://data.emii.com/bca/portfolio/cis-medium-risk-porfolio"
                                        },
                                        "Id": 14,
                                        "Uri": "http://data.emii.com/bca/allocation/14",
                                        "CurrentAllocation": 9.173053,
                                        "CurrentAllocationWeighting": "Overweight",
                                        "PreviousAllocation": 69.48215,
                                        "PreviousAllocationWeighting": null,
                                        "CurrentBenchmark": 85.113,
                                        "CurrentBenchmarkMin": null,
                                        "CurrentBenchmarkMax": null,
                                        "CurrentBenchmarkWeighting": null,
                                        "PreviousBenchmark": 84.331,
                                        "PreviousBenchmarkMin": null,
                                        "PreviousBenchmarkMax": null,
                                        "PreviousBenchmarkWeighting": null,
                                        "AbsolutePerformance": null,
                                        "LastUpdated": "2014-02-23T16:35:12.597",
                                        "FirstPublishedDate": "2014-02-23T16:35:12.46",
                                        "ParentAllocation_Id": null,
                                        "Portfolio_Id": 2,
                                        "AbsolutePerformanceMeasure": null,
                                        "Currency": null,
                                        "Instrument": "CASH",
                                        "InstrumentUri": "<http://data.emii.com/currency-pairs/cash>",
                                        "Status": "Published",
                                        "StatusId": 1
                                    },
                                    {
                                        "PortfolioSummary": {
                                            "Service": "China Investment Strategy",
                                            "ServiceCode": "CIS",
                                            "Type": "Absolute",
                                            "Benchmark": "S&P 500",
                                            "Status": "Deleted",
                                            "StatusId": 3,
                                            "Duration": "Above Average",
                                            "Id": 3,
                                            "Name": "Model High Risk Portfolio",
                                            "LastUpdated": "2014-03-10T09:53:00.167",
                                            "FirstPublishedDate": null,
                                            "PerformanceModel": "Ahmad ?",
                                            "Uri": "http://data.emii.com/bca/portfolio/cis-high-risk-porfolio"
                                        },
                                        "Id": 27,
                                        "Uri": "http://data.emii.com/bca/allocation/27",
                                        "CurrentAllocation": 17.0641651,
                                        "CurrentAllocationWeighting": "Overweight",
                                        "PreviousAllocation": 43.7962456,
                                        "PreviousAllocationWeighting": null,
                                        "CurrentBenchmark": 85.113,
                                        "CurrentBenchmarkMin": null,
                                        "CurrentBenchmarkMax": null,
                                        "CurrentBenchmarkWeighting": null,
                                        "PreviousBenchmark": 84.331,
                                        "PreviousBenchmarkMin": null,
                                        "PreviousBenchmarkMax": null,
                                        "PreviousBenchmarkWeighting": null,
                                        "AbsolutePerformance": null,
                                        "LastUpdated": "2014-02-23T16:35:12.713",
                                        "FirstPublishedDate": "2014-02-23T16:35:12.46",
                                        "ParentAllocation_Id": null,
                                        "Portfolio_Id": 3,
                                        "AbsolutePerformanceMeasure": null,
                                        "Currency": null,
                                        "Instrument": "CASH",
                                        "InstrumentUri": "<http://data.emii.com/currency-pairs/cash>",
                                        "Status": "Published",
                                        "StatusId": 1
                                    }
                                ]
                            };
                        });

                        beforeEach(inject(function () {
                            $httpBackend.expectGET(endpointUrl)
                                .respond(allocationsResponse);
                        }));

                        it('Should pass the right parameters to the server', inject(function(AllocationsDataService, DataEndpoint) {
                            AllocationsDataService.getAllocations({instrumentUri: 'http://data.com/instrument/1', pageSize: 3})
                                .then(function (data) {
                                    expect(data.totalCount).toBe(1000);
                                    expect(data.allocations.length).toBe(3);
                                });

                            expect(DataEndpoint.getTemplatedEndpoint)
                                .toHaveBeenCalledWith(
                                    ['bca-trades', 'allocations'], // constant: api directory
                                    [
                                        { key: '$expand', value: 'PortfolioSummary' }, // constant
                                        { key: '$inlinecount', value: 'allpages' }, // constant
                                        { key: '$skip', value: 0 }, // default value
                                        { key: '$top', value: 3 }, // from options
                                        { key: '$orderby', value: 'LastUpdated desc,Instrument' }, // constant
                                        { key: '$filter', value: "InstrumentUri eq 'http://data.com/instrument/1' or InstrumentUri eq '<http://data.com/instrument/1>'" } // constructed from options
                                    ]
                                );

                            $httpBackend.flush();
                        }));
                    });
                });
        });
    });