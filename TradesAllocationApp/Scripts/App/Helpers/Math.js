define(['underscore'], function(_) {
    'use strict';

    return {
        equalityOperators: {
            greaterThanOrEqualTo: ">=",
            greaterThan: ">",
            equalTo: "=",
            lessThan: "<",
            lessThanOrEqualTo: "<="
        },

        getOperatorLabel : function(equalityOperator) {
            switch (equalityOperator) {
                case this.equalityOperators.equalTo:
                    return "Equal to";
                case this.equalityOperators.lessThanOrEqualTo:
                    return "Less than or equal to";
                case this.equalityOperators.greaterThanOrEqualTo:
                    return "Greater than or equal to";
                default:
                    return null;
            }
        }
    };

});