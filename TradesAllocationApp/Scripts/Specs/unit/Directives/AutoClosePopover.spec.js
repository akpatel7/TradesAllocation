define(['angular', 'mocks', 'App/Directives/AutoClosePopover'], function () {
    'use strict';

    describe('Auto close popover directive', function () {
        var scope, element, popover;

        beforeEach(module('App'));
        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope;

            element = $compile('<a auto-close-popover></a>')(scope);
            popover = $('<div class="popover"><span></span></div>').appendTo($('body'));
            $('body').append(element);
        }));

        afterEach(function () {
            element.remove();
            popover.remove();
        });

        describe('Given we have a popover displayed', function () {
            it('should hide the pover when the document is clicked', function () {
                expect($('.popover').length).toBe(1);
                $('body').trigger('click');
                scope.$root.$digest();
                expect($('.popover').length).toBe(0);
            });

            it('should not hide the pover when the popover itself is clicked', function () {
                expect($('.popover').length).toBe(1);
                $('.popover span').trigger('click');
                scope.$root.$digest();
                expect($('.popover').length).toBe(1);
            });
        });
 
    });
});


