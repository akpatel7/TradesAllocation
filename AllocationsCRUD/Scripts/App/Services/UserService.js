define(['angular', 'underscore', 'moment'], function(angular, _, moment) {
    'use strict';

    var service = function($q, DataEndpoint, $http) {
        var cachedCurrentUser;

        return {
            getCurrentUser: function() {
                var deferred = $q.defer();
                if (cachedCurrentUser !== undefined) {
                    deferred.resolve(cachedCurrentUser);
                } else {
                    DataEndpoint.getEndpoint(['users', 'current-user'], [])
                        .then(function(result) {
                            DataEndpoint.followEndpoint(result)
                                .then(function(data) {
                                    if (!_.isArray(data.user.account.accessTokens.token)) {
                                        data.user.account.accessTokens.token = [data.user.account.accessTokens.token];
                                    }
                                    cachedCurrentUser = data.user;
                                    deferred.resolve(data.user);
                                });
                        });
                }
                return deferred.promise;
            },

            isCurrentUserAuthorisedToSeeCharts: function() {
                var deferred = $q.defer();

                this.getCurrentUser()
                    .then(function(userData) {
                        var result = false,
                            chartToken = _.find(userData.account.accessTokens.token, function (token) {
                            return token._product === 'CHART';
                        });
                        if (chartToken) {
                            if (moment(chartToken._expires).valueOf() > moment().valueOf()) {
                                result = true;
                            }
                        }
                        deferred.resolve(result);
                    });

                return deferred.promise;
            },

            getCurrentUsersGroupMembers: function() {
                var deferred = $q.defer();
                this.getCurrentUser().then(function(user) {
                    var groupId;
                    if (_.isArray(user.groups)) {
                        groupId = _.first(user.groups).group._id;
                    } else {
                        groupId = user.groups.group._id;
                    }

                    DataEndpoint.getTemplatedEndpoint('group-members', [{ key: 'id', value: groupId }])
                        .then(function(url) {
                            $http.get(url).success(function(data) {
                                deferred.resolve(_.isArray(data.users.user) ? data.users.user : [].concat(data.users.user));
                            });
                        });
                });
                return deferred.promise;
            }
            
        };

    };
   

    service.$inject = ['$q', 'DataEndpoint', '$http'];
    return service;
});