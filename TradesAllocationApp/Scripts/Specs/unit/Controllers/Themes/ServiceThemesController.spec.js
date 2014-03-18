define(['App/Controllers/Themes/ServiceThemesController',
        'angular',
        'resource',
        'mocks'
    ], function(ServiceThemesController) {
        describe('ServiceThemesController', function() {
            describe('Given we have a theme controller', function() {
                var controller,
                    scope;

                angular.module('ServiceThemesController.spec', []).service('UrlProvider', ['$q', function($q) {
                    return {
                        getLiveReportUrl: function(id) {
                            return 'http://livereport/' + id;
                        },
                        getReportUrl: function (id) {
                            var deferred = $q.defer();
                            deferred.resolve('http://document/' + id);
                            return deferred.promise;
                        }
                    };
                }]);

                beforeEach(function() {
                    module('App.controllers');
                    module('ServiceThemesController.spec');
                });

                beforeEach(module(function($provide) {
                    $provide.value('AnnotationsSupportUri', 'http://data.emii.com/annotation-types/support');
                }));

                beforeEach(inject(function($rootScope, $controller) {
                    scope = $rootScope.$new();

                    controller = $controller(ServiceThemesController, {
                        $scope: scope
                    });
                }));

                describe('Given we select a house theme', function () {
                    beforeEach(function () {
                        scope.theme = {
                            "@id": "http://data.emii.com/bca/themes/bcah-theme1",
                            "canonicalLabel": "House Theme",
                            "childTheme": {
                                "@set": [
                                    { "@id": "http://data.emii.com/bca/themes/fes-theme1" },
                                    { "@id": "http://data.emii.com/bca/themes/ces-theme1" }
                                ]
                            }
                        };
                    });
                    
                    beforeEach(inject(function (Annotations, AnnotationsSupportUri, AnnotationsScenarioUri, AnnotationsCounterArgumentUri) {
                        spyOn(Annotations, 'getAnnotations').andReturn({
                            then: function (expression) {
                                var data = {};
                                data['http://data.emii.com/bca/themes/bcah-theme1'] = [{
                                    key: AnnotationsSupportUri,
                                    values: [{
                                            '@id': 'http://data.emii.com/annotation-bcah-theme1',
                                            annotationFor: {
                                                '@id': 'http://data.emii.com/bca/themes/bcah-theme1',
                                                publishedIn: {
                                                    '@id': 'http://data.emii.com/bca/services/bca'
                                                },
                                                lastModified: '2013-06-21T09:00:00Z'
                                            }
                                        }]
                                },
                                {
                                    key: AnnotationsScenarioUri,
                                    values: []
                                },
                                {
                                    key: AnnotationsCounterArgumentUri,
                                    values: []
                                }];
                              
                                data['http://data.emii.com/bca/themes/fes-theme1'] = [{
                                    key: AnnotationsSupportUri,
                                    values: [{
                                        '@id': 'supportAnnotation2',
                                        annotationFor: {
                                            '@id': 'http://data.emii.com/bca/themes/fes-theme1',
                                            publishedIn: {
                                                '@id': 'http://data.emii.com/bca/services/fes'
                                            },
                                            lastModified: '2013-06-21T09:00:00Z'
                                        }
                                    }]
                                },
                                {
                                      key: AnnotationsScenarioUri,
                                      values: [{
                                          '@id': 'scenarioAnnotation1',
                                          annotationFor: {
                                              '@id': 'http://data.emii.com/bca/themes/fes-theme1',
                                              publishedIn: {
                                                  '@id': 'http://data.emii.com/bca/services/fes'
                                              },
                                              lastModified: '2013-06-21T09:00:00Z'
                                          }
                                      }]
                              },
                              {
                                  key: AnnotationsCounterArgumentUri,
                                  values: [{
                                      '@id': 'counterAnnotation1',
                                      annotationFor: {
                                          '@id': 'http://data.emii.com/bca/themes/fes-theme1',
                                          publishedIn: {
                                              '@id': 'http://data.emii.com/bca/services/fes'
                                          },
                                          lastModified: '2013-06-21T09:00:00Z'
                                      }
                                  }]
                              }];
                                
                                data['http://data.emii.com/bca/themes/ces-theme1'] = [{
                                    key: AnnotationsSupportUri,
                                    values: [{
                                        '@id': 'supportAnnotation2',
                                        annotationFor: {
                                            '@id': 'http://data.emii.com/bca/themes/ces-theme1',
                                            publishedIn: {
                                                '@id': 'http://data.emii.com/bca/services/ces'
                                            },
                                            lastModified: '2013-06-21T09:00:00Z'
                                        }
                                    }]
                                },
                                {
                                  key: AnnotationsScenarioUri,
                                  values: [{
                                      '@id': 'scenarioAnnotation1',
                                      annotationFor: {
                                          '@id': 'http://data.emii.com/bca/themes/ces-theme1',
                                          publishedIn: {
                                              '@id': 'http://data.emii.com/bca/services/ces'
                                          },
                                          lastModified: '2013-06-21T09:00:00Z'
                                      }
                                  }]
                                },
                                {
                                    key: AnnotationsCounterArgumentUri,
                                    values: [{
                                        '@id': 'counterAnnotation1',
                                        annotationFor: {
                                            '@id': 'http://data.emii.com/bca/themes/ces-theme1',
                                            publishedIn: {
                                                '@id': 'http://data.emii.com/bca/services/ces'
                                            },
                                            lastModified: '2013-06-21T09:00:00Z'
                                        }
                                    }]
                                }
                                ];
                                
                                expression(data);
                            }
                        });

                        scope.$root.$digest();
                    }));
                    
                    it('should show the annotations', function () {
                        expect(scope.showAnnotations).toBe(true);
                    });
                    
                    it('should get the annotations for the theme', inject(function (Annotations) {
                        expect(Annotations.getAnnotations).toHaveBeenCalledWith({
                            onlyOneAnnotationPerDocument: true,
                            conceptUri: ['http://data.emii.com/bca/themes/fes-theme1', 'http://data.emii.com/bca/themes/ces-theme1']
                        });
                    }));

                    it('should extend the themes with the annotations', function() {
                        expect(scope.theme.annotations).toBeUndefined();
                        expect(scope.theme.childTheme['@set'][0].annotations).toBeDefined();
                        expect(scope.theme.childTheme['@set'][1].annotations).toBeDefined();
                    });

                    it('allThemes should have 2 themes', function() {
                        expect(scope.allThemes.length).toBe(2);
                    });
                });

                describe('Given we select an orphan theme', function () {
                    describe('And the user is subscribed', function() {
                        beforeEach(function () {
                            scope.theme = {
                                "@id": "http://data.emii.com/bca/themes/fes-theme1",
                                "canonicalLabel": "FES Theme",
                                hasPermission: true
                            };
                        });

                        beforeEach(inject(function (Annotations, AnnotationsSupportUri, AnnotationsScenarioUri, AnnotationsCounterArgumentUri) {
                            spyOn(Annotations, 'getAnnotations').andReturn({
                                then: function (expression) {
                                    var data = {};

                                    data['http://data.emii.com/bca/themes/fes-theme1'] = [{
                                        key: AnnotationsSupportUri,
                                        values: [{
                                            '@id': 'http://data.emii.com/annotation-fes-theme1',
                                            annotationFor: {
                                                '@id': 'http://data.emii.com/bca/themes/fes-theme1',
                                                publishedIn: {
                                                    '@id': 'http://data.emii.com/bca/services/fes'
                                                },
                                                lastModified: '2013-06-21T09:00:00Z'
                                            }
                                        }]
                                    },
                                    {
                                        key: AnnotationsScenarioUri,
                                        values: [{
                                            '@id': 'scenarioAnnotation1',
                                            annotationFor: {
                                                '@id': 'http://data.emii.com/bca/themes/fes-theme1',
                                                publishedIn: {
                                                    '@id': 'http://data.emii.com/bca/services/fes'
                                                },
                                                lastModified: '2013-06-21T09:00:00Z'
                                            }
                                        }]
                                    },
                                  {
                                      key: AnnotationsCounterArgumentUri,
                                      values: [{
                                          '@id': 'counterAnnotation1',
                                          annotationFor: {
                                              '@id': 'http://data.emii.com/bca/themes/fes-theme1',
                                              publishedIn: {
                                                  '@id': 'http://data.emii.com/bca/services/fes'
                                              },
                                              lastModified: '2013-06-21T09:00:00Z'
                                          }
                                      }]
                                  }];


                                    expression(data);
                                }
                            });

                            scope.$root.$digest();
                        }));

                        it('should get the annotations for the theme', inject(function (Annotations) {
                            expect(Annotations.getAnnotations).toHaveBeenCalledWith({
                                onlyOneAnnotationPerDocument: true,
                                conceptUri: ['http://data.emii.com/bca/themes/fes-theme1']
                            });
                        }));

                        it('should extend the themes with the annotations', function () {
                            expect(scope.theme.annotations).toBeDefined();
                        });

                        it('allThemes should have 1 theme', function () {
                            expect(scope.allThemes.length).toBe(1);
                        });
                        
                        it('should show the annotations', function () {
                            expect(scope.showAnnotations).toBe(true);
                        });

                        it('should have default research options', function() {
                            expect(scope.options.length).toBe(4);
                        });
                    });

                    describe('And the user is not subscribed', function() {
                        beforeEach(inject(function (Annotations) {
                            spyOn(Annotations, 'getAnnotations').andCallThrough();
                            
                            scope.theme = {
                                "@id": "http://data.emii.com/bca/themes/fes-theme1",
                                "canonicalLabel": "FES Theme",
                                hasPermission: false
                            };
                            scope.$root.$digest();
                        }));

                        it('should not show the annotations', function() {
                            expect(scope.showAnnotations).toBe(false);
                        });
                        
                        it('should not get the annotations for the theme', inject(function (Annotations) {
                            expect(Annotations.getAnnotations).not.toHaveBeenCalled();
                        }));
                    });
                });

               
                describe('Given a theme already has annotations', function() {
                    describe('When selecting the theme', function() {
                        it('Should not fetch annotations', inject(function(Annotations) {
                            scope.theme = {
                                annotations: {}
                            };
                            spyOn(Annotations, 'getAnnotations').andReturn({
                                then: function(expression) {
                                    expression();
                                }
                            });

                            scope.$root.$digest();
                            expect(Annotations.getAnnotations).not.toHaveBeenCalled();
                        }));
                    });
                });
            });
        });
    });
