define(['angular',
        'mocks',
        'jquery',
        'App/Directives/Widget'], function() {
            'use strict';

            describe('Widget directive', function() {
                var scope,
                    element,
                    _WIDGET_RESIZED_ = 'widget:resized';

                beforeEach(module('App'));
                beforeEach(inject(function($rootScope, $compile) {
                    scope = $rootScope;
                    element = $compile('<div widget class="test" widget-title="Some kind of widget" widget-width="span3" toggle-time="200">some widget content</div>')(scope);
                    scope.$root.$digest();
                }));

                describe('When the widget is rendered', function() {
                    it('Should be open by default', function() {
                        expect(element.isolateScope().isOpen).toBe(true);
                    });

                    it('Should contain the correct content with the widget wrapper', function() {
                        expect(element.find('.widget-header > h3').text()).toEqual('Some kind of widget');
                        expect(element.find('.widget-body').text()).toEqual('some widget content');
                    });
                    
                    it('should not have the class "maximised"', function () {
                        expect(element.hasClass('maximised')).toBe(false);
                    });

                    it('should have the class "minimised"', function () {
                        expect(element.hasClass('minimised')).toBe(true);
                    });
                });

                describe('Widget with expand button', function() {
                    beforeEach(inject(function($rootScope, $compile) {
                        scope = $rootScope;
                        element = $compile('<div widget class="test" toggle-time="200" widget-show-expand-button="true"></div>')(scope);
                        scope.$root.$digest();
                    }));

                    describe('When clicking on the expand button', function () {
                        beforeEach(function () {
                            expect(element.isolateScope().isOpen).toBe(true);
                            element.find('[expand-button]').trigger('click');
                        });
                        
                        it('Should be closed', function() {
                            expect(element.isolateScope().isOpen).toBe(false);
                        });

                    });

                    describe('When clicking on the expand button several times', function() {
                        it('Should change the button icon', function() {
                            var expandBtn = element.find('[expand-button]');
                            expect(expandBtn.find('i').attr('class')).toBe('icon-minus');
                            expandBtn.trigger('click');
                            expect(expandBtn.find('i').attr('class')).toBe('icon-plus');
                            expandBtn.trigger('click');
                            expect(expandBtn.find('i').attr('class')).toBe('icon-minus');
                        });
                    });

                    describe('When toggle time is undefined and clicking on the expand button', function() {
                        var localElement;

                        beforeEach(inject(function($rootScope, $compile) {
                            scope = $rootScope;
                            localElement = $compile('<div widget class="test" widget-show-expand-button="true"></div>')(scope);
                            scope.$root.$digest();
                        }));

                        it('Should be closed and toggle time should have some default value', function() {
                            expect(localElement.isolateScope().isOpen).toBe(true);
                            localElement.find('[expand-button]').trigger('click');
                            expect(localElement.isolateScope().isOpen).toBe(false);
                        });
                    });
                });

                describe('Widget with maximise button', function() {
                    beforeEach(inject(function($rootScope, $compile) {
                        scope = $rootScope;
                        element = $compile('<div widget class="test" toggle-time="200" widget-show-maximise-button="true"></div>')(scope);
                        scope.$root.$digest();
                    }));

                    describe('When clicking on the maximise button', function () {
                        beforeEach(function () {
                            expect(element.isolateScope().isMaximised).toBe(false);
                            element.find('[maximise-button]').trigger('click');
                        });
                        it('Should be maximised', function() {
                            expect(element.isolateScope().isMaximised).toBe(true);
                        });

                        it('should have the class "maximised"', function() {
                            expect(element.hasClass('maximised')).toBe(true);
                        });
                        
                        it('should not have the class "minimised"', function () {
                            expect(element.hasClass('minimised')).toBe(false);
                        });
                    });

                    describe('When clicking on the maximise button several times', function() {
                        it('Should change the button icon', function() {
                            var maximiseBtn = element.find('[maximise-button]');
                            expect(maximiseBtn.find('i').attr('class')).toBe('icon-resize-full');
                            maximiseBtn.trigger('click');
                            expect(maximiseBtn.find('i').attr('class')).toBe('icon-resize-small');
                            maximiseBtn.trigger('click');
                            expect(maximiseBtn.find('i').attr('class')).toBe('icon-resize-full');
                        });
                    });

                    describe('When toggle time is undefined and clicking on the maximise button', function() {
                        var localElement;

                        beforeEach(inject(function($rootScope, $compile) {
                            scope = $rootScope;
                            localElement = $compile('<div widget class="test" widget-show-maximise-button="true"></div>')(scope);
                            scope.$root.$digest();
                        }));

                        it('Should be not be maximised and toggle time should have some default value', function() {
                            expect(localElement.isolateScope().isMaximised).toBe(false);
                            localElement.find('[maximise-button]').trigger('click');
                            expect(localElement.isolateScope().isMaximised).toBe(true);
                        });
                    });
                });
            });
        });