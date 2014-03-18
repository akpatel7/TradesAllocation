define(['angular', 'mocks', 'App/Directives/Horizon'], function (angular) {
    'use strict';

    describe('ViewHorizon directive', function () {
        var scope,
            element;

        beforeEach(module('App.directives'));
        beforeEach(inject(function($rootScope, $compile) {
            scope = $rootScope;            
            element = $compile('<div view-horizon="horizonView"></div>')(scope);
        }));

        describe('view horizon with P60M', function () {
            it('should display 5 years', function () {
                scope.horizonView = 'P60M';
                scope.$root.$digest();
                expect(element.text()).toEqual('5 years');
            });
        });
        describe('view horizon with P18M', function () {
            it('should display 5 years', function () {
                scope.horizonView = 'P18M';
                scope.$root.$digest();
                expect(element.text()).toEqual('1 year 6 months');
            });
        });
        
        describe('view horizon with undefined', function () {
            it('should display ""', function () {
                scope.horizonView = undefined;
                scope.$root.$digest();
                expect(element.text()).toEqual('');
            });
        });
    });
});


