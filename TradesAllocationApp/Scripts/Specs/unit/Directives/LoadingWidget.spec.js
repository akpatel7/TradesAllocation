define(['angular', 'mocks', 'App/Directives/LoadingWidget'], function () {
    'use strict';

    describe('LoadingWidget directive', function () {
        var scope,
            element;

        beforeEach(module('App.directives'));
        beforeEach(module(function ($provide) {
            $provide.constant('_REQUEST_STARTED_', 'started');
            $provide.constant('_REQUEST_ENDED_', 'ended');
        }));


        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope;
            element = $compile('<div loading-widget></div>')(scope);
        }));

        describe('When having a loading widget attribute', function () {
            it('The element should be hidden by default', function() {
                expect(element.hasClass('hide')).toBe(true);
            });
            
            describe('When broadcasting a started event', function () {
                it('Should be displayed', function () {
                    element.scope().$broadcast('started');
                    expect(element.hasClass('show')).toBe(true);
                    expect(element.hasClass('hide')).toBe(false);
                });
            });
            
            describe('When broadcasting an ended event', function () {
                it('should be hidden', function () {
                    element.scope().$broadcast('ended');
                    expect(element.hasClass('show')).toBe(false);
                    expect(element.hasClass('hide')).toBe(true);
                });
            });
        });
    });
});


