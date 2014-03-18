define(['underscore'], function (_) {
    'use strict';

    return {
        makeRoutesCaseInsensitive: function (routeParams, path, search, paths) {
            if (_.contains(paths, path.toLowerCase())) {
                return path.toLowerCase();
            } else {
                return '/home';
            }
        }
    };

});