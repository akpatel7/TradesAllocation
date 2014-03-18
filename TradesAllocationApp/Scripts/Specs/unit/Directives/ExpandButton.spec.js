define(['angular', 'mocks', 'App/Directives/Date'], function () {
    'use strict';

    describe('Expand Button directive', function () {
        var scope,
            element;

        beforeEach(module('App.directives'));
       

        describe('Expand single', function () {
            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope;
                element = $compile('<div expand-button expanded="isExpanded" expand-title="Expand All" collapse-title="Collapse All"></div>')(scope);
            }));
            describe('Given we have an expand button in an expanded state', function () {
                it('should show the icon-minus icon, and the Collapse title', function () {
                    scope.isExpanded = true;
                    scope.$root.$digest();
                    expect(element.find('i').attr('class')).toBe('icon-minus');
                    expect(element.attr('title')).toBe('Collapse All');
                });

                describe('When collapsing it', function () {
                    it('should display icon-plus and the Expand title', function () {
                        scope.isExpanded = false;
                        scope.$root.$digest();
                        expect(element.find('i').attr('class')).toBe('icon-plus');
                        expect(element.attr('title')).toBe('Expand All');
                    });
                });
            });

            describe('Given we have an expand button in a collapsed state', function () {
                it('should display icon-plus', function () {
                    scope.isExpanded = false;
                    scope.$root.$digest();
                    expect(element.find('i').attr('class')).toBe('icon-plus');
                });

                describe('When expanding it', function () {
                    it('should display icon-minus', function () {
                        scope.isExpanded = true;
                        scope.$root.$digest();
                        expect(element.find('i').attr('class')).toBe('icon-minus');
                    });
                });

            });
        });

        describe('Expand all button', function() {
            beforeEach(inject(function($rootScope, $compile) {
                scope = $rootScope;
                element = $compile('<div expand-button expanded="isExpanded" expand-title="Expand All" collapse-title="Collapse All" is-double="true"></div>')(scope);
            }));
            
            describe('Given we have a double expand button in an expanded state', function () {
                it('should show the icon-double-angle-down icon', function () {
                    scope.isExpanded = true;
                    scope.$root.$digest();
                    expect(element.find('i').attr('class')).toBe('icon-double-angle-down');
                });

                describe('When collapsing it', function () {
                    it('should display icon-double-angle-up', function () {
                        scope.isExpanded = false;
                        scope.$root.$digest();
                        expect(element.find('i').attr('class')).toBe('icon-double-angle-up');
                    });
                });
            });
        });
        
        describe('Expand button', function () {
            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope;
                element = $compile('<div expand-button expanded="isExpanded" expand-title="Expand All" collapse-title="Collapse All" is-button="true"></div>')(scope);
            }));

            describe('Given we an expand button configured as button', function () {
                it('should have the btn btn-mini classes', function () {
                    scope.$root.$digest();
                    expect(element.attr('class')).toBe('minimise btn btn-mini');
                });
            });
        });

    });
});


