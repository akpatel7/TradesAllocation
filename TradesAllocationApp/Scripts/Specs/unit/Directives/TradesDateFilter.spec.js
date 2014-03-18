 define(['angular', 'underscore', 'App/Helpers/Math', 'mocks', 'App/Directives/TradesDateFilter'], function(angular, _, mathHelper) {
     'use strict';

     describe('TradesDateFilter directive', function() {
         var scope,
             element,
             directiveScope,
             testDate;

         beforeEach(module('App.services'));
         beforeEach(module('App.directives'));

         describe('The TradesDateFilter directive', function() {
             beforeEach(inject(function($rootScope, $compile) {
                 scope = $rootScope.$new();

                 scope.filters = {
                     "instruction_entry_date": {
                         isDate: true
                     }
                 };

                 element = $compile('<div id="StartDate" column="StartDate" trades-date-filter filter="filters.instruction_entry_date"  filters-changed-callback="onFiltersChanged" class="filter-container date-filter-container"/>')(scope);
                 scope.$root.$digest();
                 directiveScope = element.isolateScope();

                 directiveScope.filtersChangedCallback = function() {};
                 testDate = "Dec 31, 1975";

             }));

             it('should load with the equalityOptions set', function() {
                 expect(directiveScope.equalityOptions.length).toBe(3);
             });
             it('should load with the element set', function() {
                 expect(directiveScope.element).not.toBe(null);
             });
             it('should load with the default date and operator', function() {
                 expect(directiveScope.filter.date).toBe(null);
                 expect(directiveScope.filter.operator).toBe(mathHelper.equalityOperators.equalTo);
             });
             it('should load with date picker hidden ', function() {
                 expect(directiveScope.isShowingDatepicker).toBe(false);
             });

             describe('When openDatePicker is called', function() {
                 var eventTriggered;
                 beforeEach(function() {
                     eventTriggered = false;
                     scope.$on('trade:toggle-filter', function() {
                         eventTriggered = true;
                     });
                     directiveScope.openDatePicker();
                 });
                 it('should fire the openingTradeFilter event', function() {
                     expect(eventTriggered).toBe(true);
                 });
                 it('should set isShowingDatepicker to true', function() {
                     expect(directiveScope.isShowingDatepicker).toBe(true);
                 });
                 describe('When closeDatePicker is called', function() {
                     beforeEach(function() {
                         directiveScope.closeDatePicker();
                     });
                     it('should set isShowingDatepicker to false', function() {
                         expect(directiveScope.isShowingDatepicker).toBe(false);
                     });
                 });
             });

             describe('When onDateChanged is called', function() {
                 beforeEach(function() {
                     spyOn(directiveScope, 'filtersChanged');
                     directiveScope.onDateChanged(testDate);
                 });
                 it('should call filtersChanged', function() {
                     expect(directiveScope.filtersChanged).toHaveBeenCalled();
                 });
                 it('should set the filter date', function() {
                     expect(directiveScope.filter.date).toBe(testDate);
                 });
             });

             describe('When selectOperator is called', function() {
                 var selectedOption;
                 beforeEach(function() {
                     selectedOption = directiveScope.equalityOptions[1];
                     directiveScope.selectOperator(selectedOption);
                     spyOn(directiveScope, 'filtersChanged');
                 });
                 it('should set the filter operator', function() {
                     expect(directiveScope.filter.operator).toBe(selectedOption);
                 });
                 describe('Where the filter date is null', function() {
                     beforeEach(function() {
                         directiveScope.filter.date = null;
                         directiveScope.selectOperator(selectedOption);
                     });
                     it('should not call filtersChanged', function() {
                         expect(directiveScope.filtersChanged).not.toHaveBeenCalled();
                     });
                 });
                 describe('Where the filter date is not null', function() {
                     beforeEach(function() {
                         directiveScope.filter.date = testDate;
                         directiveScope.selectOperator(selectedOption);
                     });
                     it('should not call filtersChanged', function() {
                         expect(directiveScope.filtersChanged).toHaveBeenCalled();
                     });
                 });
             });
             describe('When clearSelections is called', function() {
                 beforeEach(function() {
                     spyOn(directiveScope, 'resetValues');
                     spyOn(directiveScope, 'closeDatePicker');
                     directiveScope.clearSelections();
                 });
                 it('should call resetValues', function() {
                     expect(directiveScope.resetValues).toHaveBeenCalled();
                 });
                 it('should call closeDatePicker', function() {
                     expect(directiveScope.closeDatePicker).toHaveBeenCalled();
                 });

                 describe('Where the filter date is not null', function() {
                     beforeEach(function() {
                         spyOn(directiveScope, 'filtersChanged');
                         directiveScope.filter.date = testDate;
                         directiveScope.clearSelections();
                     });
                     it('should call filtersChanged', function() {
                         expect(directiveScope.filtersChanged).toHaveBeenCalled();
                     });
                 });
                 describe('Where the filter date is null', function() {
                     beforeEach(function() {
                         spyOn(directiveScope, 'filtersChanged');
                         directiveScope.filter.date = null;
                         directiveScope.clearSelections();
                     });
                     it('should not call filtersChanged', function() {
                         expect(directiveScope.filtersChanged).not.toHaveBeenCalled();
                     });
                 });
             });
             describe('When resetValues is called', function() {
                 beforeEach(function() {
                     directiveScope.resetValues();
                 });
                 it('should have date and operator set to default values', function() {
                     expect(directiveScope.filter.date).toBe(null);
                     expect(directiveScope.filter.operator).toBe(directiveScope.equalityOptions[0]);
                     expect(directiveScope.operatorLabel).toBe("Equal to");
                 });
             });
             describe('When getTooltipText is called', function() {
                 beforeEach(function() {
                     directiveScope.resetValues();
                 });
                 describe('Where the filter date is not null', function() {
                     beforeEach(function() {
                         directiveScope.filter.date = testDate;
                     });
                     it('should return the filter date in upper case', function() {
                         expect(directiveScope.getTooltipText()).toBe("DEC 31, 1975");
                     });
                 });
                 describe('Where the filter date is null', function() {
                     beforeEach(function() {
                         directiveScope.filter.date = null;
                     });
                     it('should return an empty string', function() {
                         expect(directiveScope.getTooltipText()).toBe("");
                     });
                 });
             });

             describe('When filtersChanged is clicked', function() {
                 beforeEach(function() {
                     spyOn(directiveScope, 'filtersChangedCallback');
                     directiveScope.filtersChanged();
                 });
                 it('should call filtersChangedCallback', function() {
                     expect(directiveScope.filtersChangedCallback).toHaveBeenCalled();
                 });
             });
             describe('When the openingTradeFilter event is handled', function() {
                 beforeEach(function() {
                     spyOn(directiveScope, 'closeDatePicker');
                     scope.$root.$broadcast('trade:toggle-filter');
                     scope.$root.$digest();
                 });
                 it('should call closeDatePicker', function() {
                     expect(directiveScope.closeDatePicker).toHaveBeenCalled();
                 });
             });
             describe('When the page body is clicked', function() {
                 beforeEach(function() {
                     spyOn(directiveScope, 'closeDatePicker');
                     $('body').trigger('click');
                     scope.$root.$digest();
                 });
                 it('should call closeDatePicker', function() {
                     expect(directiveScope.closeDatePicker).toHaveBeenCalled();
                 });
             });
             describe('When syncWithDatepicker is called', function() {
                 beforeEach(function() {
                     directiveScope.syncWithDatepicker("1-1-1976");
                 });
                 it('should set filter date', function() {
                     expect(directiveScope.filter.date).toBe("Jan 1, 1976");
                 });
                 describe('with an invalid date argument', function() {
                     beforeEach(function() {
                         directiveScope.syncWithDatepicker("xxx");
                     });
                     it('should not set filter date', function() {
                         expect(directiveScope.filter.date).toBe("Jan 1, 1976");
                     });
                 });

             });
         });
     });
 });