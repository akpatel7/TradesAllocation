define([
        'angular',
        'underscore',
        'jquery',
        'webtrends'
], function (angular, _, $) {
    'use strict';
    // Resource: http://help.webtrends.com/en/jstag/tracking_mulitrack_advanced.html
    var analytics = function ($window, $location, UserService) {
        var user;
        UserService.getCurrentUser()
            .then(function (data) {
                user = data._id;
            });
        return {
            _getHostName: function () {
                return $location.$$host;
            },
            _getPage: function () {
                return $location.$$path;
            },
            _getCurrentUser: function () {
                return user;
            },
            logUsage: function (action, resourceUri, actionTargetUri, additionalTags) {
                if (action === undefined || action === null) {
                    return;
                }
                // action: action performed - e.g. create, delete, export
                // resourceUri:  URI of API resource *on* which action is being performed (required), e.g. /users/current/annotations/{annotation-id}
                // actionTargetUri: URI of API resource *to* which action is being performed (optional), e.g. /charts/{chart-id}

                if (action.indexOf("DCSext.") < 0) {
                    action = "DCSext." + action;
                }

                var jsonString = '{"' + action + '"' + ':"1"}';
                var jsonObj = JSON.parse(jsonString);

                if (additionalTags == null) {
                    additionalTags = jsonObj;
                } else {
                    additionalTags = $.extend({}, additionalTags, jsonObj); //Append two JSON objects
                }
              
                var args = $.extend({
                    'DCSext.resource-uri': resourceUri,
                    'DCSext.action-target-uri': actionTargetUri,
                    'DCSext.dcssip': this._getHostName(),
                    'DCSext.em-user-id': this._getCurrentUser(),
                    'DCS.dcsuri': this._getPage()
                }, additionalTags);
                try {
                    $window.WebTrends.multiTrack({
                        args: args,
                        callback: function(a) {
                            // Callback functions are called after the data collection server has successfully recorded the event 
                            // or when a timeout event happens waiting for the collection server to respond. 
                        },
                        finish: function (dcsObject, mtrackObject) {
                            // Finish functions are transform functions that are called after the beacon request has been sent. 
                        
                            // Clear out variable assignement - variable assignmenents from the initial page load remain intact.
                            // Unless overridden, these variables are retained and used during each call to dcsMultiTrack
                            // Cf. https://tagbuilder.webtrends.com/help/eventtracking/dcsmultitrack.aspx
                           for (var v in dcsObject.DCSext) { 
                               dcsObject.DCSext[v] = '';
                           }
                        }
                    });
                } catch(e) {
                }
            },
            registerPageTrack: function (page) {
                this.logUsage('pageload', page);
            },
            registerClick: function (click, resource) {
                this.logUsage(click, resource);
            }
        };
    };

    analytics.$inject = ['$window', '$location', 'UserService'];
    return analytics;  
});