define(['angular', 'mocks', 'App/Directives/WrapContent'], function () {
    'use strict';

    describe('WrapContent directive', function () {
        var scope,
            element;

        beforeEach(module('App.directives'));

        describe('Expandable', function() {
            beforeEach(inject(function($rootScope, $compile) {
                scope = $rootScope;
                element = $compile('<div wrap-content content="{{content}}" max-length="{{maxLength}}" expandable="true" ></div>')(scope);
            }));

            describe('Wrapping text with a max length of 10', function() {
                beforeEach(function() {
                    scope.content = 'here is some long text';
                    scope.maxLength = 10;
                    scope.$root.$digest();
                });

                it('should display the first 10 characters followed by ...', function() {
                    expect(element.children().find('div').text()).toEqual('here is so...');
                });

                describe('When clicking the MORE/LESS button', function() {
                    it('should show and hide the content', function() {
                        expect(element.children().find('a').text().trim()).toEqual('MORE');
                        element.children().find('a').click();
                        expect(element.children().find('div').text()).toEqual('here is some long text');

                        expect(element.children().find('a').text().trim()).toEqual('LESS');
                        element.children().find('a').click();
                        expect(element.children().find('div').text()).toEqual('here is so...');
                    });
                });

            });

            describe('Wrapping text without specifying a length', function() {
                it('should display the entire content', function() {
                    scope.content = 'here is some long text';
                    scope.$root.$digest();
                    expect(element.children().find('div').text()).toEqual('here is some long text');
                });
            });

            describe('Wrapping text with undefined length', function() {
                it('should display the entire content', inject(function($compile) {
                    scope.content = 'here is some long text';
                    scope.maxLength = undefined;
                    var testElement = $compile('<div wrap-content content="{{content}}" ></div>')(scope);
                    scope.$root.$digest();
                    element.children().find('a').click();
                    expect(testElement.children().find('div').text()).toEqual('here is some long text');
                }));
            });

            describe('Wrapping text with undefined content', function() {
                it('should display nothing', inject(function($compile) {
                    scope.maxLength = 100;
                    var testElement = $compile('<div wrap-content max-length="{{maxLength}}" ></div>')(scope);
                    scope.$root.$digest();
                    expect(testElement.children().find('div').text()).toEqual('');
                }));
            });
        });

        describe('Not Expandable', function () {
            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope;
                element = $compile('<div wrap-content content="{{content}}" max-length="{{maxLength}}" expandable="false" ></div>')(scope);
            }));

            describe('Wrapping text with a max length of 10', function () {
                beforeEach(function () {
                    scope.content = 'here is some long text';
                    scope.maxLength = 10;
                    scope.$root.$digest();
                });

                it('should not display the show more button', function () {
                    expect(element.find('a').length).toBe(0);
                });

            });

          
        });
    });
});


