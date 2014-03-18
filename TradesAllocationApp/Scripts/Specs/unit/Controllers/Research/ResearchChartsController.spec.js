define(['App/Controllers/Research/ResearchChartsController',
        'underscore',
        'angular',
        'resource',
        'mocks',
        'App/Controllers/controllers'], function (ResearchChartsController) {
            describe('Research Charts Controller', function () {
                describe('Given we have a research charts controller', function() {
                    var controller,
                        scope,
                        $httpBackend,
                        hasUserChartsPermission;

                    var viewable = { 
                        '@id': 'http://data.emii.com/equity-markets/ae/agricultural-products'
                    };
                    beforeEach(function () {
                        module('App');
                    });

                   
                    beforeEach(inject(function ($rootScope, $controller, _$httpBackend_, $q) {
                        hasUserChartsPermission = true;
                        var fakeUrlProvider = {
                            getChartImageUrl: function (chartId) {
                                var deferred = $q.defer();
                                deferred.resolve('http://localhost/chart/' + chartId + '/image');
                                return deferred.promise;
                            },
                            getBanUrl: function (chartId) {
                                return 'http://banUrl/chart/' + chartId;
                            },
                            getLiveReportUrl: function (reportId) {
                                return 'http://livereport/' + reportId;
                            }
                        };

                        var fakeUserService = {
                            isCurrentUserAuthorisedToSeeCharts: function() {
                                return {
                                    then: function(expression) {
                                        return expression(hasUserChartsPermission);
                                    }
                                };
                            }
                        };

                        scope = $rootScope.$new();
                        scope.viewable = viewable;
                        scope.pageSize = 2;
                        controller = $controller(ResearchChartsController, {
                            $scope: scope,
                            UserService: fakeUserService,
                            UrlProvider: fakeUrlProvider
                        });
                        $httpBackend = _$httpBackend_;
                    }));

                    describe('When getting a single annotation', function() {
                        var singleAnnotationData,
                            chartData,
                            documentData;
                        beforeEach(inject(function(Annotations, Charts) {
                            singleAnnotationData = [
                            {
                                'references': {
                                    '@id': 'http://data.emii.com/equity-markets/ae/agricultural-products'
                                },
                                '@type': 'Annotation',
                                'annotationText': 'Annotation for Viewable',
                                'annotationFor': {
                                    'title': 'Chart 2',
                                    'lastModified': '2013-10-10T10:46:05.1292132+01:00',
                                    '@type': 'AnnotationConcept',
                                    'publishedIn': {
                                        '@type': 'Service',
                                        '@id': 'http://data.emii.com/bca/services/fes',
                                        'canonicalLabel': 'Foreign Exchange Strategy'
                                    },
                                    '@id': 'http://content.emii.com/charts/agricultural-products-chart-1-fes',
                                    'published': '2013-10-10T10:46:03.4423759+01:00'
                                },
                                '@id': 'http://data.emii.com/annotations/ann-chart-about-1#agricultural-products',
                                'annotatedAs': {
                                    '@id': 'http://data.emii.com/annotation-types/about'
                                },
                                'hasPermission': true
                        }
                            ];

                            chartData = {
                                _id: 'http://content.emii.com/charts/agricultural-products-chart-1-fes',
                                title: {
                                    text: 'Chart 1 FES'
                                },
                                link: [
                                    {
                                        _href: 'http://localhost/documents/agricultural-products-fes-doc',
                                        _rel: 'document'
                                    }

                                ]
                            };
                            documentData = {
                                document: {
                                    _id: 'agricultural-products-fes-doc',
                                    entry: {
                                        title: 'Agricultural Products Document'
                                    }
                                }
                            };
                            spyOn(Annotations, 'getAnnotations').andReturn({
                                then: function (expression) {
                                    expression(singleAnnotationData);
                                }
                            });
                            spyOn(Charts, 'getChart').andReturn({
                                then: function (expression) {
                                    expression(chartData);
                                }
                            });
                            
                            $httpBackend.expectGET('http://localhost/documents/agricultural-products-fes-doc')
                                .respond(documentData);
                        }));
                        afterEach(function() {
                            $httpBackend.verifyNoOutstandingExpectation();
                            $httpBackend.verifyNoOutstandingRequest();
                        });
                        
                        it('should load annotations for the viewable', inject(function (Annotations) {
                            scope.$root.$digest();
                            $httpBackend.flush();
                            expect(Annotations.getAnnotations).toHaveBeenCalledWith({
                                conceptUri: 'http://data.emii.com/equity-markets/ae/agricultural-products',
                                noGrouping: true
                            });
                            expect(scope.charts[0].annotation.publishedIn['@id']).toBe('http://data.emii.com/bca/services/fes');
                            expect(scope.charts[0].annotation.published).toBe('2013-10-10T10:46:03.4423759+01:00');
                        }));
                        
                        it('should load chart data for each annotation', inject(function (Charts) {
                            scope.$root.$digest();
                            $httpBackend.flush();
                            expect(Charts.getChart).toHaveBeenCalledWith({
                                id: 'agricultural-products-chart-1-fes'
                            });
                            expect(scope.charts[0].title).toEqual('Chart 1 FES');
                        }));
                        
                        it('should add the chart image url', function () {
                            scope.$root.$digest();
                            $httpBackend.flush();
                            expect(scope.charts[0].hasPermission).toBe(true);
                            expect(scope.charts[0].image).toBe('http://localhost/chart/agricultural-products-chart-1-fes/image');
                        });
                        
                        it('should add the ban url for the chart', function() {
                            scope.$root.$digest();
                            $httpBackend.flush();
                            expect(scope.charts[0].chartUrl).toBe('http://banUrl/chart/agricultural-products-chart-1-fes');
                        });
                        
                        it('should fetch the document', function () {
                            scope.$root.$digest();
                            $httpBackend.flush();
                            expect(scope.charts.length).toBe(1);
                            expect(scope.charts[0].reportPublishedIn).toBe('Agricultural Products Document');
                        });

                        it('charts should be valid', function() {
                            scope.$root.$digest();
                            $httpBackend.flush();
                            expect(scope.charts[0].valid).toBe(true);
                        });

                        it('should add the document url', function() {
                            scope.$root.$digest();
                            $httpBackend.flush();
                            expect(scope.charts[0].reportUrl).toBe('http://livereport/agricultural-products-fes-doc');
                        });
                        it('the "show more" button should not be displayed', inject(function () {
                            scope.$root.$digest();
                            $httpBackend.flush();
                            expect(scope.canShowMore).toBeFalsy();
                        }));
                    });
                    
                    describe('When the document doesnt exist', function () {
                        var singleAnnotationData,
                            chartData;
                        beforeEach(inject(function (Annotations, Charts) {
                            singleAnnotationData = [
                            {
                                'references': {
                                    '@id': 'http://data.emii.com/equity-markets/ae/agricultural-products'
                                },
                                '@type': 'Annotation',
                                'annotationText': 'Annotation for Viewable',
                                'annotationFor': {
                                    'title': 'Chart 2',
                                    'lastModified': '2013-10-10T10:46:05.1292132+01:00',
                                    '@type': 'AnnotationConcept',
                                    'publishedIn': {
                                        '@type': 'Service',
                                        '@id': 'http://data.emii.com/bca/services/fes',
                                        'canonicalLabel': 'Foreign Exchange Strategy'
                                    },
                                    '@id': 'http://content.emii.com/charts/agricultural-products-chart-1-fes',
                                    'published': '2013-10-10T10:46:03.4423759+01:00'
                                },
                                '@id': 'http://data.emii.com/annotations/ann-chart-about-1#agricultural-products',
                                'annotatedAs': {
                                    '@id': 'http://data.emii.com/annotation-types/about'
                                },
                                'hasPermission': true
                            }
                            ];

                            chartData = {
                                _id: 'http://content.emii.com/charts/agricultural-products-chart-1-fes',
                                title: {
                                    text: 'Chart 1 FES'
                                },
                                link: [
                                    {
                                        _href: 'http://localhost/documents/agricultural-products-fes-doc',
                                        _rel: 'document'
                                    }

                                ]
                            };
                           
                            spyOn(Annotations, 'getAnnotations').andReturn({
                                then: function (expression) {
                                    expression(singleAnnotationData);
                                }
                            });
                            spyOn(Charts, 'getChart').andReturn({
                                then: function (expression) {
                                    expression(chartData);
                                }
                            });

                            $httpBackend.whenGET('http://localhost/documents/agricultural-products-fes-doc')
                                .respond(404, 'There is no document at \'/documents/agricultural-products-fes-doc\'');
                        }));
                        afterEach(function () {
                            $httpBackend.verifyNoOutstandingExpectation();
                            $httpBackend.verifyNoOutstandingRequest();
                        });

                        it('should mark the chart as valid', function() {
                            scope.$root.$digest();
                            $httpBackend.flush();
                            expect(scope.charts[0].valid).toBe(true);
                        });
                    });
                    
                    describe('When the chart doesnt exist', function () {
                        var singleAnnotationData;
                        beforeEach(inject(function (Annotations, Charts) {
                            singleAnnotationData = [
                            {
                                'references': {
                                    '@id': 'http://data.emii.com/equity-markets/ae/agricultural-products'
                                },
                                '@type': 'Annotation',
                                'annotationText': 'Annotation for Viewable',
                                'annotationFor': {
                                    'title': 'Chart 2',
                                    'lastModified': '2013-10-10T10:46:05.1292132+01:00',
                                    '@type': 'AnnotationConcept',
                                    'publishedIn': {
                                        '@type': 'Service',
                                        '@id': 'http://data.emii.com/bca/services/fes',
                                        'canonicalLabel': 'Foreign Exchange Strategy'
                                    },
                                    '@id': 'http://content.emii.com/charts/agricultural-products-chart-1-fes',
                                    'published': '2013-10-10T10:46:03.4423759+01:00'
                                },
                                '@id': 'http://data.emii.com/annotations/ann-chart-about-1#agricultural-products',
                                'annotatedAs': {
                                    '@id': 'http://data.emii.com/annotation-types/about'
                                },
                                'hasPermission': true
                            }
                            ];

                            spyOn(Annotations, 'getAnnotations').andReturn({
                                then: function (expression) {
                                    expression(singleAnnotationData);
                                }
                            });
                            spyOn(Charts, 'getChart').andReturn({
                                then: function (success, error) {
                                    error('There is no document at ...');
                                }
                            });
                        }));
                        afterEach(function () {
                            $httpBackend.verifyNoOutstandingExpectation();
                            $httpBackend.verifyNoOutstandingRequest();
                        });

                        it('should mark the chart as not valid', function () {
                            scope.$root.$digest();
                            expect(scope.charts[0].valid).toBe(false);
                        });
                    });
                    
                    describe('When getting a single annotation without CHART permission', function () {
                        var singleAnnotationData,
                            chartData;
                        beforeEach(inject(function (Annotations, Charts) {
                            singleAnnotationData = [
                            {
                                'references': {
                                    '@id': 'http://data.emii.com/equity-markets/ae/agricultural-products'
                                },
                                '@type': 'Annotation',
                                'annotationText': 'Annotation for Viewable',
                                'annotationFor': {
                                    'title': 'Chart 2',
                                    'lastModified': '2013-10-10T10:46:05.1292132+01:00',
                                    '@type': 'AnnotationConcept',
                                    'publishedIn': {
                                        '@type': 'Service',
                                        '@id': 'http://data.emii.com/bca/services/fes',
                                        'canonicalLabel': 'Foreign Exchange Strategy'
                                    },
                                    '@id': 'http://content.emii.com/charts/agricultural-products-chart-1-fes',
                                    'published': '2013-10-10T10:46:03.4423759+01:00'
                                },
                                '@id': 'http://data.emii.com/annotations/ann-chart-about-1#agricultural-products',
                                'annotatedAs': {
                                    '@id': 'http://data.emii.com/annotation-types/about'
                                },
                                'hasPermission': true
                            }
                            ];

                            chartData = {
                                _id: 'http://content.emii.com/charts/agricultural-products-chart-1-fes',
                                title: {
                                    text: 'Chart 1 FES'
                                },
                                link: [
                                    {
                                        _href: 'http://localhost/documents/agricultural-products-fes-doc',
                                        _rel: 'document'
                                    }

                                ]
                            };
                            
                            spyOn(Annotations, 'getAnnotations').andReturn({
                                then: function (expression) {
                                    expression(singleAnnotationData);
                                }
                            });
                            spyOn(Charts, 'getChart').andReturn({
                                then: function (expression) {
                                    expression(chartData);
                                }
                            });
                        }));
                        afterEach(function () {
                            $httpBackend.verifyNoOutstandingExpectation();
                            $httpBackend.verifyNoOutstandingRequest();
                        });

                        it('should not add the chart image url if user has no CHAR token', function () {
                            hasUserChartsPermission = false;
                            scope.$root.$digest();
                            expect(scope.charts[0].hasPermission).toBe(false);
                            expect(scope.charts[0].image).toBeFalsy();
                        });

                    });
                  
                    describe('When getting multiple annotations', function() {
                        var multipleAnnotationsData,
                            chart1Data,
                            chart2Data,
                            documentData;
                        
                        beforeEach(inject(function(Annotations, Charts) {
                            multipleAnnotationsData = [
                                {
                                    'references': {
                                        '@id': 'http://data.emii.com/equity-markets/ae/agricultural-products'
                                    },
                                    '@type': 'Annotation',
                                    'annotationText': 'Annotation for Viewable',
                                    'annotationFor': {
                                        '@set': [
                                            {
                                                'title': 'Chart 2',
                                                'lastModified': '2013-10-10T15:24:53.3110337+01:00',
                                                '@type': 'AnnotationConcept',
                                                'publishedIn': {
                                                    '@type': 'Service',
                                                    '@id': 'http://data.emii.com/bca/services/ces',
                                                    'canonicalLabel': 'Commodity & Energy Strategy'
                                                },
                                                '@id': 'http://content.emii.com/charts/agricultural-products-chart-2',
                                                'published': '2013-10-10T15:24:52.4463608+01:00',
                                                'hasPermission': true
                                            },
                                            {
                                                'title': 'Chart 1',
                                                'lastModified': '2013-10-10T15:24:53.3470409+01:00',
                                                '@type': 'AnnotationConcept',
                                                'publishedIn': {
                                                    '@type': 'Service',
                                                    '@id': 'http://data.emii.com/bca/services/ces',
                                                    'canonicalLabel': 'Commodity & Energy Strategy'
                                                },
                                                '@id': 'http://content.emii.com/charts/agricultural-products-chart-1',
                                                'published': '2013-10-10T15:24:52.4463608+01:00',
                                                'hasPermission': true
                                            }
                                            
                                        ]
                                    },
                                    '@id': 'http://data.emii.com/annotations/ann-chart-about-1#agricultural-products',
                                    'annotatedAs': {
                                        '@id': 'http://data.emii.com/annotation-types/about'
                                    }
                                }
                            ];

                            chart1Data = {
                                _id: 'http://content.emii.com/charts/agricultural-products-chart-1',
                                title: {
                                    text: 'Chart 1 FES'
                                },
                                link: [
                                    {
                                        _href: 'http://localhost/documents/agricultural-products-doc',
                                        _rel: 'document'
                                    }
                                ]
                            };
                            
                            chart2Data = {
                                _id: 'http://content.emii.com/charts/agricultural-products-chart-2',
                                title: {
                                    text: 'Chart 2 FES'
                                },
                                link: [
                                    {
                                        _href: 'http://localhost/documents/agricultural-products-doc',
                                        _rel: 'document'
                                    }
                                ]
                            };
                            
                            documentData = {
                                document: {
                                    _id: 'agricultural-products-doc',
                                    entry: {
                                        title: 'Agricultural Products Document'
                                    }
                                }
                            };
                           
                            spyOn(Annotations, 'getAnnotations').andReturn({
                                then: function (expression) {
                                    expression(multipleAnnotationsData);
                                }
                            });
                            spyOn(Charts, 'getChart').andCallFake(function (data) {
                                if (data.id === 'agricultural-products-chart-1') {
                                    return {
                                        then: function(expression) {
                                            expression(chart1Data);
                                        }
                                    };
                                } else {
                                    return {
                                        then: function(expression) {
                                            expression(chart2Data);
                                        }
                                    };
                                }
                            });

                            $httpBackend.expectGET('http://localhost/documents/agricultural-products-doc')
                                .respond(documentData);
                            $httpBackend.expectGET('http://localhost/documents/agricultural-products-doc')
                               .respond(documentData);
                           
                        }));
                        afterEach(function () {
                            $httpBackend.verifyNoOutstandingExpectation();
                            $httpBackend.verifyNoOutstandingRequest();
                        });
                        it('should load annotations for the viewable', inject(function (Annotations) {
                            scope.$root.$digest();
                            $httpBackend.flush();
                            expect(Annotations.getAnnotations).toHaveBeenCalledWith({
                                conceptUri: 'http://data.emii.com/equity-markets/ae/agricultural-products',
                                noGrouping: true
                            });
                        }));

                        it('charts should be valid', function () {
                            scope.$root.$digest();
                            $httpBackend.flush();
                            expect(scope.charts[0].valid).toBe(true);
                            expect(scope.charts[1].valid).toBe(true);
                        });
                        
                        it('should load chart data for each unique chart annotation', inject(function (Charts) {
                            scope.$root.$digest();
                            $httpBackend.flush();
                            expect(Charts.getChart).toHaveBeenCalledWith({
                                id: 'agricultural-products-chart-1'
                            });
                            expect(Charts.getChart).toHaveBeenCalledWith({
                                id: 'agricultural-products-chart-2'
                            });
                           
                        }));

                     
                    });
                    
                    describe('When multiple annotations reference the same chart', function () {
                        var multipleAnnotationsData;

                        beforeEach(inject(function (Annotations, Charts) {
                            multipleAnnotationsData = [
                                {
                                    'references': {
                                        '@id': 'http://data.emii.com/equity-markets/ae/agricultural-products'
                                    },
                                    '@type': 'Annotation',
                                    'annotationText': 'Annotation for Viewable',
                                    'annotationFor': {
                                        '@set': [
                                            {
                                                'title': 'Chart 2',
                                                'lastModified': '2013-10-10T15:24:53.3110337+01:00',
                                                '@type': 'AnnotationConcept',
                                                'publishedIn': {
                                                    '@type': 'Service',
                                                    '@id': 'http://data.emii.com/bca/services/ces',
                                                    'canonicalLabel': 'Commodity & Energy Strategy'
                                                },
                                                '@id': 'http://content.emii.com/charts/agricultural-products-chart',
                                                'published': '2013-10-10T15:24:52.4463608+01:00',
                                                'hasPermission': true
                                            },
                                             {
                                                 'title': 'Chart 2',
                                                 'lastModified': '2013-10-10T15:24:53.3110337+01:00',
                                                 '@type': 'AnnotationConcept',
                                                 'publishedIn': {
                                                     '@type': 'Service',
                                                     '@id': 'http://data.emii.com/bca/services/ces',
                                                     'canonicalLabel': 'Commodity & Energy Strategy'
                                                 },
                                                 '@id': 'http://content.emii.com/charts/agricultural-products-chart',
                                                 'published': '2013-10-10T15:24:52.4463608+01:00',
                                                 'hasPermission': true
                                             }
                                        ]
                                    },
                                    '@id': 'http://data.emii.com/annotations/ann-chart-about-1#agricultural-products',
                                    'annotatedAs': {
                                        '@id': 'http://data.emii.com/annotation-types/about'
                                    }
                                }
                            ];


                            spyOn(Annotations, 'getAnnotations').andReturn({
                                then: function (expression) {
                                    expression(multipleAnnotationsData);
                                }
                            });
                            spyOn(Charts, 'getChart')
                                .andReturn({
                                    then: function() {
                                        
                                    }
                                });
                        }));
                     
                        it('should not load chart data', function () {
                            scope.$root.$digest();
                            expect(scope.charts.length).toBe(1);
                        });
                    });
                    
                    describe('When the user doesnt have permission for a service', function () {
                        var multipleAnnotationsData,
                            chartData;
                        beforeEach(inject(function (Annotations, Charts) {
                            multipleAnnotationsData = [
                                {
                                    'references': {
                                        '@id': 'http://data.emii.com/equity-markets/ae/agricultural-products'
                                    },
                                    '@type': 'Annotation',
                                    'annotationText': 'Annotation for Viewable',
                                    'annotationFor': {
                                        '@set': [
                                            {
                                                'title': 'Chart 2',
                                                'lastModified': '2013-10-10T15:24:53.3110337+01:00',
                                                '@type': 'AnnotationConcept',
                                                'publishedIn': {
                                                    '@type': 'Service',
                                                    '@id': 'http://data.emii.com/bca/services/ces',
                                                    'canonicalLabel': 'Commodity & Energy Strategy'
                                                },
                                                '@id': 'http://content.emii.com/charts/agricultural-products-chart-1',
                                                'published': '2013-10-10T15:24:52.4463608+01:00',
                                                'hasPermission': false
                                            }
                                        ]
                                    },
                                    '@id': 'http://data.emii.com/annotations/ann-chart-about-1#agricultural-products',
                                    'annotatedAs': {
                                        '@id': 'http://data.emii.com/annotation-types/about'
                                    }
                                }
                            ];

                            chartData = {
                                _id: 'http://content.emii.com/charts/agricultural-products-chart-1',
                                title: {
                                    text: 'Chart 1 FES'
                                },
                                link: [
                                    {
                                        _href: 'http://localhost/documents/agricultural-products-doc',
                                        _rel: 'document'
                                    }
                                ]
                            };

                            spyOn(Annotations, 'getAnnotations').andReturn({
                                then: function (expression) {
                                    expression(multipleAnnotationsData);
                                }
                            });
                            spyOn(Charts, 'getChart').andReturn({
                                then: function (expression) {
                                    expression(chartData);
                                }
                            });

                        }));
                       
                        it('should not attempt to fetch the document', function ()  {
                            scope.$root.$digest();
                          
                            $httpBackend.verifyNoOutstandingExpectation();
                            $httpBackend.verifyNoOutstandingRequest();
                        });

                    });

                    describe('Parsing chart title', function() {
                        describe('And the title is an object', function() {
                            it('Should parse the title correctly', function () {
                                var chartData = {
                                    title: {
                                        text: 'Chart Title'
                                    }
                                };
                                expect(scope._parseChartTitle(chartData)).toBe('Chart Title');
                            });
                        });
                        
                        describe('And the title is an array', function () {
                            it('Should parse the title correctly', function () {
                                var chartData = {
                                    title: {
                                        text: ['Chart Title', 'some style']
                                    }
                                };
                                expect(scope._parseChartTitle(chartData)).toBe('Chart Title');
                            });
                        });
                    });

                    describe('Given a viewable has multiple pages of annotations', function() {
                        var annotations,
                            chartData,
                            documentData,
                            chartData2,
                            documentData2,
                            chartData3,
                            documentData3;

                        beforeEach(inject(function (Annotations, Charts) {
                            annotations = [
                                {
                                    'references': {
                                        '@id': 'http://data.emii.com/equity-markets/ae/agricultural-products'
                                    },
                                    '@type': 'Annotation',
                                    'annotationText': 'Annotation for Viewable',
                                    'annotationFor': {
                                        '@set': [
                                            {
                                                'title': 'Chart 1',
                                                'lastModified': '2013-10-10T15:24:53.3110337+01:00',
                                                '@type': 'AnnotationConcept',
                                                'publishedIn': {
                                                    '@type': 'Service',
                                                    '@id': 'http://data.emii.com/bca/services/ces',
                                                    'canonicalLabel': 'Commodity & Energy Strategy'
                                                },
                                                '@id': 'http://content.emii.com/charts/agricultural-products-chart',
                                                'published': '2013-10-10T15:24:52.4463608+01:00',
                                                'hasPermission': true
                                            },
                                            {
                                                 'title': 'Chart 2',
                                                 'lastModified': '2013-10-10T15:24:53.3110337+01:00',
                                                 '@type': 'AnnotationConcept',
                                                 'publishedIn': {
                                                     '@type': 'Service',
                                                     '@id': 'http://data.emii.com/bca/services/ces',
                                                     'canonicalLabel': 'Commodity & Energy Strategy'
                                                 },
                                                 '@id': 'http://content.emii.com/charts/agricultural-products-chart-2',
                                                 'published': '2012-10-10T15:24:52.4463608+01:00',
                                                 'hasPermission': true
                                            },
                                            {
                                                'title': 'Chart 3',
                                                'lastModified': '2013-10-10T15:24:53.3110337+01:00',
                                                '@type': 'AnnotationConcept',
                                                'publishedIn': {
                                                    '@type': 'Service',
                                                    '@id': 'http://data.emii.com/bca/services/ces',
                                                    'canonicalLabel': 'Commodity & Energy Strategy'
                                                },
                                                '@id': 'http://content.emii.com/charts/agricultural-products-chart-3',
                                                'published': '2014-10-10T15:24:52.4463608+01:00',
                                                'hasPermission': true
                                            }
                                        ]
                                    },
                                    '@id': 'http://data.emii.com/annotations/ann-chart-about-1#agricultural-products',
                                    'annotatedAs': {
                                        '@id': 'http://data.emii.com/annotation-types/about'
                                    }
                                }
                            ];

                           chartData = {
                                _id: 'http://content.emii.com/charts/agricultural-products-chart',
                                title: {
                                    text: 'Chart FES'
                                },
                                link: [
                                    {
                                        _href: 'http://localhost/documents/agricultural-products-doc',
                                        _rel: 'document'
                                    }
                                ]
                            };

                            documentData = {
                                document: {
                                    _id: 'agricultural-products-doc',
                                    entry: {
                                        title: 'Agricultural Products Document'
                                    }
                                }
                            };

                            documentData2 = {
                                document: {
                                    _id: 'agricultural-products-doc-2',
                                    entry: {
                                        title: 'Agricultural Products Document'
                                    }
                                }
                            };

                            chartData2 = {
                                _id: 'http://content.emii.com/charts/agricultural-products-chart-2',
                                title: {
                                    text: 'Chart FES'
                                },
                                link: [
                                    {
                                        _href: 'http://localhost/documents/agricultural-products-doc-2',
                                        _rel: 'document'
                                    }
                                ]
                            };

                            documentData3 = {
                                document: {
                                    _id: 'agricultural-products-doc-3',
                                    entry: {
                                        title: 'Agricultural Products Document'
                                    }
                                }
                            };

                            chartData3 = {
                                _id: 'http://content.emii.com/charts/agricultural-products-chart-3',
                                title: {
                                    text: 'Chart FES'
                                },
                                link: [
                                    {
                                        _href: 'http://localhost/documents/agricultural-products-doc-3',
                                        _rel: 'document'
                                    }
                                ]
                            };

                            spyOn(Annotations, 'getAnnotations').andReturn({
                                then: function (expression) {
                                    expression(annotations);
                                }
                            });
                            spyOn(Charts, 'getChart').andCallFake(function (data) {
                                var result = {};
                                if (data.id === 'agricultural-products-chart') {
                                    result = chartData;
                                } else if (data.id === 'agricultural-products-chart-2') {
                                    result = chartData2;
                                } else if (data.id === 'agricultural-products-chart-3') {
                                    result = chartData3;
                                }
                                return {
                                    then: function(expression) {
                                        expression(result);
                                    }
                                };
                            });

                            $httpBackend.expectGET('http://localhost/documents/agricultural-products-doc-3')
                                .respond(documentData3);
                           
                            scope.pageSize = 1;
                            scope.$root.$digest();
                            $httpBackend.flush();
                        }));
                        
                        afterEach(function () {
                            $httpBackend.verifyNoOutstandingExpectation();
                            $httpBackend.verifyNoOutstandingRequest();
                            scope.pageSize = 10;
                        });
                        
                        it('should only load the chart document for the visible annotations', function () {
                            expect(scope.visibleCharts.length).toBe(1);
                        });
                        
                        it('should display "show more" button if the page size is less than the number of charts', inject(function () {
                            expect(scope.canShowMore).toBeTruthy();
                            expect(scope.chartsToShow).toBe(scope.pageSize);
                        }));

                        it('annotations should be ordered by descending published date', function() {
                            expect(scope.charts[0].annotation['@id']).toBe('http://content.emii.com/charts/agricultural-products-chart-3');
                            expect(scope.charts[1].annotation['@id']).toBe('http://content.emii.com/charts/agricultural-products-chart');
                            expect(scope.charts[2].annotation['@id']).toBe('http://content.emii.com/charts/agricultural-products-chart-2');
                        });
                        describe('When the user wants to show more charts', function () {
                            beforeEach(function() {
                                $httpBackend.expectGET('http://localhost/documents/agricultural-products-doc')
                                   .respond(documentData);
                                scope.showMore();
                                scope.$root.$digest();
                                $httpBackend.flush();
                            });
                            it('should load another page of charts', inject(function () {
                                expect(scope.visibleCharts.length).toBe(2);
                            }));
                            
                            it('should show the show more button', inject(function () {
                                expect(scope.canShowMore).toBe(true);
                            }));
                        
                            describe('When the user wants to show more charts again', function () {
                                beforeEach(function () {
                                    $httpBackend.expectGET('http://localhost/documents/agricultural-products-doc-2')
                                       .respond(documentData2);
                                    scope.showMore();
                                    scope.$root.$digest();
                                    $httpBackend.flush();
                                });
                                it('should load another page of charts', inject(function () {
                                    expect(scope.visibleCharts.length).toBe(3);
                                }));

                                it('should not show the show more button anymore', inject(function () {
                                    expect(scope.canShowMore).toBe(false);
                                }));

                            });
                        });


                    });
                });
            });
        }); 

