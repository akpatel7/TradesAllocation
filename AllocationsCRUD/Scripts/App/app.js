define(['angular', 'App/Services/DependencyResolverFor', 'App/Helpers/RouteHelper', 'App/routes', 'underscore', 'route'], function (angular, dependencyResolverFor, routeHelper, config, _) {
    'use strict';

    // Declare app level module which depends on filters, and services
    var app = angular.module('App', [
        'ngRoute',
        'App.services',
        'App.directives',
        'App.filters',
        'App.controllers'
    ]);

    // Resources: 
    // http://www.bennadel.com/blog/2553-Loading-AngularJS-Components-After-Your-Application-Has-Been-Bootstrapped.htm
    // http://ify.io/lazy-loading-in-angularjs/
    // https://github.com/ifyio/angularjs-lazy-loading-with-requirejs

    return app.config(
    [
        '$routeProvider',
        '$locationProvider',
        '$controllerProvider',
        '$compileProvider',
        '$filterProvider',
        '$provide',

        function ($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {
            app.register =
            {
                controller: $controllerProvider.register,
                directive: $compileProvider.directive,
                filter: $filterProvider.register,
                factory: $provide.factory,
                service: $provide.service
            };

            if (config.routes !== undefined) {
                angular.forEach(config.routes, function (route, path) {
                    var options = {
                        redirectTo: route.redirectTo,
                        action: route.action,
                        title: route.title,
                        templateUrl: route.templateUrl,
                        controller: route.controller,
                        caseInsensitiveMatch: true
                    };

                    if (route.dependencies !== undefined && route.dependencies.length > 0) {
                        _.extend(options, {
                            resolve: dependencyResolverFor(route.dependencies)
                        });
                    }

                    if (route.reloadOnSearch !== undefined) {
                        _.extend(options, {
                            reloadOnSearch: route.reloadOnSearch
                        });
                    }

                    $routeProvider.when(path, options);
                });
            }

            if (config.defaultRoutePath !== undefined) {
                $routeProvider.otherwise({ redirectTo: config.defaultRoutePath });
            }
        }
    ]);
});
