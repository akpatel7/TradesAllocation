define(['angular', 'underscore', 'jquery'], function (angular, _, $) {
    'use strict';

    var service = function ($http, $q) {

        var _formatAllocation = function (allocation) {

            var formatNumber = function (n) {
                return n.toFixed(2) + ' %';
            };

            var isNullOrZero = function (a) {
                return a === null || a === 0;
            };

            var getMeasure = function (a) {
                if (a.AbsolutePerformanceMeasure === "BPS") {
                    return "BPS";
                }
                if (a.AbsolutePerformanceMeasure === "Percent") {
                    return "%";
                }

                if (a.AbsolutePerformanceMeasure === "Currency") {
                    return a.Currency;
                }
            };

            if (allocation.AbsolutePerformance) {
                allocation.AbsolutePerformance = allocation.AbsolutePerformance + " " + getMeasure(allocation);
            }


            if (isNullOrZero(allocation.CurrentAllocation) && isNullOrZero(allocation.PreviousAllocation) && allocation.CurrentAllocationWeighting === null && allocation.PreviousAllocationWeighting === null) {
                allocation.CurrentAllocation = '';
                allocation.PreviousAllocation = '';
            } else {
                if (isNullOrZero(allocation.CurrentAllocation)) {
                    allocation.CurrentAllocation = allocation.CurrentAllocationWeighting;
                } else {
                    allocation.CurrentAllocation = formatNumber(allocation.CurrentAllocation);
                }

                if (isNullOrZero(allocation.PreviousAllocation)) {
                    allocation.PreviousAllocation = allocation.PreviousAllocationWeighting;
                } else {
                    allocation.PreviousAllocation = formatNumber(allocation.PreviousAllocation);
                }
            }

            if (isNullOrZero(allocation.CurrentBenchmark) && isNullOrZero(allocation.PreviousBenchmark) && allocation.PreviousBenchmarkMin === null && allocation.CurrentBenchmarkMin === null) {
                allocation.CurrentBenchmark = '';
                allocation.PreviousBenchmark = '';
            } else {

                if (isNullOrZero(allocation.CurrentBenchmark)) {
                    if (allocation.CurrentBenchmarkWeighting !== null) {
                        allocation.CurrentBenchmark = allocation.CurrentBenchmarkWeighting;
                    } else {
                        allocation.CurrentBenchmark = allocation.CurrentBenchmarkMin.toFixed(2) + ' % - ' + allocation.CurrentBenchmarkMax.toFixed(2) + ' %';
                    }
                } else {
                    allocation.CurrentBenchmark = formatNumber(allocation.CurrentBenchmark);
                }

                if (isNullOrZero(allocation.PreviousBenchmark)) {
                    if (allocation.PreviousBenchmarkWeighting !== null) {
                        allocation.PreviousBenchmark = allocation.PreviousBenchmarkWeighting;
                    } else if (allocation.PreviousBenchmarkMin !== null && allocation.PreviousBenchmarkMax !== null) {
                        allocation.PreviousBenchmark = allocation.PreviousBenchmarkMin.toFixed(2) + ' % - ' + allocation.PreviousBenchmarkMax.toFixed(2) + ' %';
                    }
                } else {
                    allocation.PreviousBenchmark = formatNumber(allocation.PreviousBenchmark);
                }
            }

            return allocation;
        };

        var recursivelyAddAllocationData = function (allocations, parentPortfolio, childAllocation, options) {

            var allocation = _.extend(childAllocation, {
                id: 'a-' + childAllocation.Id,
                originalId: childAllocation.Id,
                isPortfolio: false,
                Expanded: 0,
                Visible: 1,
                CanExpand: '1',
                Items: []
            });
            _.extend(allocation, options);

            allocation = _formatAllocation(allocation);


            parentPortfolio.Items.push(allocation);

            var children = _.where(allocations, { ParentAllocation_Id: childAllocation.Id });
            _.each(children, function (child) {
                recursivelyAddAllocationData(allocations, allocation, child, options);
            });
        };

        return {
            /// options: object, which to extend the tree grid rows with
            formatAllocation: function (allocation) {
                return _formatAllocation(allocation);
            },
            getData: function (options) {
                var deferred = $q.defer();
               
                $http.get({
                    method: 'GET',
                    url: '/Api/Allocations/GetAllocationsTestData',
                    responseType: 'json' // remove this line to make work in IE8,IE9
                }).success(function (data) {
                            var portfolios = [];
                            _.each(data.value, function (item) {
                                var portfolio = {
                                    id: 'p-' + item.Id,
                                    Uri: item.Uri,
                                    originalId: item.Id,
                                    isPortfolio: true,
                                    ServiceCode: item.ServiceCode,
                                    Instrument: item.Name,
                                    Benchmark: item.Benchmark,
                                    Duration: item.Duration,
                                    LastUpdated: item.LastUpdated,
                                    CanExpand: '1',
                                    Expanded: 1,
                                    Items: [],
                                    isFavourited: item.isFavourited,
                                    perspectiveId: item.perspectiveId,
                                    isFollowed: item.isFollowed,
                                    followPerspectiveId: item.followPerspectiveId
                                };
                                _.extend(portfolio, options);

                                portfolios.push(portfolio);

                                var rootAllocations = _.where(item.Allocations, { ParentAllocation_Id: null });
                                _.each(rootAllocations, function (root) {
                                    recursivelyAddAllocationData(item.Allocations, portfolio, root, options);
                                });
                            });


                            deferred.resolve({ portfolios: portfolios, totalCount: parseInt(data['odata.count'], 10) });
                        });
                   
                return deferred.promise;
            },
            getAllocations: function (options) {
                options = _.extend({ page: 0, pageSize: 10 }, options);
                var deferred = $q.defer();
                
                        $http({
                            method: 'GET',
                            url: '/Api/Allocations/GetAllocationsTestData',
                            responseType: 'json' // remove this line to make work in IE8,IE9
                        }).success(function (data) {
                            _.each(data.value, _formatAllocation);
                            deferred.resolve({ allocations: data.value, totalCount: parseInt(data['odata.count'], 10) });
                        });
                  

                return deferred.promise;
            }
        };
    };

    service.$inject = ['$http', '$q'];
    return service;
});