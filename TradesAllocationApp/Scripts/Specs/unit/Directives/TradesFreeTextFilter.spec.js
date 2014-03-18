define(['angular','underscore', 'jquery', 'mocks', 'App/Directives/TradesFreeTextFilter' ], function(angular, _) {
     'use strict';

     describe('TradesFreeTextFilter directive', function() {
         var scope,
             element,
             directiveScope;

         beforeEach(module('App.services'));
         beforeEach(module('App.directives'));

         describe('The TradesFreeTextFilter directive', function() {

             beforeEach(inject(function($rootScope, $compile) {
                 scope = $rootScope.$new();

                 scope.filter = {
                     options: [{
                         name: "AB"
                     }, {
                         name: "BC"
                     }, {
                         name: "CD"
                     }]
                 };

                 scope.filtersChangedCallback = function() {};

                 element = $compile('<div trades-free-text-filter filter="filter" filters-changed-callback="filtersChangedCallback" class="filter-container"/>')(scope);

                 scope.$root.$digest();
                 directiveScope = element.isolateScope();
             }));

             it('should load with the list closed', function() {
                 expect(directiveScope.isSelectedListOpen).toBe(false);
             });

             it('should load with the searchText property set to empty', function() {
                 expect(directiveScope.searchText).toBe('');
             });
             it('should have filter.selected return an array', function() {
                 expect(_.isArray(directiveScope.filter.selected)).toBe(true);
             });

             describe('when opening the list', function() {

                 beforeEach(function() {
                     directiveScope.openSelectedList();
                 });

                 it('should set isOpen to true', function() {
                     expect(directiveScope.isSelectedListOpen).toBe(true);
                 });

                 describe('when closing the list', function() {
                     beforeEach(function() {
                         directiveScope.closeSelectedList();
                     });
                     it('isOpen should be false', function() {
                         expect(directiveScope.isSelectedListOpen).toBe(false);
                     });
                 });
             });


             describe('when toggling the selected list', function() {

                 beforeEach(function() {
                     directiveScope.toggleLists();
                 });

                 it('should open the list', function() {
                     expect(directiveScope.isSelectedListOpen).toBe(true);
                 });

                 describe('when toggling the list again', function() {
                     beforeEach(function() {
                         directiveScope.toggleLists();
                     });

                     it('should close the list', function() {
                         expect(directiveScope.isSelectedListOpen).toBe(false);
                     });
                 });
             });

             describe('when adding an item', function() {
                 var itemName;

                 beforeEach(function() {
                     itemName = "aTestItem";
                     directiveScope.searchText = itemName;
                     spyOn(directiveScope, 'filtersChanged').andCallThrough();
                     spyOn(directiveScope, 'filtersChangedCallback');
                 });

                 describe('by selecting it from the option list', function() {
                     beforeEach(function() {
                         directiveScope.selectOption(directiveScope.filteredListOfFilterOptions[0]);
                     });
                     it('should be selected', function() {
                         expect(directiveScope.hasSelectedItem(directiveScope.filteredListOfFilterOptions[0].name));
                     });
                 });

                 describe('where the searchText is not empty and the item is not already in the list', function() {
                     beforeEach(function() {
                         directiveScope.addSelectedItem(itemName);
                     });
                     it('should be in the selected property', function() {
                         expect(directiveScope.filter.selected.length).toBe(1);
                         expect(directiveScope.filter.selected[0]).toBe(itemName);
                     });
                     it('should call the filtersChanged method', function() {
                         expect(directiveScope.filtersChanged).toHaveBeenCalled();
                     });
                     it('should have hasSelectedItem return true for the item', function() {
                         expect(directiveScope.hasSelectedItem(itemName)).toBe(true);
                     });

                     describe('and then clearing the list of items', function() {
                         var eventTriggered;
                         beforeEach(function() {
                             eventTriggered = false;
                             scope.$on('trade:clear-filter', function() {
                                 eventTriggered = true;
                             });
                             directiveScope.clearSelections();
                         });
                         it('should have no selected items', function() {
                             expect(directiveScope.filter.selected.length).toBe(0);
                         });
                         it('should fire the clearingTradeFilter event', function() {
                             expect(eventTriggered).toBe(true);
                         });
                         it('should call the filtersChanged method', function() {
                             expect(directiveScope.filtersChanged.callCount).toBe(2);
                         });
                         it('should call the filtersChangedCallback method', function() {
                             expect(directiveScope.filtersChangedCallback).toHaveBeenCalled();
                         });
                     });
                 });
                 describe('where the item is an empty string', function() {
                     beforeEach(function() {
                         directiveScope.addSelectedItem('');
                     });
                     it('should not be in the selected property', function() {
                         expect(directiveScope.filter.selected.length).toBe(0);
                     });
                 });
                 describe('where the item contains multiple words', function() {
                     beforeEach(function() {
                         directiveScope.addSelectedItem('copper gold');
                     });
                     it('should have a selected item for each word', function() {
                         expect(directiveScope.filter.selected.length).toBe(2);
                     });
                     describe('where some of the words are already selected', function() {
                         beforeEach(function() {
                             directiveScope.addSelectedItem('silver gold');
                         });
                         it('should have a selected item for each word but with no duplicates', function() {
                             expect(directiveScope.filter.selected.length).toBe(3);
                         });
                     });
                 });
                 describe('where the item already exists in the selected list', function() {
                     beforeEach(function() {
                         directiveScope.filter.selected.push(itemName);
                         directiveScope.addSelectedItem(itemName);
                     });
                     it('should not be in the selected property', function() {
                         expect(directiveScope.filter.selected.length).toBe(1);
                     });
                     it('should not call the filtersChanged method', function() {
                         expect(directiveScope.filtersChanged).not.toHaveBeenCalled();
                     });
                 });
             });
             describe('when removing an item', function() {
                 var itemName;
                 beforeEach(function() {
                     itemName = "aTestItem";
                     spyOn(directiveScope, 'filtersChanged');
                     directiveScope.filter.selected.push(itemName);
                     directiveScope.removeSelectedItem(itemName);
                 });
                 it('should not be in the selected property', function() {
                     expect(directiveScope.filter.selected.length).toBe(0);
                 });
                 it('should call the filtersChanged method', function() {
                     expect(directiveScope.filtersChanged).toHaveBeenCalled();
                 });
                 it('should have hasSelectedItem return false for the item', function() {
                     expect(directiveScope.hasSelectedItem(itemName)).toBe(false);
                 });
             });

             describe('when setting tooltip text', function() {
                 describe('when no items are selected', function() {
                     it('should have empty tooltip text', function() {
                         expect(directiveScope.getTooltipText()).toBe("");
                     });
                 });
                 describe('when one item is selected', function() {
                     beforeEach(function() {
                         directiveScope.filter.selected.push("A1");
                     });
                     it('should have the item in the tooltip text', function() {
                         expect(directiveScope.getTooltipText()).toBe("A1");
                     });
                 });
                 describe('when several items are selected', function() {
                     beforeEach(function() {
                         directiveScope.filter.selected.push("A1");
                         directiveScope.filter.selected.push("A2");
                     });
                     it('should have each item in the tooltip text', function() {
                         expect(directiveScope.getTooltipText()).toBe("A1,\nA2");
                     });
                 });
             });
             describe('when setting placeholder text', function() {
                 describe('when no items are selected', function() {
                     it('should have default text', function() {
                         expect(directiveScope.buildPlaceholder()).toBe("Filter");
                     });
                 });
                 describe('when one item is selected', function() {
                     beforeEach(function() {
                         directiveScope.filter.selected.push("A1");
                     });
                     it('should have the item as the placeholder text', function() {
                         expect(directiveScope.buildPlaceholder()).toBe("A1");
                     });
                 });
                 describe('when several items are selected', function() {
                     beforeEach(function() {
                         directiveScope.filter.selected.push("A1");
                         directiveScope.filter.selected.push("A2");
                     });
                     it('should have the placeholder text set to multiple', function() {
                         expect(directiveScope.buildPlaceholder()).toBe("Multiple");
                     });
                 });
             });

             describe('when handling the openingTradeFilter event', function() {
                 beforeEach(function() {
                     spyOn(directiveScope, 'closeSelectedList');
                     scope.$root.$broadcast('trade:toggle-filter');
                     scope.$root.$digest();
                 });
                 it('should call closeSelectedList', function() {
                     expect(directiveScope.closeSelectedList).toHaveBeenCalled();
                 });
             });
             describe('when handling the clearingTradeFilter event', function() {
                 beforeEach(function() {
                     spyOn(directiveScope, 'closeSelectedList');
                     scope.$root.$broadcast('trade:clear-filter');
                     scope.$root.$digest();
                 });
                 it('should call closeSelectedList', function() {
                     expect(directiveScope.closeSelectedList).toHaveBeenCalled();
                 });
             });
             describe('when handling the tradesLookupDataLoaded event', function() {
                 beforeEach(function() {
                     scope.$root.$broadcast('trade:lookup-data-loaded');
                     scope.$root.$digest();
                 });
                 it('should have filteredListOfFilterOptions array filled', function() {
                     expect(directiveScope.filteredListOfFilterOptions.length).toBe(3);
                 });
             });
             describe('when the focus method is called', function() {
                 var eventTriggered;

                 beforeEach(function() {
                     spyOn(directiveScope, 'openSelectedList');
                     eventTriggered = false;
                     scope.$on('trade:toggle-filter', function() {
                         eventTriggered = true;
                     });

                     directiveScope.focus();
                 });
                 it('should fire the openingTradeFilter event', function() {
                     expect(eventTriggered).toBe(true);
                 });
                 it('should call openSelectedList', function() {
                     expect(directiveScope.openSelectedList).toHaveBeenCalled();
                 });
             });
             describe('when the body of the page is clicked on', function() {
                 beforeEach(function() {
                     $('body').trigger('click');
                     scope.$root.$digest();
                 });
                 it('should close the list', function() {
                     expect(directiveScope.isSelectedListOpen).toEqual(false);
                 });
             });
             describe('when the search text is changed', function() {
                 beforeEach(function() {
                     spyOn(directiveScope, 'openSelectedList');
                     spyOn(directiveScope, 'openOptionList');
                 });
                 describe('and the the search text is empty', function() {
                     beforeEach(function() {
                         directiveScope.searchText = '';
                         scope.$root.$digest();
                     });
                     it('should not open the list', function() {
                         expect(directiveScope.openSelectedList).not.toHaveBeenCalled();
                         expect(directiveScope.openOptionList).not.toHaveBeenCalled();
                     });
                 });
                 describe('and the the search text is not empty', function() {
                     beforeEach(function() {
                         directiveScope.searchText = 'abc';
                         scope.$root.$digest();
                     });
                     it('should open the list', function() {
                         expect(directiveScope.openSelectedList).toHaveBeenCalled();
                         expect(directiveScope.openOptionList).toHaveBeenCalled();
                     });
                 });
             });
             describe('when filterAction is called', function() {
                 beforeEach(function() {
                     spyOn(directiveScope, 'clearHighlightedOptions');
                     directiveScope.filterAction(directiveScope);
                 });
                 describe('and the the search text is not empty', function() {
                     it('should call clearHighlightedOptions', function() {
                         expect(directiveScope.clearHighlightedOptions).toHaveBeenCalled();
                     });
                     it('should have indexOfHighlightedOption set to null', function() {
                         expect(directiveScope.indexOfHighlightedOption).toBe(null);
                     });
                 });
             });
             describe('when the Enter key is pressed', function() {
                 beforeEach(function() {
                     spyOn(directiveScope, 'addSelectedItem');
                     directiveScope.searchKeydown({
                         'keyCode': 13
                     });
                 });
                 it('should call addSelectedItem', function() {
                     expect(directiveScope.addSelectedItem).toHaveBeenCalled();
                 });
             });
             describe('when the Esc key is pressed', function() {
                 beforeEach(function() {
                     spyOn(directiveScope, 'closeSelectedList');
                     directiveScope.searchKeydown({
                         'keyCode': 27
                     });
                 });
                 it('should call closeSelectedList', function() {
                     expect(directiveScope.closeSelectedList).toHaveBeenCalled();
                 });
                 it('should have empty searchText', function() {
                     expect(directiveScope.searchText).toBe('');
                 });
             });
             describe('when an item is highlighted', function() {
                 describe('when hitting the Enter key', function() {
                     var item;
                     beforeEach(function() {
                         directiveScope.indexOfHighlightedOption = 0;
                         directiveScope.setHighlightedOption();
                         directiveScope.searchKeydown({
                             'keyCode': 13
                         });
                         item = directiveScope.filteredListOfFilterOptions[0];
                     });
                     it('should de-highlight the item', function() {
                         expect(item.isHighlighted).toBe(false);
                     });
                     it('should select the item', function() {
                         expect(directiveScope.hasSelectedItem(item.name)).toBe(true);
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
                     describe('and highlighted items are cleared', function() {
                         beforeEach(function() {
                             directiveScope.clearHighlightedOptions();
                         });
                         it('no items should be highlighted', function() {
                             for (var i = 0; i < scope.filteredListOfFilterOptions; i++) {
                                 expect(scope.filteredListOfFilterOptions[i].isHighlighted).not.toBe(true);
                             }
                         });

                     });

                 });
             });

         });
     });
 });