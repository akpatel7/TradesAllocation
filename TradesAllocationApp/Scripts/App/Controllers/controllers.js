define([
    'angular',
    'App/Controllers/AppController',
    'App/Controllers/HouseViews/HouseViewsController',
    'App/Controllers/AllViews/AllViewsController',
    'App/Controllers/NotificationsController',
    'App/Controllers/FilterController',
    'App/Controllers/User/UserNameController',
    'App/Controllers/AllViews/ViewableController',
    'App/Controllers/AllViews/ViewEvolutionController',
    'App/Controllers/AllViews/ViewableTileController',
    'App/Controllers/AnnotationsController',
    'App/Controllers/Themes/ThemesController',
    'App/Controllers/Themes/ServiceThemesController',
    'App/Controllers/PagePaginationController',
    'App/Controllers/BricksController',
    'App/Controllers/LegendController',
    'App/Controllers/Research/ResearchController',
    'App/Controllers/Research/ResearchPublicationsController',
    'App/Controllers/Research/ResearchViewsController',
    'App/Controllers/Research/ResearchTradesController',
    'App/Controllers/Research/ResearchThemesController',    
    'App/Controllers/Research/ResearchChartsController',
    'App/Controllers/Research/ResearchViewEvolutionsController',
    'App/Controllers/Research/ResearchKeyIndicatorsController',
    'App/Controllers/Research/ResearchAllocationsController',
    'App/Controllers/Trades/TradesController',
    'App/Controllers/Trades/TradeHistoryController',    
    'App/Controllers/Trades/TradeCommentsController',
    'App/Controllers/Alerts/AlertNotificationsController',
    'App/Controllers/Trades/TradeReportsController',
    'App/Controllers/Trades/PerformanceController',
    'App/Controllers/Trades/TradeRelatedViewsController',
    'App/Controllers/Trades/TradeColumnsController',
    'App/Controllers/Trades/FollowTradeController',
    'App/Controllers/Trades/ShareTradeController',
    'App/Controllers/Trades/TradeController',
    'App/Controllers/Allocations/AllocationBookmarkController',
    'App/Controllers/Allocations/PortfolioAllocationRelatedThingsController',
    'App/Controllers/Allocations/PortfolioAllocationRelatedReportsController',
    'App/Controllers/Allocations/AllocationFollowController' ,       
    'App/Controllers/Allocations/AllocationsColumnsController',
    'App/Controllers/Allocations/AllocationsController',
    'App/Controllers/Allocations/AllocationHistoryController',
    'App/Controllers/Allocations/PortfolioAllocationCommentsController',
    'App/Controllers/Allocations/PortfolioAllocationFilterController',
    'App/Controllers/Allocations/AllocationsTreeGridController'
], function (angular,
// ReSharper disable InconsistentNaming
    AppController,
    HouseViewsController,
    AllViewsController,
    NotificationsController,
    FilterController,
    UserNameController,
    ViewableController,
    ViewEvolutionController,
    ViewableTileController,
    AnnotationsController,
    ThemesController,
    ServiceThemesController,
    PagePaginationController,
    BricksController,
    LegendController,
    ResearchController,
    ResearchPublicationsController,
    ResearchViewsController,
    ResearchTradesController,
    ResearchThemesController,
    ResearchChartsController,
    ResearchViewEvolutionsController,
    ResearchKeyIndicatorsController,
    ResearchAllocationsController,
    TradesController,
    TradeHistoryController,    
    TradeCommentsController,
    AlertNotificationsController,    
    TradeReportsController,
    PerformanceController,
    TradeRelatedViewsController,
    TradeColumnsController,    
    FollowTradeController,
    ShareTradeController,
    TradeController,
    AllocationBookmarkController,
    PortfolioAllocationRelatedThingsController,
    PortfolioAllocationRelatedReportsController,  
    AllocationFollowController,
    AllocationsColumnsController,
    AllocationsController,

    AllocationHistoryController,
    PortfolioAllocationCommentsController,
    PortfolioAllocationFilterController,
    AllocationsTreeGridController
) {
        'use strict';
        var controllers = angular.module('App.controllers', ['App.services']);
        controllers.controller('AppController', AppController);
        controllers.controller('HouseViewsController', HouseViewsController);
        controllers.controller('AllViewsController', AllViewsController);
        controllers.controller('NotificationsController', NotificationsController);
        controllers.controller('FilterController', FilterController);
        controllers.controller('UserNameController', UserNameController);
        controllers.controller('ViewableController', ViewableController);
        controllers.controller('ViewEvolutionController', ViewEvolutionController);
        controllers.controller('ViewableTileController', ViewableTileController);
        controllers.controller('AnnotationsController', AnnotationsController);
        controllers.controller('ThemesController', ThemesController);
        controllers.controller('ServiceThemesController', ServiceThemesController);
        controllers.controller('PagePaginationController', PagePaginationController);
        controllers.controller('BricksController', BricksController);
        controllers.controller('LegendController', LegendController);
        controllers.controller('ResearchController', ResearchController);
        controllers.controller('ResearchPublicationsController', ResearchPublicationsController);
        controllers.controller('ResearchViewsController', ResearchViewsController);
        controllers.controller('ResearchTradesController', ResearchTradesController);
        controllers.controller('ResearchThemesController', ResearchThemesController);
        controllers.controller('ResearchChartsController', ResearchChartsController);
        controllers.controller('ResearchViewEvolutionsController', ResearchViewEvolutionsController);
        controllers.controller('ResearchKeyIndicatorsController', ResearchKeyIndicatorsController);
        controllers.controller('ResearchAllocationsController', ResearchAllocationsController);
        controllers.controller('TradesController', TradesController);
        controllers.controller('TradeHistoryController', TradeHistoryController);
        controllers.controller('TradeCommentsController', TradeCommentsController);
        controllers.controller('AlertNotificationsController', AlertNotificationsController);
        controllers.controller('TradeReportsController', TradeReportsController);
        controllers.controller('PerformanceController', PerformanceController);
        controllers.controller('TradeRelatedViewsController', TradeRelatedViewsController);
        controllers.controller('TradeColumnsController', TradeColumnsController);
        controllers.controller('FollowTradeController', FollowTradeController);
        controllers.controller('ShareTradeController', ShareTradeController);
        controllers.controller('TradeController', TradeController);
        controllers.controller('AllocationBookmarkController', AllocationBookmarkController);
        controllers.controller('PortfolioAllocationRelatedThingsController', PortfolioAllocationRelatedThingsController);
        controllers.controller('PortfolioAllocationRelatedReportsController', PortfolioAllocationRelatedReportsController);
        controllers.controller('AllocationsColumnsController', AllocationsColumnsController);
        controllers.controller('AllocationsController', AllocationsController);
        controllers.controller('AllocationFollowController', AllocationFollowController);
        controllers.controller('AllocationHistoryController', AllocationHistoryController);
        controllers.controller('PortfolioAllocationCommentsController', PortfolioAllocationCommentsController);    
        controllers.controller('PortfolioAllocationFilterController', PortfolioAllocationFilterController);
        controllers.controller('AllocationsTreeGridController', AllocationsTreeGridController);
    
        return controllers;
    });

