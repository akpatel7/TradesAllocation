define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var viewables = function ($resource, $q, DataEndpoint, AnnotationsCounterArgumentUri, AnnotationsScenarioUri, AnnotationsSupportUri, AnnotationsMentionUri, $http) {
        
        return {
            getAnnotations: function(o) {
                var deferred = $q.defer(),
                    self = this,
                    args = [],
                    options = {
                        conceptUri: [],
                        noGrouping: false,
                        onlyOneAnnotationPerDocument: false
                    },
                    numberOfConceptUriPerRequest = 50,
                    requestUris = [],
                    i, j;
                _.extend(options, o);
                
                if (_.isArray(options.conceptUri)) {
                    _.each(options.conceptUri, function(uri) {
                        args.push({
                            key: 'conceptUri',
                            value: uri
                        });
                    });
                } else {
                    args.push({ key: 'conceptUri', value: options.conceptUri });
                }
                var resolveUrlFn = function(data) {
                    return data;
                };
                // prepare chunked requests
                for (i = 0, j = args.length; i < j; i += numberOfConceptUriPerRequest) {
                    var temp = args.slice(i, i + numberOfConceptUriPerRequest);
                    requestUris.push(DataEndpoint.getTemplatedEndpoint('annotations', temp)
                                        .then(resolveUrlFn)
                                    );
                }

                $q.all(requestUris).then(function (resolvedUrls) {
                    var requests = [];
                    _.each(resolvedUrls, function (url) {
                        // go fetch the data
                        requests.push($http({
                                method: 'GET',
                                url: url
                            }).then(function (result) {
                                return result.data;
                            }));
                    });
                    $q.all(requests).then(function (requestsResults) {
                        var data = [],
                            processedData;
                        // aggregate the results
                        _.each(requestsResults, function (a) {
                            data = data.concat(a);
                        });
                        
                        processedData = data;
                        // process the results

                        if (!options.noGrouping) {
                            var groupedAnnotations = [];
                            if (_.isArray(options.conceptUri)) {
                                _.each(options.conceptUri, function (uri) {
                                    var annotationsByConcept = self._groupByConcept(processedData);
                                    if (options.onlyOneAnnotationPerDocument) {
                                        annotationsByConcept[uri] = self._filterToDistinctDocuments(annotationsByConcept[uri]);
                                    }
                                    groupedAnnotations[uri] = self._groupByType(annotationsByConcept[uri]);
                                });
                            } else {
                                if (options.onlyOneAnnotationPerDocument) {
                                    processedData = self._filterToDistinctDocuments(processedData);
                                }
                                groupedAnnotations = self._groupByType(processedData);
                            }
                            
                            deferred.resolve(groupedAnnotations);
                        }
                        else {
                            if (options.onlyOneAnnotationPerDocument) {
                                processedData = self._filterToDistinctDocuments(processedData);
                            }
                            deferred.resolve(processedData);
                        }
                    });
                });
                
                return deferred.promise;
            },
            _groupByConcept: function(annotations) {
                return _.groupBy(annotations, function(annotation) {
                    return annotation.references['@id'];
                });
            },
            _groupByType: function (annotations) {
                var filterByType = function(uri) {
                    return _.filter(annotations, function(item) {
                        return item.annotatedAs['@id'] === uri;
                    });
                };
                var groupedItems = [
                    {
                        key: AnnotationsSupportUri,
                        label: 'Supports',
                        title: 'Supporting Research',
                        index: 0
                    },
                    {
                        key: AnnotationsCounterArgumentUri,
                        label: 'Counters',
                        title: 'Counter Views',
                        index: 1
                    },
                    {
                        key: AnnotationsScenarioUri,
                        label: 'Scenarios',
                        title: 'Scenarios',
                        index: 2
                    },
                    {
                        key: AnnotationsMentionUri,
                        label: 'Mentions',
                        title: 'Mentions',
                        index: 3
                    }];
                _.each(groupedItems, function (groupedItem) {
                    _.extend(groupedItem, {
                        values: filterByType(groupedItem.key)
                    });
                });
               
                return groupedItems;
            },
            
            _filterToDistinctDocuments: function (documentsToFilter) {
                return _.uniq(documentsToFilter, false, function(annotation) {
                    return annotation.annotatedAs['@id'] + annotation.annotationFor['@id'];
                });
            }
        };
    };

    viewables.$inject = ['$resource', '$q', 'DataEndpoint', 'AnnotationsCounterArgumentUri', 'AnnotationsScenarioUri', 'AnnotationsSupportUri', 'AnnotationsMentionUri', '$http'];
    return viewables;
});