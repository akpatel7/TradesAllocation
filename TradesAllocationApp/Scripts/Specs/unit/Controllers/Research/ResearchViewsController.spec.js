define(['App/Controllers/Research/ResearchViewsController',
        'underscore',
        'moment',
        'angular',
        'resource',
        'mocks',
        'App/Controllers/controllers'], function (ResearchViewsController) {
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
                        controller = $controller(ResearchViewsController, {
                            $scope: scope
                        });
                    }));

                    describe('When the parent scope viewable changes', function () {
                        it("Should load the active views", inject(function ($rootScope) {
                            scope.viewable = viewable;
                            scope.pageSize = 2;
                            $rootScope.$digest();
                            expect(scope.views.length).toEqual(2);
                            expect(scope.views[0]['@id']).toEqual('view3');
                            expect(scope.views[1]['@id']).toEqual('view2');
                        }));
                    });

                    describe('When I do not want see views I am not authorized to see', function () {
                        it("Should display only the views I have permission for", inject(function ($rootScope) {
                            scope.viewable = viewable;
                            scope.pageSize = 2;
                            scope.showAuthorisedContentOnly = true;
                            $rootScope.$digest();
                            expect(scope.views.length).toEqual(1);
                            expect(scope.views[0]['@id']).toEqual('view1');
                        }));
                    });

                    describe('When I want to see more views', function () {
                        it("Should display more views when I click on the show more button", inject(function ($rootScope) {
                            scope.viewable = viewable;
                            scope.pageSize = 2;
                            $rootScope.$digest();
                            expect(scope.views.length).toEqual(2);

                            scope.showMore();
                            $rootScope.$digest();
                            expect(scope.views.length).toEqual(3);
                        }));
                    });
                });
            });
        });

