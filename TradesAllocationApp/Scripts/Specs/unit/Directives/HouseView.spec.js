define(['angular',
        'mocks',
        //'jquery',
        'App/Directives/HouseView'], function () {
    'use strict';

    describe('HouseView directive', function() {
        var scope,
            element;

        beforeEach(module('App'));        
      

        describe('Given we have a house view', function() {
            beforeEach(inject(function($rootScope, $compile) {
                scope = $rootScope;
                element = $compile('<div house-view view="view"></div>')(scope);
                scope.view = {
                    viewWeighting: {
                        canonicalLabel: 'BCA House'
                    },
                    viewHorizon: 'P6M',
                    lastUpdated: '2013-01-01',
                    themes: [
                        { "canonicalLabel": "China theme" },
                        { "canonicalLabel": "Equities theme" }
                    ]
                };
            }));
            it('should display "last update" date, horizon', function() {
                scope.$root.$digest();
                expect(element.find('.latest-update').text()).toBe('latest update01 Jan 2013');
                expect(element.find('[view-horizon]').text()).toBe('6 months');
            });

            it('should be collapsed by default', function() {
                scope.$root.$digest();
                expect(element.isolateScope().isExpanded).toBe(false);
            });
        });

        describe('Given we have a house view', function() {
            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope;
                element = $compile('<div house-view view="view" expanded="{{expanded}}" ></div>')(scope);
                scope.view = {
                    viewWeighting: {
                        canonicalLabel: 'BCA House'
                    },
                    viewHorizon: 'P6M',
                    description: 'here is some description',
                    horizonStartDate: '2013-01-01',
                    themes: [
                        { "canonicalLabel": "China theme" },
                        { "canonicalLabel": "Equities theme" }
                    ]
                };
                scope.expanded = undefined;
            }));

            it('should have a conviction class', function () {
                scope.$root.$digest();
                expect(element.find('.conviction-1').length).toBe(1);
            });

            it('should have position class', function () {
                scope.$root.$digest();
                expect(element.find('.position-1').length).toBe(1);
            });
            
            describe('When expanding it', function() {
                it('should expand', function () {
                    scope.expanded = true;
                    scope.$root.$digest();
                    expect(element.isolateScope().isExpanded).toBe(true);
                    
                });
            });

            describe('When expanding it and then collapsing it', function () {
                it('should be collapsed', function () {
                    scope.expanded = true;
                    scope.$root.$digest();
                    expect(element.isolateScope().isExpanded).toBe(true);
                    expect(element.children().find('.description').attr('style') === undefined || element.children().find('.description').attr('style') === '').toBe(true);
                    scope.expanded = false;
                    scope.$root.$digest();
                    expect(element.isolateScope().isExpanded).toBe(false);
                    expect(element.children().find('.description').hasClass('ng-hide')).toBe(true);
                });
            });
        });        
        
		
    });
});


