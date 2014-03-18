define(['App/Controllers/Research/ResearchAllocationsController',
        'underscore',
        'moment',
        'angular',
        'resource',
        'mocks',
        'App/Controllers/controllers'], function (ResearchAllocationsController) {
            describe('Research Allocations Controller', function () {
                describe('Given we have a research allocations controller', function () {
                    var controller,
                        scope,
                        viewable,
                        allAllocations;

                    beforeEach(function () {
                        module('App');
                    });

                    beforeEach(inject(function ($rootScope, $controller, AllocationsDataService) {

                        viewable = {
                            '@id': 'http://data.emii.com/commodities-markets/gold'
                        };

                        allAllocations = [
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
                        ];
                        
                        spyOn(AllocationsDataService, 'getAllocations')
                            .andCallFake(function(queryOptions) {
                                return {
                                    then: function (expression) {
                                        return expression({
                                            totalCount: 3,
                                            allocations: queryOptions.page === 0 ? [allAllocations[0], allAllocations[1]] : [allAllocations[2]]
                                        });
                                    }
                                };
                            });
                        
                        scope = $rootScope.$new();
                        controller = $controller(ResearchAllocationsController, {
                            $scope: scope
                        });
                        scope.pageSize = 2;

                        $rootScope.$digest();
                    }));

                    describe('When the parent scope viewable changes', function () {
                        beforeEach(inject(function ($rootScope) {
                            scope.$parent.viewable = viewable;
                            $rootScope.$digest();
                        }));

                        it("should call the allocations service", inject(function ($rootScope, AllocationsDataService) {
                            expect(AllocationsDataService.getAllocations).toHaveBeenCalledWith({ instrumentUri: viewable['@id'], page: 0, pageSize: 2 });
                        }));
                        
                        it("should load a page of allocations", function () {
                            expect(scope.allocations.length).toEqual(2);
                            expect(scope.allocations).toEqual([allAllocations[0], allAllocations[1]]);
                        });
                        
                        it("set the loaded flag", function () {
                            expect(scope.loaded).toBe(true);
                        });
                        
                        it("totalCount should be 3", function () {
                            expect(scope.totalCount).toBe(3);
                        });
                        
                        it("page should increase to 1", function () {
                            expect(scope.page).toBe(1);
                        });
                        
                        it("canShowMore should be true", function () {
                            expect(scope.canShowMore).toBe(true);
                        });

                        describe('When loading an extra page of data', function () {
                            beforeEach(function () {
                                scope.goToAllocation(allAllocations[0]);
                                scope.$root.$digest();
                            });
                            
                            it("page should increase to 2", inject(function ($location) {
                                expect($location.path()).toBe('/allocations');
                                expect($location.search()).toEqual({ Uri: allAllocations[0].Uri });
                            }));
                        });

                        describe('When loading an extra page of data', function() {
                            beforeEach(function() {
                                scope.showMore();
                                scope.$root.$digest();
                            });

                            it('should fetch an extra page of data', inject(function (AllocationsDataService) {
                                expect(AllocationsDataService.getAllocations).toHaveBeenCalledWith({ instrumentUri: viewable['@id'], page: 1, pageSize: 2 });
                            }));
                            
                            it("page should increase to 2", function () {
                                expect(scope.page).toBe(2);
                            });

                            it("canShowMore should be false", function () {
                                expect(scope.canShowMore).toBe(false);
                            });

                            describe('And changing viewable', function() {
                                beforeEach(function() {
                                    scope.$parent.viewable = { '@id': 'http://data.emii.com/commodities-markets/silver' };
                                    scope.$root.$digest();
                                });

                                it("should call the allocations service for the new viewable", inject(function ($rootScope, AllocationsDataService) {
                                    expect(AllocationsDataService.getAllocations).toHaveBeenCalledWith({ instrumentUri: 'http://data.emii.com/commodities-markets/silver', page: 0, pageSize: 2 });
                                }));
                            });
                        });
                    });
                });
            });
        });

