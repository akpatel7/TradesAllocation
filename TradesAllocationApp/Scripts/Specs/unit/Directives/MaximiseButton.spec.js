define(['angular', 'mocks', 'App/Directives/Date'], function () {
    'use strict';

    describe('Maximise Button directive', function () {
        var scope,
            element;

        beforeEach(module('App.directives'));
       
        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope;
            element = $compile('<div maximise-button maximised="isMaximised" maximise-title="Maximise" minimise-title="Minimise" is-button="isButton"></div>')(scope);
        }));

        describe('Given we have an maximise button in an maximised state', function () {
            it('should show the icon-resize-small icon, and the Collapse title', function () {
                scope.isMaximised = true;
                scope.$root.$digest();
                expect(element.find('i').attr('class')).toBe('icon-resize-small');
                expect(element.attr('title')).toBe('Minimise');
            });

            describe('When collapsing it', function () {
                it('should display icon-resize-full and the Maximise title', function () {
                    scope.isMaximised = false;
                    scope.$root.$digest();
                    expect(element.find('i').attr('class')).toBe('icon-resize-full');
                    expect(element.attr('title')).toBe('Maximise');
                });
            });
        });

        describe('Given we have an maximise button in a collapsed state', function () {
            it('should display icon-resize-full', function () {
                scope.isMaximised = false;
                scope.$root.$digest();
                expect(element.find('i').attr('class')).toBe('icon-resize-full');
            });

            describe('When maximising it', function () {
                it('should display icon-resize-small', function () {
                    scope.isMaximised = true;
                    scope.$root.$digest();
                    expect(element.find('i').attr('class')).toBe('icon-resize-small');
                });
            });

        });

        describe('Given we an maximise button configured as button', function () {
            it('should have the btn btn-mini classes', function () {
                scope.isButton = true;
                scope.$root.$digest();
                expect(element.attr('class')).toBe('minimise btn btn-mini');
            });
        });

    });
});


