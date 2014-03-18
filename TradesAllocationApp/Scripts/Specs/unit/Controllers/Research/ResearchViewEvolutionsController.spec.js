define(['App/Controllers/Research/ResearchViewEvolutionsController',
        'underscore',
        'moment',
        'angular',
        'resource',
        'mocks',
        'App/Controllers/controllers'], function (ResearchViewEvolutionsController) {
            describe('Research Views Controller', function () {
                describe('Given we have a research views controller', function () {
                    var controller,
                        scope;

                    var viewable = {
                        'activeView': {
                            '@set': [
                                { '@id': 'view1', lastUpdatedDate: '2012-07-04', hasPermission: true },
                                { '@id': 'view2', lastUpdatedDate: '2013-08-05', hasPermission: false },
                                { '@id': 'view3', lastUpdatedDate: '2013-09-05', hasPermission: false }
                            ]
                        }
                    };
                    beforeEach(function () {
                        module('App');
                    });

                    beforeEach(inject(function ($rootScope, $controller) {

                        scope = $rootScope.$new();
                        controller = $controller(ResearchViewEvolutionsController, {
                            $scope: scope
                        });
                    }));

                    describe('When the widget is minimised', function() {

                        it('should show strategic views only', function() {
                            expect(scope.minimisedSettings.viewType.strategic.visible).toBe(true);
                            expect(scope.minimisedSettings.viewType.tactical.visible).toBe(false);
                        });
                        
                        it('should not show the reports', function () {
                            expect(scope.minimisedSettings.report.visible).toBe(false);
                        });
                        
                        it('should show active and expired views', function () {
                            expect(scope.minimisedSettings.viewStatus.all.visible).toBe(true);
                        });
                        
                        it('should have views toggle disabled', function () {
                            expect(scope.minimisedSettings.viewsTogglable.enabled).toBe(false);
                        });
                    });
                    
                    describe('When the widget is maximised', function () {
                        it('should show strategic views only', function () {
                            expect(scope.maximisedSettings.viewType.strategic.visible).toBe(true);
                            expect(scope.maximisedSettings.viewType.tactical.visible).toBe(false);
                        });

                        it('should not show the reports', function () {
                            expect(scope.maximisedSettings.report.visible).toBe(false);
                        });

                        it('should show active and expired views', function () {
                            expect(scope.maximisedSettings.viewStatus.all.visible).toBe(true);
                        });
                        
                        it('should have views toggle enabled', function () {
                            expect(scope.maximisedSettings.viewsTogglable.enabled).toBe(true);
                        });
                    });
                });
            });
        });

