define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var service = function (Perspectives, $q, PerspectiveBuilder, Notifications) {

        function trimAngleBrackets(uri) {
            if (uri[0] === '<') {
                return uri.slice(1, -1);
            }
            return uri;
        }

        return {
            _followSomething: function (endpoint, o) {
                var deferred = $q.defer(),
                    options = {
                        enableNotification: true
                    };
                
                _.extend(options, o);

                if (!options.uri) {
                    deferred.reject('No uri provided.');
                } else {
                    endpoint('follow', trimAngleBrackets(options.uri))
                        .then(function(data) {
                            Perspectives.post(data).then(function(result) {
                                if (options.enableNotification) {
                                    Notifications.success('"' + options.label + '" is now being followed.');
                                }

                                deferred.resolve(result);
                            });
                        });
                }
                return deferred.promise;
            },
            _unfollowSomething: function (o) {
                var deferred = $q.defer(),
                    options = {
                        enableNotification: true
                    };

                _.extend(options, o);
                if (!options.perspectiveId) {
                    deferred.reject('No uri provided.');
                } else {
                    Perspectives.remove(options.perspectiveId).then(function(data) {
                        if (options.enableNotification) {
                            Notifications.success('"' + options.label + '" is no longer being followed.');
                        }

                        deferred.resolve(true);
                    });
                }
                return deferred.promise;
            },
            followAllocation: function (options) {
                return this._followSomething(PerspectiveBuilder.buildAllocationPerspective, options);
            },
            unfollowAllocation: function (options) {
                return this._unfollowSomething(options);
            },
            followAllocationInstrument: function (options) {
                return this._followSomething(PerspectiveBuilder.buildTradableThingPerspective, options);
            },
            unfollowAllocationInstrument: function (options) {
                return this._unfollowSomething(options);
            },
            followPortfolio: function (options) {
                return this._followSomething(PerspectiveBuilder.buildPortfolioPerspective, options);
            },
            unfollowPortfolio: function (options) {
                return this._unfollowSomething(options);
            }
        };
    };

    service.$inject = ['Perspectives', '$q', 'PerspectiveBuilder', 'Notifications'];
    return service;
});