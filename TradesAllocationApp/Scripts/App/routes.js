define([], function () {
    'use strict';

    return {
        defaultRoutePath: '/home',
        routes: {
            '/home': {
                action: 'home.default',
                title: 'My Dashboard',
                templateUrl: '/Templates/HouseViews/HouseViewWidget.html',
                controller: 'HouseViewsController'
            },
            '/views': {
                action: 'home.viewables',
                title: 'All Views',
                templateUrl: '/Templates/AllViews/AllViewsIndex.html',
                controller: 'BricksController'
            },
            '/themes': {
                action: 'home.themes',
                title: 'All Themes',
                templateUrl: '/Templates/Themes/Index.html',
                controller: 'BricksController'
            },
            '/research': {
                action: 'home.viewables.research',
                templateKey: 'research',
                title: 'Research Page',
                templateUrl: '/Templates/Research/Index.html',
                controller: 'ResearchController'
            },
            '/trades': {
                action: 'home.trades',
                templateKey: 'trades',
                title: 'Trades and Allocations',
                templateUrl: '/Templates/Trades/Index.html',
                controller: 'TradesController',
                reloadOnSearch: false
            },
            '/trade/:tradeId': {
                action: 'home.trade',
                templateKey: 'trade',
                title: 'Trade',
                templateUrl: '/Templates/Trades/Index.html',
                controller: 'TradesController',
                reloadOnSearch: false
            },
            '/linked-trades/:tradeId': {
                action: 'home.linked-trades',
                templateKey: 'linked-trades',
                title: 'Linked Trades',
                templateUrl: '/Templates/Trades/Index.html',
                controller: 'TradesController',
                reloadOnSearch: false
            },
            '/allocations': {
                action: 'home.allocations',
                templateKey: 'allocations',
                title: 'Allocations',
                templateUrl: '/Templates/Trades/Allocations.html',
                controller: 'AllocationsController',
                // lazy load allocations directive (eg. TreeGrid), so we dont load big libraries upfront
                dependencies: ['App/Directives/Allocations/lazyDirectives']
            },
            '/favourites': {
                action: 'mybca.favourites',
                title: 'My Favourites',
                templateUrl: '/Templates/AllViews/AllViewsIndex.html',
                controller: 'BricksController'
            },
            '/favourites/marketseconomies': {
                redirectTo: '/favourites'
            },
            '/favourites/themes': {
                action: 'mybca.favourites.themes',
                title: 'My Favourites',
                templateUrl: '/Templates/Themes/Index.html',
                controller: 'BricksController'
            },
            '/favourites/trades': {
                action: 'mybca.favourites.trades',
                title: 'My Favourites',
                templateUrl: '/Templates/Trades/Index.html',
                controller: 'TradesController',
                reloadOnSearch: false
            },
            '/favourites/allocations': {
                action: 'mybca.favourites.allocations',
                title: 'My Favourites',
                templateUrl: '/Templates/Trades/Allocations.html',
                controller: 'AllocationsController',
                // lazy load allocations directive (eg. TreeGrid), so we dont load big libraries upfront
                dependencies: ['App/Directives/Allocations/lazyDirectives']                
            },
             '/crud/allocations': {
            //action: 'home.allocations',
            title: 'Allocations CRUD',
            templateUrl: '/Templates/Trades/AllocationsCRUD.html',
            controller: 'AllocationsController',
            // lazy load allocations directive (eg. TreeGrid), so we dont load big libraries upfront
            dependencies: ['App/Directives/Allocations/lazyDirectives']                
    }
        }
    };

});
