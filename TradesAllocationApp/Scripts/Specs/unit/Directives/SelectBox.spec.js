define(['angular', 'mocks', 'App/Directives/SelectBox'], function (angular) {
    'use strict';

    describe('SelectBox directive', function () {
        var scope,
            element;

        beforeEach(module('App.directives'));
        
        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope;
            scope.items = [
                { label: 'Supports' },
                { label: 'Scenarios' },
                { label: 'Counters' },
                { label: 'Mentions' }
            ];
            element = $compile('<span select-box items="items" active-class="active-item"></span>')(scope);
            scope.$root.$digest();
        }));

        it('should render 4 items', function() {
            expect(element.find('.dropdown-menu > li').length).toBe(4);
        });

        describe('When selecting Counters', function() {
            it('should activate Counters', function () {
                expect(element.find('.dropdown > a').text().trim()).toBe('Supports');
                element.find('.dropdown > a').trigger('click');
                $(element.find('.dropdown-menu > li a')[2]).trigger('click');
                expect(element.find('.dropdown > a').text().trim()).toBe('Counters');
            });
        });
    });
    
});


