define(['angular', 'underscore', 'App/Helpers/String'], function(angular, _, stringHelper) {
    'use strict';

    var directive = function ($rootScope, _TOGGLING_TRADE_FILTER_, _CLEARING_TRADE_FILTER_, _TRADES_LOOKUP_DATA_LOADED_) {

        return {
            restrict: 'A',
            transclude: false,
            scope: {
                filter: '=',
                filtersChangedCallback: '=',
                column: '@'
            },
            template: '<div ng-click="$event.stopPropagation();">' +
                '<input title="{{getTooltipText()}}" id="{{column}}Filter" placeholder="{{placeholder}}" type="text" ng-keydown="searchKeydown($event);" ng-model="searchText" class="trades-filter-search" ng-focus="focus();" >' +
                '<a title="{{getTooltipText()}}" class="trades-filter-open" href="javascript:void(0)" ng-click="toggleFilterList();"><i class="icon-filter"></i></a>' +
                '<a class="trades-filter-close btn btn-tiny bca-btn-red" href="javascript:void(0)" ng-click="clearSelections();" ng-show="filter.selected && filter.selected.length > 0"><i class="icon-remove"></i></a>' +
                '<div class="trade-filter-option-list-container">' +
                '<ul ng-if="isListOpen && filteredListOfFilterOptions.length > 0" class="trade-filter-option-list">' +
                '<li id ="{{stripIllegalHtmlAttributeCharacters(filterOption.name)}}" ng-click="toggleSelect(filterOption)" ng-class="{selected:filterOption.isSelected, highlighted:filterOption.isHighlighted}" class="trade-filter-option-list-item" ng-repeat="filterOption in filteredListOfFilterOptions">' +
                '<a>{{filterOption.label || filterOption.name}}</a>' +
                '</li></ul></div></div>',

            link: function(scope, element, attrs) {
                scope.isFilterChanged = false;
                scope.isListOpen = false;
                scope.searchText = '';
                scope.indexOfHighlightedOption = null;

                //used when data is passed in preloaded - for async data loading, see the tradesLookupDataLoaded event handler
                scope.filteredListOfFilterOptions = scope.filter && scope.filter.options;

                var firstWatch = true;

                scope.placeholder = "Filter";

                $(document.body).on('click', function() {
                    scope.$apply(function() {
                        scope.closeList();
                    });
                });

                var incrementIndexOfHighlightedOption = function() {
                    //it'll be null before we hit an arrow key
                    if (scope.indexOfHighlightedOption === null) {
                        scope.indexOfHighlightedOption = 0;
                    } else {
                        //check we haven't reached the array bounds
                        if (scope.indexOfHighlightedOption >= scope.filteredListOfFilterOptions.length - 1) {
                            return;
                        }
                        scope.indexOfHighlightedOption++;
                    }
                };
                var decrementIndexOfHighlightedOption = function() {
                    if (scope.indexOfHighlightedOption <= -1) {
                        return;
                    }
                    scope.indexOfHighlightedOption--;

                };

                scope.setHighlightedOption = function() {
                    if (scope.filteredListOfFilterOptions.length > scope.indexOfHighlightedOption) {
                        clearHighlightedOptions();
                        if (scope.indexOfHighlightedOption >= 0) {
                            scope.filteredListOfFilterOptions[scope.indexOfHighlightedOption].isHighlighted = true;
                        }
                    }
                };

                var clearHighlightedOptions = function() {
                    _.each(scope.filteredListOfFilterOptions, function(item) {
                        item.isHighlighted = false;
                    });
                };

                var selectHighlightedOption = function() {
                    if (scope.indexOfHighlightedOption === null || scope.filteredListOfFilterOptions.length===0) {
                        return;
                    }
                    scope.toggleSelect(scope.filteredListOfFilterOptions[scope.indexOfHighlightedOption]);
                };

                //opens and closes the list of options
                scope.toggleFilterList = function() {
                    if (scope.isListOpen) {
                        scope.closeList();
                    } else {
                        $rootScope.$broadcast(_TOGGLING_TRADE_FILTER_);
                        scope.openList();
                    }
                };

                $rootScope.$on(_TOGGLING_TRADE_FILTER_, function(event, e) {
                    scope.closeList();
                });
                $rootScope.$on(_CLEARING_TRADE_FILTER_, function (event, e) {
                    scope.closeList();
                });

                $rootScope.$on(_TRADES_LOOKUP_DATA_LOADED_, function (event, e) {
                    if (scope.filter.options.length > 0) {
                        scope.filteredListOfFilterOptions = scope.filter.options;
                    }
                });

                scope.focus = function() {
                    $rootScope.$broadcast(_TOGGLING_TRADE_FILTER_);
                    scope.openList();
                };

                scope.openList = function() {
                    if (!scope.isListOpen) {
                        scope.isListOpen = true;
                    }
                };

                scope.closeList = function() {
                    if (scope.isListOpen) {
                        scope.isListOpen = false;
                        clearHighlightedOptions();
                        scope.searchText = '';
                    }
                };

                scope.toggleSelect = function(filterOption) {
                    if (filterOption.isSelected && filterOption.isSelected === true) {
                        filterOption.isSelected = false;
                    } else { //would be null at first, false later on
                        filterOption.isSelected = true;
                    }
                    scope.isFilterChanged = true;
                    scope.filtersChanged();
                };

                scope.clearSelections = function() {
                    $rootScope.$broadcast(_CLEARING_TRADE_FILTER_);

                    _.each(scope.filter.options, function(filterOption) {
                        filterOption.isSelected = false;
                    });
                    clearHighlightedOptions();
                    scope.indexOfHighlightedOption = null;
                    scope.filtersChanged();
                };

                //this just gets the values of selected items
                scope.selectedValues = function(field) {
                    field = field || 'name';
                    if (!scope.filter) {
                        return [];
                    }

                    var selectedItems = _.filter(scope.filter.options, function(i) {
                        return i.isSelected;
                    });
                    return _.map(selectedItems, function(o) {
                        return o[field];
                    });
                };

                //this gets the selected items themselves
                var getSelectedItems = function() {
                    var selectedItems = _.filter(scope.filter.options, function(i) {
                        return i.isSelected;
                    });
                    return selectedItems;
                };

                scope.getTooltipText = function() {
                    if (!scope.filter) {
                        return "";
                    }
                    //all items have .name, some have .label which we prefer to use
                    var items = _.map(getSelectedItems(), function(item) {
                        if ( !! item.label) {
                            return item.label;
                        }
                        return item.name;
                    });

                    return items.join(",\n").toUpperCase();
                };


                var buildPlaceholder = function() {
                    if (!scope.filter) {
                        return "Filter";
                    }

                    var selected = scope.selectedValues(scope.filter.placeholderField);
                    if (selected.length > 1) {
                        return "Multiple";
                    } else if (selected.length === 1) {
                        return selected[0];
                    } else {
                        return "Filter";
                    }
                };

                scope.filtersChanged = function() {
                    scope.placeholder = buildPlaceholder();
                    scope.filter.selected = scope.selectedValues();
                    scope.filtersChangedCallback();
                };

                scope.stripIllegalHtmlAttributeCharacters = function(text) {
                    //for some reason we need to convert to a string here, but not inthe free text filter
                    return stringHelper.stripIllegalHtmlAttributeCharacters(String(text));
                };

                scope.$watch('filter.selected', function() {
                    if (scope.filter) {
                        scope.filter.selected = scope.filter.selected || [];

                        _.each(scope.filter.options, function(option) {
                            option.isSelected = _.indexOf(scope.filter.selected, option.name) !== -1;
                        });
                    }
                    scope.placeholder = buildPlaceholder();
                });

                //no idea why we need scope as an argument to filterAction,filterDelayed etc - it doesn't seem to work without them
                //public for unit test purposes                
                scope.filterAction = function(scope) {

                    if (_.isEmpty(scope.searchText)) {
                        scope.filteredListOfFilterOptions = scope.filter.options;
                        clearHighlightedOptions();
                        //we also reset the index - so a down arrow will highlight the first item
                        scope.indexOfHighlightedOption = null;
                    } else {
                        var searchString = scope.searchText.toLowerCase();
                        scope.filteredListOfFilterOptions = _.filter(scope.filter.options, function(item) {
                            var listString = (item.label || item.name).toLowerCase();
                            return listString.indexOf(searchString) !== -1;
                        });
                    }
                };

                scope.scrollToFilterOption = function(filterOption) {
                    if (!filterOption) {
                        return;
                    }

                    var idSelector = "[id='" + scope.stripIllegalHtmlAttributeCharacters(filterOption.name) + "']";
                    var item = $(element).find(idSelector);
                    var list = item.closest(".trade-filter-option-list");
                    var listScrollTop = list.scrollTop();
                    var itemTop = item.position().top;
                    var bottomOffset = itemTop - (list.height() - item.height());

                    if (itemTop < 0) {
                        list.scrollTop(listScrollTop + itemTop - 4);
                    } else if (bottomOffset >= 0) {
                        list.scrollTop(listScrollTop + bottomOffset);
                    }
                };



                //**********************events

                //NB this actually runs on first loading - we don't want the list to open then
                //but we do want it to be open when people are typing - this is possible: if they hit Esc, the text box still has focus 
                scope.$watch('searchText', function() {
                    if (firstWatch) {
                        firstWatch = false;
                        return;
                    }
                    if (!scope.isListOpen && !_.isEmpty(scope.searchText)) {
                        scope.openList();
                    }

                    //if none are selected, select the first one
                    if (scope.indexOfHighlightedOption == null && scope.filteredListOfFilterOptions.length>0) {
                        incrementIndexOfHighlightedOption();
                        scope.setHighlightedOption();
                    }

                    scope.filterAction(scope);
                });

                scope.searchKeydown = function($event) {
                    var keyCode = $event.keyCode;
                    var filterOption;

                    switch (keyCode) {
                        case 27: //Esc
                            scope.closeList();
                            scope.searchText = '';
                            break;
                        case 13: //Enter
                            selectHighlightedOption();
                            break;
                        case 38: //Arrow up
                            decrementIndexOfHighlightedOption();
                            scope.setHighlightedOption();
                            filterOption = scope.filteredListOfFilterOptions[scope.indexOfHighlightedOption];
                            scope.scrollToFilterOption(filterOption);
                            break;
                        case 40: //Arrow down
                            incrementIndexOfHighlightedOption();
                            scope.setHighlightedOption();
                            filterOption = scope.filteredListOfFilterOptions[scope.indexOfHighlightedOption];
                            scope.scrollToFilterOption(filterOption);

                            break;
                        default:
                            //do nothing
                    }
                };

            }
        };
    };
    directive.$inject = ['$rootScope', '_TOGGLING_TRADE_FILTER_', '_CLEARING_TRADE_FILTER_', '_TRADES_LOOKUP_DATA_LOADED_'];
    return directive;

});