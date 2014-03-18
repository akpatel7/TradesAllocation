define(['angular', 'underscore'], function(angular, _) {
    'use strict';

    var lookupDataService = function($resource, $q, DataEndpoint, $http) {

        var data = {};

        var getData = function() {
            var deferred = $q.defer();

            DataEndpoint.getEndpoint('trade-lookup-data')
                .then(function(url) {
                    $http({
                        method: 'GET',
                        url: url
                    }).success(function (returnedData) {
                        data.benchmark_label = transformData(filterData(returnedData.value, "benchmark_label"));
                        data.location_label = transformData(filterData(returnedData.value, "location_label"));
                        data.tradable_thing_code = transformData(filterData(returnedData.value, "tradable_thing_code"));
                        data.instruction_type_label = transformData(filterData(returnedData.value, "instruction_type_label"));
                        data.position_label = transformData(filterData(returnedData.value, "position_label"));
                        data.structure_type_label = transformData(filterData(returnedData.value, "structure_type_label"));
                        data.tradable_thing_label = transformData(filterData(returnedData.value, "tradable_thing_label"));
                        data.service_code = transformData(filterData(returnedData.value, "service_code"));
                        data.hedge_label = transformData(filterData(returnedData.value, "hedge_label"));
                        data.tradable_thing_class_editorial_label = transformData(filterData(returnedData.value, "tradable_thing_class_editorial_label"));
                        data.length_type_label = transformData(filterData(returnedData.value, "length_type_label"));
                        data.isOpen = transformData(filterData(returnedData.value, "isOpen"));

                        deferred.resolve(data);
                    });

                });
            return deferred.promise;
        };

        var transformData = function (input) {
            var mappedData = _.map(input, function (item) {
                return {
                    name: item.value,
                    label: item.label
                };
            });

            var uniqueData = _.uniq(mappedData, false, function(item) {
                return item.name;
            });

            return _.sortBy(uniqueData, function (item) {
                return item.name;
            });
        };

        var filterData = function (input, fieldName) {
            return _.filter(input, function (item) {
                return item.field === fieldName;
            });
        };

        return {
            getData: getData
        };
    };

    lookupDataService.$inject = ['$resource', '$q', 'DataEndpoint', '$http'];
    return lookupDataService;
});