 define(['angular', 'mocks', 'App/Directives/TradesFilter', 'underscore'], function(_) {
     'use strict';

     describe('TradesFilter directive', function() {
         var scope,
             element,
             directiveScope;

         beforeEach(module('App.services'));
         beforeEach(module('App.directives'));

         describe('The TradesFilter directive', function() {

             beforeEach(inject(function($rootScope, $compile) {
                 scope = $rootScope.$new();

                 scope.filter = {
                     options: [{
                         name: "BCA"
                     }, {
                         name: "BCAH"
                     }, {
                         name: "EMS"
                     }]
                 };

                 scope.filtersChangedCallback = function() {};

                 element = $compile('<div trades-filter filter="filter" filters-changed-callback="filtersChangedCallback" class="filter-container filter-container-service"/>')(scope);
                 scope.$root.$digest();
                 directiveScope = element.isolateScope();
             }));

             it('should load with the list closed', function() {
                 expect(directiveScope.isListOpen).toBe(false);
             });

             it('should load with the filterChanged property set to false', function() {
                 expect(directiveScope.isFilterChanged).toBe(false);
             });

             it('should load with the list of options unfiltered', function() {
                 expect(directiveScope.filteredListOfFilterOptions.length).toBe(directiveScope.filter.options.length);
             });

             describe('when opening the list', function() {
                 it('should set isOpen to true', function() {
                     directiveScope.openList();
                     expect(directiveScope.isListOpen).toBe(true);
                 });
             });
             describe('when closing the list', function() {
                 it('isOpen should be false', function() {
                     directiveScope.openList();
                     directiveScope.closeList();
                     expect(directiveScope.isListOpen).toBe(false);
                 });
             });

             describe('when toggling the list', function() {
                 it('should open and close the list', function() {
                     directiveScope.toggleFilterList();
                     expect(directiveScope.isListOpen).toBe(true);
                     directiveScope.toggleFilterList();
                     expect(directiveScope.isListOpen).toBe(false);
                 });
             });
             describe('when selecting an item in the list', function() {
                 beforeEach(function() {
                     spyOn(directiveScope, 'filtersChangedCallback');
                 });
                 it('should set its isSelected property to true and set isFilterChanged to true', function() {
                     var item = directiveScope.filteredListOfFilterOptions[0];
                     directiveScope.toggleSelect(item);
                     expect(item.isSelected).toBe(true);
                     expect(directiveScope.isFilterChanged).toBe(true);
                     expect(directiveScope.filtersChangedCallback).toHaveBeenCalled();
                 });
             });
             describe('when deselecting an item in the list', function() {
                 beforeEach(function() {
                     spyOn(directiveScope, 'filtersChangedCallback');
                 });
                 it('should set its isSelected property to false', function() {
                     var item = directiveScope.filteredListOfFilterOptions[0];
                     directiveScope.toggleSelect(item);
                     directiveScope.toggleSelect(item);
                     expect(item.isSelected).toBe(false);
                     expect(directiveScope.filtersChangedCallback).toHaveBeenCalled();
                 });
             });
             describe('when clearing selected items in the list', function() {
                 it('should have no items with isSelected property set to true', function() {
                     var item = directiveScope.filteredListOfFilterOptions[0];
                     directiveScope.toggleSelect(item);
                     directiveScope.clearSelections();

                     expect(directiveScope.filteredListOfFilterOptions[0].isSelected).toBe(false);
                     expect(directiveScope.filteredListOfFilterOptions[1].isSelected).toBe(false);
                     expect(directiveScope.filteredListOfFilterOptions[2].isSelected).toBe(false);
                 });
             });

             describe('when several items in the list are selected', function() {
                 it('getTooltipText should return appropriate text', function() {
                     directiveScope.toggleSelect(directiveScope.filteredListOfFilterOptions[0]);
                     directiveScope.toggleSelect(directiveScope.filteredListOfFilterOptions[2]);

                     expect(directiveScope.getTooltipText()).toBe("BCA,\nEMS");
                 });
             });

             describe('when hitting the Esc key', function() {
                 it('should close the list and the searchText property empty', function() {
                     directiveScope.openList();
                     directiveScope.searchKeydown({
                         'keyCode': 27
                     });

                     expect(directiveScope.isListOpen).toBe(false);
                     expect(directiveScope.searchText).toBe('');
                 });
             });
             describe('when an item is highlighted', function() {
                 describe('when hitting the Enter key', function() {
                     it('should select and deselect the highlighted item', function() {

                         directiveScope.indexOfHighlightedOption = 0;
                         directiveScope.setHighlightedOption();
                         directiveScope.searchKeydown({
                             'keyCode': 13
                         });
                         var item = directiveScope.filteredListOfFilterOptions[0];
                         expect(item.isSelected).toBe(true);

                         directiveScope.searchKeydown({
                             'keyCode': 13
                         });
                         expect(item.isSelected).toBe(false);
                     });
                 });
                 describe('when hitting the arrow up key', function() {
                     it('should highlight the previous item in the list', function() {
                         spyOn(directiveScope, 'scrollToFilterOption');
                         directiveScope.indexOfHighlightedOption = 1;
                         directiveScope.setHighlightedOption();
                         directiveScope.searchKeydown({
                             'keyCode': 38
                         });
                         var item = directiveScope.filteredListOfFilterOptions[0];
                         expect(item.isHighlighted).toBe(true);
                     });
                 });
                 describe('when hitting the arrow down key', function() {
                     it('should highlight the next item in the list', function() {
                         spyOn(directiveScope, 'scrollToFilterOption');
                         directiveScope.indexOfHighlightedOption = 1;
                         directiveScope.setHighlightedOption();
                         directiveScope.searchKeydown({
                             'keyCode': 40
                         });
                         var item = directiveScope.filteredListOfFilterOptions[2];
                         expect(item.isHighlighted).toBe(true);
                     });
                     describe('and the highlighted item is the last in the list', function() {
                         it('should highlight the last item in the list', function() {
                             spyOn(directiveScope, 'scrollToFilterOption');
                             directiveScope.indexOfHighlightedOption = 2;
                             directiveScope.setHighlightedOption();
                             directiveScope.searchKeydown({
                                 'keyCode': 40
                             });
                             var item = directiveScope.filteredListOfFilterOptions[2];
                             expect(item.isHighlighted).toBe(true);
                         });
                     });

                 });

                 describe('when the search text changes', function() {
                     it('should open the list', function() {
                         directiveScope.searchText = "a";
                         scope.$root.$digest();
                         expect(directiveScope.isListOpen).toBe(true);
                     });
                     describe('after the directive first loads', function() {
                         it('should filter the list and select the first visible item', function() {
                             directiveScope.searchText = "B";
                             scope.$root.$digest();

                             expect(directiveScope.filteredListOfFilterOptions.length).toBe(2);
                             expect(directiveScope.filteredListOfFilterOptions[0].isHighlighted).toBe(true);

                         });
                         describe('and the text case does not match that of the list item', function() {
                             it('should filter the list', function() {
                                 //subsequent change
                                 directiveScope.searchText = "b"; //wrong case

                                 scope.$root.$digest();
                                 expect(directiveScope.filteredListOfFilterOptions.length).toBe(2);
                             });
                         });
                     });

                 });
                 describe('the filterAction method', function() {
                     describe('when called with an empty searchText property', function() {
                         it('should return an unfiltered list', function() {
                             directiveScope.searchText = "";
                             directiveScope.filterAction(directiveScope);
                             expect(directiveScope.filteredListOfFilterOptions.length).toBe(3);
                         });
                     });
                     describe('when called with an non empty searchText property', function() {
                         it('should return a filtered list', function() {
                             directiveScope.searchText = "B";
                             directiveScope.filterAction(directiveScope);
                             expect(directiveScope.filteredListOfFilterOptions.length).toBe(2);
                         });
                     });
                 });
             });
         });
     });
 });