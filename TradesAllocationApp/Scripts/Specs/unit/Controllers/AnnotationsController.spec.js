define(['App/Controllers/AnnotationsController',
        'angular',
        'resource',
        'mocks'
], function (AnnotationsController) {
            describe('AnnotationsController', function () {
                describe('Given we have a Annotations controller', function () {
                    var controller,
                        scope,
                        _TILE_SIZE_CHANGING_ = '_TILE_SIZE_CHANGING_',
                        $event;

                    angular.module('AnnotationsController.spec', []).service('UrlProvider', ['$q', function($q) {
                        return {
                            getLiveReportUrl: function(id) {
                                return 'http://livereport/' + id;
                            },
                            getReportUrl: function(id) {
                                var deferred = $q.defer();
                                deferred.resolve('http://someurl/' + id);
                                return deferred.promise;
                            }
                        };
                    }]);

                    beforeEach(function () {
                        module('App.controllers');
                        module('AnnotationsController.spec');
                    });
                    
                    beforeEach(module(function ($provide) {
                        $provide.value('AnnotationsCounterArgumentUri', 'http://data.emii.com/annotation-types/counter-argument');
                        $provide.value('AnnotationsScenarioUri', 'http://data.emii.com/annotation-types/scenario');
                        $provide.value('AnnotationsSupportUri', 'http://data.emii.com/annotation-types/support');
                        $provide.value('AnnotationsMentionUri', 'http://data.emii.com/annotation-types/mention');
                        $provide.constant('_TILE_SIZE_CHANGING_', _TILE_SIZE_CHANGING_);
                    }));
                    
                    beforeEach(inject(function ($controller, $rootScope, AnnotationsCounterArgumentUri, AnnotationsScenarioUri, AnnotationsSupportUri, AnnotationsMentionUri) {

                        $event = {
                            stopPropagation: function () {
                            }
                        };
                        scope = $rootScope.$new();
                        scope.annotations = [{
                                key: AnnotationsCounterArgumentUri,
                                label: 'Counters',
                                values: [
                                    {
                                        "@id": "annotation3",
                                        "annotatedAs": { "@id": "http://data.emii.com/annotation-types/counter-argument" },
                                        "annotationFor": {
                                            "@id": "document:annotation3"
                                        },
                                        hasPermission: true
                                    },
                                    {
                                        "@id": "annotation4",
                                        "annotatedAs": { "@id": "http://data.emii.com/annotation-types/counter-argument" },
                                        "annotationFor": {
                                            "@id": "document:annotation4"
                                        },
                                        hasPermission: true
                                    },
                                    {
                                        "@id": "annotation6",
                                        "annotatedAs": { "@id": "http://data.emii.com/annotation-types/counter-argument" },
                                        "annotationFor": {
                                            "@id": "document:annotation6"
                                        },
                                        hasPermission: false
                                    },
                                    {
                                        "@id": "annotation7",
                                        "annotatedAs": { "@id": "http://data.emii.com/annotation-types/counter-argument" },
                                        "annotationFor": {
                                            "@id": "document:annotation7"
                                        },
                                        hasPermission: true
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
                                    },
                                    hasPermission: true
                                }]
                            },
                            {
                                key: AnnotationsSupportUri,
                                label: 'Supports',
                                values: [{
                                        "@id": "annotation1",
                                        "annotatedAs": { "@id": "http://data.emii.com/annotation-types/support" },
                                        "annotationFor": {
                                            "@id": "document:annotation1"
                                        },
                                        hasPermission: false
                                    }, {
                                        "@id": "annotation5",
                                        "annotatedAs": { "@id": "http://data.emii.com/annotation-types/support" },
                                        "annotationFor": {
                                            "@id": "document:annotation5"
                                        },
                                        hasPermission: false
                                    }
                                ]
                            },
                            {
                                key: AnnotationsMentionUri,
                                label: 'Mentions',
                                values: [{
                                    "@id": "annotation8",
                                    "annotatedAs": { "@id": "http://data.emii.com/annotation-types/mention" },
                                    "annotationFor": {
                                        "@id": "document:annotation8"
                                    },
                                    hasPermission: true
                                }
                                ]
                            }
                        ];
                        
                        controller = $controller(AnnotationsController, {
                            $scope: scope
                        });
                       
                    }));
                

                    it('Annotations visibility should be initialized by the parent controller', function () {
                        expect(scope.annotationsVisible).toBeUndefined();
                    });

                    it('Should have 2 supports', function () {
                        scope.$root.$digest();
                        expect(scope.supportsCount).toBe(2);
                    });
                    
                    it('Supports should have the flag hasPermission set to false', function () {
                        scope.$root.$digest();
                        expect(scope.annotations[2].hasPermission).toBe(false);
                    });

                    it('Should have 1 scenario', function () {
                        scope.$root.$digest();
                        expect(scope.scenariosCount).toBe(1);
                    });

                    it('Scenarios should have the flag hasPermission set to true', function () {
                        scope.$root.$digest();
                        expect(scope.annotations[1].hasPermission).toBe(true);
                    });
                    
                    it('Should have 4 counters', function () {
                        scope.$root.$digest();
                        expect(scope.countersCount).toBe(4);
                    });
                    
                    it('Should have 1 mention', function () {
                        scope.$root.$digest();
                        expect(scope.mentionsCount).toBe(1);
                    });

                    it('Mentions should have the flag hasPermission set to true', function () {
                        scope.$root.$digest();
                        expect(scope.annotations[3].hasPermission).toBe(true);
                    });
                    
                    it('Annotations should have report urls', function () {
                        scope.annotationsVisible = true;
                        scope.$root.$digest();
                        expect(scope.annotations[0].values[0].reportUrl).toBe('http://someurl/document:annotation3');
                        expect(scope.annotations[0].values[1].reportUrl).toBe('http://someurl/document:annotation4');
                        expect(scope.annotations[0].values[2].reportUrl).toBe('http://someurl/document:annotation6');
                        expect(scope.annotations[0].values[3].reportUrl).toBe('http://someurl/document:annotation7');
                        expect(scope.annotations[1].values[0].reportUrl).toBe('http://someurl/document:annotation2');
                        expect(scope.annotations[2].values[0].reportUrl).toBe('http://someurl/document:annotation1');
                        expect(scope.annotations[2].values[1].reportUrl).toBe('http://someurl/document:annotation5');
                    });

                    it('Annotations should have live report url', function () {
                        scope.annotationsVisible = true;
                        scope.$root.$digest();
                        expect(scope.annotations[0].values[0].liveReportUrl).toBe('http://livereport/document:annotation3');
                        expect(scope.annotations[0].values[1].liveReportUrl).toBe('http://livereport/document:annotation4');
                        expect(scope.annotations[0].values[2].liveReportUrl).toBe('http://livereport/document:annotation6');
                        expect(scope.annotations[0].values[3].liveReportUrl).toBe('http://livereport/document:annotation7');
                        expect(scope.annotations[1].values[0].liveReportUrl).toBe('http://livereport/document:annotation2');
                        expect(scope.annotations[2].values[0].liveReportUrl).toBe('http://livereport/document:annotation1');
                        expect(scope.annotations[2].values[1].liveReportUrl).toBe('http://livereport/document:annotation5');
                    });
                    
                    describe('When expanding the view', function () {
                        beforeEach(function () {
                            scope.activate(scope.annotations, null, $event);
                            scope.$root.$digest();
                        });
                      
                        it('Should activate Supports by default', function () {
                            expect(scope.annotations[0].active).toBe(false);
                            expect(scope.annotations[1].active).toBe(false);
                            expect(scope.annotations[2].active).toBe(true);
                            expect(scope.activeAnnotation).toBe(scope.annotations[2]);
                        });
                    });

                    describe('When expanding the row with only some of the supports', function () {
                        beforeEach(inject(function (AnnotationsCounterArgumentUri, AnnotationsScenarioUri, AnnotationsSupportUri) {
                            scope.annotations = [{
                                    key: AnnotationsCounterArgumentUri,
                                    label: 'Counters',
                                    values: [
                                        {
                                            "@id": "annotation3",
                                            "annotatedAs": { "@id": "http://data.emii.com/annotation-types/counter-argument" },
                                            "annotationFor": {
                                                "@id": "document:annotation3"
                                            },
                                            hasPermission: true
                                        }
                                    ]
                                },
                                    {
                                        key: AnnotationsScenarioUri,
                                        label: 'Scenarios',
                                        values: []
                                    },
                                    {
                                        key: AnnotationsSupportUri,
                                        label: 'Supports',
                                        values: []
                                    }
                                ];
                            scope.annotationsVisible = true;
                            scope.$root.$digest();
                        }));
                        
                        it('Should activate Counters by default', function () {
                            expect(scope.annotations[0].active).toBe(true);
                            expect(scope.annotations[1].active).toBe(false);
                            expect(scope.annotations[2].active).toBe(false);
                            expect(scope.activeAnnotation).toBe(scope.annotations[0]);
                        });
                    });

                    describe('When activating supports', function () {
                        beforeEach(function () {
                            scope.activate(scope.annotations, scope.annotations[2], $event);
                            scope.$root.$digest();
                        });
                        it('Should activate the supports tab', function () {
                            expect(scope.annotations[0].active).toBe(false);
                            expect(scope.annotations[1].active).toBe(false);
                            expect(scope.annotations[2].active).toBe(true);
                        });
                        it('Should show the annotations', function () {
                            expect(scope.annotationsVisible).toBe(true);
                        });
                        it('Supports should be activated', function () {
                            expect(scope.activeAnnotation).toBe(scope.annotations[2]);
                        });

                        it('should update the active annotation label', function () {
                            expect(scope.activeAnnotation.label).toBe('Supports');
                        });
                    });
                    
                    describe('When activating scenarios', function () {
                        beforeEach(function () {
                            scope.activate(scope.annotations, scope.annotations[1], $event);
                            scope.$root.$digest();
                        });
                        it('Should activate the scenarios tab', function () {
                            expect(scope.annotations[0].active).toBe(false);
                            expect(scope.annotations[1].active).toBe(true);
                            expect(scope.annotations[2].active).toBe(false);
                        });
                        it('Should show the annotations', function () {
                            expect(scope.annotationsVisible).toBe(true);
                        });
                        it('Scenarios should be activated', function () {
                            expect(scope.activeAnnotation).toBe(scope.annotations[1]);
                        });
                        
                        it('should update the active annotation label', function () {
                            expect(scope.activeAnnotation.label).toBe('Scenarios');
                        });
                    });
                    
                    describe('When activating counters', function () {
                        beforeEach(function () {
                            scope.activate(scope.annotations, scope.annotations[0], $event);
                            scope.$root.$digest();
                        });
                        it('Should activate the counters tab', function () {
                            expect(scope.annotations[0].active).toBe(true);
                            expect(scope.annotations[1].active).toBe(false);
                            expect(scope.annotations[2].active).toBe(false);
                        });
                        it('Should show the annotations', function () {
                            expect(scope.annotationsVisible).toBe(true);
                        });
                        it('Counters should be activated', function () {
                            expect(scope.activeAnnotation).toBe(scope.annotations[0]);
                        });

                    });
                   
                    describe('When activating mentions', function () {
                        beforeEach(function () {
                            scope.activate(scope.annotations, scope.annotations[3], $event);
                            scope.$root.$digest();
                        });
                        it('Should activate the mentions tab', function () {
                            expect(scope.annotations[0].active).toBe(false);
                            expect(scope.annotations[1].active).toBe(false);
                            expect(scope.annotations[2].active).toBe(false);
                            expect(scope.annotations[3].active).toBe(true);
                        });
                        it('Should show the annotations', function () {
                            expect(scope.annotationsVisible).toBe(true);
                        });
                        it('Mentions should be activated', function () {
                            expect(scope.activeAnnotation).toBe(scope.annotations[3]);
                        });

                    });
                    
                    describe('Given counters are activated', function() {
                        beforeEach(function () {
                            scope.activate(scope.annotations, scope.annotations[0], $event);
                            scope.$root.$digest();
                        });
                        describe('When activating counters again', function () {
                            it('Should hide annotations', function () {
                                scope.activate(scope.annotations, scope.annotations[0], $event);
                                scope.$root.$digest();
                                expect(scope.annotationsVisible).toBe(false);
                            });
                            
                            describe('When activating counters again', function () {
                                it('Should show annotations', function () {
                                    scope.activate(scope.annotations, 'counters', $event);
                                    scope.$root.$digest();
                                    scope.activate(scope.annotations, 'counters', $event);
                                    scope.$root.$digest();
                                    expect(scope.annotationsVisible).toBe(true);
                                });
                            });
                        });
                        
                      
                    });
                });
            });
});