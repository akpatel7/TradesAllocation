define(['angular', 'underscore', 'App/Helpers/Math', 'App/Helpers/Date'], function(angular, _, mathHelper, dateHelper) {
    'use strict';

    var directive = function ($rootScope, $filter, $timeout, _TOGGLING_TRADE_FILTER_, _SET_DATE_) {

        return {
            restrict: 'A',
            transclude: false,
            scope: {
                filter: '=',
                filtersChangedCallback: '='
            },
            template: '<div ng-click="$event.stopPropagation();">' +
                '<a href="javascript:void(0)" ng-click="openDatePicker()" ng-if="filter.date!=null" class="trade-date-filter-operator">{{filter.operator}}</a>' +
                '<input value="{{filter.date}}" ng-class="{ \'has-date\': filter.date!=null, \'two-char-operator\':filter.operator.length==2 }" title="{{getTooltipText()}}" placeholder="Filter" type="text" class="trades-filter-search" ng-focus="openDatePicker();" >' +
                '<a title="{{getTooltipText()}}" class="trades-filter-open" href="javascript:void(0)" ng-click="openDatePicker()"><i class="icon-filter"></i></a>' +
                '<a class="trades-filter-close btn btn-tiny btn-danger" href="javascript:void(0)" ng-click="clearSelections()" ng-if="filter.date!=null"><i class="icon-remove"></i></a>' +
                '<div class="datepicker-container" ng-if="isShowingDatepicker">' +
                '<ul class="trade-date-filter-operator-list">' +
                 '<li ng-class="{ \'selected\': isSelectedOperator(equalityOptions[0]) }"><a class="trade-date-filter-operator-list-item" href="javascript:void(0)" ng-click="selectOperator(equalityOptions[0])">Equals<i class="icon-remove pull-right"/></a></li>' +
                 '<li ng-class="{ \'selected\': isSelectedOperator(equalityOptions[1]) }"><a class="trade-date-filter-operator-list-item" href="javascript:void(0)" ng-click="selectOperator(equalityOptions[1])">Less than or equals<i class="icon-remove pull-right"/></a></li>' +
                 '<li ng-class="{ \'selected\': isSelectedOperator(equalityOptions[2]) }"><a class="trade-date-filter-operator-list-item" href="javascript:void(0)" ng-click="selectOperator(equalityOptions[2])">Greater than or equals<i class="icon-remove pull-right"/></a></li>' +
                '</ul><hr>' +
                '<div date-picker-ui date-changed-callback="onDateChanged" ng-model="filter.date"/></div>' +
                '</div>' +
                '</div>',

            link: function(scope, element, attrs) {

                scope.element = element;
                scope.equalityOptions = [mathHelper.equalityOperators.equalTo, mathHelper.equalityOperators.lessThanOrEqualTo, mathHelper.equalityOperators.greaterThanOrEqualTo];
                scope.isShowingDatepicker = false;

                scope.filter.date = null;
                scope.filter.operator = scope.equalityOptions[0];

                var firstWatch = true;

                scope.onDateChanged = function(newDate) {
                    scope.filter.date = newDate;
                    scope.filtersChanged();
                };

                scope.openDatePicker = function() {
                    $rootScope.$broadcast(_TOGGLING_TRADE_FILTER_);

                    scope.element.find('input')[0].focus();
                    scope.isShowingDatepicker = true;

                };
                scope.closeDatePicker = function() {
                    scope.isShowingDatepicker = false;
                };

                scope.selectOperator = function(option) {
                    scope.filter.operator = option;
                    if (scope.filter.date != null) {
                        scope.filtersChanged();
                    }
                };

                scope.getOperatorLabel = function() {
                    return mathHelper.getOperatorLabel(scope.filter.operator);
                };

                scope.clearSelections = function() {
                    var wasNull = (scope.filter.date == null);
                    scope.resetValues();
                    scope.closeDatePicker();
                    if (!wasNull) {
                        scope.filtersChanged();
                    }
                };

                scope.resetValues = function() {
                    scope.filter.date = null;
                    scope.filter.operator = scope.equalityOptions[0];
                    scope.operatorLabel = scope.getOperatorLabel();
                };

                scope.getTooltipText = function() {
                    if (scope.filter.date !== null) {
                        return scope.filter.date.toUpperCase();
                    }
                    return "";
                };

                scope.filtersChanged = function() {
                    scope.filtersChangedCallback();
                };

                scope.isSelectedOperator = function(operator) {
                    return scope.filter.operator === operator;
                };

                scope.syncWithDatepicker = function(dateText) {
                    var date = dateHelper.getDateFromString(dateText);

                    //invalid dates get caught here
                    if (isNaN(date.getDate())) {
                        return;
                    }

                    scope.$apply(function() {
                        scope.filter.date = dateHelper.getDateStringForDisplay(date);
                    });

                    scope.$broadcast(_SET_DATE_, date);
                };


                //**********************init

                scope.resetValues();

                //**********************events

                $rootScope.$on(_TOGGLING_TRADE_FILTER_, function (event, e) {
                    scope.closeDatePicker();
                });

                $('body').on('click', function() {
                    scope.$apply(function() {
                        scope.closeDatePicker();
                    });
                });

                $timeout(function() {
                    //sync with the datepicker when date text is changed manually
                    $(element.find('input')).change(function(eventData) {
                        scope.syncWithDatepicker(eventData.currentTarget.value);
                    });

                }, 0);



            }
        };
    };
    directive.$inject = ['$rootScope', '$filter', '$timeout', '_TOGGLING_TRADE_FILTER_', '_SET_DATE_'];
    return directive;

});