define(['angular', 'mocks', 'App/Directives/Date'], function () {
    'use strict';

    describe('Icon directive', function () {
        var scope,
            element;

        beforeEach(module('App.directives'));
       

        describe('Icon', function () {
            var compile;
            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope;
                compile = $compile;
                element = compile('<div icon state="isOn" on-title="On" off-title="Off" ' +
                    'on-icon="icon-on" on-hover-icon="icon-hover-on" ' +
                    'off-icon="icon-off"></div>')(scope);
            }));describe('Given we have an icon element in an on state', function () {
                it('should show the on-icon icon, and the on title', function () {
                    scope.isOn = true;
                    scope.$root.$digest();
                    expect(element.attr('class')).toBe('icon-on');
                    expect(element.attr('title')).toBe('On');
                });

                describe('When turning it off it', function () {
                    it('should display icon-off and the Off title', function () {
                        scope.isOn = false;
                        scope.$root.$digest();
                        expect(element.attr('class')).toBe('icon-off');
                        expect(element.attr('title')).toBe('Off');
                    });
                });

                describe('When hovering the On icon which has a hover state', function() {
                    it('should display icon-off and the Off title', function () {
                        scope.isOn = true;
                        scope.$root.$digest();
                        expect(element.attr('class')).toBe('icon-on');
                        $(element).trigger('mouseenter');
                        expect(element.attr('class')).toBe('icon-hover-on');
                        $(element).trigger('mouseout');
                        expect(element.attr('class')).toBe('icon-on');
                    });
                });
             
            });

            describe('Given we have an icon element in an off state', function () {
                it('should display icon-off', function () {
                    scope.isOn = false;
                    scope.$root.$digest();
                    expect(element.attr('class')).toBe('icon-off');
                });

                describe('When turning it on', function () {
                    it('should display icon-on', function () {
                        scope.isOn = true;
                        scope.$root.$digest();
                        expect(element.attr('class')).toBe('icon-on');
                    });
                });
                

                describe('When hovering the Off icon which doesnt have a hover state', function () {
                    it('should display icon-off and the Off title', function () {
                        scope.isOn = false;
                        scope.$root.$digest();
                        expect(element.attr('class')).toBe('icon-off');
                        $(element).trigger('mouseenter');
                        expect(element.attr('class')).toBe('icon-off');
                        $(element).trigger('mouseout');
                        expect(element.attr('class')).toBe('icon-off');
                    });
                });

            });

            it('should let me have some text inside the icon body', function() {
                element = compile('<div icon state="isOn" on-title="On" off-title="Off" on-icon="icon-on" off-icon="icon-off">biscuits</div>')(scope);
                expect(element.text()).toBe("biscuits");
            });
            
            it('should let me have a binding inside the body', function () {
                scope.bindingValue = "biscuits";
                element = compile('<div icon state="isOn" on-title="On" off-title="Off" on-icon="icon-on" off-icon="icon-off">{{bindingValue}}</div>')(scope);
                scope.$root.$digest();
                expect(element.text()).toBe("biscuits");
            });

        });
    });
});


