define(['angular', 'mocks', 'App/Directives/Conviction'], function (angular) {
    'use strict';

    describe('Conviction directive', function () {
        var scope, graphicElement;

        beforeEach(module('App.services'));
        beforeEach(module('App.directives'));
        
        beforeEach(inject(function($rootScope, $compile) {
            scope = $rootScope;            
            graphicElement = $compile('<div conviction view-conviction="viewConviction" previous-conviction="previousConviction"></div>')(scope);
        }));
        
        describe('When initialize', function () {
            beforeEach(function () {
                scope.$root.$digest();
            });
            it('should replace and display default', function () {
                expect(graphicElement.attr('data-canonical-label')).toBe('');
                expect(graphicElement.find('.view-conviction-icon').hasClass('view-conviction-icon-1')).toBe(true);
            });
        });

        describe('High view conviction is defined', function () {
            beforeEach(function() {
                scope.viewConviction = { canonicalLabel: 'High' };
                scope.$root.$digest();
            });
            it('should display "High conviction" value 5 boxes', function() {
                expect(graphicElement.attr('data-canonical-label')).toBe('High');
                expect(graphicElement.find('.view-conviction-icon').hasClass('view-conviction-icon-2')).toBe(true);
            });
        });
        
        describe('Medium view conviction is defined', function () {
            beforeEach(function() {
                scope.viewConviction = { canonicalLabel: 'MeDium' };
                scope.$root.$digest();
            });
            it('should display "Medium conviction" value', function () {
                expect(graphicElement.attr('data-canonical-label')).toBe('MeDium');
                expect(graphicElement.find('.view-conviction-icon').hasClass('view-conviction-icon-1')).toBe(true);
            });
        });
        
        describe('Low view conviction is defined', function () {
            beforeEach(function() {
                scope.viewConviction = { canonicalLabel: 'Low' };
                scope.$root.$digest();
            });
            it('should display "Low conviction" value', function() {
                expect(graphicElement.attr('data-canonical-label')).toBe('Low');
                expect(graphicElement.find('.view-conviction-icon').hasClass('view-conviction-icon-0')).toBe(true);
            });
        });
        
        describe('Given conviction is undefined', function () {
            beforeEach(function () {
                scope.viewConviction = { };
                scope.$root.$digest();
            });
            it('should display medium', function () {
                expect(graphicElement.attr('data-canonical-label')).toBe('');
                expect(graphicElement.find('.view-conviction-icon').hasClass('view-conviction-icon-1')).toBe(true);
            });
        });
        
        describe('Given conviction is invalid', function () {
            beforeEach(function () {
                scope.viewConviction = { canonicalLabel: 'SomeRandomValue' };
                scope.$root.$digest();
            });
            it('should display "Medium conviction" value', function () {
                expect(graphicElement.attr('data-canonical-label')).toBe('SomeRandomValue');
                expect(graphicElement.find('.view-conviction-icon').hasClass('view-conviction-icon-1')).toBe(true);
            });
        });

        describe('View conviction increases from previous view', function () {
            beforeEach(function () {
                scope.previousConviction = { canonicalLabel: 'Low' };
                scope.viewConviction = { canonicalLabel: 'High' };
                scope.$root.$digest();
            });
            it('should display a correctly positioned and sized up arrow', function () {
                expect(graphicElement.find('.view-conviction-change-icon').hasClass('view-conviction-change-icon-0-2')).toBe(true);
            });
        });

        describe('View conviction decreases from previous view', function () {
            beforeEach(function () {
                scope.previousConviction = { canonicalLabel: 'Medium' };
                scope.viewConviction = { canonicalLabel: 'Low' };
                scope.$root.$digest();
            });
            it('should display a correctly positioned and sized down arrow', function () {
                expect(graphicElement.find('.view-conviction-change-icon').hasClass('view-conviction-change-icon-1-0')).toBe(true);
            });
        });

        describe('View conviction is unchanged from previous view', function () {
            beforeEach(function () {
                scope.previousConviction = { canonicalLabel: 'High' };
                scope.viewConviction = { canonicalLabel: 'High' };
                scope.$root.$digest();
            });
            it('should display a correctly positioned dot', function () {
                expect(graphicElement.find('.view-conviction-change-icon').hasClass('view-conviction-change-icon-2-2')).toBe(true);
            });
        });
        
        describe('There was not a previous view conviction', function () {
            beforeEach(function () {
                scope.viewConviction = { canonicalLabel: 'High' };
                scope.$root.$digest();
            });
            it('should not display an arrow nor a dot', function () {
                expect(graphicElement.find('.view-conviction-change-icon').length).toBe(0);
            });
        });
    });
});


