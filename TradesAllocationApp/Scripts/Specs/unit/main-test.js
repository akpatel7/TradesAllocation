(function (window, require) {
    "Use strict";
    var file, requireModules;
    requireModules = [];

    for (file in window.__karma__.files) {
        if (window.__karma__.files.hasOwnProperty(file)) {
            if (file.substring(file.length - 8, file.length) === '.spec.js') {
                requireModules.push(file);
            }
        }
    }

    // Our own application including dependencies
    requireModules.push("App/app");
    requireModules.push('mocks');
    requireModules.push('route');
    requireModules.push('sinon');
    require({
        // !! Testacular serves files from '/base'
        baseUrl: '/base',

        paths: {
            angular: 'Lib/angular/angular',
            mocks: 'Lib/angular-mocks/angular-mocks',
            sinon: 'Specs/lib/sinon/sinon',
            underscore: 'Lib/underscore/underscore',
            resource: 'Lib/angular-resource/angular-resource',
            cookies: 'Lib/angular-cookies/angular-cookies',
            route: 'Lib/angular-route/angular-route',
            nezasa: 'Lib/nezasa/iso8601',
            moment: 'Lib/momentjs/moment',
            jquery: 'Lib/jquery/jquery',
            'jquery-ui': 'Lib/jquery-ui/ui/jquery-ui',
            'infinite-scroll': 'Lib/ngInfiniteScroll/ng-infinite-scroll',
            'ui-bootstrap': 'Lib/angular-bootstrap/ui-bootstrap',
            'angular-strap': 'Lib/angular-strap/dist/angular-strap',
            'webtrends': 'Specs/lib/FakeTracking',
            base64: 'Lib/base64/base64',
            'highcharts-fix': 'Lib/highchart/highcharts-fix1686',
            'highcharts-exporting': 'Lib/highstock/js/modules/exporting.src',
            highstock: 'Lib/highstock/js/highstock.src',
            'highcharts-more': 'Lib/highstock/js/highcharts-more.src',
            'bootstrap-switch': 'Lib/bootstrap-switch/bootstrap-switch',
            'bootstrap': 'Lib/bootstrap-mock/bootstrap-mock',
            'angular-bootstrap-switch': 'Lib/angular-bootstrap-switch/angular-bootstrap-switch',
            stickyTableHeaders: 'Lib/stickyTableHeaders/jquery.stickytableheaders',
            'math.uuid': 'Lib/math.uuid/math.uuid',
            'amplify': 'Lib/amplify/amplify.min',
            'ui-sortable': 'Lib/angular-ui-sortable/sortable',
            masonry: 'Lib/masonry/masonry',
            'doc-ready': 'Lib/doc-ready',
            eventEmitter: 'Lib/eventEmitter',
            eventie: 'Lib/eventie',
            'get-style-property': 'Lib/get-style-property',
            'get-size': 'Lib/get-size',
            'matches-selector': 'Lib/matches-selector',
            outlayer: 'Lib/outlayer',
            'jquery-bridget': 'Lib/jquery-bridget/jquery.bridget',
            TreeGrid: 'Lib/TreeGrid/GridE',
            'highcharts': 'App/highcharts'
        },

        shim: {
            underscore: {
                exports: '_'
            },
            'masonry': {
                deps: ['jquery-bridget']
            },
            'angular': {
                exports: 'angular',
                deps: [
                    'jquery'
                ]
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
            'mocks': { deps: ['angular'], 'exports': 'mocks' },
            'app': {
                deps: [
                    'underscore',
                    'cookies',
                    'route',
                    'jquery',
                    'App/Services/services',
                    'App/Providers/providers',
                    'App/Directives/directives',
                    'App/Filters/filters',
                    'App/Controllers/controllers',
                    'App/Constants/constants'
                ]
            },
            'nezasa': {
                exports: 'nezasa'
            },
            'base64': {
                exports: 'base64'
            },
            'sinon': {
                exports: 'sinon'
            },
            'infinite-scroll': {
                deps: ['angular']
            },
            'angular-strap': {
                deps: ['angular']
            },
            'ui-bootstrap': {
                deps: ['angular']
            },
            'bootstrap-ui.tab': {
                deps: ['angular']
            },
            'bootstrap-ui.tabset': {
                deps: ['angular']
            },
            'popover': {
                deps: ['angular']  
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
            'bootstrap': {
                deps: ['jquery']
            },
            stickyTableHeaders: {
                deps: ['jquery']
            },
            amplify: {
                deps: ['jquery'],
                exports: 'amplify'
            },
            'ui-sortable': {
                deps: ['angular']
            },
            TreeGrid: {
                exports: 'TreeGrid'
            }
        },
        priority: ['angular']
    }, requireModules, function () {
        window.__karma__.start();
    }, function (err) {
    });
}(window, requirejs));

