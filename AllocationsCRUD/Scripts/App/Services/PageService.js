define(['angular', 'underscore'], function(angular, _) {
    'use strict';

    var service = function($rootScope) {
        var defaultTitle = 'BCA DNA',
            title = defaultTitle,
            breadcrumbs = [],
            deferred,
            breadcrumbMap = {
                'home': { name: 'My Dashboard', url: '/' },
                'viewables': { name: 'Views', url: '/views' },
                'mybca': { name: 'My BCA', url: '/' },
                'favourites': { name: 'Favourites', url: '/favourites' },
                'themes': { name: 'Themes', url: '/themes' },
                'trades': { name: 'Trades', url: '#/trades' },
                'research': {},
                'alert-settings': { name: 'Alert Settings', url: '/alerts/settings' },
                'alert-history': { name: 'Alert History', url: '/alerts/history' },
                'trade': { name: 'Trade', url: '/trade/:tradeId' },
                'linked-trades': { name: 'Linked Trades', url: '/linked-trade/:tradeId' },
                'allocations': { name: 'Allocations', url: '/allocations' }
            };

        function createBreadcrumb(path) {
            var results = _.map(path, function(item) {
                return {
                    name: breadcrumbMap[item].name,
                    link: breadcrumbMap[item].url
                };
            });

            var lastItem = _.last(results);
            if (lastItem) {
                lastItem.link = null;
                lastItem.style = '';
            }

            return results;
        }

        function getBreadcrumbs(action) {
            var renderPath = action.split('.');
            if (renderPath.length > 1 && renderPath[1] !== 'default' && breadcrumbMap.hasOwnProperty(renderPath[1])) {
                // Render only if path is from more than 1 key
                breadcrumbs = createBreadcrumb(renderPath);
            } else {
                breadcrumbs = [];
                deferred = null;
            }

            return breadcrumbs;
        }

        function setLastBreadcrumbs(newBreadcrumbs, replace) {
            if (breadcrumbs && newBreadcrumbs) {
                if (replace) {
                    breadcrumbs.pop();
                }
                breadcrumbs.push.apply(breadcrumbs, newBreadcrumbs);
            }
        }
        
        function getCurrentBreadcrumbs() {
            return breadcrumbs;
        }

        $rootScope.$on('$routeChangeSuccess', function() {
            title = defaultTitle;
        });

        return {
            getTitle: function() { return title; },
            setTitle: function(newTitle) {
                (_.last(breadcrumbs) || {}).name = newTitle;
                title = newTitle;
            },
            resetTitle: function() { title = defaultTitle; },
            setLastBreadcrumbs: setLastBreadcrumbs,
            getBreadcrumbs: getBreadcrumbs,
            getCurrentBreadcrumbs: getCurrentBreadcrumbs
        };
    };

    service.$inject = ['$rootScope'];
    return service;
});