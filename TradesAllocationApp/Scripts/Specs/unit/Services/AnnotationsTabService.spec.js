define(['App/Services/AnnotationsTabService',
        'angular',
        'mocks',
        'App/Services/services'], function () {
            describe('AnnotationsTabService', function () {
                var annotations;
                
                beforeEach(function () {
                    module('App');
                });

                describe('Given we have 2 support annotations', function () {
                    beforeEach(inject(function (AnnotationsSupportUri, AnnotationsScenarioUri, AnnotationsCounterArgumentUri) {
                        annotations = [
                            {
                                key: AnnotationsSupportUri,
                                label: 'Supports',
                                values: [{
                                        "@id": "annotation1",
                                        "annotatedAs": { "@id": "http://data.emii.com/annotation-types/support" },
                                        "annotationFor": {
                                            "@id": "document:annotation1"
                                        }
                                    }, {
                                        "@id": "annotation5",
                                        "annotatedAs": { "@id": "http://data.emii.com/annotation-types/support" },
                                        "annotationFor": {
                                            "@id": "document:annotation5"
                                        }
                                    }
                                ]
                            },
                            {
                                 key: AnnotationsScenarioUri,
                                 label: 'Scenarios',
                                 values: [{
                                     "@id": "annotation2",
                                     "annotatedAs": { "@id": "http://data.emii.com/annotation-types/scenario" },
                                     "annotationFor": {
                                         "@id": "document:annotation2"
                                     }
                                 }]
                            },
                            {
                                key: AnnotationsCounterArgumentUri,
                                label: 'Counters',
                                values: []
                            }
                        ];
                    }));
                    describe('When activating "Support"', function() {
                        it('should activate support annotations', inject(function (AnnotationsTabService, AnnotationsSupportUri) {
                            var result = AnnotationsTabService.activate(annotations, AnnotationsSupportUri);
                            expect(annotations[0].active).toBe(true);
                            expect(annotations[1].active).toBe(false);
                            expect(result.key).toBe(AnnotationsSupportUri);
                        }));

                    });
                    
                    describe('When activating a type for which there is no annotations', function () {
                        it('should activate the fallback annotation', inject(function (AnnotationsTabService, AnnotationsCounterArgumentUri, AnnotationsSupportUri) {
                            var result = AnnotationsTabService.activate(annotations, AnnotationsCounterArgumentUri, AnnotationsSupportUri);
                            expect(annotations[0].active).toBe(true);
                            expect(annotations[1].active).toBe(false);
                            expect(result.key).toBe(AnnotationsSupportUri);
                        }));
                    });
                });


            });
        });