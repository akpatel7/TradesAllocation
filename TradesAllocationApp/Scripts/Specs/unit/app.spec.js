define(['angular', 'underscore', 'App/app', 'mocks'], function (angular, _) {
    describe("App: Testing Modules", function () {
        describe("App Module:", function () {
            var appModule, dependencies;

            beforeEach(function () {
                appModule = angular.module("App");

                dependencies = appModule.requires;
            });

            it("should be registered", function () {
                expect(appModule).not.toBeUndefined();
            });

            describe("Dependencies:", function () {

                var hasModule = function (m) {
                    return _.indexOf(dependencies, m) >= 0;
                };

                it("should have filters as a dependency", function () {
                    expect(hasModule('App.filters')).toEqual(true);
                });

                it("should have services as a dependency", function () {
                    expect(hasModule('App.services')).toEqual(true);
                });

                it("should have controllers as a dependency", function () {
                    expect(hasModule('App.controllers')).toEqual(true);
                });

                it("should have directives as a dependency", function () {
                    expect(hasModule('App.directives')).toEqual(true);
                });

            });
        });
    });

});