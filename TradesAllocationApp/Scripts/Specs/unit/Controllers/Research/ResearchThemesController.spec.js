define(['App/Controllers/Research/ResearchThemesController',
        'underscore',
        'moment',
        'angular',
        'resource',
        'mocks',
        'App/Controllers/controllers'], function (ResearchThemesController) {
            describe('Research Themeses Controller', function () {
                describe('Given we have a research themes controller', function() {
                    var controller, scope, fakeThemesService, fakeAnnotationsService, fakeUrlProvider;

                    var viewable = { 
                        'activeView': {
                            '@set': [
                                { '@id': 'view1', informedByTheme: { '@set': [{ '@id': 'theme1' }] } },
                                { '@id': 'view2', informedByTheme: { '@set': [{ '@id': 'theme2' }, { '@id': 'theme3' }] } }
                            ]
                        }
                    };
                    var themes = {
                        'theme1': { '@id': 'theme1', 'service': { '@id': 'service1' }, 'lastApplied': '2013-01-07', 'hasPermission' : true, impact: 'bullish' },
                        'theme2': { '@id': 'theme2', 'service': { '@id': 'service1' }, 'lastApplied': '2013-04-07', 'hasPermission': false, impact: 'bullish' },
                        'theme3': { '@id': 'theme3', 'service': { '@id': 'service1' }, 'lastApplied': undefined, 'hasPermission': false, impact: 'bullish' }
                    };
                    var annotations = [
                                        { '@id': 'annotation1', 'references': { '@id': 'theme1' }, 'hasPermission': true, 'annotationFor': { '@id': 'doc_1', 'published': '2013-05-06' } },
                                        { '@id': 'annotation2', 'references': { '@id': 'theme1' }, 'hasPermission': true, 'annotationFor': { '@id': 'doc_2', 'published': '2013-06-01' } }
                                    ];

                    beforeEach(function () {
                        module('App');
                    });

                    beforeEach(inject(function ($rootScope, $controller, $q) {

                        fakeThemesService = {
                            getThemes: function (o) {
                                var deferred = $q.defer();
                                deferred.resolve({ '@graph' : [themes[o.filters.uri.value]] });
                                return deferred.promise;
                            },
                            calculateImpact: function () { },
                            calculateMarketsCount: function () { }
                        };

                        spyOn(fakeThemesService, 'getThemes').andCallThrough();
                        spyOn(fakeThemesService, 'calculateMarketsCount');

                        fakeAnnotationsService = {
                            getAnnotations: function () {
                                var deferred = $q.defer();
                                deferred.resolve(annotations);
                                return deferred.promise;
                            }
                        };
                        spyOn(fakeAnnotationsService, 'getAnnotations').andCallThrough();

                        fakeUrlProvider = {
                            getLiveReportUrl: function(id) {
                                return 'http://livereport/' + id;
                            },
                            getReportUrl: function(id) {
                                var deferred = $q.defer();
                                deferred.resolve('http://report/' + id);
                                return deferred.promise;
                            }
                        };
                        spyOn(fakeUrlProvider, 'getLiveReportUrl').andCallThrough();
                        spyOn(fakeUrlProvider, 'getReportUrl').andCallThrough();

                        scope = $rootScope.$new();
                        controller = $controller(ResearchThemesController, {
                            $scope: scope,
                            Themes: fakeThemesService, 
                            Annotations: fakeAnnotationsService,
                            UrlProvider: fakeUrlProvider
                        });
                    }));

                    describe('When the parent scope viewable changes', function () {
                        it("Should load the themes that inform the viewable's views", inject(function ($rootScope) {
                            scope.viewable = viewable;
                            scope.pageSize = 2;
                            $rootScope.$digest();

                            expect(fakeThemesService.getThemes.calls.length).toEqual(3);
                            expect(fakeThemesService.getThemes).toHaveBeenCalledWith({ 'filters': { 'uri': { 'value': 'theme1' } } });
                            expect(fakeThemesService.getThemes).toHaveBeenCalledWith({ 'filters': { 'uri': { 'value': 'theme2' } } });
                            expect(fakeThemesService.getThemes).toHaveBeenCalledWith({ 'filters': { 'uri': { 'value': 'theme3' } } });

                            expect(fakeThemesService.calculateMarketsCount.calls.length).toEqual(3);
                            expect(scope.themes.length).toEqual(2);
                            expect(scope.themes[0]['@id']).toEqual('theme2');
                            expect(scope.themes[1]['@id']).toEqual('theme1');
                        }));

                        it("Should load annotations for the themes", inject(function ($rootScope) {
                            scope.viewable = viewable;
                            scope.pageSize = 2;
                            $rootScope.$digest();

                            expect(fakeAnnotationsService.getAnnotations.calls.length).toEqual(1);
                            expect(fakeAnnotationsService.getAnnotations).toHaveBeenCalledWith({
                                conceptUri: ['theme1', 'theme2', 'theme3'],
                                noGrouping: true
                            });
                            expect(scope.themes[0].annotations.length).toEqual(0);
                            expect(scope.themes[1].annotations.length).toEqual(2);
                        }));

                        it("Should set the report and live reports urls for the annotations", inject(function ($rootScope) {
                            scope.viewable = viewable;
                            scope.pageSize = 2;
                            $rootScope.$digest();

                            expect(fakeUrlProvider.getLiveReportUrl.calls.length).toEqual(2);
                            expect(fakeUrlProvider.getReportUrl.calls.length).toEqual(2);
                            expect(scope.themes[1].annotations[0].liveReportUrl).toEqual('http://livereport/doc_2');
                            expect(scope.themes[1].annotations[0].reportUrl).toEqual('http://report/doc_2');
                        }));
                        
                        it("should order themes by descending lastApplied, pushing themes with no date to the end", inject(function ($rootScope) {
                            scope.viewable = viewable;
                            scope.pageSize = 10;
                            $rootScope.$digest();

                            expect(scope.themes[0]['@id']).toEqual('theme2');
                            expect(scope.themes[1]['@id']).toEqual('theme1');
                            expect(scope.themes[2]['@id']).toEqual('theme3');
                        }));
                    });

                    describe('When I do not want see themes I am not authorized to see', function () {
                        it("Should display only the themes I have permission for", inject(function ($rootScope) {
                            scope.viewable = viewable;
                            scope.pageSize = 2;
                            scope.showAuthorisedContentOnly = true;
                            $rootScope.$digest();
                            expect(scope.themes.length).toEqual(1);
                            expect(scope.themes[0]['@id']).toEqual('theme1');
                        }));
                    });

                    describe('When I want to see more themes', function () {
                        it("Should display more themes when I click on the show more button", inject(function ($rootScope) {
                            scope.viewable = viewable;
                            scope.pageSize = 2;
                            $rootScope.$digest();
                            expect(scope.themes.length).toEqual(2);

                            scope.showMore();
                            $rootScope.$digest();
                            expect(scope.themes.length).toEqual(3);
                        }));
                    });
                });
            });
        }); 

