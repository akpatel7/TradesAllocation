define(['angular', 'mocks'], function() {
	'use strict';

	describe('DatePicker directive', function() {
		var scope,
			element,
			directiveScope;

		beforeEach(module('App.services'));
		beforeEach(module('App.directives'));

		describe('Given a DatePicker directive', function() {
			beforeEach(inject(function($rootScope, $compile) {
				scope = $rootScope.$new();

				element = $compile('<input date-picker-ui  date-changed-callback="onDateChanged" type="text" ng-model="filter.date" class="trades-filter-search" ng-focus="focus();" >')(scope);
				scope.$root.$digest();

				directiveScope = element.isolateScope();

			}));
			describe('The DatePicker directive', function() {
				it('should have a 36 character id', function() {
					expect(element.attr('id').length).toBe(36);
				});

			});
		});
	});
});