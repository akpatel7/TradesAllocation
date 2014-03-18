define(['jquery', 'angular', 'mocks', 'bootstrap', 'App/Directives/twitter-bootstrap-affix'], function ($) {
    'use strict';

    describe('twitter-bootstrap-affix directive', function () {
        var scope,
            element;

        beforeEach(module('App.directives'));
        
        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope.$new();
            element = $compile('<span><div twitter-bootstrap-affix="45"> </div></span>')(scope);
            scope.$root.$digest();
        }));

        describe('When element is initialized', function () {
            it('Should have scope defined', function () {
                expect($('div:first-child', element).hasClass('affix')).toBe(true);
                expect($('div:first-child', element).attr('data-offset-top')).toBe('45');
            });
            
            it('Should render affix-placeholder after element', function () {
                expect($('div:last-child', element).hasClass('affix-placeholder')).toBe(true);
            });
            
        });        
    });
});


