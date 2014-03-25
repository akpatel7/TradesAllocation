define(['angular', 'underscore', 'App/Helpers/String', 'moment'], function(angular, _, stringHelper, moment) {
    'use strict';

    return {

        monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],

        getDateFromString: function(dateString) {
            return moment(dateString).toDate();
        },
        getDateString: function(date) {
            //returns format 2103-02-09
            var month = date.getMonth() + 1; //0-based index
            return date.getFullYear() + "-" + stringHelper.padDigits(month, 2) + "-" + stringHelper.padDigits(date.getDate(), 2);
        },
        getDateStringForDisplay: function(date) {
            //returns format Dec 20, 2013
            var monthName = this.monthNames[date.getMonth(date)];
            var result = monthName + " " + date.getDate() + ", " + date.getFullYear();
            return result;
        },
        addDays: function(date, noOfDays) {
            var result = new Date(date);
            result.setDate(date.getDate() + noOfDays);
            return result;
        }
    };

});