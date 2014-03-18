define(['App/routes'], function (routesConfig) {

    describe('', function() {
        describe('/home', function () {
            it('should be HouseViewsController', function () {
                expect(routesConfig.routes['/home'].controller).toBe('HouseViewsController');
            });
        });

        describe('/views', function () {
            it('should be BricksController', function () {
                expect(routesConfig.routes['/views'].controller).toBe('BricksController');
            });
        });
        
        describe('/themes', function () {
            it('should be BricksController', function () {
                expect(routesConfig.routes['/themes'].controller).toBe('BricksController');
            });
        });
        
        describe('/favourites', function () {
            it('should be BricksController', function () {
                expect(routesConfig.routes['/favourites'].controller).toBe('BricksController');
            });
        });
        
        describe('/favourites/marketseconomies', function () {
            it('should redirect to "/favourites"', function () {
                expect(routesConfig.routes['/favourites/marketseconomies'].redirectTo).toBe('/favourites');
            });
        });
        
        describe('/favourites/themes', function () {
            it('should be BricksController', function () {
                expect(routesConfig.routes['/favourites/themes'].controller).toBe('BricksController');
            });
        });
        
        describe('/research', function () {
            it('should be ResearchController', function () {
                expect(routesConfig.routes['/research'].controller).toBe('ResearchController');
            });
        });
        
        describe('/favourites/trades', function () {
            it('should be TradesController', function () {
                expect(routesConfig.routes['/favourites/trades'].controller).toBe('TradesController');
            });
        });
        
        describe('/trades', function () {
            it('should be TradesController', function () {
                expect(routesConfig.routes['/trades'].controller).toBe('TradesController');
            });
            it('should not reload on search', function() {
                expect(routesConfig.routes['/trades'].reloadOnSearch).toBe(false);
            });
        });
        
        describe('/trade/:tradeId', function () {
            it('should be TradesController', function () {
                expect(routesConfig.routes['/trade/:tradeId'].controller).toBe('TradesController');
            });
            it('should not reload on search', function () {
                expect(routesConfig.routes['/trades'].reloadOnSearch).toBe(false);
            });
        });

        describe('/linked-trades/:tradeId', function () {
            it('should be TradesController', function () {
                expect(routesConfig.routes['/linked-trades/:tradeId'].controller).toBe('TradesController');
            });
            it('should not reload on search', function () {
                expect(routesConfig.routes['/trades'].reloadOnSearch).toBe(false);
            });
        });
        
        describe('/allocations', function () {
            it('should be AllocationsController', function () {
                expect(routesConfig.routes['/allocations'].controller).toBe('AllocationsController');
            });
            it('should have the dependencies', function () {
                expect(routesConfig.routes['/allocations'].dependencies.length).toBe(1);
            });
        });
        
        describe('/favourites/allocations', function () {
            it('should be AllocationsController', function () {
                expect(routesConfig.routes['/favourites/allocations'].controller).toBe('AllocationsController');
            });
        });
    });
    
});