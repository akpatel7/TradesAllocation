define(['jquery', 'angular', 'mocks', 'App/Directives/Date'], function ($) {
    'use strict';

    describe('Date directive', function () {
        var scope,
            element;

        beforeEach(module('App.directives'));
        describe('For default language', function() {
            beforeEach(inject(function($rootScope, $compile) {
                scope = $rootScope.$new();
                element = $compile('<div class="horizonStartDate" date="horizonStartDate"></div>')(scope);
            }));

            describe('2013-01-10', function() {
                it('should display 10 Jan 2013', function() {
                    scope.horizonStartDate = '2013-01-10';
                    scope.$root.$digest();
                    expect(element.text()).toEqual('10 Jan 2013');
                });
            });

            describe('2013-01-01', function () {
                it('should display 01 Jan 2013', function () {
                    scope.horizonStartDate = '2013-01-01';
                    scope.$root.$digest();
                    expect(element.text()).toEqual('01 Jan 2013');
                });
            });
            
            describe('2013-01-01 in format "MMM DD, YYYY"', function() {
                beforeEach(inject(function($compile) {
                    element = $compile('<div class="horizonStartDate" date="horizonStartDate" format="MMM DD, YYYY"></div>')(scope);
                }));
                it('should display 10-Jan-13', function() {
                    scope.horizonStartDate = '2013-01-10';
                    scope.$root.$digest();
                    expect(element.text()).toEqual('Jan 10, 2013');
                });
            });

            describe('undefined', function() {
                it('should display N/A', function() {
                    scope.horizonStartDate = undefined;
                    scope.$root.$digest();
                    expect(element.text()).toEqual('N/A');
                });
            });

            describe('Display nothing for undefined values', function() {
                beforeEach(inject(function($compile) {
                    element = $compile('<div class="horizonStartDate" date="horizonStartDate" display-empty="true"></div>')(scope);
                }));
                it('Should display an empty string', function() {
                    scope.horizonStartDate = undefined;
                    scope.$root.$digest();
                    expect(element.text()).toEqual('');
                });
            });
        });
      

        describe('For us language', function () {
            var elt = $('<meta name="accept-language" content="en-US">');
            beforeEach(inject(function ($rootScope, $compile) {
                $('head').append(elt);
                scope = $rootScope.$new();
                element = $compile('<div class="horizonStartDate" date="horizonStartDate"></div>')(scope);
            }));
            afterEach(function() {
                elt.remove();
            });
            describe('2013-01-10', function () {
                it('should display Jan 10 2013', function () {
                    scope.horizonStartDate = '2013-01-10';
                    scope.$root.$digest();
                    expect(element.text()).toEqual('Jan 10 2013');
                });
            });
            
            describe('2013-01-01', function () {
                it('should display Jan 01 2013', function () {
                    scope.horizonStartDate = '2013-01-01';
                    scope.$root.$digest();
                    expect(element.text()).toEqual('Jan 01 2013');
                });
            });

            describe('/Date(1377953294000)', function() {
                it('should display Aug 31 2013', function() {
                    scope.horizonStartDate = '/Date(1377953294000)';
                    scope.$root.$digest();
                    expect(element.text()).toEqual('Aug 31 2013');
                });
            });
        });
    });
});


