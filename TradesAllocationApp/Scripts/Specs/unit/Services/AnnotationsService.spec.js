define(['underscore',
        'App/Services/AnnotationsService',
        'angular',
        'mocks',
        'App/Services/services'], function(_) {
            describe('AnnotationsService', function() {
                describe('Given we have a Annotations Service', function() {
                    var scope,
                        $httpBackend,
                        expectedData,
                        endpointUrl = 'http://localhost/api/annotations',
                        buildEndpointUrl = function(uris) {
                            var relativePath = '';
                            _.each(uris, function(uri, index) {
                                relativePath += 'uri=' + uri + (index < uris.length - 1 ? '&' : '');
                            });
                            return relativePath;
                        };

                    angular.module('AnnotationsService.spec', []).service('DataEndpoint', ['$q', function($q) {
                        return {
                            getTemplatedEndpoint: function(endpoint, uris) {
                                var deferred = $q.defer(),
                                    relativePath = buildEndpointUrl(_.pluck(uris, 'value'));
                                deferred.resolve(endpointUrl + '?' + relativePath);
                                return deferred.promise;
                            }
                        };
                    }]);

                    beforeEach(module(function($provide) {
                        $provide.value('AnnotationsCounterArgumentUri', 'http://data.emii.com/annotation-types/counter-argument');
                        $provide.value('AnnotationsScenarioUri', 'http://data.emii.com/annotation-types/scenario');
                        $provide.value('AnnotationsSupportUri', 'http://data.emii.com/annotation-types/support');
                    }));

                    beforeEach(function() {
                        module('App');
                        module('AnnotationsService.spec');
                    });

                    describe('When we query the service', function() {
                        beforeEach(inject(function(_$httpBackend_, $rootScope, DataEndpoint) {
                            spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallThrough();
                            expectedData = [
                                {
                                    "references": { "@id": "http://some/view/id" },
                                    "@type": "Annotation",
                                    "annotationText": "This is sample of support longer annotated text. Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
                                    "annotationFor": {
                                        "title": "Document to suport test view (http://data.emii.com/bca/views/view_ua_03) on UK automotive ",
                                        "lastModified": "2013-06-05",
                                        "@type": "Content",
                                        "publishedIn": {
                                            "@type": "Concept",
                                            "@id": "http://data.emii.com/bca/services/eis",
                                            "canonicalLabel": "European Investment Strategy"
                                        },
                                        "@id": "urn:document:doc_uk_automotive_01",
                                        "published": "2013-04-05"
                                    },
                                    "@id": "urn:annotation:doc_uk_automotive_01.2",
                                    "annotatedAs": { "@id": "http://data.emii.com/annotation-types/support" }
                                },
                                {
                                    "references": { "@id": "http://some/view/id" },
                                    "@type": "Annotation",
                                    "annotationText": "This is anoter sample of support longer annotated text. Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
                                    "annotationFor": {
                                        "title": "Document to suport test view (http://data.emii.com/bca/views/view_ua_03) on UK automotive ",
                                        "lastModified": "2013-06-05",
                                        "@type": "Content",
                                        "publishedIn": {
                                            "@type": "Concept",
                                            "@id": "http://data.emii.com/bca/services/eis",
                                            "canonicalLabel": "European Investment Strategy"
                                        },
                                        "@id": "urn:document:doc_uk_automotive_01",
                                        "published": "2013-09-10"
                                    },
                                    "@id": "urn:annotation:doc_uk_automotive_01.2",
                                    "annotatedAs": { "@id": "http://data.emii.com/annotation-types/support" }
                                },
                                {
                                    "references": { "@id": "http://some/view/id" },
                                    "@type": "Annotation",
                                    "annotationText": "This is sample of annotated text",
                                    "annotationFor": {
                                        "title": "Document to suport test view (http://data.emii.com/bca/views/view_ua_03) on UK automotive ",
                                        "lastModified": "2013-06-05",
                                        "@type": "Content",
                                        "publishedIn": {
                                            "@type": "Concept",
                                            "@id": "http://data.emii.com/bca/services/eis",
                                            "canonicalLabel": "European Investment Strategy"
                                        },
                                        "@id": "urn:document:doc_uk_automotive_01",
                                        "published": "2013-04-05"
                                    },
                                    "@id": "urn:annotation:doc_uk_automotive_01.1",
                                    "annotatedAs": { "@id": "http://data.emii.com/annotation-types/scenario" }
                                },
                                {
                                    "references": { "@id": "http://some/view/id" },
                                    "@type": "Annotation",
                                    "annotationText": "Counter argument annotation text!",
                                    "annotationFor": {
                                        "title": "Document to suport test view (http://data.emii.com/bca/views/view_ua_03) on UK automotive ",
                                        "lastModified": "2013-06-05",
                                        "@type": "Content",
                                        "publishedIn": {
                                            "@type": "Concept",
                                            "@id": "http://data.emii.com/bca/services/eis",
                                            "canonicalLabel": "European Investment Strategy"
                                        },
                                        "@id": "urn:document:doc_uk_automotive_01",
                                        "published": "2013-04-05"
                                    },
                                    "@id": "urn:annotation:doc_uk_automotive_01.3",
                                    "annotatedAs": { "@id": "http://data.emii.com/annotation-types/counter-argument" }
                                }
                            ];
                            $httpBackend = _$httpBackend_;

                            $httpBackend.whenGET(endpointUrl + "?uri=http://some/view/id")
                                .respond(expectedData);
                            $httpBackend.whenGET(endpointUrl + "?uri=http://some/view/id&uri=http://some/other/view/id")
                                .respond(expectedData);
                            scope = $rootScope.$new();
                        }));

                        describe('for a single concept uri', function() {
                            it('should return annotations data for specific concept Uri', inject(function(Annotations, AnnotationsCounterArgumentUri, AnnotationsScenarioUri, AnnotationsSupportUri) {
                                Annotations.getAnnotations({
                                    conceptUri: 'http://some/view/id'
                                }).then(function(data) {
                                    var supports, counter, scenarios;
                                    expect(data).toBeDefined();
                                    supports = _.find(data, function(current) {
                                        return current.key === AnnotationsSupportUri;
                                    });
                                    expect(supports).toBeDefined();
                                    counter = _.find(data, function(current) {
                                        return current.key === AnnotationsCounterArgumentUri;
                                    });
                                    expect(counter).toBeDefined();
                                    scenarios = _.find(data, function(current) {
                                        return current.key === AnnotationsScenarioUri;
                                    });
                                    expect(scenarios).toBeDefined();
                                });
                                scope.$root.$digest();
                                $httpBackend.flush();
                            }));

                            it('should be able to pass single concept uri to the api', inject(function(Annotations, DataEndpoint) {
                                Annotations.getAnnotations({
                                    conceptUri: 'http://some/view/id'
                                }).then(function(data) {
                                });
                                scope.$root.$digest();
                                $httpBackend.flush();
                                expect(DataEndpoint.getTemplatedEndpoint).toHaveBeenCalledWith('annotations', [
                                    { key: 'conceptUri', value: 'http://some/view/id' }
                                ]);
                            }));

                            it('should pass an array of concept uri to the api', inject(function(Annotations, DataEndpoint) {
                                Annotations.getAnnotations({
                                    conceptUri: ['http://some/view/id', 'http://some/other/view/id']
                                }).then(function(data) {
                                });
                                scope.$root.$digest();
                                $httpBackend.flush();
                                expect(DataEndpoint.getTemplatedEndpoint).toHaveBeenCalledWith('annotations', [
                                    { key: 'conceptUri', value: 'http://some/view/id' },
                                    { key: 'conceptUri', value: 'http://some/other/view/id' }
                                ]);
                            }));

                            describe('when no grouping is requested', function() {
                                it('should return a flat list of annotations', inject(function(Annotations) {
                                    Annotations.getAnnotations({
                                        conceptUri: ['http://some/view/id'],
                                        noGrouping: true
                                    }).then(function(annotations) {
                                        expect(_.isArray(annotations)).toBe(true);
                                        expect(annotations.length).toBe(4);
                                    });
                                    scope.$root.$digest();
                                    $httpBackend.flush();
                                }));

                                describe('And only unique documents is requested', function() {
                                    it('should return a flat list of 3 annotations for array of conceptUri', inject(function(Annotations) {
                                        Annotations.getAnnotations({
                                            conceptUri: ['http://some/view/id'],
                                            noGrouping: true,
                                            onlyOneAnnotationPerDocument: true
                                        }).then(function(annotations) {
                                            expect(_.isArray(annotations)).toBe(true);
                                            expect(annotations.length).toBe(3);
                                        });
                                        scope.$root.$digest();
                                        $httpBackend.flush();
                                    }));

                                    it('should return a flat list of 3 annotations for string conceptUri', inject(function(Annotations) {
                                        Annotations.getAnnotations({
                                            conceptUri: 'http://some/view/id',
                                            noGrouping: true,
                                            onlyOneAnnotationPerDocument: true
                                        }).then(function(annotations) {
                                            expect(_.isArray(annotations)).toBe(true);
                                            expect(annotations.length).toBe(3);
                                        });
                                        scope.$root.$digest();
                                        $httpBackend.flush();
                                    }));
                                });
                            });

                            describe('when grouped and only unique documents is requested', function() {
                                it('should only return one annotation per document for array of conceptUri', inject(function(Annotations) {
                                    Annotations.getAnnotations({
                                        conceptUri: ['http://some/view/id'],
                                        noGrouping: false,
                                        onlyOneAnnotationPerDocument: true
                                    }).then(function(annotations) {
                                        expect(annotations['http://some/view/id'][0].values.length).toBe(1);
                                        expect(annotations['http://some/view/id'][1].values.length).toBe(1);
                                        expect(annotations['http://some/view/id'][2].values.length).toBe(1);
                                        expect(annotations['http://some/view/id'][3].values.length).toBe(0);
                                    });
                                    scope.$root.$digest();
                                    $httpBackend.flush();
                                }));
                                it('should only return one annotation per document for string conceptUri', inject(function(Annotations) {
                                    Annotations.getAnnotations({
                                        conceptUri: 'http://some/view/id',
                                        noGrouping: false,
                                        onlyOneAnnotationPerDocument: true
                                    }).then(function(annotations) {
                                        expect(annotations[0].values.length).toBe(1);
                                        expect(annotations[1].values.length).toBe(1);
                                        expect(annotations[2].values.length).toBe(1);
                                        expect(annotations[3].values.length).toBe(0);
                                    });
                                    scope.$root.$digest();
                                    $httpBackend.flush();
                                }));
                            });

                        });

                        describe('for a list of uris', function() {
                            it('should return annotations data for the list of uris', inject(function(Annotations, AnnotationsCounterArgumentUri, AnnotationsScenarioUri, AnnotationsSupportUri) {
                                Annotations.getAnnotations({
                                    conceptUri: ['http://some/view/id']
                                }).then(function(data) {
                                    var supports, counter, scenarios;
                                    expect(data['http://some/view/id']).toBeDefined();
                                    supports = _.find(data['http://some/view/id'], function(current) {
                                        return current.key === AnnotationsSupportUri;
                                    });
                                    expect(supports).toBeDefined();
                                    counter = _.find(data['http://some/view/id'], function(current) {
                                        return current.key === AnnotationsCounterArgumentUri;
                                    });
                                    expect(counter).toBeDefined();
                                    scenarios = _.find(data['http://some/view/id'], function(current) {
                                        return current.key === AnnotationsScenarioUri;
                                    });
                                    expect(scenarios).toBeDefined();
                                });
                                scope.$root.$digest();
                                $httpBackend.flush();
                            }));
                        });

                        describe('When no grouping is requested', function() {
                            it('should return a flat list of annotations', inject(function(Annotations) {
                                Annotations.getAnnotations({
                                    conceptUri: ['http://some/view/id', 'http://some/other/view/id'],
                                    noGrouping: true
                                }).then(function(annotations) {
                                    expect(_.isArray(annotations)).toBe(true);
                                    expect(annotations.length).toBe(expectedData.length);
                                });
                                scope.$root.$digest();
                                $httpBackend.flush();
                            }));
                        });

                        describe('when only unique documents is requested', function() {
                            it('should only return one annotation per document', inject(function(Annotations) {
                                Annotations.getAnnotations({
                                    conceptUri: ['http://some/view/id'],
                                    noGrouping: false,
                                    onlyOneAnnotationPerDocument: true
                                }).then(function(annotations) {
                                    expect(annotations['http://some/view/id'][0].values.length).toBe(1);
                                    expect(annotations['http://some/view/id'][1].values.length).toBe(1);
                                    expect(annotations['http://some/view/id'][2].values.length).toBe(1);
                                });
                                scope.$root.$digest();
                                $httpBackend.flush();
                            }));
                        });

                        describe('When we request annotations for more than 50 uris', function() {
                            it('should send multiple requests and aggregate the responses', inject(function(Annotations) {
                                var uris = [],
                                    firstRequest,
                                    secondRequest;
                                for (var i = 0; i < 100; i++) {
                                    uris.push('http://some/view/id' + i);
                                }
                                firstRequest = endpointUrl + '?' + buildEndpointUrl(uris.slice(0, 50));
                                secondRequest = endpointUrl + '?' + buildEndpointUrl(uris.slice(50, 100));
                                $httpBackend.expectGET(firstRequest)
                                    .respond([
                                            {
                                                "references": { "@id": "http://some/view/id12" }
                                            }]
                                    );

                                $httpBackend.expectGET(secondRequest)
                                    .respond([
                                            {
                                                "references": { "@id": "http://some/view/id60" }
                                            }]
                                    );


                                Annotations.getAnnotations({
                                    conceptUri: uris,
                                    noGrouping: true
                                }).then(function(annotations) {
                                    expect(_.isArray(annotations)).toBe(true);
                                    expect(annotations.length).toBe(2);
                                });
                                scope.$root.$digest();
                                $httpBackend.flush();
                            }));
                        });
                    });

                    describe('When we group by type for a single concept uri', function() {
                        var annotations,
                            findByType = function(items, uri) {
                                return _.find(items, function(item) {
                                    return item.key === uri;
                                });
                            };

                        beforeEach(function() {
                            annotations = [{
                                    "@id": "annotation1",
                                    "annotatedAs": { "@id": "http://data.emii.com/annotation-types/support" }
                                },
                                {
                                    "@id": "annotation2",
                                    "annotatedAs": { "@id": "http://data.emii.com/annotation-types/scenario" }
                                },
                                {
                                    "@id": "annotation3",
                                    "annotatedAs": { "@id": "http://data.emii.com/annotation-types/counter-argument" }
                                },
                                {
                                    "@id": "annotation4",
                                    "annotatedAs": { "@id": "http://data.emii.com/annotation-types/counter-argument" }
                                },
                                {
                                    "@id": "annotation5",
                                    "annotatedAs": { "@id": "http://data.emii.com/annotation-types/support" }
                                },
                                {
                                    "@id": "annotation6",
                                    "annotatedAs": { "@id": "http://data.emii.com/annotation-types/counter-argument" }
                                },
                                {
                                    "@id": "annotation7",
                                    "annotatedAs": { "@id": "http://data.emii.com/annotation-types/counter-argument" }
                                }];
                        });

                        describe('Supports', function() {
                            var support;
                            beforeEach(inject(function(Annotations, AnnotationsSupportUri) {
                                var result = Annotations._groupByType(annotations);
                                support = findByType(result, AnnotationsSupportUri);
                            }));

                            it('Should have 2 values', function() {
                                expect(support.values.length).toBe(2);
                            });

                            it('Should have the label "Supports"', function() {
                                expect(support.label).toBe('Supports');
                            });

                            it('Should have the title "Supporting Research"', function() {
                                expect(support.title).toBe('Supporting Research');
                            });

                            it('Should have an index of 0"', function() {
                                expect(support.index).toBe(0);
                            });
                        });

                        describe('Scenarios', function() {
                            var scenario;
                            beforeEach(inject(function(Annotations, AnnotationsScenarioUri) {
                                var result = Annotations._groupByType(annotations);
                                scenario = findByType(result, AnnotationsScenarioUri);
                            }));

                            it('should return 1 value', function() {
                                expect(scenario.values.length).toBe(1);
                            });

                            it('Should have the label "Scenarios"', function() {
                                expect(scenario.label).toBe('Scenarios');
                            });

                            it('Should have the title "Scenarios"', function() {
                                expect(scenario.title).toBe('Scenarios');
                            });

                            it('Should have an index of 2"', function() {
                                expect(scenario.index).toBe(2);
                            });
                        });

                        describe('Counters', function() {
                            var counter;
                            beforeEach(inject(function(Annotations, AnnotationsCounterArgumentUri) {
                                var result = Annotations._groupByType(annotations);
                                counter = findByType(result, AnnotationsCounterArgumentUri);
                            }));

                            it('should return 4 values', function() {
                                expect(counter.values.length).toBe(4);
                            });

                            it('Should have the label "Counters"', function() {
                                expect(counter.label).toBe('Counters');
                            });

                            it('Should have the title "Counter Views"', function() {
                                expect(counter.title).toBe('Counter Views');
                            });


                            it('Should have an index of 1"', function() {
                                expect(counter.index).toBe(1);
                            });
                        });

                    });

                    describe('When we group by concept uri', function() {
                        var annotations;

                        beforeEach(function() {
                            annotations = [
                                {
                                    "@id": "annotation1",
                                    "annotatedAs": { "@id": "http://data.emii.com/annotation-types/support" },
                                    references: {
                                        '@id': 'http://data.emii.com/view1'
                                    }
                                },
                                {
                                    "@id": "annotation2",
                                    "annotatedAs": { "@id": "http://data.emii.com/annotation-types/scenario" },
                                    references: {
                                        '@id': 'http://data.emii.com/view2'
                                    }
                                },
                                {
                                    "@id": "annotation3",
                                    "annotatedAs": { "@id": "http://data.emii.com/annotation-types/counter-argument" },
                                    references: {
                                        '@id': 'http://data.emii.com/view2'
                                    }
                                },
                                {
                                    "@id": "annotation4",
                                    "annotatedAs": { "@id": "http://data.emii.com/annotation-types/counter-argument" },
                                    references: {
                                        '@id': 'http://data.emii.com/view1'
                                    }
                                }
                            ];
                        });

                        describe('View1', function() {
                            it('View1 should have 2 annotations', inject(function(Annotations) {
                                var result = Annotations._groupByConcept(annotations);
                                expect(result['http://data.emii.com/view1'].length).toBe(2);
                                expect(result['http://data.emii.com/view1'][0]['@id']).toBe('annotation1');
                                expect(result['http://data.emii.com/view1'][1]['@id']).toBe('annotation4');
                            }));

                            it('View2 should have 2 annotations', inject(function(Annotations) {
                                var result = Annotations._groupByConcept(annotations);
                                expect(result['http://data.emii.com/view2'].length).toBe(2);
                                expect(result['http://data.emii.com/view2'][0]['@id']).toBe('annotation2');
                                expect(result['http://data.emii.com/view2'][1]['@id']).toBe('annotation3');
                            }));
                        });
                    });

                    describe('When we filter annotations to distinct documents', function() {
                        var annotations;

                        beforeEach(function() {
                            annotations = [
                                {
                                    "@id": "annotation1",
                                    "annotatedAs": { "@id": "http://data.emii.com/annotation-types/support" },
                                    "annotationFor": { "@id": "http://data.emii.com/documents/doc1" }
                                },
                                {
                                    "@id": "annotation2",
                                    "annotatedAs": { "@id": "http://data.emii.com/annotation-types/support" },
                                    "annotationFor": { "@id": "http://data.emii.com/documents/doc1" }
                                },
                                {
                                    "@id": "annotation3",
                                    "annotatedAs": { "@id": "http://data.emii.com/annotation-types/argument" },
                                    "annotationFor": { "@id": "http://data.emii.com/documents/doc1" }
                                },
                                {
                                    "@id": "annotation4",
                                    "annotatedAs": { "@id": "http://data.emii.com/annotation-types/support" },
                                    "annotationFor": { "@id": "http://data.emii.com/documents/doc2" }
                                }
                            ];
                        });

                        it('Should filter out duplicate documents dor annotation type', inject(function(Annotations) {
                            var result = Annotations._filterToDistinctDocuments(annotations);
                            expect(result.length).toBe(3);
                            expect(result[0]['@id']).toBe('annotation1');
                            expect(result[1]['@id']).toBe('annotation3');
                            expect(result[2]['@id']).toBe('annotation4');
                        }));
                    });
                });
            });
        });