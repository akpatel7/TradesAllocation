define(['App/Directives/ViewsEvolutionChart',
        'underscore',
        'moment',
        'angular',
        'mocks'], function (ViewsEvolutionChart, _, moment) {
            'use strict';

            describe('Chart Directive', function () {
                var scope,
                    element;

                angular.module('ViewsEvolutionChart.Spec', [])
                    .factory('redirectService', function () {
                        return {
                            logout: function() {
                            },
                            forbidden: function() {
                            },
                            unauthorised: function() {
                            },
                            redirectTo: function () {
                            }
                        };
                    }).factory('UrlProvider', function () {
                        return {
                            getLiveReportUrl: function() {
                            },
                            getReportUrl: function() {
                            },
                            getViewHistoryExcelExportUrl: function() {
                                return {
                                    then: function(expression) {
                                        expression('');
                                    }
                                };
                            }
                        };
                    }).factory('Analytics', function () {
                        return {
                            registerPageTrack: function () {
                            },
                            registerClick: function () {
                            },
                            logUsage: function () {
                            }
                        };
                    });

                beforeEach(function () {
                    module('App');
                    module('ViewsEvolutionChart.Spec');
                });

                beforeEach(inject(function (_$httpBackend_) {
                    _$httpBackend_.whenGET('Templates/ViewEvolutionChart/ModalAddServiceViews.html')
                        .respond('');
                }));
                
                describe('Views Evolution', function () {
                    beforeEach(inject(function ($compile, $rootScope, HighCharts) {
                        var series = [
                            {
                                name: 'Strategic View',
                                data: [
                                    [0, 0, 3],
                                    [0, 7, 10]
                                ],
                                view: {
                                    viewType: {
                                        '@id': 'http://data.emii.com/view-types/absolute'
                                    },
                                    viewRecommendationType: {
                                        '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                    },
                                    service: {
                                        '@id': 'http://data.emii.com/bca/services/ces'
                                    },
                                    viewOn: {
                                        '@id': 'http://data.emii.com/economy/us',
                                        canonicalLabel: 'US Economy'
                                    }
                                }
                            },
                            {
                                name: 'Tactical View',
                                color: 'red',
                                data: [
                                    [0, 16, 20],
                                    [0, 19, 30]
                                ],
                                view: {
                                    viewType: {
                                        '@id': 'http://data.emii.com/view-types/absolute'
                                    },
                                    viewRecommendationType: {
                                        '@id': 'http://data.emii.com/view-recommendation-types/tactical'
                                    },
                                    service: {
                                        '@id': 'http://data.emii.com/bca/services/ces'
                                    },
                                    viewOn: {
                                        '@id': 'http://data.emii.com/economy/us',
                                        canonicalLabel: 'US Economy'
                                    }
                                }
                            },
                            {
                                name: 'Strategic Annotation',
                                color: 'red',
                                data: [[0, 16]],
                                view: {
                                    viewType: {
                                        '@id': 'http://data.emii.com/view-types/absolute'
                                    },
                                    viewRecommendationType: {
                                        '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                    },
                                    service: {
                                        '@id': 'http://data.emii.com/bca/services/usis'
                                    },
                                    viewOn: {
                                        '@id': 'http://data.emii.com/economy/us',
                                        canonicalLabel: 'US Economy'
                                    }
                                },
                                annotation: {
                                    
                                }
                            },
                            {
                                name: 'Tactical Annotation',
                                color: 'red',
                                data: [[0, 16]],
                                view: {
                                    viewType: {
                                        '@id': 'http://data.emii.com/view-types/absolute'
                                    },
                                    viewRecommendationType: {
                                        '@id': 'http://data.emii.com/view-recommendation-types/tactical'
                                    },
                                    service: {
                                        '@id': 'http://data.emii.com/bca/services/fes'
                                    },
                                    viewOn: {
                                        '@id': 'http://data.emii.com/economy/us',
                                        canonicalLabel: 'US Economy'
                                    }
                                },
                                annotation: {
                                                                        
                                }
                            }                           
                        ];
                        scope = $rootScope.$new();
                        scope.views = {
                            views: _.pluck(series, 'view')
                        };
                        spyOn(HighCharts, 'processViews').andReturn({
                            series: series,
                            xAxis: {
                                categories: [
                                    {
                                        name: 'Category 1',
                                        serviceName: 'CES',
                                        description: ''
                                    },
                                    {
                                        name: 'Category 2',
                                        serviceName: 'CES',
                                        description: ''
                                    }
                                ]
                            }
                        });
                       
                    }));

                    describe('With default values', function() {
                        beforeEach(inject(function ($compile) {
                            element = $compile('<div views-evolution-chart views="views" width="500" ></div>')(scope);
                            scope.$root.$digest();
                        }));
                        
                        it('Should have a height of 200', function () {
                            expect(element.isolateScope().chart.options.chart.height).toBe(200);
                        });

                        it('Should have a width of 500', function () {
                            expect(element.isolateScope().chart.options.chart.width).toBe('500');
                        });

                        it('Should have series data', function () {
                            expect(element.isolateScope().chart.options.series.length).toBe(4);
                        });

                        it('Should have categories data', function () {
                            expect(element.isolateScope().chart.options.xAxis[0].categories.length).toBe(2);
                        });

                        it('Should create the chart', function () {
                            expect(element.isolateScope().chart).toBeDefined();
                        });

                        it('should have Tactical & Strategic views selected by default', function () {
                            expect(element.find('.view-types > a').text().trim()).toBe('Tactical & Strategic');
                        });

                        it('should have active views selected by default', function () {
                            expect(element.find('.view-status > a').text().trim()).toBe('Active');
                        });

                        it('should have Reports Indicators selected by default', function () {
                            expect(element.find('.reports > a').text().trim()).toBe('Report Indicators');
                        });
                        
                    });

                    describe('With custom settings', function () {
                        beforeEach(inject(function ($compile) {
                            scope.settings = {
                                viewType: {
                                    strategic: {
                                        visible: true
                                    },
                                    tactical: {
                                        visible: false
                                    }
                                },
                                report: {
                                    visible: false
                                },
                                viewStatus: {
                                    all: {
                                        visible: true
                                    }
                                }
                            };
                            element = $compile('<div views-evolution-chart views="views" width="500" custom-settings="settings"></div>')(scope);
                            scope.$root.$digest();
                        }));
                       
                        it('should have only Strategic selected', function () {
                            expect(element.isolateScope().settings.viewType.tactical.visible).toBe(false);
                            expect(element.isolateScope().settings.viewType.strategic.visible).toBe(true);
                            expect(element.find('.view-types > a').text().trim()).toBe('Strategic');
                        });

                        it('should have active and expired views selected', function () {
                            expect(element.isolateScope().settings.viewStatus.all.visible).toBe(true);
                            expect(element.find('.view-status > a').text().trim()).toBe('Active & Expired');
                        });

                        it('should have no Reports Indicators selected', function () {
                            expect(element.isolateScope().settings.report.visible).toBe(false);
                            expect(element.find('.reports > a').text().trim()).toBe('No Report Indicators');
                        });
                    });
                });
                
                describe('Toggable buttons', function () {
                    beforeEach(inject(function ($compile, $rootScope) {
                        scope = $rootScope.$new();
                        scope.views = [];
                        
                        element = $compile('<div views-evolution-chart views="views" ></div>')(scope);
                    }));
                    
                    describe('Given we only have strategic views', function () {
                        var series = [
                            {
                                name: 'Strategic View',
                                data: [
                                    [0, 0, 3],
                                    [0, 7, 10]
                                ],
                                view: {
                                    viewRecommendationType: {
                                        '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                    },
                                    viewOn: {
                                        '@id': 'http://data.emii.com/economy/us',
                                        canonicalLabel: 'US Economy'
                                    },
                                    service: {
                                        '@id': 'http://data.emii.com/bca/services/ces'
                                    }
                                }
                            }];
                        beforeEach(inject(function (HighCharts) {
                            spyOn(HighCharts, 'processViews').andReturn({
                                series: series,
                                xAxis: {
                                    categories: [
                                        {
                                            name: 'Category 1',
                                            serviceName: 'CES',
                                            description: ''
                                        },
                                        {
                                            name: 'Category 2',
                                            serviceName: 'CES',
                                            description: ''
                                        }
                                    ]
                                }
                            });
                            spyOn(HighCharts, '_getCategory').andReturn('');
                            scope.views.views = _.pluck(series, 'view');
                            scope.$root.$digest();
                        }));

                        it('should only display one option', function () {
                            expect(element.find('.view-types .dropdown-menu li').length).toBe(1);
                        });
                        
                        it('should display the selected option "Strategic"', function () {
                            expect(element.find('.view-types > a').text().trim()).toBe('Strategic');
                        });
                        
                        it('tactical option should be disabled', function () {
                            expect(element.isolateScope().settings.viewType.tactical.enabled).toBe(false);
                        });
                        
                        it('strategic option should be enabled', function () {
                            expect(element.isolateScope().settings.viewType.strategic.enabled).toBe(true);
                        });
                    });
                    
                    describe('Given we only have tactical views', function () {
                        var series = [
                            {
                                name: 'Tactical View',
                                data: [
                                    [0, 0, 3],
                                    [0, 7, 10]
                                ],
                                view: {
                                    viewRecommendationType: {
                                        '@id': 'http://data.emii.com/view-recommendation-types/tactical'
                                    },
                                    viewOn: {
                                        '@id': 'http://data.emii.com/economy/us',
                                        canonicalLabel: 'US Economy'
                                    },
                                    service: {
                                        '@id': 'http://data.emii.com/bca/services/ces'
                                    }
                                }
                            }];
                        beforeEach(inject(function (HighCharts) {
                            spyOn(HighCharts, 'processViews').andReturn({
                                series: series,
                                xAxis: {
                                    categories: [
                                        {
                                            name: 'Category 1',
                                            serviceName: 'CES',
                                            description: ''
                                        },
                                        {
                                            name: 'Category 2',
                                            serviceName: 'CES',
                                            description: ''
                                        }
                                    ]
                                }
                            });
                            spyOn(HighCharts, '_getCategory').andReturn('');
                            scope.views.views = _.pluck(series, 'view');
                            scope.$root.$digest();
                        }));
                        
                        it('should only display one option', function () {
                            expect(element.find('.view-types .dropdown-menu li').length).toBe(1);
                        });

                        it('should display the selected option "Tactical"', function () {
                            expect(element.find('.view-types > a').text().trim()).toBe('Tactical');
                        });
                        
                        it('tactical option should be enabled', function () {
                            expect(element.isolateScope().settings.viewType.tactical.enabled).toBe(true);
                        });

                        it('strategic option should be disabled', function () {
                            expect(element.isolateScope().settings.viewType.strategic.enabled).toBe(false);
                        });
                    });
                    
                    describe('Given we have tactical and strategic views', function () {
                        beforeEach(inject(function (HighCharts) {
                            spyOn(HighCharts, 'processViews').andReturn({
                                series: [
                                    {
                                        name: 'Tactical View',
                                        data: [
                                            [0, 0, 3],
                                            [0, 7, 10]
                                        ],
                                        view: {
                                            viewRecommendationType: {
                                                '@id': 'http://data.emii.com/view-recommendation-types/tactical'
                                            },
                                            viewOn: {
                                                '@id': 'http://data.emii.com/economy/us',
                                                canonicalLabel: 'US Economy'
                                            }
                                        }
                                    },
                                    {
                                        name: 'Strategic View',
                                        data: [
                                            [0, 0, 3],
                                            [0, 7, 10]
                                        ],
                                        view: {
                                            viewRecommendationType: {
                                                '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                            },
                                            viewOn: {
                                                '@id': 'http://data.emii.com/economy/us',
                                                canonicalLabel: 'US Economy'
                                            }
                                        }
                                    }
                                ],
                                xAxis: {
                                    categories: [
                                        {
                                            name: 'Category 1',
                                            serviceName: 'CES',
                                            description: ''
                                        },
                                        {
                                            name: 'Category 2',
                                            serviceName: 'CES',
                                            description: ''
                                        }
                                    ]
                                }
                            });
                        }));
                        
                        it('should only display two options', function () {
                            scope.$root.$digest();
                            expect(element.find('.view-types .dropdown-menu li').length).toBe(2);
                        });
                        
                        it('tactical option should be enabled', function () {
                            scope.$root.$digest();
                            expect(element.isolateScope().settings.viewType.tactical.enabled).toBe(true);
                        });

                        it('strategic option should be enabled', function () {
                            scope.$root.$digest();
                            expect(element.isolateScope().settings.viewType.strategic.enabled).toBe(true);
                        });

                        describe('When selecting strategic', function () {
                            it('selected option should be Strategic', function () {
                                scope.$root.$digest();
                                $(element.find('.view-types .dropdown-menu li a')[0]).trigger('click');
                                scope.$root.$digest();
                                expect(element.find('.view-types > a').text().trim()).toBe('Strategic');
                            });
                        });
                        
                        describe('When selecting tactical', function () {
                            it('selected option should be Tactical', function () {
                                scope.$root.$digest();
                                $(element.find('.view-types .dropdown-menu li a')[1]).trigger('click');
                                scope.$root.$digest();
                                expect(element.find('.view-types > a').text().trim()).toBe('Tactical');
                            });
                        });
                    });
                    
                });
                
                describe('Reports button', function () {
                    beforeEach(inject(function ($compile, $rootScope) {
                        scope = $rootScope.$new();
                        scope.views = [];
                        element = $compile('<div views-evolution-chart views="views" ></div>')(scope);

                    }));
                    describe('Given we have reports', function () {
                        var series = [
                            {
                                name: 'Strategic View Report',
                                data: [
                                    [0, 0, 3],
                                    [0, 7, 10]
                                ],
                                view: {
                                    viewRecommendationType: {
                                        '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                    },
                                    viewOn: {
                                        '@id': 'http://data.emii.com/economy/us',
                                        canonicalLabel: 'US Economy'
                                    },
                                    service: {
                                        '@id': 'http://data.emii.com/bca/services/ces'
                                    }
                                },
                                annotation: {
                                    
                                }
                            }];
                        beforeEach(inject(function (HighCharts) {
                            spyOn(HighCharts, 'processViews').andReturn({
                                series: series,
                                xAxis: {
                                    categories: [
                                        {
                                            name: 'Category 1',
                                            serviceName: 'CES',
                                            description: ''
                                        },
                                        {
                                            name: 'Category 2',
                                            serviceName: 'CES',
                                            description: ''
                                        }
                                    ]
                                }
                            });
                            spyOn(HighCharts, '_getCategory').andReturn('');
                            scope.views.views = _.pluck(series, 'view');
                            scope.$root.$digest();
                        }));
                        
                        it('report option should be enabled', function () {
                            expect(element.isolateScope().settings.report.enabled).toBe(true);
                        });

                        describe('When de-selecting reports', function() {
                            it('should change the text to "No Report Indicators"', function() {
                                expect(element.find('.reports > a').text().trim()).toBe('Report Indicators');
                                $(element.find('.reports .dropdown-menu li a')[0]).trigger('click');
                                expect(element.find('.reports > a').text().trim()).toBe('No Report Indicators');
                            });
                        });
                    });

                    describe('Given we dont have reports', function () {
                        var series = [
                            {
                                name: 'Tactical View',
                                data: [
                                    [0, 0, 3],
                                    [0, 7, 10]
                                ],
                                view: {
                                    viewRecommendationType: {
                                        '@id': 'http://data.emii.com/view-recommendation-types/tactical'
                                    },
                                    viewOn: {
                                        '@id': 'http://data.emii.com/economy/us',
                                        canonicalLabel: 'US Economy'
                                    },
                                    service: {
                                        '@id': 'http://data.emii.com/bca/services/ces'
                                    }
                                }
                            }];
                        beforeEach(inject(function (HighCharts) {
                            spyOn(HighCharts, 'processViews').andReturn({
                                series: series,
                                xAxis: {
                                    categories: [
                                        {
                                            name: 'Category 1',
                                            serviceName: 'CES',
                                            description: ''
                                        },
                                        {
                                            name: 'Category 2',
                                            serviceName: 'CES',
                                            description: ''
                                        }
                                    ]
                                }
                            });
                            spyOn(HighCharts, '_getCategory').andReturn('');
                            
                            scope.views.views = _.pluck(series, 'view');
                        }));
                        
                        it('report option should not be displayed', function () {
                            scope.$root.$digest();
                            expect(element.isolateScope().settings.report.enabled).toBe(false);
                            expect(element.find('.nav .dropdown').length).toBe(3);
                        });
                    });


                });
                
                describe('Selecting a series', function() {
                    describe('Given we have 3 series', function () {
                        var event,
                            parentElement,
                            element1,
                            element2,
                            element3;
                        beforeEach(inject(function ($compile, $rootScope, HighCharts) {
                            scope = $rootScope.$new();
                            scope.views = {
                                views: [
                                    {
                                        '@id': 'http://data.emii.com/view1',
                                        viewRecommendationType: {
                                            '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                        },
                                        viewOn: {
                                            '@id': 'http://data.emii.com/viewable1'
                                        },
                                        service: {
                                            '@id': 'http://data.emii.com/bca/services/ces'
                                        }
                                    },
                                    {
                                        '@id': 'http://data.emii.com/view2',
                                        viewRecommendationType: {
                                            '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                        },
                                        viewOn: {
                                            '@id': 'http://data.emii.com/viewable1'
                                        },
                                        service: {
                                            '@id': 'http://data.emii.com/bca/services/ces'
                                        }
                                    },
                                     {
                                         '@id': 'http://data.emii.com/view3',
                                         viewRecommendationType: {
                                             '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                         },
                                         viewOn: {
                                             '@id': 'http://data.emii.com/viewable1'
                                         },
                                         service: {
                                             '@id': 'http://data.emii.com/bca/services/ces'
                                         }
                                     }
                            ]};
                            spyOn(HighCharts, '_getCategory').andReturn('');
                            spyOn(HighCharts, 'processViews').andReturn({
                                series: [
                                ],
                                xAxis: {
                                    categories: []
                                }
                            });
                            element = $compile('<div views-evolution-chart views="views"></div>')(scope);
                            scope.$root.$digest();
                        }));
                        beforeEach(function () {
                            var toFront = function () {
                                var index = _.indexOf(this.element.parentElement.childNodes, this.element);
                                this.element.parentElement.childNodes.splice(index, 1);
                                this.element.parentElement.childNodes.push(this.element);
                            };
                            parentElement = {
                                removeChild: function (elt) {
                                    this.childNodes = _.without(this.childNodes, elt);
                                },
                                insertBefore: function (newElt, existingElt) {
                                    var index = _.indexOf(this.childNodes, existingElt);
                                    existingElt.parentElement.childNodes.splice(index, 0, newElt);
                                },
                                appendChild: function (elt) {
                                    this.childNodes.push(elt);
                                }
                            };

                            element1 = {
                                id: 'element1',
                                parentElement: parentElement,
                                toFront: function () {
                                }
                            };
                            element2 = {
                                id: 'element2',
                                parentElement: parentElement,
                                toFront: function () {
                                }
                            };
                            element3 = {
                                id: 'element3',
                                parentElement: parentElement,
                                toFront: function () {
                                }
                            };
                            parentElement.childNodes = [
                                element1,
                                element2,
                                element3
                            ];

                            event = {
                                currentTarget: {
                                    update: function (options) {
                                        _.extend(this.userOptions, options);
                                    },
                                    chart: {
                                        linkSeries: function() {
                                        },
                                        redraw: function() {
                                        },
                                        series: [
                                            {
                                                userOptions: {
                                                    view: {
                                                        '@id': 'http://data.emii.com/view1',
                                                        viewRecommendationType: {
                                                            '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                                        }
                                                    },
                                                    data: [[0, 1, 12]],
                                                    states: {
                                                        select: {},
                                                        unselect: {}
                                                    },
                                                    seriesEndDate: 12,
                                                    selectedSeriesEndDate: 1002
                                                },
                                                group: {
                                                    element: element1,
                                                    toFront: toFront
                                                },
                                                update: function (options) {
                                                    _.extend(this.userOptions, options);
                                                }
                                            },
                                             {
                                                 userOptions: {
                                                     view: {
                                                         '@id': 'http://data.emii.com/view2',
                                                         viewRecommendationType: {
                                                             '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                                         }
                                                     },
                                                     data: [[0, 1, 22]],
                                                     states: {
                                                         select: {},
                                                         unselect: {}
                                                     },
                                                     seriesEndDate: 22,
                                                     selectedSeriesEndDate: 2002
                                                 },
                                                 group: {
                                                     element: element2,
                                                     toFront: toFront
                                                 },
                                                 update: function (options) {
                                                     _.extend(this.userOptions, options);
                                                 }
                                             },
                                            {
                                                userOptions: {
                                                    view: {
                                                        '@id': 'http://data.emii.com/view3',
                                                        viewRecommendationType: {
                                                            '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                                        }
                                                    },
                                                    data: [[0, 1, 32]],
                                                    states: {
                                                        select: {},
                                                        unselect: {}
                                                    },
                                                    seriesEndDate: 32,
                                                    selectedSeriesEndDate: 3002
                                                },
                                                group: {
                                                    element: element3,
                                                    toFront: toFront
                                                },
                                                update: function (options) {
                                                    _.extend(this.userOptions, options);
                                                }
                                            }
                                        ]
                                    }
                                }

                            };
                        });
                        describe('When selecting the second series (strategic) for the first time', function () {
                            beforeEach(function () {
                                event.currentTarget.userOptions = event.currentTarget.chart.series[1].userOptions;
                            });
                            it('should set selected to true', function () {
                                element.isolateScope().chart.options.plotOptions.series.events.click(event);
                                expect(event.currentTarget.userOptions.selected).toBe(true);
                                expect(event.currentTarget.userOptions.zIndex).toBe(1);
                            });
                            
                            it('should set the z-index to 1', function () {
                                element.isolateScope().chart.options.plotOptions.series.events.click(event);
                                expect(event.currentTarget.userOptions.zIndex).toBe(1);
                            });
                            
                            it('should update the series data', function () {
                                element.isolateScope().chart.options.plotOptions.series.events.click(event);
                                expect(event.currentTarget.chart.series[1].userOptions.data[0]).toEqual([0, 1, 2002]);
                            });
                        });

                        describe('When selecting the second series (strategic)  for the second time', function () {
                            beforeEach(function () {
                                event.currentTarget.userOptions = event.currentTarget.chart.series[1].userOptions;
                                element.isolateScope().chart.options.plotOptions.series.events.click(event);
                            });
                            it('should set selected to false', function () {
                                element.isolateScope().chart.options.plotOptions.series.events.click(event);
                                expect(event.currentTarget.userOptions.selected).toBe(false);
                            });

                            it('should update the series data to its original value', function () {
                                element.isolateScope().chart.options.plotOptions.series.events.click(event);
                                expect(event.currentTarget.chart.series[1].userOptions.data[0]).toEqual([0, 1, 22]);
                            });
                            
                            it('should set the z-index to 0', function () {
                                element.isolateScope().chart.options.plotOptions.series.events.click(event);
                                expect(event.currentTarget.userOptions.zIndex).toBe(0);
                            });

                        });

                        describe('When selecting the last series twice', function () {
                            beforeEach(function () {
                                event.currentTarget.userOptions = event.currentTarget.chart.series[2].userOptions;
                                element.isolateScope().chart.options.plotOptions.series.events.click(event);
                            });
                            
                            it('should set selected to false', function () {
                                element.isolateScope().chart.options.plotOptions.series.events.click(event);
                                expect(event.currentTarget.userOptions.selected).toBe(false);
                            });
                        });

                        describe('When selecting two different series', function () {
                            it('should unselect the first one and select the second one', function () {
                                // select first series
                                event.currentTarget.userOptions = event.currentTarget.chart.series[1].userOptions;
                                element.isolateScope().chart.options.plotOptions.series.events.click(event);
                                expect(event.currentTarget.chart.series[0].userOptions.selected).toBeUndefined();
                                expect(event.currentTarget.chart.series[1].userOptions.selected).toBe(true);
                                expect(event.currentTarget.chart.series[2].userOptions.selected).toBeUndefined();

                                // select second series
                                event.currentTarget.userOptions = event.currentTarget.chart.series[0].userOptions;
                                element.isolateScope().chart.options.plotOptions.series.events.click(event);
                                expect(event.currentTarget.chart.series[0].userOptions.selected).toBe(true);
                                expect(event.currentTarget.chart.series[1].userOptions.selected).toBe(false);
                                expect(event.currentTarget.chart.series[2].userOptions.selected).toBeUndefined();
                            });

                        });
                    });

                });

                describe('Selecting a ', function () {
                    var series = [
                            {
                                name: 'Strategic View Report',
                                data: [
                                    [0, 0, 3],
                                    [0, 7, 10]
                                ],
                                view: {
                                    viewRecommendationType: {
                                        '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                    },
                                    viewOn: {
                                        '@id': 'http://data.emii.com/economy/us',
                                        canonicalLabel: 'US Economy'
                                    },
                                    service: {
                                        '@id': 'http://data.emii.com/bca/services/ces'
                                    }
                                },
                                annotation: {

                                }
                            }];
                    beforeEach(inject(function ($compile, $rootScope, HighCharts) {
                        scope = $rootScope.$new();
                        
                        spyOn(HighCharts, 'processViews').andReturn({
                            series: series,
                            xAxis: {
                                categories: []
                            }
                        });
                        element = $compile('<div views-evolution-chart views="views"></div>')(scope);
                        scope.views = {
                            views: _.pluck(series, 'view')
                        };
                        spyOn(HighCharts, '_getCategory').andReturn('');
                        scope.$root.$digest();
                    }));

                    describe('report series', function() {
                        it('should go to live report', inject(function (UrlProvider, redirectService) {
                            var event = {
                                currentTarget: {
                                    userOptions: {
                                        annotation: {
                                            annotationFor: {
                                                title: 'report title',
                                                '@id': 'urn:document:documentId'
                                            }
                                        }
                                    }
                                }
                            };
                            spyOn(UrlProvider, 'getLiveReportUrl').andReturn('http://livereport.com/report');
                            spyOn(redirectService, 'redirectTo').andCallFake(function() {
                            });
                            element.isolateScope().chart.options.plotOptions.series.events.click(event);
                            expect(redirectService.redirectTo).toHaveBeenCalledWith('http://livereport.com/report');
                        }));
                        
                        it('track the click', inject(function (Analytics) {
                            var event = {
                                currentTarget: {
                                    userOptions: {
                                        annotation: {
                                            annotationFor: {
                                                title: 'report title',
                                                '@id': 'urn:document:documentId'
                                            }
                                        }
                                    }
                                }
                            };
                            spyOn(Analytics, 'registerClick').andCallFake(function() {
                            });
                            element.isolateScope().chart.options.plotOptions.series.events.click(event);
                            expect(Analytics.registerClick).toHaveBeenCalledWith('accessreport_REPORT_TITLE');
                        }));
                    });
                });
                
                describe('When exporting the chart', function () {
                    beforeEach(inject(function ($compile, $rootScope, HighCharts) {
                        scope = $rootScope.$new();
                        scope.views = {
                            views: [
                               
                            ]
                        };
                        spyOn(HighCharts, 'processViews').andReturn({
                            series: [
                            ],
                            xAxis: {
                                categories: []
                            }
                        });
                        element = $compile('<div views-evolution-chart views="views" viewable-id="selectedViewableId"></div>')(scope);
                        scope.$root.$digest();
                    }));
                    
                    it('Should only export the visible series', inject(function (UrlProvider) {
                        spyOn(UrlProvider, 'getViewHistoryExcelExportUrl').andReturn({
                            then: function (expression) {
                                expression('http://tempuri.org');
                            }
                        });
                        element.isolateScope().settings.viewType.tactical.visible = true;
                        element.isolateScope().settings.viewType.strategic.visible = false;
                        element.isolateScope().settings.viewStatus.all.visible = true;
                        element.isolateScope().categories = [
                            { 'service': { '@id': 'service1' }, 'viewRelativeTo': { '@id': 'benchmark1' }, 'visible': false },
                            { 'service': { '@id': 'service2' }, 'viewRelativeTo': { '@id': 'benchmark2' }, 'visible': true }];
                        element.isolateScope().views.views = [{
                            viewOn: {
                                '@id': 'http://data.emii.com/viewable1'
                            }
                        }];
                        element.isolateScope().setExportUrl();
                        expect(UrlProvider.getViewHistoryExcelExportUrl).toHaveBeenCalledWith(['http://data.emii.com/viewable1'], ['http://data.emii.com/view-recommendation-types/tactical'], [{ 'service': 'service2', 'viewRelativeTo': 'benchmark2' }], true);
                    }));

                    describe('When active is true', function() {
                        it('Should export all evolved views', inject(function (UrlProvider) {
                            spyOn(UrlProvider, 'getViewHistoryExcelExportUrl').andReturn({
                                then: function (expression) {
                                    expression('http://tempuri.org');
                                }
                            });
                            element.isolateScope().settings.viewType.tactical.visible = true;
                            element.isolateScope().settings.viewType.strategic.visible = false;
                            element.isolateScope().settings.viewStatus.all.visible = false;
                            element.isolateScope().categories = [
                                { 'service': { '@id': 'service1' }, 'viewRelativeTo': { '@id': 'benchmark1' }, 'visible': false },
                                { 'service': { '@id': 'service2' }, 'viewRelativeTo': { '@id': 'benchmark2' }, 'visible': true }];
                            element.isolateScope().views.views = [{
                                viewOn: {
                                    '@id': 'http://data.emii.com/viewable1'
                                }
                            }];
                            element.isolateScope().setExportUrl();
                            expect(UrlProvider.getViewHistoryExcelExportUrl).toHaveBeenCalledWith(['http://data.emii.com/viewable1'], ['http://data.emii.com/view-recommendation-types/tactical'], [{ 'service': 'service2', 'viewRelativeTo': 'benchmark2' }], false);
                        }));
                    });

                    describe('When multiple viewables are being displayed', function () {
                        it('Should export all all viewables', inject(function (UrlProvider) {
                            spyOn(UrlProvider, 'getViewHistoryExcelExportUrl').andReturn({
                                then: function (expression) {
                                    expression('http://tempuri.org');
                                }
                            });
                            element.isolateScope().settings.viewType.tactical.visible = true;
                            element.isolateScope().settings.viewType.strategic.visible = false;
                            element.isolateScope().settings.viewStatus.all.visible = false;
                            element.isolateScope().categories = [
                                { 'service': { '@id': 'service1' }, 'viewRelativeTo': { '@id': 'benchmark1' }, 'visible': false },
                                { 'service': { '@id': 'service2' }, 'viewRelativeTo': { '@id': 'benchmark2' }, 'visible': true }];
                            element.isolateScope().views.views = [{
                                viewOn: {
                                    '@id': 'http://data.emii.com/viewable1'
                                }
                            },
                            {
                                viewOn: {
                                    '@id': 'http://data.emii.com/viewable2'
                                }
                            }];
                            element.isolateScope().setExportUrl();
                            expect(UrlProvider.getViewHistoryExcelExportUrl).toHaveBeenCalledWith(['http://data.emii.com/viewable1', 'http://data.emii.com/viewable2'], ['http://data.emii.com/view-recommendation-types/tactical'], [{ 'service': 'service2', 'viewRelativeTo': 'benchmark2' }], false);
                        }));
                    });
                });

                describe('Toggling series type ', function() {
                    var series = [
                        {
                            name: 'Strategic View',
                            data: [
                                [0, 0, 3],
                                [0, 7, 10]
                            ],
                            view: {
                                viewRecommendationType: {
                                    '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                },
                                viewOn: {
                                    '@id': 'http://data.emii.com/economy/us',
                                    canonicalLabel: 'US Economy'
                                },
                                service: {
                                    '@id': 'http://data.emmii.com/bca/services/ces'
                                }
                            }
                        },
                        {
                            name: 'Tactical View',
                            color: 'red',
                            data: [
                                [0, 16, 20],
                                [0, 19, 30]
                            ],
                            view: {
                                viewRecommendationType: {
                                    '@id': 'http://data.emii.com/view-recommendation-types/tactical'
                                },
                                viewOn: {
                                    '@id': 'http://data.emii.com/economy/us',
                                    canonicalLabel: 'US Economy'
                                },
                                service: {
                                    '@id': 'http://data.emmii.com/bca/services/ces'
                                }
                            }
                        },
                        {
                            name: 'Strategic Annotation',
                            color: 'red',
                            data: [[0, 16]],
                            view: {
                                viewRecommendationType: {
                                    '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                },
                                viewOn: {
                                    '@id': 'http://data.emii.com/economy/us',
                                    canonicalLabel: 'US Economy'
                                },
                                service: {
                                    '@id': 'http://data.emmii.com/bca/services/ces'
                                }
                            },
                            annotation: {
                                
                            }
                        },
                        {
                            name: 'Tactical Annotation',
                            color: 'red',
                            data: [[0, 16]],
                            view: {
                                viewRecommendationType: {
                                    '@id': 'http://data.emii.com/view-recommendation-types/tactical'
                                },
                                viewOn: {
                                    '@id': 'http://data.emii.com/economy/us',
                                    canonicalLabel: 'US Economy'
                                },
                                service: {
                                    '@id': 'http://data.emmii.com/bca/services/ces'
                                }
                            },
                            annotation: {
                                
                            }
                        }
                    ];
                    beforeEach(inject(function($compile, $rootScope, HighCharts) {
                        scope = $rootScope.$new();
                        scope.views = {
                            views: _.pluck(series, 'view')
                        };
                        spyOn(HighCharts, 'processViews').andReturn({
                            series: series,
                            xAxis: {
                                categories: [
                                    {
                                        name: 'Category 1',
                                        serviceName: 'CES',
                                        description: ''
                                    },
                                    {
                                        name: 'Category 2',
                                        serviceName: 'CES',
                                        description: ''
                                    }
                                ]
                            }
                        });
                        spyOn(HighCharts, '_getCategory').andReturn('');
                        element = $compile('<div views-evolution-chart views="views" title="Chart Title" width="500" y-axis-title="Y Axis Title"></div>')(scope);
                        scope.$root.$digest();

                    }));


                    describe('When clicking the reports button', function() {
                        beforeEach(function () {
                            $(element.find('.reports .dropdown-menu li a')[0]).trigger('click');
                            scope.$root.$digest();
                        });

                        it('should change the visibility of the reports', function() {
                            expect(element.isolateScope().settings.report.visible).toBe(false);
                        });
                        
                        it('report series should not be visible', function() {
                            expect(element.isolateScope().chart.series[2].visible).toBe(false);
                            expect(element.isolateScope().chart.series[3].visible).toBe(false);
                        });

                        describe('And tactical series are not visible', function() {
                            beforeEach(function() {
                                $(element.find('.view-types .dropdown-menu li a')[0]).trigger('click');
                            });
                            describe('When clicking the tactical button', function() {
                                it('should not display report series', function() {
                                    $(element.find('.view-types .dropdown-menu li a')[0]).trigger('click');
                                    expect(element.isolateScope().chart.series[2].visible).toBe(false);
                                    expect(element.isolateScope().chart.series[3].visible).toBe(false);
                                });
                            });
                        });

                    });

                    describe('When clicking the strategic button', function() {
                        beforeEach(function() {
                            scope.$root.$digest();
                            expect(element.isolateScope().settings.viewType.strategic.visible).toBe(true);
                            $(element.find('.view-types .dropdown-menu li a')[1]).trigger('click');
                            scope.$root.$digest();
                        });

                        it('should change the strategic visibility', function() {
                            expect(element.isolateScope().settings.viewType.strategic.visible).toBe(false);
                        });

                        it('strategic series should not be visible', function() {
                            expect(element.isolateScope().chart.series[0].visible).toBe(false);
                            expect(element.isolateScope().chart.series[1].visible).toBe(true);
                            expect(element.isolateScope().chart.series[2].visible).toBe(false);
                            expect(element.isolateScope().chart.series[3].visible).toBe(true);
                        });

                        describe('And clicking the tactical button', function () {
                            beforeEach(function() {
                                $(element.find('.view-types .dropdown-menu li a')[0]).trigger('click');
                            });
                            
                            it('should show strategic again', function() {
                                expect(element.isolateScope().chart.series[0].visible).toBe(true);
                                expect(element.isolateScope().chart.series[1].visible).toBe(false);
                                expect(element.isolateScope().chart.series[2].visible).toBe(true);
                                expect(element.isolateScope().chart.series[3].visible).toBe(false);
                            });
                        });
                    });

                    describe('When clicking the tactical button', function() {
                        beforeEach(function() {
                            scope.$root.$digest();
                            $(element.find('.view-types .dropdown-menu li a')[0]).trigger('click');
                            scope.$root.$digest();
                        });

                        it('tactical series should not be visible', function() {
                            expect(element.isolateScope().chart.series[0].visible).toBe(true);
                            expect(element.isolateScope().chart.series[1].visible).toBe(false);
                            expect(element.isolateScope().chart.series[2].visible).toBe(true);
                            expect(element.isolateScope().chart.series[3].visible).toBe(false);
                        });
                        
                        describe('And clicking the tactical button', function () {
                            beforeEach(function () {
                                $(element.find('.view-types .dropdown-menu li a')[1]).trigger('click');
                            });

                            it('should show tactical again', function () {
                                expect(element.isolateScope().chart.series[0].visible).toBe(false);
                                expect(element.isolateScope().chart.series[1].visible).toBe(true);
                                expect(element.isolateScope().chart.series[2].visible).toBe(false);
                                expect(element.isolateScope().chart.series[3].visible).toBe(true);
                            });
                        });
                    });

                    describe('When clicking the active button', function() {
                        beforeEach(function() {
                            scope.$root.$digest();
                            expect(element.isolateScope().settings.viewStatus.all.visible).toBe(false);
                            expect(element.find('.view-status > a').text().trim()).toBe('Active');
                            $(element.find('.view-status .dropdown-menu li a')[0]).trigger('click');
                            scope.$root.$digest();
                        });

                        it('should change the active visibility', function() {
                            expect(element.isolateScope().settings.viewStatus.all.visible).toBe(true);
                        });

                        it('should set the label to "Active & Expired"', function() {
                            expect(element.find('.view-status > a').text().trim()).toBe('Active & Expired');
                        });

                    });

                    describe('When clicking the all button', function() {
                        beforeEach(function() {
                            scope.$root.$digest();
                            expect(element.isolateScope().settings.viewStatus.all.visible).toBe(false);
                            expect(element.find('.view-status > a').text().trim()).toBe('Active');
                            $(element.find('.view-status .dropdown-menu li a')[1]).trigger('click');
                            scope.$root.$digest();
                        });

                        it('should change the active visibility', function() {
                            expect(element.isolateScope().settings.viewStatus.all.visible).toBe(true);
                        });

                        it('should set the label to "Active & Expired"', function() {
                            expect(element.find('.view-status > a').text().trim()).toBe('Active & Expired');
                        });

                    });
                });
                
                describe('Axis formatter', function () {
                    var series = [
                               {
                                   name: 'Strategic View Report',
                                   data: [
                                       [0, 0, 3],
                                       [0, 7, 10]
                                   ],
                                   view: {
                                       viewRecommendationType: {
                                           '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                       },
                                       viewOn: {
                                           '@id': 'http://data.emii.com/economy/us',
                                           canonicalLabel: 'US Economy'
                                       },
                                       service: {
                                           '@id': 'http://data.emii.com/bca/services/ces'
                                       }
                                   }
                               }];
                    beforeEach(inject(function ($compile, $rootScope, HighCharts) {
                        scope = $rootScope.$new();
                        scope.views = {
                            views: _.pluck(series, 'view')
                        };
                        spyOn(HighCharts, 'processViews').andReturn({
                            xAxis: {
                                categories: [
                                        {
                                            name: 'CES / Japan',
                                            serviceName: 'CES',
                                            description: 'Japan'
                                        },
                                        {
                                            name: 'BCAH',
                                            serviceName: 'BCAH'
                                        }
                                ]
                            }
                        });
                        element = $compile('<div views-evolution-chart views="views" ></div>')(scope);
                        spyOn(HighCharts, '_getCategory').andReturn('');
                        scope.$root.$digest();
                    }));
                    
                    describe('xAxis label formatter', function () {
                        describe('CES / Japan', function () {
                            var result,
                                 html;
                            beforeEach(function() {
                                element.isolateScope().chart.options.xAxis[0].labels.value = {
                                    name: 'CES / Japan',
                                    serviceName: 'CES',
                                    description: 'Japan'
                                };
                                result = element.isolateScope().chart.options.xAxis[0].labels.formatter();
                                html = $.parseHTML(result);
                            });
                            it('Should  have the label CES', function () {
                                expect($(html).find('.label').text()).toBe('CES');
                            });

                            it('Should  have the description Japan', function () {
                                expect($(html).find('.sublabel').text()).toBe('Japan');
                            });
                        });

                        describe('BCAH', function () {
                            var result,
                                 html;
                            beforeEach(function () {
                                element.isolateScope().chart.options.xAxis[0].labels.value = {
                                    name: 'BCAH',
                                    serviceName: 'BCAH'
                                };
                                result = element.isolateScope().chart.options.xAxis[0].labels.formatter();
                                html = $.parseHTML(result);
                            });
                            it('Should  have the label BCA', function () {
                                expect($(html).find('.label').text().trim()).toBe('BCA');
                            });

                            it('Should have the home icon', function () {
                                expect($(html).find('.icon-home').length).toBe(1);
                            });

                            it('Should have no description', function () {
                                expect($(html).find('.sublabel').length).toBe(0);
                            });
                        });
                    
                        describe('Empty object', function () {
                            var result,
                                 html;
                            beforeEach(function () {
                                element.isolateScope().chart.options.xAxis[0].labels.value = {};
                                result = element.isolateScope().chart.options.xAxis[0].labels.formatter();
                                html = $.parseHTML(result);
                            });
                            it('Should have no label', function () {
                                expect($(html).find('.label').length).toBe(0);
                            });

                            it('Should have no description', function () {
                                expect($(html).find('.sublabel').length).toBe(0);
                            });
                        });

                        describe('Dominant view category', function () {
                            var result,
                                html;
                            beforeEach(function () {
                                element.isolateScope().chart.options.xAxis[0].labels.value = {
                                    name: 'CES',
                                    serviceName: 'CES'
                                };
                                element.isolateScope().dominantViewCategory = 'CES';
                                result = element.isolateScope().chart.options.xAxis[0].labels.formatter();
                                html = $.parseHTML(result);
                            });
                            
                            it('should not have the remove icon', function () {
                                expect($(html).find('.icon-remove').length).toBe(0);
                            });
                        });
                        
                        describe('Not dominant view category', function () {
                            var result,
                               html;
                            beforeEach(function () {
                                element.isolateScope().chart.options.xAxis[0].labels.value = {
                                    name: 'CES',
                                    serviceName: 'CES'
                                };
                                result = element.isolateScope().chart.options.xAxis[0].labels.formatter();
                                html = $.parseHTML(result);
                            });
                            
                            it('should have the remove icon', function () {
                                expect($(html).find('.icon-remove').length).toBe(1);
                            });
                        });

                    });
                    
                    describe('yAxis label formatter', function () {
                        describe('Janurary', function () {
                            var result,
                                 html;
                            beforeEach(function () {
                                element.isolateScope().chart.options.yAxis[0].labels.value = 1357387200000; // Sat, 05 Jan 2013 12:00:00 GMT
                                result = element.isolateScope().chart.options.yAxis[0].labels.formatter();
                                html = $.parseHTML(result);
                            });
                            it('Should have the text JAN 2013', function () {
                                expect($(html).text()).toBe('JAN2013');
                            });
                        });
                        
                        describe('Any other month', function () {
                            var result,
                                 html;
                            beforeEach(function () {
                                element.isolateScope().chart.options.yAxis[0].labels.value = 1360065600000; // Tue, 05 Feb 2013 12:00:00 GMT
                                result = element.isolateScope().chart.options.yAxis[0].labels.formatter();
                                html = $.parseHTML(result);
                            });
                            it('Should have the text FEB', function () {
                                expect($(html).text()).toBe('FEB');
                            });
                        });
                    });
                });
                

                describe('Integration', function () {
                    describe('Given we have 2 evolved strategic views, 2 tactical evolved views and 1 tactical', function () {
                        var views = [
                                    {
                                        '@id': 'http://data.emii.com/gis-view-1',
                                        viewOrigin: {
                                            '@id': 'http://data.emii.com/gis-view-1'
                                        },
                                        viewType: {
                                            '@id': 'http://data.emii.com/view-types/absolute'
                                        },
                                        service: {
                                            '@id': 'http://data.emii.com/bca/services/gis'
                                        },
                                        horizonStartDate: '2012-12-31',
                                        horizonEndDate: moment().add('months', 1).format('YYYY-MM-DD'),
                                        viewConviction: {
                                            canonicalLabel: 'low'
                                        },
                                        viewDirection: {
                                            canonicalLabel: 'short'
                                        },
                                        viewRecommendationType: {
                                            '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                        },
                                        annotations: [
                                            {
                                                key: 'http://data.emii.com/annotation-types/support',
                                                values: []
                                            },
                                            {
                                                key: 'http://data.emii.com/annotation-types/scenario',
                                                values: []
                                            }
                                        ],
                                        viewOn: {
                                            '@id': 'http://data.emii.com/economy/us',
                                            canonicalLabel: 'US Economy'
                                        }
                                    },
                                    {
                                        '@id': 'http://data.emii.com/gis-view-3',
                                        viewOrigin: {
                                            '@id': 'http://data.emii.com/gis-view-1'
                                        },
                                        viewType: {
                                            '@id': 'http://data.emii.com/view-types/absolute'
                                        },
                                        service: {
                                            '@id': 'http://data.emii.com/bca/services/gis'
                                        },
                                        horizonStartDate: '2013-05-01',
                                        horizonEndDate: moment().add('years', 1).format('YYYY-MM-DD'),
                                        viewConviction: {
                                            canonicalLabel: 'high'
                                        },
                                        viewDirection: {
                                            canonicalLabel: 'short'
                                        },
                                        viewRecommendationType: {
                                            '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                        },
                                        annotations: [
                                            {
                                                key: 'http://data.emii.com/annotation-types/support',
                                                values: []
                                            },
                                            {
                                                key: 'http://data.emii.com/annotation-types/scenario',
                                                values: []
                                            }
                                        ],
                                        viewOn: {
                                            '@id': 'http://data.emii.com/economy/us',
                                            canonicalLabel: 'US Economy'
                                        }
                                    },
                                    {
                                        '@id': 'http://data.emii.com/gis-view-2',
                                        viewOrigin: {
                                            '@id': 'http://data.emii.com/gis-view-1'
                                        },
                                        viewType: {
                                            '@id': 'http://data.emii.com/view-types/absolute'
                                        },
                                        service: {
                                            '@id': 'http://data.emii.com/bca/services/gis'
                                        },
                                        horizonStartDate: '2013-02-01',
                                        horizonEndDate: '2013-08-30',
                                        viewConviction: {
                                            canonicalLabel: 'medium'
                                        },
                                        viewDirection: {
                                            canonicalLabel: 'short'
                                        },
                                        viewRecommendationType: {
                                            '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                        },
                                        viewOn: {
                                            '@id': 'http://data.emii.com/economy/us',
                                            canonicalLabel: 'US Economy'
                                        },
                                        annotations: [
                                            {
                                                key: 'http://data.emii.com/annotation-types/support',
                                                values: [
                                                    {
                                                        '@id': 'urn:annotation:bca.gis.support1',
                                                        references: {
                                                            '@id': 'http://data.emii.com/gis-view-2'
                                                        },
                                                        annotationFor: {
                                                            published: '2013-04-20T09:00:00Z',
                                                            '@id': 'urn:document:bca.gis_sr_2013_04_20'
                                                        }
                                                    }
                                                ]
                                            },
                                            {
                                                key: 'http://data.emii.com/annotation-types/scenario',
                                                values: [
                                                    {
                                                        '@id': 'urn:annotation:bca.gis.scenario1',
                                                        references: {
                                                            '@id': 'http://data.emii.com/gis-view-2'
                                                        },
                                                        annotationFor: {
                                                            published: '2013-04-20T09:00:00Z',
                                                            '@id': 'urn:document:bca.gis_sr_2013_04_20'
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        '@id': 'http://data.emii.com/ces-view-1',
                                        viewOrigin: {
                                            '@id': 'http://data.emii.com/ces-view-1'
                                        },
                                        viewType: {
                                            '@id': 'http://data.emii.com/view-types/absolute'
                                        },
                                        service: {
                                            '@id': 'http://data.emii.com/bca/services/ces'
                                        },
                                        horizonStartDate: '2013-01-01',
                                        horizonEndDate: moment().add('years', 1).format('YYYY-MM-DD'),
                                        viewConviction: {
                                            canonicalLabel: 'medium'
                                        },
                                        viewDirection: {
                                            canonicalLabel: 'long'
                                        },
                                        viewRecommendationType: {
                                            '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                        },
                                        viewOn: {
                                            '@id': 'http://data.emii.com/economy/us',
                                            canonicalLabel: 'US Economy'
                                        },
                                        annotations: [
                                            {
                                                key: 'http://data.emii.com/annotation-types/support',
                                                values: []
                                            },
                                            {
                                                key: 'http://data.emii.com/annotation-types/scenario',
                                                values: []
                                            }
                                        ]
                                    },
                                    {
                                        '@id': 'http://data.emii.com/ces-view-2',
                                        viewOrigin: {
                                            '@id': 'http://data.emii.com/ces-view-1'
                                        },
                                        viewType: {
                                            '@id': 'http://data.emii.com/view-types/absolute'
                                        },
                                        service: {
                                            '@id': 'http://data.emii.com/bca/services/ces'
                                        },
                                        horizonStartDate: '2013-06-01',
                                        horizonEndDate: moment().add('years', 1).format('YYYY-MM-DD'),
                                        viewConviction: {
                                            canonicalLabel: 'medium'
                                        },
                                        viewDirection: {
                                            canonicalLabel: 'long'
                                        },
                                        viewRecommendationType: {
                                            '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                        },
                                        viewOn: {
                                            '@id': 'http://data.emii.com/economy/us',
                                            canonicalLabel: 'US Economy'
                                        },
                                        annotations: [
                                            {
                                                key: 'http://data.emii.com/annotation-types/support',
                                                values: []
                                            },
                                            {
                                                key: 'http://data.emii.com/annotation-types/scenario',
                                                values: []
                                            }
                                        ]
                                    },
                                    {
                                        '@id': 'http://data.emii.com/tactical-view',
                                        viewRecommendationType: {
                                            '@id': 'http://data.emii.com/view-recommendation-types/tactical'
                                        },
                                        viewType: {
                                            '@id': 'http://data.emii.com/view-types/absolute'
                                        },
                                        horizonStartDate: '2013-07-01',
                                        horizonEndDate: moment().add('years', 1).format('YYYY-MM-DD'),
                                        viewDirection: {
                                            canonicalLabel: 'long'
                                        },
                                        viewOn: {
                                            '@id': 'http://data.emii.com/economy/us',
                                            canonicalLabel: 'US Economy'
                                        },
                                        annotations: [
                                           {
                                               key: 'http://data.emii.com/annotation-types/support',
                                               values: [
                                                   {
                                                       '@id': 'urn:annotation:bca.tactical.gis.support1',
                                                       references: {
                                                           '@id': 'http://data.emii.com/tactical-view'
                                                       },
                                                       annotationFor: {
                                                           published: '2013-04-20T09:00:00Z',
                                                           '@id': 'urn:document:bca.gis_sr_2013_04_20'
                                                       }
                                                   }
                                               ]
                                           }
                                        ],
                                        service: {
                                            '@id': 'http://data.emii.com/bca/services/usis'
                                        }
                                    }
                        ];
                        describe('', function() {
                            beforeEach(inject(function ($compile, $rootScope) {
                                scope = $rootScope.$new();
                                scope.views = {
                                    views: views
                                };
                                scope.dominantView = views[5];
                                scope.vieawableId = 'http://data.emii.com/economy/us';
                                scope.chartCreatedCallback = jasmine.createSpy('chartCreatedCallback');
                                element = $compile('<div views-evolution-chart views="views" viewable-dominant-view="dominantView" viewable-id="vieawableId" chart-created-callback="chartCreatedCallback()" ></div>')(scope);

                                element.isolateScope().settings.report.visible = true;
                                element.isolateScope().settings.viewType.tactical.visible = true;
                                element.isolateScope().settings.viewType.strategic.visible = true;
                                element.isolateScope().settings.viewStatus.all.visible = true;

                                scope.$root.$digest();
                            }));

                            it('should call the callback function', function () {
                                expect(scope.chartCreatedCallback).toHaveBeenCalled();
                            });

                            describe('When trying to remove the dominant view (USIS)', function () {
                                beforeEach(function () {
                                    expect(element.isolateScope().chart.series.length).toBe(8);
                                    $(element.find('.service-label')[2]).trigger('click');
                                });

                                it('should not remove the categorie USIS', function () {
                                    expect(element.isolateScope().chart.xAxis[0].categories[0].name).toBe('CES');
                                    expect(element.isolateScope().chart.xAxis[0].categories[1].name).toBe('GIS');
                                    expect(element.isolateScope().chart.xAxis[0].categories[2].name).toBe('USIS');
                                });

                                it('should not remove the series for the USIS category', function () {
                                    expect(element.isolateScope().chart.series.length).toBe(8);
                                });
                            });

                            describe('When clicking CES', function () {
                                beforeEach(function () {
                                    expect(element.isolateScope().chart.series.length).toBe(8);
                                    $(element.find('.service-label')[0]).trigger('click');
                                });

                                it('CES should not be visible', function () {
                                    var findCategory = function (category) {
                                        return _.find(element.isolateScope().categories, function (c) {
                                            return c.name === category;
                                        });
                                    };

                                    expect(findCategory('CES').visible).toBe(false);
                                    expect(findCategory('GIS').visible).toBe(true);
                                });

                                it('the chart should have 2 categories (GIS and USIS)', function () {
                                    expect(element.isolateScope().chart.xAxis[0].categories.length).toBe(2);
                                    expect(element.isolateScope().chart.xAxis[0].categories[0].name).toBe('GIS');
                                    expect(element.isolateScope().chart.xAxis[0].categories[1].name).toBe('USIS');
                                });

                                it('should have 6 series', function () {
                                    expect(element.isolateScope().chart.series.length).toBe(6);
                                });
                            });

                            describe('And tactical views are hidden', function () {
                                describe('When clicking CES', function () {
                                    beforeEach(function () {
                                        expect(element.isolateScope().chart.series.length).toBe(8);
                                        element.isolateScope().settings.report.visible = true;
                                        element.isolateScope().settings.viewType.tactical.visible = false;
                                        element.isolateScope().settings.viewType.strategic.visible = true;
                                        element.isolateScope().settings.viewStatus.all.visible = true;

                                        element.isolateScope().$digest();
                                        expect(_.filter(element.isolateScope().chart.series, function (s) { return s.visible; }).length).toBe(6);

                                        $(element.find('.service-label')[0]).trigger('click');

                                    });

                                    it('should have 6 series', function () {
                                        expect(element.isolateScope().chart.series.length).toBe(6);
                                        expect(_.filter(element.isolateScope().chart.series, function (s) { return s.visible; }).length).toBe(4);
                                    });
                                });

                            });

                            describe('When showing active views', function () {
                                beforeEach(function () {
                                    element.isolateScope().settings.report.visible = true;
                                    element.isolateScope().settings.viewType.tactical.visible = true;
                                    element.isolateScope().settings.viewType.strategic.visishoble = true;
                                    element.isolateScope().settings.viewStatus.all.visible = false;

                                    scope.$root.$digest();
                                });

                                it('should only show 4 visible series', function () {
                                    expect(_.filter(element.isolateScope().chart.series, function (s) { return s.visible; }).length).toBe(4);
                                });
                            });
                        });

                        describe('When disabling views toggling', function() {
                            beforeEach(inject(function ($compile, $rootScope) {
                                scope = $rootScope.$new();
                                scope.views = {
                                    views: views
                                };
                                scope.vieawableId = 'http://data.emii.com/economy/us';
                                scope.settings = {
                                    viewsTogglable: {
                                        enabled: false
                                    }    
                                };
                                element = $compile('<div views-evolution-chart views="views" viewable-id="vieawableId" custom-settings="settings" ></div>')(scope);

                                scope.$root.$digest();
                            }));
                            
                            it('should not have the remove icon', function () {
                                expect($(element.html()).find('.icon-remove').length).toBe(0);
                            });
                            
                            describe('When clicking CES', function () {
                                beforeEach(function () {
                                    $(element.find('.service-label')[0]).trigger('click');
                                });

                                it('CES should still be visible', function () {
                                    var findCategory = function (category) {
                                        return _.find(element.isolateScope().categories, function (c) {
                                            return c.name === category;
                                        });
                                    };

                                    expect(findCategory('CES').visible).toBe(true);
                                });
                            });
                        });
                    });                   
               
                    describe('Given we have one strategic view, and one tactical view', function() {
                        beforeEach(inject(function ($compile, $rootScope) {
                            var views = [
                                    {
                                        '@id': 'http://data.emii.com/gis-view-1',
                                        viewOrigin: {
                                            '@id': 'http://data.emii.com/gis-view-1'
                                        },
                                        viewType: {
                                            '@id': 'http://data.emii.com/view-types/absolute'
                                        },
                                        service: {
                                            '@id': 'http://data.emii.com/bca/services/gis'
                                        },
                                        horizonStartDate: '2012-12-31',
                                        horizonEndDate: moment().add('years', 1).format('YYYY-MM-DD'),
                                        viewConviction: {
                                            canonicalLabel: 'low'
                                        },
                                        viewDirection: {
                                            canonicalLabel: 'short'
                                        },
                                        viewRecommendationType: {
                                            '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                        },
                                        viewOn: {
                                            '@id': 'http://data.emii.com/economy/us',
                                            canonicalLabel: 'US Economy'
                                        }
                                    },
                                    {
                                        '@id': 'http://data.emii.com/tactical-view',
                                        viewRecommendationType: {
                                            '@id': 'http://data.emii.com/view-recommendation-types/tactical'
                                        },
                                        viewType: {
                                            '@id': 'http://data.emii.com/view-types/absolute'
                                        },
                                        horizonStartDate: '2013-07-01',
                                        horizonEndDate: moment().add('years', 1).format('YYYY-MM-DD'),
                                        viewDirection: {
                                            canonicalLabel: 'long'
                                        },
                                        viewOn: {
                                            '@id': 'http://data.emii.com/economy/us',
                                            canonicalLabel: 'US Economy'
                                        },
                                        service: {
                                            '@id': 'http://data.emii.com/bca/services/usis'
                                        }
                                    }
                            ];
                            scope = $rootScope.$new();
                            scope.views = {
                                views: views
                            };
                            scope.vieawableId = 'http://data.emii.com/economy/us';
                            element = $compile('<div views-evolution-chart views="views" viewable-id="vieawableId"></div>')(scope);
                            scope.$root.$digest();
                        }));

                        it('tactical and strategic buttons should be toggable', function () {
                            expect(element.find('.view-types li').length).toBe(2);
                        });

                        describe('When we hide the strategic views', function() {
                            beforeEach(function() {
                                $(element.find('.view-types .dropdown-menu li a')[1]).trigger('click');
                            });

                            it('strategic views should be hidden', function() {
                                expect(element.isolateScope().settings.viewType.strategic.visible).toBe(false);
                            });
                          
                            describe('And we then change the views to only be strategic views', function() {
                                beforeEach(function() {
                                    scope.views.views.splice(1, 1);
                                    scope.$root.$digest();
                                    expect(element.isolateScope().views.views.length).toBe(1);
                                });
                                
                                it('only strategic views should be enabled', function () {
                                    expect(element.find('.view-types li').length).toBe(1);
                                    expect(element.isolateScope().settings.viewType.tactical.enabled).toBe(false);
                                    expect(element.isolateScope().settings.viewType.strategic.enabled).toBe(true);
                                });
                            });
                        });
                    });
                    
                    describe('Given we have one view from a viewable', function () {
                        beforeEach(inject(function ($compile, $rootScope) {
                            var views = [
                                    {
                                        '@id': 'http://data.emii.com/gis-view-1',
                                        viewOrigin: {
                                            '@id': 'http://data.emii.com/gis-view-1'
                                        },
                                        viewType: {
                                            '@id': 'http://data.emii.com/view-types/absolute'
                                        },
                                        service: {
                                            '@id': 'http://data.emii.com/bca/services/gis'
                                        },
                                        horizonStartDate: '2012-12-31',
                                        horizonEndDate: moment().add('years', 1).format('YYYY-MM-DD'),
                                        viewConviction: {
                                            canonicalLabel: 'low'
                                        },
                                        viewDirection: {
                                            canonicalLabel: 'short'
                                        },
                                        viewRecommendationType: {
                                            '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                        },
                                        viewOn: {
                                            '@id': 'http://data.emii.com/economy/us',
                                            canonicalLabel: 'US Economy'
                                        }
                                    }
                            ];
                            scope = $rootScope.$new();
                            scope.views = {
                                views: views
                            };
                            scope.vieawableId = 'http://data.emii.com/economy/us';
                            element = $compile('<div views-evolution-chart views="views" viewable-id="vieawableId"></div>')(scope);
                            scope.$root.$digest();
                        }));

                        describe('When adding another view of the same type, but from a different viewable', function () {
                            beforeEach(function () {
                                expect(element.isolateScope().chart.series.length).toBe(1);
                                scope.views.views.push(
                                   {
                                       '@id': 'http://data.emii.com/gis-view-2',
                                       viewOrigin: {
                                           '@id': 'http://data.emii.com/gis-view-2'
                                       },
                                       viewType: {
                                           '@id': 'http://data.emii.com/view-types/absolute'
                                       },
                                       service: {
                                           '@id': 'http://data.emii.com/bca/services/gis'
                                       },
                                       horizonStartDate: '2012-12-31',
                                       horizonEndDate: '2013-06-30',
                                       viewConviction: {
                                           canonicalLabel: 'low'
                                       },
                                       viewDirection: {
                                           canonicalLabel: 'long'
                                       },
                                       viewRecommendationType: {
                                           '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                       },
                                       viewOn: {
                                           '@id': 'http://data.emii.com/economy/uk',
                                           canonicalLabel: 'UK Economy'
                                       }
                                   });
                                element.isolateScope().settings.viewStatus = {
                                    all: {
                                            visible: true
                                        }
                                };
                                scope.$root.$digest();
                            });
                            
                            it('should display 2 series', function () {
                                expect(element.isolateScope().chart.series.length).toBe(2);
                            });

                            it('should have 2 categories', function () {
                                expect(element.isolateScope().serviceViews.length).toBe(2);
                            });
                            
                            it('main viewable should be first', function () {
                                expect(element.isolateScope().serviceViews[0].key).toBe('US Economy');
                            });
                        });
                    });
                });

               
            });
        });