define(['angular', 'mocks', 'App/Directives/Conviction'], function (angular) {
    'use strict';

    describe('Conviction directive', function () {
        var scope,
            graphicElement;

        beforeEach(module('App'));
        
        beforeEach(inject(function($rootScope, $compile) {
            scope = $rootScope;            
            graphicElement = $compile('<div position-conviction-color view="view" data-conviction-value="{{convictionValue}}" data-position-value="{{positionValue}}"></div>')(scope);
        }));

        describe('View conviction and economicPosition is defined as low', function () {
            beforeEach(function() {
                scope.view = {
                    economicPosition: {
                        canonicalLabel: "UNDErwEIGHT",
                        '@id': 'http://data.emii.com/economic-positions/underweight'
                    },
                    viewConviction: { canonicalLabel: "LoW" }
                };
                scope.$root.$digest();
            });
            it('Should display underweight low', function () {
                expect(graphicElement.data('conviction-value')).toEqual(0);
                expect(graphicElement.data('position-value')).toEqual(0);
            });
        });
       
        describe('View conviction and economicPosition is defined as neutral', function () {
            beforeEach(function () {
                scope.view = {
                    viewDirection: {
                        canonicalLabel: "FlAt",
                        '@id': 'http://data.emii.com/ontologies/bca/viewDirection/flat'
                    },
                    viewConviction: { canonicalLabel: "MEDiUm" }
                };
                scope.$root.$digest();
            });
            it('Should display underweight low', function () {
                expect(graphicElement.data('conviction-value')).toEqual(1);
                expect(graphicElement.data('position-value')).toEqual(1);
            });
        });
        
        describe('View conviction and economicPosition is defined as high', function () {
            beforeEach(function () {
                scope.view = {
                    viewWeighting: {
                        canonicalLabel: "STRONGER",
                        '@id': 'http://data.emii.com/view-weightings/stronger'
                    },
                    viewConviction: { canonicalLabel: "HIGH" }
                };
                scope.$root.$digest();
            });
            it('Should display underweight low', function () {
                expect(graphicElement.data('conviction-value')).toEqual(2);
                expect(graphicElement.data('position-value')).toEqual(2);
            });
        });
        
        describe('View conviction and economicPosition is not defined', function () {
            beforeEach(function () {
                scope.view = {};
                scope.$root.$digest();
            });
            it('Should display underweight low', function () {
                expect(graphicElement.data('conviction-value')).toEqual(1);
                expect(graphicElement.data('position-value')).toEqual(1);
            });
        });
        
        describe('User is not authorised to view', function () {
            beforeEach(function () {
                scope.view = { hasPermission : false };
                scope.$root.$digest();
            });
            it('Should display not apply classes', function () {
                expect(graphicElement.data('conviction-value')).toEqual('');
                expect(graphicElement.data('position-value')).toEqual('');
            });
        });
        
        describe('View is not defined', function () {
            beforeEach(function () {
                scope.view = null;
                scope.$root.$digest();
            });
            it('Should not have any values', function () {
                expect(graphicElement.data('conviction-value')).toEqual('');
                expect(graphicElement.data('position-value')).toEqual('');
            });
        });
    });
});


