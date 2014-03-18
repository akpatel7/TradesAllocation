define(['angular', 'underscore', 'App/Helpers/Math', 'App/Helpers/String', 'App/Helpers/Date'], function(angular, _, mathHelper, stringHelper, dateHelper) {
    'use strict';

    var service = function() {

        var anyIndex = 0;

        var odataFormatString = function(value) {
            return JSON.stringify(value)
                .replace(/"/g, "'")
                .replace("'false'", "false")
                .replace("'true'", "true");
        };

        var getContainsParametersFromFilterString = function(filterString, filterField) {
            var topLevel = getTopLevelContainsParameters(filterString, filterField);
            var subLevel = getSubLevelContainsParameters(filterString, filterField);

            return topLevel
                .concat(subLevel);
        };

        var getTopLevelContainsParameters = function(filterString, filterField) {
            //eg for top-level properties, indexof(instruction_label, '27') gt -1
            var reg = new RegExp("\\(indexof\\(" + filterField + ", (.*?)'\\) gt -1", "gi");
            return getContainsParameters(filterString, filterField, reg);
        };
        var getSubLevelContainsParameters = function(filterString, filterField) {
            //eg  TradeLines/any(_1TradeLines: indexof(_1TradeLines/tradable_thing_label, 'Copper') gt -1
            var reg = new RegExp(": indexof\\(_(.*?)" + filterField + ", (.*?)'\\) gt -1", "gi");
            return getContainsParameters(filterString, filterField, reg);
        };

        var getContainsParameters = function(filterString, filterField, pattern) {

            var matches = filterString.match(pattern);
            return _.map(matches, function(match) {
                return match
                    .replace(/(.*?)'/, '')
                    .replace(/'\) gt -1/, '')
                    .replace("'", "''"); //escape each single quote with another one
            });
        };

        //oDataEqualityOperator = le or ge
        var getNonEqualDateParameter = function(filterString, filterField, oDataEqualityOperator) {
            //eg "((instruction_exit_date lt datetime'2013-12-20'"))

            if (oDataEqualityOperator !== "le" && oDataEqualityOperator !== "ge") {
                throw "oDataEqualityOperator must be le or ge";
            }

            //if we do le, we're really doing lt on the day after
            var revisedODataEqualityOperator = (oDataEqualityOperator === "ge") ? "ge" : "lt";

            var pattern = new RegExp("\\(\\(" + filterField + " " + revisedODataEqualityOperator + " datetime'(.*?)'\\)\\)", "gi");
            var matches = filterString.match(pattern);

            if (!matches) {
                return null;
            }

            var dateString = matches[0]
                .replace(/(.*?)'/, '') //remove all before the first quote
           .replace(/'(.*)/, ''); //remove all after the first quote

            var date = dateHelper.getDateFromString(dateString);
            var operator;


            if (oDataEqualityOperator === "le") {
                date = dateHelper.addDays(date, -1);
                operator = mathHelper.equalityOperators.lessThanOrEqualTo;
            } else {
                //otherwise, it must be ge
                operator = mathHelper.equalityOperators.greaterThanOrEqualTo;
            }

            var convertedDateString = dateHelper.getDateStringForDisplay(date);

            var result = {
                date: convertedDateString,
                operator: operator
            };

            return result;

        };

        var getEqualDateParameter = function(filterString, filterField) {
            //eg "((instruction_exit_date ge datetime'2013-12-20'") and (instruction_exit_date lt datetime'2013-12-21'"))
            // var pattern = new RegExp("\(\(" + filterField + " ge datetime'(.*?)'\) and \(" + filterField + " lt datetime'(.*?)'\)\)", "gi");
            var pattern = new RegExp("\\(\\(" + filterField + " ge datetime'(.*?)'\\) and \\(" + filterField + " lt datetime'(.*?)'\\)\\)", "gi");
            var matches = filterString.match(pattern);

            if (!matches) {
                return null;
            }

            var dateString = matches[0]
                .replace(/(.*?)'/, '') //remove all before the first quote
            .replace(/'(.*)/, ''); //remove all after the first quote


            var date = dateHelper.getDateFromString(dateString);
            var convertedDateString = dateHelper.getDateStringForDisplay(date);

            var result = {
                date: convertedDateString,
                operator: mathHelper.equalityOperators.equalTo
            };

            return result;
        };


        var getDateParameterFromFilterString = function(filterString, filterField) {
            var result;
            result = getEqualDateParameter(filterString, filterField);

            if (!result) {
                result = getNonEqualDateParameter(filterString, filterField, 'ge');
            }
            if (!result) {
                result = getNonEqualDateParameter(filterString, filterField, 'le');
            }

            return result;
        };


        var createContainsFilterItem = function(field, value) {
            return {
                getQueryStringFragment: function() {
                    var parts = field.split('/');
                    if (parts.length === 1) {
                        return "(indexof(" + field + ", " + odataFormatString(value) + ") gt -1)";
                    } else {
                        anyIndex++; // variable names in any(x: x/field eq '...') expressions need to be unique across the whole expression for some reason
                        var childObjectName = parts[0];
                        var fieldName = parts[1];
                        return childObjectName + "/any(" + '_' + anyIndex + childObjectName + ": indexof(" + '_' + anyIndex + childObjectName + "/" +
                            fieldName + ", " + odataFormatString(value) + ") gt -1)";
                    }
                }
            };
        };

        var createEqualityFilterItem = function(field, value) {
            return {
                getQueryStringFragment: function() {
                    var parts = field.split('/');
                    if (parts.length === 1) {
                        return field + " eq " + odataFormatString(value);
                    } else {
                        anyIndex++; // variable names in any(x: x/field eq '...') expressions need to be unique across the whole expression for some reason
                        var childObjectName = parts[0];
                        var fieldName = parts[1];
                        return childObjectName + "/any(" + '_' + anyIndex + childObjectName + ": " + '_' + anyIndex + childObjectName + "/" +
                            fieldName + " eq " + odataFormatString(value) + ")";
                    }

                }
            };
        };

        var createDateFilterItem = function(field, date, operator) {
            return {
                getQueryStringFragment: function() {
                    date = dateHelper.getDateFromString(date);
                    var dayAfter = dateHelper.addDays(date, 1);

                    if (operator === mathHelper.equalityOperators.equalTo) {
                        //eg DateProperty+ge+datetime'2013-04-04' and DateProperty+lt+datetime'2013-04-05'                         
                        return "(" + field + " ge datetime'" + dateHelper.getDateString(date) + "') and (" + field + " lt datetime'" + dateHelper.getDateString(dayAfter) + "')";

                    } else if (operator === mathHelper.equalityOperators.greaterThanOrEqualTo) {
                        //eg DateProperty+ge+datetime'2013-04-04'
                        return "(" + field + " ge datetime'" + dateHelper.getDateString(date) + "')";

                    } else if (operator === mathHelper.equalityOperators.lessThanOrEqualTo) {
                        //eg DateProperty+lt+datetime'2013-04-05'                        
                        return "(" + field + " lt datetime'" + dateHelper.getDateString(dayAfter) + "')";
                    }
                    //none of the above
                    throw "Operator argument must be equalTo, lessThanOrEqualTo or greaterThanOrEqualTo";
                }
            };
        };



        var createFilterStringBuilder = function() {

            function Builder() {
                var filterItemArrays = [];

                this.addFilterItemArray = function(filterItemArray, isUsingAndOperatorInsteadOfNot) {

                    if (!_.isArray(filterItemArray)) {
                        throw "argument must be an array";
                    }

                    if (filterItemArray.length === 0) {
                        return this;
                    }

                    _.each(filterItemArray, function(filterItem) {
                        //check our arg has the right function
                        if (!_.isFunction(filterItem.getQueryStringFragment)) {
                            throw "argument must have a function called 'getQueryStringFragment'";
                        }
                    });

                    //the default is false - ie we use and instead of or. This suits the the (more common) non-free-text filter
                    if (isUsingAndOperatorInsteadOfNot !== true) {
                        isUsingAndOperatorInsteadOfNot = false;
                    }

                    var itemObject = {
                        'isUsingAndOperatorInsteadOfNot': isUsingAndOperatorInsteadOfNot,
                        'items': filterItemArray
                    };

                    filterItemArrays.push(itemObject);

                    //allow for chaining
                    return this;
                };

                //here we satisfy the requirements for the trades filter (https://jira.euromoneydigital.com/browse/TA-139)
                //ie we use OR within a group of filters, and AND between groups
                //if we want more flexibility, we might implement the specification pattern
                this.buildFilterString = function() {
                    //an example - "$filter=(myField eq 'abc' or myField eq 'cde') and (myNumericField eq 555 or indexof(myField, 'def') gt -1)"
                    anyIndex = 0;
                    var filter = "";
                    _.each(filterItemArrays, function(filterItemArray, index) {
                        var conjunction = index !== 0 ? " and " : "";
                        filter += conjunction + "(" + buildStringForFilterItemArray(filterItemArray) + ")";
                    });
                    return filter;
                };

                var buildStringForFilterItemArray = function(filterItemArray) {
                    var result = "";
                    var operator = filterItemArray.isUsingAndOperatorInsteadOfNot ? " and " : " or ";
                    _.each(filterItemArray.items, function(filterItem, index) {
                        var conjunction = index !== 0 ? operator : "";
                        result += conjunction + filterItem.getQueryStringFragment();
                    });
                    return result;
                };

            }
            return new Builder();

        };


        return {
            createContainsFilterItem: createContainsFilterItem,
            createEqualityFilterItem: createEqualityFilterItem,
            createDateFilterItem: createDateFilterItem,
            createFilterStringBuilder: createFilterStringBuilder,
            odataFormatString: odataFormatString,
            getContainsParametersFromFilterString: getContainsParametersFromFilterString,
            getDateParameterFromFilterString: getDateParameterFromFilterString
        };
    };

    service.$inject = [];
    return service;
});