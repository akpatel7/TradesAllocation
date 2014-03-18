define(['angular', 'mocks', 'App/Directives/ServiceName'], function () {
    'use strict';

    describe('Service Name directive', function () {
        var scope,
            element;

        beforeEach(module('App'));
        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope;
            element = $compile('<div service-name service="service"></div>')(scope);
        }));

        describe('Given we have http://data.emii.com/bca/services/gis', function () {
            it('should display GIS', function () {
                scope.service = {
                    '@id': 'http://data.emii.com/bca/services/gis'
                };
                scope.$root.$digest();
                expect(element.text()).toBe('GIS');
            });
        });
        
        describe('Given we have http://data.emii.com/bca/services/bcah', function () {
            it('should display HOUSE', function () {
                scope.service = {
                    '@id': 'http://data.emii.com/bca/services/bcah'
                };
                scope.$root.$digest();
                expect(element.text()).toBe('HOUSE');
            });
        });
       
    });
});


