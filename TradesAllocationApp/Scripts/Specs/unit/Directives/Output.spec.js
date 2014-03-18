define(['angular', 'mocks', 'App/Directives/Output'], function () {
    'use strict';

    describe('Output content without a binding directive', function () {
        var scope,
            element;

        beforeEach(module('App.directives'));
       

        describe('Given we have some content we want to output without a watch/binding', function () {
            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope;
                scope.item = {
                    value: 10
                };
                element = $compile('<div output value="item.value"></div>')(scope);
                scope.$root.$digest();
            }));

            it('Should output the count value from the scope', function() {
                expect(element.text()).toBe('10');
            });

            describe('And the value changes on the scope', function() {
                it('Should not change the content of the DOM element', function() {
                    scope.item.value = 11;
                    expect(element.text()).toBe('10');
                });
            });
        });
 
    });
});


