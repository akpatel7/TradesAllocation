define(['underscore',
        'angular',
        'mocks',
        'jquery',
        'App/Directives/ViewableBrick'], function(_) {
            'use strict';

            describe('Viewable Brick directive', function() {
                var scope,
                    element,
                    $httpBackend;
                
                angular.module('ViewableBrick.Spec', [])
                     .service('Perspectives', ['$q', function ($q) {
                         return {
                             post: function () {
                                 var deferred = $q.defer();
                                 deferred.resolve('someid');
                                 return deferred.promise;
                             },
                             remove: function () {
                                 var deferred = $q.defer();
                                 deferred.resolve(true);
                                 return deferred.promise;
                             }
                         };
                     }])
                    .service('PerspectiveBuilder', ['$q', function ($q) {
                        return {
                            buildViewablePerspective: function () {
                                var deferred = $q.defer();
                                deferred.resolve({});
                                return deferred.promise;
                            }
                        };
                    }])
                  .factory('Analytics', function () {
                       return {
                           registerPageTrack: function () {
                           },
                           registerClick: function () {
                           },
                           logUsage: function () {
                           }
                       };
                  })
                    .factory('UrlProvider', function () {
                      return {
                          getLiveReportUrl: function (reportId) {
                              return 'http://livereport.com/' + reportId;
                          },
                          getReportUrl: function () {
                          },
                          getViewHistoryExcelExportUrl: function () {
                          }
                      };
                  });


                beforeEach(function () {
                    module('App');
                    module('ViewableBrick.Spec');
                });


                describe('Given a viewable brick', function() {
                    beforeEach(inject(function ($rootScope, $compile, _$httpBackend_) {
                        $httpBackend = _$httpBackend_;
                        scope = $rootScope;

                        scope.viewable = {
                            '@id': 'http://data.emii.com/currency-pairs/usd-hkd',
                            canonicalLabel: 'USD/HKD',
                            lastUpdated: '2013-08-17',
                            'typeLabel': 'Currency Market'
                        };
                     
                        element = $compile('<div viewable-brick viewable="viewable"></div>')(scope);
                        scope.$digest();
                    }));

                    describe('When rendering the tile', function() {
                        it('Should render the title', function() {
                            expect(element.find('.brick-title').text().trim()).toBe('USD/HKD');
                        });
                        
                        it('should not render the market type', function () {
                            expect(element.find('.market-type').length).toBe(0);
                        });
                        
                        it('should render the expand icon', function() {
                            expect(element.find('.icon-resize-full').length).toBe(1);
                        });

                        it('should render the market icon', function() {
                            expect(element.find('.icon-list').length).toBe(1);
                        });
                        
                        it('should render the evolution icon', function () {
                            expect(element.find('.icon-time').length).toBe(1);
                        });
                        
                        it('should render the research icon', function () {
                            expect(element.find('.icon-desktop').length).toBe(1);
                        });

                        it('should link to the research page', function () {
                            var expectedPath = '/#/research?uri=http:%2F%2Fdata.emii.com%2Fcurrency-pairs%2Fusd-hkd',
                                href = element.find('.links a')[0].href;
                            expect(href.indexOf(expectedPath, href.length - expectedPath.length)).not.toBe(-1);
                        });
                    });

                   
                    describe('When opening market', function () {
                        beforeEach(function() {
                            $httpBackend.expectGET('/Templates/AllViews/MarketEconomiesTab.html')
                                                          .respond('');
                            scope.$digest();
                            element.children().find('.icon-list').trigger('click');
                            scope.$root.$digest();
                            $httpBackend.flush();
                        });
                        afterEach(function () {
                            $httpBackend.verifyNoOutstandingExpectation();
                            $httpBackend.verifyNoOutstandingRequest();
                        });
                        it('open tab should be market', function() {
                            expect(element.isolateScope().tabs['market'].open).toBe(true);
                            expect(element.isolateScope().tabs['evolution'].open).toBe(false);
                        });
                        
                        it('viewable should be expanded', function () {
                            expect(scope.viewable.expanded).toBe(true);
                        });
                        
                        it('viewable should be selected', function () {
                            expect(scope.viewable.selected).toBe(true);
                        });

                        it('market icon should have the class selected', function() {
                            expect(element.find('.icon-list.selected').length).toBe(1);
                        });
                        
                        describe('And minimizing completely', function () {
                            beforeEach(function () {
                                expect(scope.viewable.selected).toBe(true);
                                expect(element.children().find('.icon-minus').length).toBe(1);
                                element.children().find('.icon-minus').trigger('click');
                            });

                            it('viewable should not be selected', function () {
                                expect(scope.viewable.selected).toBe(false);
                            });

                            it('viewable should not be expanded', function () {
                                expect(scope.viewable.expanded).toBe(false);
                            });
                        });
                        
                        describe('And reducing the brick', function () {
                            beforeEach(function () {
                                expect(scope.viewable.expanded).toBe(true);
                                expect(element.children().find('.icon-resize-small').length).toBe(1);
                                element.children().find('.icon-resize-small').trigger('click');
                            });

                            it('viewable should not be selected', function () {
                                expect(scope.viewable.selected).toBe(true);
                            });

                            it('viewable should not be expanded', function () {
                                expect(scope.viewable.expanded).toBe(false);
                            });
                        });
                    });
                    
                    describe('When opening view evolutions', function () {
                        beforeEach(function () {
                            $httpBackend.expectGET('/Templates/AllViews/ViewHistoryTab.html')
                                                          .respond('');
                            scope.$digest();
                            element.children().find('.icon-time').trigger('click');
                            $httpBackend.flush();
                        });
                        afterEach(function() {
                            $httpBackend.verifyNoOutstandingExpectation();
                            $httpBackend.verifyNoOutstandingRequest();
                        });
                        it('open tab should be evolution', function () {
                            expect(element.isolateScope().tabs['market'].open).toBe(false);
                            expect(element.isolateScope().tabs['evolution'].open).toBe(true);
                        });
                        it('viewable should be expanded', function () {
                            expect(scope.viewable.expanded).toBe(true);
                        });

                        it('view evolution icon should have the class selected', function () {
                            expect(element.find('.icon-time.selected').length).toBe(1);
                        });
                        
                        describe('And minimizing completely', function () {
                            beforeEach(function () {
                                expect(scope.viewable.selected).toBe(true);
                                expect(element.children().find('.icon-minus').length).toBe(1);
                                element.children().find('.icon-minus').trigger('click');
                            });

                            it('viewable should not be selected', function () {
                                expect(scope.viewable.selected).toBe(false);
                            });

                            it('viewable should not be expanded', function () {
                                expect(scope.viewable.expanded).toBe(false);
                            });
                        });

                        describe('And reducing the brick', function () {
                            beforeEach(function () {
                                expect(scope.viewable.expanded).toBe(true);
                                expect(element.children().find('.icon-resize-small').length).toBe(1);
                                element.children().find('.icon-resize-small').trigger('click');
                            });

                            it('viewable should not be selected', function () {
                                expect(scope.viewable.selected).toBe(true);
                            });

                            it('viewable should not be expanded', function () {
                                expect(scope.viewable.expanded).toBe(false);
                            });
                        });
                    });
                    
                    describe('not favourited', function () {
                        beforeEach(function () {
                            scope.viewable = {
                                
                            };
                            scope.$digest();
                        });
                        it('Should not have the favourite star', function () {
                            expect(element.find('.favourite-action i').hasClass('icon-star-off')).toBe(true);
                        });
                    });
                    
                    describe('favourited', function () {
                        beforeEach(function () {
                            scope.viewable = {
                                "isFavourited": true,
                                "perspectiveId": "someId"
                            };
                            scope.$digest();
                        });
                        it('Should have the favourite star selected', function () {
                            expect(element.find('.favourite-action i').hasClass('icon-star-on')).toBe(true);
                        });
                    });

                    describe('partially favourited', function () {
                        it('Should have the favourite star selected', function () {
                            scope.viewable = {
                                "isFavourited": true
                            };
                            scope.$digest();
                            expect(element.find('.favourite-action > i').hasClass('icon-star-partial')).toBe(true);
                            expect(scope.viewable.isFavouritedState).toBe('half');
                        });
                    });
                    
                    describe('not followed', function () {
                        beforeEach(function () {
                            scope.viewable = {

                            };
                            scope.$digest();
                        });
                        it('Should not have the follow star', function () {
                            expect(element.find('.following-action i').hasClass('icon-arrow-right-off')).toBe(true);
                        });
                    });

                    describe('followed', function () {
                        beforeEach(function () {
                            scope.viewable = {
                                "isFollowed": true,
                                "followPerspectiveId": "someId"
                            };
                            scope.$digest();
                        });
                        it('Should have the follow star selected', function () {
                            expect(element.find('.following-action i').hasClass('icon-arrow-right-on')).toBe(true);
                        });
                    });

                    describe('partially followed', function () {
                        it('Should have the follow star selected', function () {
                            scope.viewable = {
                                "isFollowed": true
                            };
                            scope.$digest();
                            expect(element.find('.following-action > i').hasClass('icon-arrow-right-half')).toBe(true);
                            expect(scope.viewable.isFollowedState).toBe('half');
                        });
                    });

                   
                });

                describe('Given a viewable brick in selected mode', function () {
                    beforeEach(inject(function ($rootScope, $compile, Annotations, _$httpBackend_) {
                        $httpBackend = _$httpBackend_;
                        scope = $rootScope;

                        scope.viewable = {
                            '@id': 'http://data.emii.com/currency-pairs/usd-hkd',
                            'typeLabel': 'Currency Market',
                            canonicalLabel: 'USD/HKD',
                            lastUpdated: '2013-08-17',
                            dominantView: {
                                "viewHorizon": "P6M",
                                "horizonEndDate": "2013-12-15",
                                "viewWeighting": { canonicalLabel: "Neutral" },
                                "service": {
                                    "@id": "http://data.emii.com/bca/services/ces",
                                    "canonicalLabel": "CES"
                                },
                                "@id": "http://data.emii.com/dominant-view",
                                "hasPermission": true,
                                "canonicalLabel": "European Union Equities",
                                "horizonStartDate": "2013-06-15"
                            },
                            activeView: {
                                "@set": [
                                    {
                                        "service": {
                                            "@id": "http://data.emii.com/bca/services/bcah",
                                            "canonicalLabel": "BCA House"
                                        }
                                    },
                                    {
                                        "viewWeighting": {},
                                        "service": {
                                            "@id": "http://data.emii.com/bca/services/bcah",
                                            "canonicalLabel": "BCA House"
                                        }
                                    },
                                    {
                                        "viewHorizon": "P6M",
                                        "horizonEndDate": "2013-12-15",
                                        "viewWeighting": { canonicalLabel: "Neutral" },
                                        "service": {
                                            "@id": "http://data.emii.com/bca/services/ces",
                                            "canonicalLabel": "CES"
                                        },
                                        "@id": "http://data.emii.com/dominant-view",
                                        "hasPermission": true,
                                        "canonicalLabel": "European Union Equities",
                                        "horizonStartDate": "2013-06-15"
                                    }
                                ]
                            }
                        };
                       
                        spyOn(Annotations, 'getAnnotations').andReturn({
                            then: function (expression) {
                                var anns = [
                                    {
                                        key: 'http://data.emii.com/annotation-types/support',
                                        values: [
                                            {
                                                '@id': 'http://data.emii.com/annotation-view1-0',
                                                annotationText: 'Here is some support annotation 1',
                                                annotationFor: {
                                                    title: 'report title',
                                                    '@id': 'urn:document:documentId'
                                                }
                                            },
                                            {
                                                '@id': 'http://data.emii.com/annotation-view1-1',
                                                annotationText: 'Here is some support annotation 2'
                                            }
                                        ]
                                    }
                                ];
                                expression(anns);
                            }
                        });
                        
                        element = $compile('<div viewable-brick viewable="viewable" selected="selected"></div>')(scope);
                        scope.viewable.selected = true;
                        scope.$digest();
                    }));

                    describe('When rendering the tile', function () {
                        it('Should render the title', function () {
                            expect(element.find('.brick-title > h4').text().trim()).toBe('USD/HKD');
                        });

                        it('should render the market type', function() {
                            expect(element.find('.market-type').text().trim()).toBe('Currency Market');
                        });
                        
                        it('Should render the dominant view service name', function () {
                            expect(element.find('.service-label').text().trim()).toBe('CES');
                        });

                        it('should render the number of absolute views', function() {
                            expect(element.find('.absolute-views').text()).toBe('1 Absolute');
                        });
                        
                        it('should render the number of relative views', function () {
                            expect(element.find('.relative-views').text()).toBe('2 Relatives');
                        });
                        
                        it('should render the number of services', function () {
                            expect(element.find('.services-count').text()).toBe('2 Services');
                        });
                     
                        it('should render the minimize icon', function () {
                            expect(element.find('i.icon-minus').length).toBe(1);
                        });

                        it('Should render the dominant view service name', function () {
                            expect(element.find('.service-label').text().trim()).toBe('CES');
                        });

                        it('should load the primary support', function () {
                            expect(scope.viewable.primarySupport).toBeDefined();
                        });
                        
                        it('should render the primary support', function() {
                            expect(element.find('.primary-support').text()).toBe('Here is some support annotation 1');
                        });

                        it('primary support should link to live report', function () {
                            expect(element.find('.market-position h6 a')[0].href).toBe('http://livereport.com/urn:document:documentId');
                        });
                    });
                  
                    describe('When expanding the brick', function () {
                        beforeEach(function () {
                            $httpBackend.whenGET('/Templates/AllViews/MarketEconomiesTab.html')
                                                          .respond('');
                            
                            element.children().find('.icon-resize-full').trigger('click');
                            scope.$root.$digest();
                            $httpBackend.flush();
                        });
                        afterEach(function () {
                            $httpBackend.verifyNoOutstandingExpectation();
                            $httpBackend.verifyNoOutstandingRequest();
                        });
                        it('open tab should be market', function () {
                            expect(element.isolateScope().tabs['market'].open).toBe(true);
                            expect(element.isolateScope().tabs['evolution'].open).toBe(false);
                        });

                    });

                });
                
            });
        });


