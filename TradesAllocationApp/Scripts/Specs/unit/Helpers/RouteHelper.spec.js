define(['App/Helpers/RouteHelper'], function (routeHelper) {
    describe("routeHelper", function () {
        describe('MakeRoutesCaseInsensitive', function () {
            var paths;

            beforeEach(function () {
                paths = ['/home', '/views'];
            });

            describe('Given we have a path "views"', function () {
                it('the route path should be "views"', function () {
                    expect(routeHelper.makeRoutesCaseInsensitive(null, '/views', null, paths)).toBe('/views');
                });
            });

            describe('Given we have a path with mixed (upper and lower) cases "ViEws"', function () {
                it('the route path should be "views"', function () {
                    expect(routeHelper.makeRoutesCaseInsensitive(null, '/ViEws', null, paths)).toBe('/views');
                });
            });

            describe('Given we have uknknown path like "thisIsUknownPath"', function () {
                it('the route path should be "home"', function () {
                    expect(routeHelper.makeRoutesCaseInsensitive(null, '/thisIsUknownPath', null, paths)).toBe('/home');
                });
            });
        });
    });
});