define(['App/Controllers/Allocations/PortfolioAllocationFilterController',
        'angular',
        'resource',
        'mocks',
        'route',
        'App/Controllers/controllers'
], function (PortfolioAllocationFilterController) {
    describe('PortfolioAllocationFilterController', function () {
        var controller,
                scope;

        beforeEach(module('App.controllers'));

        beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            
            scope.grid = {
                Rows: [],
                SetFilter: angular.noop,
                ExpandParents: angular.noop
            };            
        }));

        describe('Give we filter by favourites', function () {
            beforeEach(inject(function ($controller) {
                spyOn(scope.grid, 'SetFilter').andCallThrough();
                
                scope.renderAction = 'home.allocations';
                controller = $controller(PortfolioAllocationFilterController, { $scope: scope });
                scope.$root.$digest();

                scope.toggleFavouritesFilter();
                scope.$root.$digest();
            }));

            it('Should set the custom filter on the TreeGrid component', function () {
                expect(scope.showFavouritesOnly).toBe(true);
                expect(scope.grid.SetFilter).toHaveBeenCalledWith('home.allocations-isFavourited', 'return Row["isFavourited"] ? 1 : 0');
                expect(scope.grid.SetFilter).toHaveBeenCalledWith('mybca.favourites.allocations-isFavourited', '');
            });
        });
        
        describe('Give we filter by follows', function () {
            beforeEach(inject(function ($controller) {
                spyOn(scope.grid, 'SetFilter').andCallThrough();

                scope.renderAction = 'home.allocations';
                controller = $controller(PortfolioAllocationFilterController, { $scope: scope });
                scope.$root.$digest();

                scope.toggleFollowFilter();
                scope.$root.$digest();
            }));

            it('Should set the custom filter on the TreeGrid component', function () {
                expect(scope.showFollowsOnly).toBe(true);
                expect(scope.grid.SetFilter).toHaveBeenCalledWith('isFollowed', 'return Row["isFollowed"] ? 1 : 0');
            });
        });

        describe('And we need to check if the favourites or follows filter is stored in the grid config', function () {
            beforeEach(inject(function ($controller) {
                scope.renderAction = 'home.allocations';
                controller = $controller(PortfolioAllocationFilterController, { $scope: scope });
                scope.$root.$digest();
            }));

            var rows = [
                {
                    id: 'p-1',
                    originalId: 1,
                    isPortfolio: true
                },
                {
                    id: 'p-2',
                    originalId: 2,
                    isPortfolio: true
                },
                {
                    id: 'a-1',
                    Portfolio_Id: 1,
                    isPortfolio: false
                },
                {
                    id: 'a-2',
                    Portfolio_Id: 2,
                    isPortfolio: false
                }
            ];

            describe('And only a Portfolio is favourited', function () {
                beforeEach(function () {
                    expect(scope.showFavouritesOnly).toBe(false);
                    rows[0].isFavourited = true;
                    rows[2].isFavourited = false;
                    scope.grid.Rows = rows;
                });
                it('Should detect if the grid is currently being filtered by favourites', function () {
                    scope.setFilterState();
                    expect(scope.showFavouritesOnly).toBe(true);
                });
            });

            describe('And only a Allocation is favourited', function () {
                beforeEach(function () {
                    expect(scope.showFavouritesOnly).toBe(false);
                    rows[0].isFavourited = false;
                    rows[2].isFavourited = true;
                    scope.grid.Rows = rows;
                });
                it('Should detect if the grid is currently being filtered by favourites', function () {
                    scope.setFilterState();
                    expect(scope.showFavouritesOnly).toBe(true);
                });
            });

            describe('And a Portfolio and Allocation is favourited', function () {
                beforeEach(function () {
                    expect(scope.showFavouritesOnly).toBe(false);
                    rows[0].isFavourited = true;
                    rows[3].isFavourited = true;
                    scope.grid.Rows = rows;
                });
                it('Should detect if the grid is currently being filtered by favourites', function () {
                    scope.setFilterState();
                    expect(scope.showFavouritesOnly).toBe(true);
                });
            });
            
            describe('And only a Portfolio is followed', function () {
                beforeEach(function () {
                    expect(scope.showFollowsOnly).toBe(false);
                    rows[0].isFollowed = true;
                    rows[2].isFollowed = false;
                    scope.grid.Rows = rows;
                });
                it('Should detect if the grid is currently being filtered by followed', function () {
                    scope.setFilterState();
                    expect(scope.showFollowsOnly).toBe(true);
                });
            });

            describe('And only a Allocation is followed', function () {
                beforeEach(function () {
                    expect(scope.showFollowsOnly).toBe(false);
                    rows[0].isFollowed = false;
                    rows[2].isFollowed = true;
                    scope.grid.Rows = rows;
                });
                it('Should detect if the grid is currently being filtered by followed', function () {
                    scope.setFilterState();
                    expect(scope.showFollowsOnly).toBe(true);
                });
            });

            describe('And a Portfolio and Allocation is followed', function () {
                beforeEach(function () {
                    expect(scope.showFollowsOnly).toBe(false);
                    rows[0].isFollowed = true;
                    rows[3].isFollowed = true;
                    scope.grid.Rows = rows;
                });
                it('Should detect if the grid is currently being filtered by followed', function () {
                    scope.setFilterState();
                    expect(scope.showFollowsOnly).toBe(true);
                });
            });
        });
        
        describe('Give we view My Favourite Allocations', function () {
            beforeEach(inject(function ($controller) {
                spyOn(scope.grid, 'SetFilter').andCallThrough();

                scope.renderAction = 'mybca.favourites.allocations';
                controller = $controller(PortfolioAllocationFilterController, { $scope: scope });
                scope.$root.$digest();
            }));

            it('Should set the custom filter on the TreeGrid component', function () {
                expect(scope.showFavouritesOnly).toBe(true);
                expect(scope.grid.SetFilter).toHaveBeenCalledWith('mybca.favourites.allocations-isFavourited', 'return Row["isFavourited"] ? 1 : 0');
            });
        });
    });
});