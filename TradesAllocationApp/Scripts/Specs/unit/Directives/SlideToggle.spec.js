define(['angular', 'mocks', 'App/Directives/SlideToggle'], function () {
    'use strict';

    describe('Slide toggle directive', function () {
        var scope,
            element;

        beforeEach(module('App.directives'));

        describe('When the content is to be displayed', function () {
            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope.$new();
                scope.show = false;
                element = $compile('<div slide-toggle="show"></div>')(scope);
            }));

            it('should show the content', inject(function ($rootScope) {
                scope.show = true;
                $rootScope.$digest();

                element.promise().done(function () {
                    expect(element.is(':visible')).toBe(true);
                });
            }));
        });

        describe('When the content is to be hidden', function () {
            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope.$new();
                scope.show = true;
                element = $compile('<div slide-toggle="show"></div>')(scope);
            }));
            it('should hide the content', inject(function ($rootScope) {
                scope.show = false;
                $rootScope.$digest();

                element.promise().done(function () {
                    expect(element.is(':visible')).toBe(false);
                });
            }));
        });
    });
});


