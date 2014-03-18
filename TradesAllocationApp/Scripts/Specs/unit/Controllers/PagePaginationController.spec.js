define(['App/Controllers/PagePaginationController',
        'angular',
        'resource',
        'mocks'
], function (PagePaginationController) {
    describe('PagePaginationController', function () {
        describe('Given we have a Related Market controller', function () {
            var controller,
                scope,
                pageSize;


            beforeEach(function () {
                module('App.controllers');
            });

            beforeEach(inject(function ($rootScope, $controller) {
                pageSize = 10;
                scope = $rootScope.$new();

                controller = $controller(PagePaginationController, {
                    $scope: scope
                });
            }));

            it('current page should be 1', function () {
                expect(scope.pagination.currentPage).toBe(1);
                expect(scope.pagination.pageSize).toBe(pageSize);
            });
            
            describe('Given we click get more button', function () {
                beforeEach(function () {
                    scope.pagination.getMore();
                });
                
                it('current page should be 1', function () {
                    expect(scope.pagination.currentPage).toBe(2);
                });
                
                it('Total visible items should be pageSize * currentPage', function () {
                    expect(scope.pagination.getMoreTotalCount()).toBe(2 * pageSize);
                });
            });
        });
    });
});
