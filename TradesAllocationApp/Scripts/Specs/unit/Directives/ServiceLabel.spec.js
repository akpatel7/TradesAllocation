define(['angular', 'mocks', 'App/Directives/ServiceLabel'], function () {
    'use strict';

    describe('Service Label directive', function () {
        var scope,
            element;

        beforeEach(module('App'));
        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope;
            element = $compile('<div service-label service="service"></div>')(scope);
        }));

        describe('Given we have a house view', function () {
            it('should display HOUSE', function () {
                scope.service = {
                    "@type": "Service",
                    "description": "BCA House service.",
                    "@id": "http://data.emii.com/bca/services/bcah",
                    "canonicalLabel": "BCA House"
                };
                scope.$root.$digest();
                expect(element.text().trim()).toBe('HOUSE');
            });
        });
        
        describe('Given we have a view, which is not a house view', function () {
            it('should display the service name', function () {
                scope.service = {
                    "@type": "Service",
                    "description": "GIS service.",
                    "@id": "http://data.emii.com/bca/services/gis",
                    "canonicalLabel": "Global Investment Strategy"
                };
                scope.$root.$digest();
                expect(element.text()).toBe('Global Investment Strategy');
            });
        });

        describe('Given we have a view and configured to show short name', function () {
            it('should display the service short name', function () {
                scope.service = {
                    "@type": "Service",
                    "description": "GIS service.",
                    "@id": "http://data.emii.com/bca/services/gis",
                    "canonicalLabel": "GIS"
                };
                scope.useShortName = true;
                scope.$root.$digest();
                expect(element.text()).toBe('GIS');
            });
        });

    });
});


