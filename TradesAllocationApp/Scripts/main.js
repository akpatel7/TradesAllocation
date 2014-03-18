requirejs.config({

    paths: {
        underscore: 'Lib/underscore/underscore',
        angular: 'Lib/angular/angular',
        resource: 'Lib/angular-resource/angular-resource',
        cookies: 'Lib/angular-cookies/angular-cookies',
        route: 'Lib/angular-route/angular-route',
        nezasa: 'Lib/nezasa/iso8601',
        moment: 'Lib/momentjs/moment',
        jquery: 'Lib/jquery/jquery',
        bootstrap: 'Lib/bootstrap/bootstrap',
        typeahead: 'Lib/jquery/jquery.autoSuggest',
        'angular-strap': 'Lib/angular-strap/dist/angular-strap',
        'jquery-ui': 'Lib/jquery-ui/ui/jquery-ui',
        'jquery-topnavigation': 'Lib/jquery.topnavigation/jquery.topnavigation',
        'jquery-scrollTo': 'Lib/jquery.scrollTo/jquery.scrollTo',
        'webtrends': 'Lib/webtrends/webtrends.load',
        'infinite-scroll': 'Lib/ngInfiniteScroll/ng-infinite-scroll',
        'ui-bootstrap': 'Lib/angular-bootstrap/ui-bootstrap',
        'global-search': 'Lib/BcaResearch.GlobalSearch/GlobalSearch',
        base64: 'Lib/base64/base64',
        'highcharts-fix': 'Lib/highchart/highcharts-fix1686',
        'highcharts-exporting': 'Lib/highstock/js/modules/exporting.src',
        highstock: 'Lib/highstock/js/highstock.src',
        'highcharts-more': 'Lib/highstock/js/highcharts-more.src',
        'bootstrap-switch': 'Lib/bootstrap-switch/bootstrap-switch',
        'angular-bootstrap-switch': 'Lib/angular-bootstrap-switch/angular-bootstrap-switch',
        stickyTableHeaders: 'Lib/stickyTableHeaders/jquery.stickytableheaders',
        'math.uuid': 'Lib/math.uuid/math.uuid',
        'amplify': 'Lib/amplify/amplify.min',
        'ui-sortable': 'Lib/angular-ui-sortable/sortable',
        'doc-ready': 'Lib/doc-ready',
        eventEmitter: 'Lib/eventEmitter',
        eventie: 'Lib/eventie',
        'get-style-property': 'Lib/get-style-property',
        'get-size': 'Masonry/get-size',
        'matches-selector': 'Lib/matches-selector',
        outlayer: 'Lib/outlayer',
        masonry: 'Lib/masonry/masonry',
        'jquery-bridget': 'Lib/jquery-bridget/jquery.bridget',
        TreeGrid: 'Lib/TreeGrid/GridE',
        'highcharts': 'App/highcharts'
    },

    shim: {        
        'masonry': {
            deps: ['jquery-bridget']
        },
        underscore: {
            exports: '_'
        },
        'angular': {
            deps: ['jquery'],
            exports: 'angular'
        },
        'resource': {
            deps: ['angular']
        },
        'cookies': {
            deps: ['angular']
        },
        'route': {
            deps: ['angular']
        },
        'nezasa': {
            exports: 'nezasa'
        },
        'base64': {
            exports: 'base64'
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'angular-strap': {
            deps: ['jquery-ui', 'angular', 'bootstrap']
        },
        'jquery': {
            exports: 'jquery'    
        },
        'jquery-ui': {
            deps: ['jquery']
        },
        'jquery-topnavigation': {
            deps: ['jquery-ui', 'bootstrap']
        },
        'jquery-scrollTo': {
            deps: ['jquery']
        },
        'infinite-scroll': {
            deps: ['angular']
        },
        'ui-bootstrap': {
            deps: ['angular']
        },
        webtrends: {
            exports: 'webtrends'
        },
        'global-search': {
            deps: ['jquery']
        },
        highstock: {
            deps: ['jquery-ui']
        },
        'highcharts-fix': {
            deps: ['highstock']
        },
        'highcharts-exporting': {
            deps: ['highstock']
        },
        'highcharts-more': {
            deps: ['highstock']
        },
        'bootstrap-switch': {
            deps: ['jquery']
        },
        'angular-bootstrap-switch': {
            deps: ['bootstrap-switch', 'angular']
        },
        stickyTableHeaders: {
            deps: ['jquery']
        },
        amplify: {
            deps: ['jquery'],
            exports: 'amplify'
        },
        'jquery-bridget': {
            deps: ['jquery']  
        },
        'ui-sortable': {
            deps: ['angular']
        },
        TreeGrid: {
            exports: 'TreeGrid'
        }
    },
    priority: [
        ['jquery', 'angular', 'bootstrap']
    ],
    waitSeconds: 30
});

requirejs(['Lib/jquery/jquery',
        'jquery-bridget',
        'masonry',
        'angular',
        'resource',
        'cookies',
        'route',
        'App/app',
        'underscore',
        'App/routes',
        'App/Services/services',
        'App/Providers/providers',
        'App/Directives/directives',
        'App/Filters/filters',
        'App/Controllers/controllers',
        'App/TopNavigation',
        'webtrends',
        'global-search',
        'Masonry/outlayer/item'
], function($, bridget, masonry, angular) {
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['App']);
    });

});
