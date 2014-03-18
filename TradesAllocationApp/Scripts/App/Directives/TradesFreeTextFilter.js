define(['angular', 'underscore', 'App/Helpers/String'], function(angular, _, string) {
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
                '<input title="{{getTooltipText()}}" id="{{column}}Filter" placeholder="{{buildPlaceholder()}}" type="text" ng-keydown="searchKeydown($event);" ng-model="searchText" class="trades-filter-search" ng-focus="focus();" >' +
                '<a title="{{getTooltipText()}}" class="trades-filter-open" href="javascript:void(0)" ng-click="toggleLists();"><i class="icon-filter"></i></a>' +
                '<a class="trades-filter-close btn btn-tiny bca-btn-red" href="javascript:void(0)" ng-click="clearSelections();" ng-show="filter.selected.length > 0""><i class="icon-remove"></i></a>' +
                '<div class="trade-filter-option-list-container">' +
                '<ul ng-if="isSelectedListOpen && filter.selected.length > 0" class="trade-filter-selected-list">' +
                '<li ng-class="" class="selected trade-filter-option-list-item" ng-repeat="selectedItem in filter.selected">' +
                '<a>{{selectedItem}}</a>' +
                '<i ng-click="removeSelectedItem(selectedItem)" class="icon-remove"/>' +
                '</li></ul>' +
                '<ul ng-if="isOptionListOpen && filteredListOfFilterOptions.length > 0" class="trade-filter-option-list">' +
                '<li id ="{{stripIllegalHtmlAttributeCharacters(filterOption.name)}}" ng-click="selectOption(filterOption)" ng-class="{selected:filterOption.isSelected, highlighted:filterOption.isHighlighted}" class="trade-filter-option-list-item" ng-repeat="filterOption in filteredListOfFilterOptions">' +
                '<a>{{filterOption.label || filterOption.name}}</a>' +
                '<i ng-show="filterOption.isSelected" class="icon-remove"/>' +
                '</li></ul>' +
                '</div></div>',

            link: function(scope, element, attrs) {
                scope.isSelectedListOpen = false;
                scope.isOptionListOpen = false;
                scope.searchText = '';
                scope.indexOfHighlightedOption = null;
                //used when data is passed in preloaded - for async data loading, see the tradesLookupDataLoaded event handler
                scope.filteredListOfFilterOptions = scope.filter && scope.filter.options;

                var firstWatch = true;

                //opens and closes the list
                scope.toggleLists = function() {
                    if (scope.isSelectedListOpen) {
                        scope.closeSelectedList();
                        scope.closeOptionList();
                    } else {
                        $rootScope.$broadcast(_TOGGLING_TRADE_FILTER_);
                        scope.openSelectedList();
                        scope.openOptionList();
                    }
                };

                scope.removeSelectedItem = function(text) {
                    scope.filter.selected = _.reject(scope.filter.selected, function(item) {
                        return item === text;
                    });
                    scope.filtersChanged();
                };
                scope.addSelectedItem = function(text, isSelectedFromList) {
                    text = string.trim(text);

                    if (text === '') {
                        return;
                    }

                    var hasAddedItem = false;

                    //default is false
                    if (isSelectedFromList !== true) {
                        isSelectedFromList = false;
                    }

                    if (isSelectedFromList) {
                        if (!scope.hasSelectedItem(text)) {
                            scope.filter.selected.push(text);
                            hasAddedItem = true;
                        }

                    } else {
                        var parts = text.split(" ");
                        _.each(parts, function(part) {
                            if (!scope.hasSelectedItem(part)) {
                                scope.filter.selected.push(part);

                                hasAddedItem = true;
                            }
                        });
                    }

                    if (hasAddedItem) {
                        scope.searchText = '';

                        scrollToTopOfFilterOptionsList();
                        scope.clearHighlightedOptions();
                        scope.filtersChanged();
                    }

                };

                scope.hasSelectedItem = function(text) {
                    var item = _.find(scope.filter.selected, function(item) {
                        return item.toLowerCase() === text.toLowerCase();
                    });
                    return ( !! item);
                };

                scope.getTooltipText = function() {
                    if (!scope.filter || !scope.filter.selected || scope.filter.selected.length === 0) {
                        return "";
                    }
                    return scope.filter.selected.join(",\n").toUpperCase();
                };

                scope.buildPlaceholder = function() {

                    if (!scope.filter || !scope.filter.selected) {
                        return "Filter";
                    }

                    if (scope.filter.selected.length > 1) {
                        return "Multiple";
                    } else if (scope.filter.selected.length === 1) {
                        return scope.filter.selected[0];
                    } else {
                        return "Filter";
                    }
                };

                $rootScope.$on(_TOGGLING_TRADE_FILTER_, function(event, e) {
                    scope.closeSelectedList();
                    scope.closeOptionList();
                });
                $rootScope.$on(_CLEARING_TRADE_FILTER_, function (event, e) {
                    scope.closeSelectedList();
                    scope.closeOptionList();
                });

                $rootScope.$on(_TRADES_LOOKUP_DATA_LOADED_, function (event, e) {
                    if (scope.filter.options.length > 0) {
                        scope.filteredListOfFilterOptions = scope.filter.options;
                    }
                });


                scope.focus = function() {
                    $rootScope.$broadcast(_TOGGLING_TRADE_FILTER_);
                    scope.openSelectedList();
                    scope.openOptionList();
                };

                scope.openSelectedList = function() {
                    if (!scope.isSelectedListOpen) {
                        scope.isSelectedListOpen = true;
                    }
                };

                scope.closeSelectedList = function() {
                    if (scope.isSelectedListOpen) {
                        scope.isSelectedListOpen = false;
                        scope.searchText = '';
                    }
                };

                scope.clearSelections = function() {
                    $rootScope.$broadcast(_CLEARING_TRADE_FILTER_);
                    scope.filter.selected = [];
                    scope.filtersChanged();
                };

                scope.filtersChanged = function() {
                    scope.filtersChangedCallback();
                };


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
                        scope.clearHighlightedOptions();
                        if (scope.indexOfHighlightedOption >= 0) {
                            scope.filteredListOfFilterOptions[scope.indexOfHighlightedOption].isHighlighted = true;
                        }
                    }
                };

                scope.clearHighlightedOptions = function() {
                    _.each(scope.filteredListOfFilterOptions, function(item) {
                        item.isHighlighted = false;
                    });
                };

                scope.openOptionList = function() {

                    if (!scope.isOptionListOpen) {
                        scope.isOptionListOpen = true;
                    }
                };

                scope.closeOptionList = function() {
                    if (scope.isOptionListOpen) {
                        scope.isOptionListOpen = false;
                    }
                };

                scope.selectOption = function(filterOption) {
                    scope.addSelectedItem(filterOption.name, true);
                    scope.filtersChanged();
                };

                //no idea why we need scope as an argument to filterAction,filterDelayed etc - it doesn't seem to work without them
                //public for unit test purposes                
                scope.filterAction = function(scope) {

                    if (_.isEmpty(scope.searchText)) {
                        scope.filteredListOfFilterOptions = scope.filter.options;
                        scope.clearHighlightedOptions();
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

                //pattern described at http://csharperimage.jeremylikness.com/2013/10/throttling-input-in-angularjs.html
                var filterDelayed = function(scope) {
                    scope.$apply(function() {
                        scope.filterAction(scope);
                    });
                };

                var filterThrottled = _.debounce(filterDelayed, 500);

                var scrollToTopOfFilterOptionsList = function() {
                    var optionList = $(element).find('.trade-filter-option-list');
                    optionList.scrollTop(0);
                    scope.indexOfHighlightedOption = null;
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

                scope.stripIllegalHtmlAttributeCharacters = function(text) {
                    return string.stripIllegalHtmlAttributeCharacters(text);
                };

                //**********************events

                $(document.body).on('click', function() {
                    scope.$apply(function() {
                        scope.closeOptionList();
                        scope.closeSelectedList();
                    });
                });

                //NB this actually runs on first loading - we don't want the list to open then
                //but we do want it to be open when people are typing - this is possible: if they hit Esc, the text box still has focus 
                scope.$watch('searchText', function() {

                    if (firstWatch) {
                        firstWatch = false;
                        return;
                    }

                    if (!_.isEmpty(scope.searchText)) {
                        scope.openSelectedList();
                        scope.openOptionList();
                    }
                    scope.filterAction(scope);
                });

                scope.$watch('filter.selected', function() {
                    scope.filter = scope.filter || {};
                    scope.filter.selected = scope.filter.selected || [];
                });

                scope.searchKeydown = function($event) {
                    var keyCode = $event.keyCode;
                    var filterOption;

                    switch (keyCode) {
                        case 27: //Esc
                            scope.closeOptionList();
                            scope.closeSelectedList();
                            scope.searchText = '';
                            break;
                        case 13: //Enter
                            if (scope.indexOfHighlightedOption !== null) {
                                scope.selectOption(scope.filteredListOfFilterOptions[scope.indexOfHighlightedOption]);
                            } else {
                                scope.searchText = scope.searchText.replace(/["']/g, "");
                                scope.addSelectedItem(scope.searchText);
                            }
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