define([], function () {
    'use strict';

    return {
        defaultRoutePath: '/allocations',
        routes: {
            '/allocations': {
                action: 'home.allocations',
                templateKey: 'allocations',
                title: 'Allocations',
                templateUrl: '/Templates/Trades/Allocations.html',
                controller: 'AllocationsController',
                // lazy load allocations directive (eg. TreeGrid), so we dont load big libraries upfront
                dependencies: ['App/Directives/Allocations/lazyDirectives']
            }
        }
    };

});