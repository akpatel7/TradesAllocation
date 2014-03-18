define(['angular', 'mocks', 'App/Directives/Date'], function () {
    'use strict';

    describe('ScrollIntoView directive', function () {
        var scope,
            element;

        beforeEach(module('App.directives'));
        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope;
            element = $compile('<div scroll-into-view>here is some link</div>')(scope);
        }));

        describe('Given some content surrounded by a scroll into view', function () {
            it('The content should be transcluded', function () {
                scope.$root.$digest();
                expect(element.text()).toBe('here is some link');
            });
        });
        
        describe('Given a scroll into view', function () {
            it('Should have an id', function () {
                scope.$root.$digest();
                expect(scope.id).toBeDefined();
            });
            
        });
    });
});


