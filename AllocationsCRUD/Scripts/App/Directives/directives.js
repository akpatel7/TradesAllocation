define(['angular',
        'App/Directives/AppVersion',
        'App/Directives/Breadcrumb',
        'App/Directives/Horizon',
        'App/Directives/HouseView',
        'App/Directives/Date',
        'App/Directives/DatePickerUi',
        'App/Directives/Conviction',
        'App/Directives/ViewPosition',
        'App/Directives/PositionConvictionColor',
        'App/Directives/Widget',
        'App/Directives/LoadingWidget',
        'App/Directives/WrapContent',
        'App/Directives/Timeago',
        'App/Directives/Themes',
        'App/Directives/Authenticating',
        'App/Directives/ExpandButton',
        'App/Directives/MaximiseButton',
        'App/Directives/ScrollIntoView',
        'App/Directives/ScrollToTop',
        'App/Directives/ViewableBrick',
        'App/Directives/SkinnyViewableTile',
        'App/Directives/ViewTile',
        'App/Directives/ThemeTile',
        'App/Directives/ThemeBrick',
        'App/Directives/DominantView',
        'App/Directives/ServiceLabel',
        'App/Directives/ServiceName',
        'App/Directives/IconMultiState',
        'App/Directives/Icon',
        'App/Directives/Dropdown',
        'App/Directives/Voting',
        'App/Directives/Tracking',
        'App/Directives/ViewsEvolutionChart',
        'App/Directives/ViewChartTooltip',
        'App/Directives/ReportChartTooltip',
        'App/Directives/Searchbox',
        'App/Directives/Highchart',
        'App/Directives/PerformanceChart',
        'App/Directives/AutoClosePopover',
        'App/Directives/TradesFilter',
        'App/Directives/TradesFreeTextFilter',
        'App/Directives/TradesDateFilter',
        'App/Directives/SlideToggle',
        'App/Directives/TrackingAction',
        'App/Directives/StickyTableHeaders',
        'App/Directives/ReOrderableTableColumns',
        'App/Directives/ReSizeableTableColumns',
        'App/Directives/Masonry',
        'App/Directives/MasonryBrick',
        'App/Directives/MasonryController',
        'App/Directives/MasonrySpy',
        'App/Directives/MultiSelect',
        'App/Directives/SingleSelect',
        'App/Directives/TreeGridConfig',
        'App/Directives/Pusher',
        'App/Directives/twitter-bootstrap-affix',
        'App/Directives/SelectBox',
        'App/Directives/ToggleTableColumns',
        'App/Directives/Output',
        'App/Directives/AllocationMoreInfo',
        'App/Directives/TableColumnsSelector',
        'App/Directives/FavouritesTabs',
        'infinite-scroll',
        'ui-bootstrap',
        'angular-strap',
        'angular-bootstrap-switch',
        'ui-sortable'], function (angular,
    appVersion,
    breadcrumb,
    viewHorizon,
    houseView,
    date,
    datePickerUi,
    conviction,
    viewPosition,
    positionConvictionColor,
    widget,
    loadingWidget,
    wrapContent,
    timeago,
    themes,
    authenticating,
    expandButton,
    maximiseButton,
    scrollIntoView,
    scrollToTop,
    viewableBrick,
    skinnyViewableTile,
    viewTile,
    themeTile,
    themeBrick,
    dominantView,
    serviceLabel,
    serviceName,
    iconMultiState,
    icon,
    dropdown,
    voting,
    tracking,
    viewsEvolutionChart,
    viewChartTooltip,
    reportChartTooltip,
    searchbox,
    highchart,
    performanceChart,
    autoClosePopover,
    tradesFilter,
    tradesFreeTextFilter,
    tradesDateFilter,
    slideToggle,
    trackingAction,
    stickyTableHeaders,
    reOrderableTableColumns,
    reSizeableTableColumns,
    masonry,
    masonryBrick,
    masonryController,
    masonrySpy,
    multiSelect,
    singleSelect,
    treeGridConfig,
    pusher,
    twitterBootstrapAffix,
    selectBox,
    toggleTableColumns,
    output,
    allocationMoreInfo,
    tableColumnsSelector,
    favouritesTabs
) {
            'use strict';

            var directives = angular.module('App.directives', ['infinite-scroll', 'ui.bootstrap', '$strap.directives', 'frapontillo.bootstrap-switch', 'ui.sortable'])
                .directive('appVersion', appVersion)
                .directive('breadcrumb', breadcrumb)
                .directive('viewHorizon', viewHorizon)
                .directive('houseView', houseView)
                .directive('date', date)
                .directive('datePickerUi', datePickerUi)
                .directive('conviction', conviction)
                .directive('viewPosition', viewPosition)
                .directive('positionConvictionColor', positionConvictionColor)
                .directive('widget', widget)
                .directive('loadingWidget', loadingWidget)
                .directive('wrapContent', wrapContent)
                .directive('timeago', timeago)
                .directive('themes', themes)
                .directive('authenticating', authenticating)
                .directive('expandButton', expandButton)
                .directive('maximiseButton', maximiseButton)
                .directive('scrollIntoView', scrollIntoView)
                .directive('scrollToTop', scrollToTop)
                .directive('viewableBrick', viewableBrick)
                .directive('skinnyViewableTile', skinnyViewableTile)
                .directive('viewTile', viewTile)
                .directive('themeTile', themeTile)
                .directive('themeBrick', themeBrick)
                .directive('dominantView', dominantView)
                .directive('serviceLabel', serviceLabel)
                .directive('serviceName', serviceName)
                .directive('iconMultiState', iconMultiState)
                .directive('icon', icon)
                .directive('dropdown', dropdown)
                .directive('voting', voting)
                .directive('clickTracking', tracking)
                .directive('viewsEvolutionChart', viewsEvolutionChart)
                .directive('viewChartTooltip', viewChartTooltip)
                .directive('reportChartTooltip', reportChartTooltip)
                .directive('searchbox', searchbox)
                .directive('highchart', highchart)
                .directive('performancechart', performanceChart)
                .directive('autoClosePopover', autoClosePopover)
                .directive('tradesFilter', tradesFilter)
                .directive('tradesFreeTextFilter', tradesFreeTextFilter)
                .directive('tradesDateFilter', tradesDateFilter)
                .directive('slideToggle', slideToggle)
                .directive('trackingAction', trackingAction)
                .directive('stickyTableHeaders', stickyTableHeaders)
                .directive('reOrderableTableColumns', reOrderableTableColumns)
                .directive('reSizeableTableColumns', reSizeableTableColumns)
                .controller('MasonryController', masonryController)
                .directive('masonry', masonry)
                .directive('masonryBrick', masonryBrick)
                .directive('masonrySpy', masonrySpy)
                .directive('multiSelect', multiSelect)
                .directive('singleSelect', singleSelect)
                .factory('treeGridConfig', treeGridConfig)
                .directive('pusher', pusher)
                .directive('twitterBootstrapAffix', twitterBootstrapAffix)
                .directive('selectBox', selectBox)
                .directive('toggleTableColumns', toggleTableColumns)
                .directive('output', output)
                .directive('allocationMoreInfo', allocationMoreInfo)
                .directive('tableColumnsSelector', tableColumnsSelector)
                .directive('favouritesTabs', favouritesTabs)

            ;
            return directives;
        });

