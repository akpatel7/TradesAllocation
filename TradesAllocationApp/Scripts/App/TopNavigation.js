define(['jquery', 'jquery-ui', 'jquery-topnavigation'], function($, a, b) {
    var appConfig = window.config;

    function appendPath(baseUrl, path) {
        return baseUrl + (baseUrl.indexOf('/', baseUrl.length - 1) !== -1 ? '' : '/') + path;
    }

    $('#topNavigation').topnavigation({
        menu: [
            {
                label: 'Dashboard ',
                items: [
                    {
                        label: 'My Dashboard',
                        url: appConfig.dashboardBaseUrl + '#/home',
                        openInNewTab: false,
                        trackingAction: 'navbar_dashboardHome'
                    },
                    {
                        label: 'Themes',
                        url: appConfig.dashboardBaseUrl + '#/themes',
                        openInNewTab: false,
                        trackingAction: 'navbar_dashboardThemes'
                    },
                    {
                        label: 'Views',
                        url: appConfig.dashboardBaseUrl + '#/views',
                        openInNewTab: false,
                        trackingAction: 'navbar_dashboardViews'
                    },                                        
                    {
                        label: 'Trades',
                        url: appConfig.dashboardBaseUrl + '#/trades',
                        openInNewTab: false,
                        trackingAction: 'navbar_dashboardTrades'
                    },
                    {
                        label: 'Allocations',
                        url: appConfig.dashboardBaseUrl + '#/allocations',
                        openInNewTab: false,
                        trackingAction: 'navbar_dashboardAllocations'
                    }
                ]
            },
            {
                label: 'Reports ',
                url: appConfig.reportsBaseUrl,
                openInNewTab: true,
                trackingAction: 'navbar_reportsViewer'
            },
            {
                label: 'Analytics ',
                items: [
                      {
                          label: 'Home',
                          url: appConfig.banBaseUrl,
                          openInNewTab: true,
                          trackingAction: 'navbar_chartHome'
                      },
                    {
                        label: 'Chart Viewer',
                        url: appendPath(appConfig.banBaseUrl,  'charts'),
                        openInNewTab: true,
                        trackingAction: 'navbar_chartViewer'
                    },
                    {
                         label: 'BCA Indicators',
                         url: appendPath(appConfig.reportsBaseUrl, '#/reports/bcaindicators/'),
                         openInNewTab: true,
                         trackingAction: 'navbar_bcaIndicators'
                    },
                    {
                        label: 'Help',
                        url:  appendPath(appConfig.banBaseUrl,  'BCAHelp'),
                        openInNewTab: true,
                        trackingAction: 'navbar_bcaHelp'
                    }
                ]
               
            },
            {
                label: 'My BCA ',
                items: [
                    {
                        label: 'Shared',
                        url: appendPath(appConfig.reportsBaseUrl, '#/reports/shared/'),
                        openInNewTab: false,
                        trackingAction: 'navbar_BcaShared'
                    },
                    {
                        label: 'Favourites',
                        url: appConfig.dashboardBaseUrl + '#/favourites',
                        openInNewTab: false,
                        trackingAction: 'navbar_BcaFavourites'
                    },
                    {
                        label: 'Clippings',
                        url: appendPath(appConfig.reportsBaseUrl, '#/reports/clipping/'),
                        openInNewTab: false,
                        trackingAction: 'navbar_BcaClippings'
                    },
                    {
                        label: 'Annotations',
                        url: appendPath(appConfig.reportsBaseUrl, '#/reports/annotations'),
                        openInNewTab: false,
                        trackingAction: 'navbar_BcaAnnotations'
                    },
                    {
                        label: 'Offline Reports',
                        url: appendPath(appConfig.reportsBaseUrl, '#/reports/offline'),
                         openInNewTab: false,
                         trackingAction: 'navbar_BcaOfflineReports'
                    }
                ]
            }
        ]
    });
});     
