define(['angular', 'mocks', 'App/Directives/Pusher'], function () {
    'use strict';

    describe('Pusher directive', function () {
        var scope,
            element;

        beforeEach(module('App.directives'));
       

        describe('Given we have a pusher with a unit height of 50px', function () {
            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope;
                scope.count = 0;
                element = $compile('<a pusher count="count" height="50"></a>')(scope);
            }));

            describe('And we have 10 units', function() {
                it('should push by 500px', function () {
                    scope.count = 10;
                    scope.$digest();
                    expect(element.height()).toBe(500);
                });
            });
        });
 
    });
});


