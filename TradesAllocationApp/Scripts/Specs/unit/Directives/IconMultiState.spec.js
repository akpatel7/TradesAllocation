define(['angular', 'mocks', 'App/Directives/Date'], function () {
    'use strict';

    describe('Icon-multi-state directive', function () {
        var scope,
            element;

        beforeEach(module('App.directives'));

        describe('Icon-2-state', function () {
            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope;
                element = $compile('<div icon-multi-state="stateValue" data-on-title="On" data-on-icon="icon-on" data-off-title="Off" data-off-icon="icon-off"></div>')(scope);
            }));

            describe('Given we have an icon element in an on state', function () {
                it('should show the on-icon icon, and the on title', function () {
                    scope.stateValue = 'On';
                    scope.$root.$digest();
                    expect(element.attr('class')).toBe('icon-on');
                    expect(element.attr('title')).toBe('On');
                });

                describe('When turning it off it', function () {
                    it('should display icon-off and the Off title', function () {
                        scope.stateValue = 'Off';
                        scope.$root.$digest();
                        expect(element.attr('class')).toBe('icon-off');
                        expect(element.attr('title')).toBe('Off');
                    });
                });
            });
        });
        
        describe('Icon-3-state', function () {
            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope;
                element = $compile('' +
                    '<div icon-multi-state="stateValue" ' +
                    '   data-on-title="On" data-on-icon="icon-on" ' +
                    '   data-off-title="Off" data-off-icon="icon-off" ' +
                    '   data-blink-title="blink BLINK blink" data-blink-icon="icon-blink" data-blink-hover-icon="icon-hover-blink" ' +
                    '></div>')(scope);
            }));
            
            describe('When icon state is undefined', function () {
                it('should hide the icon', function () {
                    scope.stateValue = undefined;
                    scope.$root.$digest();
                    expect(element.attr('class')).toBe('ng-hide');
                    expect(element.attr('title')).toBe('');
                });
            });
            describe('When icon state is empty string', function () {
                it('should hide the icon', function () {
                    scope.stateValue = '';
                    scope.$root.$digest();
                    expect(element.attr('class')).toBe('ng-hide');
                    expect(element.attr('title')).toBe('');
                });
            });
            describe('When icon is "ON"', function () {
                it('should show the on-icon', function () {
                    scope.stateValue = 'On';
                    scope.$root.$digest();
                    expect(element.attr('class')).toBe('icon-on');
                    expect(element.attr('title')).toBe('On');
                    expect(element.attr('style')).toBeUndefined();
                });

                describe('On hovering the On icon, which doesnt specify a hover icon', function () {
                    it('should show the default on icon', function () {
                        scope.stateValue = 'On';
                        scope.$root.$digest();
                        expect(element.attr('class')).toBe('icon-on');

                        $(element).trigger('mouseover');
                        expect(element.attr('class')).toBe('icon-on');
                    });
                });
            });
            describe('When icon is "Off"', function () {
                it('should show the off-icon', function () {
                    scope.stateValue = 'Off';
                    scope.$root.$digest();
                    expect(element.attr('class')).toBe('icon-off');
                    expect(element.attr('title')).toBe('Off');
                    expect(element.attr('style')).toBeUndefined();
                });
            });
            describe('When icon is "BLINK"', function () {
                it('should show the blink-icon', function () {
                    scope.stateValue = 'blink';
                    scope.$root.$digest();
                    expect(element.attr('class')).toBe('icon-blink');
                    expect(element.attr('title')).toBe('blink BLINK blink');
                    expect(element.attr('style')).toBeUndefined();
                });

                describe('On hovering the blink icon', function() {
                    it('should show the blink-icon-hover', function() {
                        scope.stateValue = 'blink';
                        scope.$root.$digest();
                        expect(element.attr('class')).toBe('icon-blink');
                        
                        $(element).trigger('mouseenter');
                        expect(element.attr('class')).toBe('icon-hover-blink');
                        $(element).trigger('mouseout');
                        expect(element.attr('class')).toBe('icon-blink');
                    });
                });
                
            });
            describe('When icon is "UNDEFINED-VALUE"', function () {
                it('should hide the icon', function () {
                    scope.stateValue = 'UNDEFINED-VALUE';
                    scope.$root.$digest();
                    expect(element.attr('class')).toBe('icon-stop');
                    expect(element.attr('title')).toBe('UNKNOWN ICON STATE');
                    expect(element.attr('style')).toBeUndefined();
                });
            });
        });
    });
});


