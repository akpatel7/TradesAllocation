define(['angular',
        'App/Services/DataEndpointService',
        'App/Services/HouseViewsService',
        'App/Services/ViewablesService',
        'App/Services/DateService',
        'App/Services/HttpInterceptorService',
        'App/Services/AuthHttpInterceptorService',
        'App/Services/RedirectService',
        'App/Services/AuthorisationService',
        'App/Services/ConfigService',
        'App/Services/ViewService',
        'App/Services/ViewsService',
        'App/Services/PerspectivesService',
        'App/Services/DominantViewService',
        'App/Services/UserService',
        'App/Services/PerspectiveBuilder',
        'App/Services/NotificationsService',
        'App/Services/AnnotationsService',
        'App/Services/UrlProvider',
        'App/Services/ThemesService',
        'App/Services/TradeService',
        'App/Services/AnalyticsService',
        'App/Services/LikeService',
        'App/Services/FilterValues',
        'App/Services/ViewEvolutionService',
        'App/Services/SuggestService',
        'App/Services/CollectionService',
        'App/Services/RelatedViewableService',
        'App/Services/HighChartsService',
        'App/Services/ColorService',
        'App/Services/PageService',
        'App/Services/PositionConvictionValueService',
        'App/Services/ChartsService',
        'App/Services/ODataFilterStringService',
        'App/Services/AlertsService',
        'App/Services/LookupDataService',
        'App/Services/TradesColumnsService',
        'App/Services/AnnotationsTabService',
        'App/Services/AllocationsDataService',
        'App/Services/PerformanceChartService',
        'App/Services/KeyIndicatorsService',
        'App/Services/TradesFilterService',
        'App/Services/TradesUrlBuilder',
        'App/Services/PortfolioService',
        'App/Services/FollowService',
        'cookies',
        'resource'], function (angular,
            dataEndpointService,
            houseViewsService,
            viewablesService,
            dateService,
            httpInterceptorService,
            authHttpInterceptorService,
            redirectService,
            authorisationService,
            configService,
            viewService,
            viewsService,
            perspectivesService,
            dominantViewService,
            userService,
            perspectiveBuilder,
            notificationsService,
            annotationsService,
            urlProvider,
            themesService,
            tradeService,
            analyticsService,
            likeService,
            filterValues,
            viewEvolutionService,
            suggestService,
            collectionService,
            relatedViewableService,
            highChartsService,
            colorService,
            pageService,
            positionConvictionValueService,
            chartsService,
            oDataFilterStringService,
            alertsService,
            lookupDataService,
            tradesColumnsService,
            annotationsTabService,
            allocationsDataService,
            performanceChartService,
            keyIndicatorsService,
            tradesFilterService,
            tradesUrlBuilder,
            portfolioService,
            followService
        ) {
            'use strict';

            var services = angular.module('App.services', ['ngResource', 'ngCookies'])
                .factory('DataEndpoint', dataEndpointService)
                .factory('HouseViews', houseViewsService)
                .factory('Viewables', viewablesService)
                .factory('Dates', dateService)
                .factory('Analytics', analyticsService)
                .value('HouseViewServiceUri', 'http://data.emii.com/bca/services/bcah')
                .value('ViewableThingUri', 'http://data.emii.com/ontologies/bca/ViewableThing')
                .value('AnnotationsCounterArgumentUri', 'http://data.emii.com/annotation-types/counter-argument')
                .value('AnnotationsScenarioUri', 'http://data.emii.com/annotation-types/scenario')
                .value('AnnotationsSupportUri', 'http://data.emii.com/annotation-types/support')
                .value('AnnotationsMentionUri', 'http://data.emii.com/annotation-types/mention')
                .value('StrategicViewUri', 'http://data.emii.com/view-recommendation-types/strategic')
                .value('TacticalViewUri', 'http://data.emii.com/view-recommendation-types/tactical')
                .value('AbsoluteViewUri', 'http://data.emii.com/view-types/absolute')
                .value('RegionUri', 'http://data.emii.com/ontologies/location/Region')
                .value('LocationTypeUri', 'http://data.emii.com/ontologies/location/locationType')
                .value('LocationUri', 'http://data.emii.com/ontologies/location/Location')
                .value('LocationTypeRegionUri', 'http://data.emii.com/location-types/region')
                .value('InflationViewTypeUri', 'http://data.emii.com/view-types/inflation')
                .value('version', '0.1')
                .factory('redirectService', redirectService)
                .factory('authorisationService', authorisationService)
                .factory('config', configService)
                .factory('View', viewService)
                .factory('Views', viewsService)
                .factory('Perspectives', perspectivesService)
                .factory('DominantView', dominantViewService)
                .factory('UserService', userService)
                .factory('PerspectiveBuilder', perspectiveBuilder)
                .factory('Notifications', notificationsService)
                .factory('Annotations', annotationsService)
                .factory('UrlProvider', urlProvider)
                .factory('Themes', themesService)
                .factory('Trades', tradeService)
                .factory('Like', likeService)
                .factory('FilterValues', filterValues)
                .factory('ViewEvolution', viewEvolutionService)
                .factory('Suggest', suggestService)
                .factory('Collection', collectionService)
                .factory('RelatedViewable', relatedViewableService)
                .factory('HighCharts', highChartsService)
                .factory('Color', colorService)
                .factory('Page', pageService)
                .factory('PositionConvictionValue', positionConvictionValueService)
                .factory('Charts', chartsService)
                .factory('ODataFilterString', oDataFilterStringService)
                .factory('Alerts', alertsService)
                .factory('LookupData', lookupDataService)
                .factory('TradesColumns', tradesColumnsService)
                .factory('AnnotationsTabService', annotationsTabService)
                .factory('AllocationsDataService', allocationsDataService)
                .factory('PerformanceChartService', performanceChartService)
                .factory('KeyIndicators', keyIndicatorsService)
                .factory('TradesFilter', tradesFilterService)
                .factory('TradesUrlBuilder', tradesUrlBuilder)
                .factory('Portfolio', portfolioService)
                .factory('Follow', followService)
                .constant('_REQUEST_STARTED_', 'request:started')
                .constant('_REQUEST_ENDED_', 'request:ended')
                .constant('_FILTERS_CHANGED_', 'filters:changed')
                .constant('_TILE_SIZE_CHANGING_', 'tile:SizeChanging')
                .constant('_FILTERS_UPDATEFACETS_', 'filters:updateFacets')
                .constant('_WINDOW_SCROLLED_', 'window:scrolled')
                .constant('IsisConsumerId', 'gbgnwk1g310y')
                .constant('_TRADE_INFORMATION_PANEL_OPENED_', 'trade:informationPanelOpened')
                .constant('_TRADE_MOVE_COLUMN_', 'trade:move-column')
                .constant('_TRADE_SET_HEADER_WIDTHS_', 'trade:set-header-widths')
                .constant('_TRADES_LOADED_', 'trade:trades-loaded')
                .constant('_FAVOURITES_TOTAL_COUNT_', 'favourites:total-count')
                .constant('_TOGGLING_TRADE_FILTER_', 'trade:toggle-filter')
                .constant('_CLEARING_TRADE_FILTER_', 'trade:clear-filter')
                .constant('_TRADES_LOOKUP_DATA_LOADED_', 'trade:lookup-data-loaded')
                .constant('_SET_DATE_', 'uidatepicker:set-date')
                .constant('_TREE_GRID_RENDERED_', 'tree-grid:rendered')
                .constant('_TREE_GRID_RESET_COLS_', 'tree-grid:reset-cols')
                .constant('_TREE_GRID_TOGGLE_COL_', 'tree-grid:toggle-col')
                .constant('_TREE_GRID_MOVE_COL_', 'tree-grid:move-col')
                .constant('_TRADE_TOGGLE_COLUMN_', 'trade:toggle-column')
                .constant('_TREE_GRID_CHANGE_PAGE_', 'tree-grid:change-page')
                .constant('_TREE_GRID_RESIZE_INFO_', 'tree-grid:resize-info')
                .constant('_TRADE_BUILD_EXPORT_URL_', 'trade:build-export')
                .constant('TreeGridLicenseKey', 'SGRERCDUUBTMMC')
                .config(httpInterceptorService)
                .config(authHttpInterceptorService)
                .run(['$http', '$cookies', '$location', 'redirectService', '$rootScope', '$window', 'authorisationService', '_WINDOW_SCROLLED_', function ($httpProvider, $cookies, $location, redirect, $rootScope, $window, authorisationService, _WINDOW_SCROLLED_) {
                    $httpProvider.defaults.headers.common['Accept'] = 'application/ld+json,' + $httpProvider.defaults.headers.common['Accept'];
                    $httpProvider.defaults.headers.common['x-requested-with'] = 'xmlhttprequest';

                    if (authorisationService.isAuthorised()) {
                        authorisationService.setAuthorisationHeader();
                    } else {
                        redirect.unauthorised();
                    }

                    var setWidth = function () {
                        $rootScope.windowWidth = $window.document.documentElement.clientWidth;
                    };

                    setWidth();

                    angular.element($window).bind('resize', function () {
                        setWidth();
                        $rootScope.$apply('windowWidth');
                    });

                    angular.element($window).bind('scroll', function () {
                        $rootScope.$broadcast(_WINDOW_SCROLLED_);
                    });
                }]);

            return services;
        });


