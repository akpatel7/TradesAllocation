 define(['angular', 'mocks', 'App/Directives/ScrollToTop', 'jquery'], function() {
     'use strict';

     describe('TradesFilter directive', function() {
         var scope,
             element,
             directiveScope,
             _WINDOW_SCROLLED_ = 'window:scrolled';

         beforeEach(module('App.directives'));

         beforeEach(module(function ($provide) {
             $provide.constant('_WINDOW_SCROLLED_', 'window:scrolled');
         }));
         
         describe('The ScrollToTop directive', function() {

             beforeEach(inject(function($rootScope, $compile) {
                 scope = $rootScope.$new();

                 element = $compile('<div scroll-to-top/>')(scope);
                 scope.$root.$digest();
                 directiveScope = element.scope();
             }));

             it('should load with isScrolled set to false', function() {
                 expect(directiveScope.isScrolled()).toBe(false);
             });

             describe('when page is scrolled', function() {
                 it('isScrolled should return true', function() {
                     spyOn($.fn, 'scrollTop').andReturn('10');
                     expect(directiveScope.isScrolled()).toBe(true);
                 });
             });
             describe('when the window scrolled event fires', function() {
                 it('should call isScrolled', function() {
                     spyOn(directiveScope, 'isScrolled').andReturn('10');
                     scope.$broadcast(_WINDOW_SCROLLED_);
                     expect(directiveScope.isScrolled).toHaveBeenCalled();
                 });
             });


         });
     });
 });