define(['angular', 'mocks', 'App/Directives/Breadcrumb'], function(angular) {
    'use strict';

    describe('Authenticating directive', function() {
        var scope,
            element,
            isAuthorised,
            template = '<div class="authenticating" authenticating></div>';

        beforeEach(module('App.services'));
        angular.module('authorisationService.Spec.Config', []).service('authorisationService', function () {
            return {
                isAuthorised: function() {
                    return isAuthorised;
                },
                setAuthorisationHeader: function() {
                }
            };
        });
        beforeEach(module('App.directives'));
        beforeEach(module('authorisationService.Spec.Config'));

        beforeEach(inject(function($rootScope, $compile) {
            scope = $rootScope;
        }));

        describe('When authenticated user is visiting page', function () {
            beforeEach(inject(function ($compile) {
                isAuthorised = true;
                element = $compile(angular.element(template))(scope);
            }));
            it('should display contents without "authenticating" css-class.', function () {
                expect(element.hasClass('authenticating')).toEqual(false);
            });
        });
        
        describe('When un-authenticated user is visiting page', function () {
            beforeEach(inject(function ($compile) {
                isAuthorised = false;
                element = $compile(angular.element(template))(scope);
            }));
            it('should not display contents.', function () {
                expect(element.hasClass('authenticating')).toEqual(true);
            });
        });
        
    });
});


