define(['App/Controllers/Allocations/AllocationsTreeGridController',
        'underscore',
        'angular',
        'resource',
        'mocks'
], function (AllocationsTreeGridController, _) {
    describe('AllocationsTreeGridController', function () {
        var controller,
            scope,
            routeParams;
          
        beforeEach(function () {
            module('App');
        });

        describe('When the route contains the Uri', function () {
            beforeEach(inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();
                scope.grid = {
                    SetFilter: function () {

                    }
                };
                spyOn(scope.grid, 'SetFilter').andCallThrough();
                routeParams = {
                    Uri: 'http://data.emii.com/bca/portfolios/portfolio-one'
                };
                controller = $controller(AllocationsTreeGridController, {
                    $scope: scope,
                    $routeParams: routeParams
                });
                scope.$root.$digest();
            }));
             
            it('should filter the portfolios by uri', function() {
                expect(scope.grid.SetFilter).toHaveBeenCalledWith('Uri', 'return Row["Uri"] === "http://data.emii.com/bca/portfolios/portfolio-one" ? 1 : 0', null, 0);
            });
        });
            
        describe('When the route contains no param', function () {
            beforeEach(inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();
                scope.grid = {
                    SetFilter: function () {

                    }
                };
                spyOn(scope.grid, 'SetFilter').andCallThrough();
                routeParams = {
                };
                controller = $controller(AllocationsTreeGridController, {
                    $scope: scope,
                    $routeParams: routeParams
                });
                scope.$root.$digest();
            }));

            it('should reset the portfolio filter', function () {
                expect(scope.grid.SetFilter).toHaveBeenCalledWith('Uri', 'return 1', null, 0);
            });
        });
            
        describe('Given we create the controller', function () {
            beforeEach(inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();
                scope.grid = {
                    GetPage: function (val) {
                        return val;
                    },
                    SetFilter: function () {
                    },
                    GoToPage: function () {
                    },
                    ActionExport: function () {
                    }
                };
                controller = $controller(AllocationsTreeGridController, {
                    $scope: scope
                });
                scope.$root.$digest();
            }));
            
            it('Should be initialised with default values', function () {
                expect(scope.totalCount).toBe(0);
                expect(scope.currentPage).toBe(1);
                expect(scope.pageSize).toBe(5);
                expect(scope.showBoundaryLinks).toBe(false);
            });

            describe('When the current page is changed', function () {
                it('Should change the grid page', function () {
                    spyOn(scope.grid, 'GetPage').andCallThrough();
                    spyOn(scope.grid, 'GoToPage').andCallThrough();

                    scope.onSelectPage(2);
                    scope.$root.$digest();

                    expect(scope.grid.GetPage).toHaveBeenCalledWith(1);
                    expect(scope.grid.GoToPage).toHaveBeenCalledWith(1);
                });
            });
            
            describe('When we are displaying a large number of portfolios', function () {
                it('Should display boundary links on the pager element', function () {
                    scope.totalCount = 100;
                    scope.$root.$digest();

                    expect(scope.showBoundaryLinks).toBe(true);
                });
            });

            describe('When exporting to excel', function() {
                it('should call tree grid export api', function () {
                    spyOn(scope.grid, 'ActionExport').andCallThrough();
                    scope.Export();
                    expect(scope.grid.ActionExport).toHaveBeenCalled();
                });
            });
        });
        
        
    });
});