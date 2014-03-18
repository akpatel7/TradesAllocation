define(['App/Controllers/Research/ResearchController',
        'underscore',
        'angular',
        'resource',
        'mocks',
        'App/Controllers/controllers'], function (ResearchController, _) {
            describe('Research Controller', function () {
                describe('Given we have a research controller', function () {
                    var controller,
                        scope,
                        expectedViewable,
                        dominantView,
                        fakeViewablesService;

                    beforeEach(function () {
                        module('App');
                    });

                    beforeEach(inject(function ($rootScope, $controller, $q, Page, DominantView, Annotations, ViewEvolution, AnnotationsSupportUri, $cookies) {
                        function promise(data) {
                            var deferred = $q.defer();
                            deferred.resolve(data);
                            return deferred.promise;
                        }
                        
                        expectedViewable = {
                            viewableId: 'http://data.emii.com/commodities-markets/gold_tst',
                            canonicalLabel: 'My Viewable',
                            typeLabel: 'Economy Inflation label',
                            '@type': 'Inflation',
                            activeView: { '@set': [{ '@id': 'http://data.com/view-id' }] }
                        };

                        dominantView = { '@id': 'http://data.com/view-id' };

                        fakeViewablesService = {
                            getViewables: function () {
                                var deferred = $q.defer();
                                deferred.resolve({ 'viewables': [expectedViewable] });
                                return deferred.promise;
                            }
                        };
                        spyOn(fakeViewablesService, 'getViewables').andCallThrough();
                        spyOn(DominantView, 'getDominantView').andReturn(dominantView);
                        spyOn(Annotations, 'getAnnotations').andCallFake(function (options) {
                            if (options.conceptUri === dominantView['@id']) {
                                return promise([{ key: AnnotationsSupportUri, values: [{ annotationFor: { '@id': 'http://data.com/annotation-id' } }] }]);
                            }
                            if (_.isArray(options.conceptUri)) {
                                return promise([{ key: AnnotationsSupportUri, values: [{ annotationFor: { '@id': 'http://data.com/annotation-id' } }] }]);
                            }
                        });
                        spyOn(ViewEvolution, 'getViewEvolution').andReturn(promise({ '@graph': [dominantView] }));

                        spyOn(Page, 'setTitle').andCallThrough();
                        spyOn(Page, 'setLastBreadcrumbs').andCallThrough();
                        scope = $rootScope.$new();

                        controller = $controller(ResearchController, {
                            $scope: scope,
                            Viewables: fakeViewablesService,
                            Page: Page,
                            $cookies: $cookies
                        });
                    }));

                    describe('When navigating to research page', function () {
                        it("Should load the appropriate viewable", inject(function ($rootScope, Page, DominantView, Annotations, ViewEvolution) {
                            scope.viewableId = 'http://data.emii.com/commodities-markets/gold_tst';
                            $rootScope.$digest();
                            expect(fakeViewablesService.getViewables).toHaveBeenCalledWith({ includeFacetsCount: false, filters: { viewableUri: { value: 'http://data.emii.com/commodities-markets/gold_tst' } } });
                            expect(DominantView.getDominantView).toHaveBeenCalledWith(expectedViewable, false);
                            expect(Annotations.getAnnotations).toHaveBeenCalledWith({
                                conceptUri: dominantView['@id']
                            });
                            expect(Annotations.getAnnotations).toHaveBeenCalledWith({
                                conceptUri: [dominantView['@id']]
                            });
                            expect(ViewEvolution.getViewEvolution).toHaveBeenCalledWith({ uri: [dominantView['@id']], restrictToLatestInactiveEvolution: true });
                            
                            expect(scope.allViewsUrl).toBeDefined();
                            expect(scope.viewable).toEqual(expectedViewable);
                            expect(scope.viewable.dominantView).toEqual(dominantView);
                            expect(Page.setTitle).toHaveBeenCalledWith(expectedViewable.canonicalLabel);
                            expect(scope.viewable.dominantView.previousView).toEqual(dominantView);
                            expect(scope.viewable.primarySupport).toBeDefined();
                            expect(scope.viewable.primarySupport.liveReportUrl).toEqual('/#/reports/annotation-id');
                        }));
                        
                        it("Should by default show authorised content based on a cookie", inject(function ($rootScope, $controller, Page, $cookies) {
                            $cookies.showAuthorisedContentOnly = "true";
                            controller = $controller(ResearchController, {
                                $scope: scope,
                                Viewables: fakeViewablesService,
                                Page: Page,
                                $cookies: $cookies
                            });
                            $rootScope.$digest();
                            expect(scope.showAuthorisedContentOnly).toBe(true);
                        }));
                        
                        it("Should order views by supplying 'displayOrder' value", inject(function ($rootScope) {
                            scope.viewableId = 'http://data.emii.com/commodities-markets/gold_tst';
                            $rootScope.$digest();
                            
                            expect(scope.viewable.activeView['@set'][0].displayOrder).toBeDefined();
                        }));
                    });

                    describe('Given viewable exists and loads', function () {
                        beforeEach(inject(function ($rootScope, $controller, $q, Page, $cookies) {
                            scope.viewableId = 'http://data.emii.com/commodities-markets/gold_tst';
                            $rootScope.$digest();
                        }));
                        
                        it("Should update breadcrumbs", inject(function ($rootScope, $controller, Page, $cookies) {
                            expect(Page.setLastBreadcrumbs).toHaveBeenCalledWith([
                                    { name: expectedViewable.typeLabel, link: '/views?Economy=http://data.emii.com/ontologies/economy/Economy' },
                                    { name: expectedViewable.canonicalLabel }
                                ], true);
                        }));
                    });

                    describe('When the user wants to show authorised content only', function () {
                        it("Should toggle showing authorised content only", inject(function ($rootScope, Page, $cookies) {
                            expect(scope.showAuthorisedContentOnly).toBe(false);
                            scope.toggleShowAuthorisedContentOnly();
                            $rootScope.$digest();
                            expect(scope.showAuthorisedContentOnly).toBe(true);
                            expect($cookies.showAuthorisedContentOnly).toBe("true");
                        }));
                    });

                });

            });
        }); 

