define(['angular', 'underscore', 'App/Helpers/Browser'], function (angular, _, browserHelper) {
    'use strict';

    var controller = function ($scope, Dates, $routeParams, ODataFilterString, FilterValues, $location, $q, PerspectiveBuilder, Perspectives, Notifications, _FAVOURITES_TOTAL_COUNT_, LookupData, $rootScope, $timeout, TradesColumns, _TRADE_SET_HEADER_WIDTHS_, _TRADES_LOOKUP_DATA_LOADED_, Trades, TradesFilter, TradesUrlBuilder, _TRADE_BUILD_EXPORT_URL_, Page) {
        var canceller,
            initialLoad = true;


        $scope.isFilterOpen = false;
        $scope.showFavouritesOnly = false;
        $scope.showFollowsOnly = false;
        $scope.isSingleTradeView = $scope.renderAction === 'home.trade' ? true : false;
        $scope.isLinkTradeView = $scope.renderAction === 'home.linked-trades' ? true : false;
        $scope.restrictToFavourites = $scope.renderAction === 'mybca.favourites.trades' ? true : false;        
        $scope.columns = {};
        $scope.filters = {
            "service_code": {
                options: []
            },
            "length_type_label": {
                options: []
            },
            "trade_editorial_label": {
                isFreeText: true,
                options: []
            },
            "TradeLines/tradable_thing_class_editorial_label": {
                options: []
            },
            "TradeLines/location_label": {
                options: [],
                isFreeText: true
            },            
            "instruction_label": {
                isFreeText: true,
                options: []
            },
            "isOpen": {
                options: [],
                placeholderField: 'label'
            },
            "benchmark_label": {
                options: []
            },
            "comment_label": {
                isFreeText: true,
                options: []
            },            
            "instruction_type_label": {
                options: []
            },
            "TradeLines/position_label": {
                options: []
            },
            "structure_type_label": {
                options: []
            },
            "hedge_label": {
                options: []
            },            
            "TradeLines/tradable_thing_label": {
                options: [],
                isFreeText: true
            },
            "TradeLines/tradable_thing_code": {
                options: [],
                isFreeText: true
            },            
            "instruction_entry_date": {
                isDate: true
            },
            "instruction_exit_date": {
                isDate: true
            },
            "last_updated": {
                isDate: true
            }
        };
     
        $scope.options = {
            pager: {
                currentPage: 1,
                pageSize: browserHelper.isIE8() ? 10 : 25
            },
            skip: 0,
            take: browserHelper.isIE8() ? 10 : 25,
            direction: 'asc'
        };

        $scope.tradesLoading = false;

        $scope.loadLookupData = function() {
            LookupData.getData().then(function (data) {
                $scope.filters.benchmark_label.options = data.benchmark_label;               
                $scope.filters.instruction_type_label.options = data.instruction_type_label;
                $scope.filters["TradeLines/position_label"].options = data.position_label;
                $scope.filters.structure_type_label.options = data.structure_type_label;
                $scope.filters["TradeLines/tradable_thing_label"].options = data.tradable_thing_label;
                $scope.filters.service_code.options = data.service_code;
                $scope.filters["TradeLines/tradable_thing_class_editorial_label"].options = data.tradable_thing_class_editorial_label;
                $scope.filters["TradeLines/tradable_thing_code"].options = data.tradable_thing_code;
                $scope.filters["TradeLines/location_label"].options = data.location_label;
                $scope.filters.length_type_label.options = data.length_type_label;
                $scope.filters.hedge_label.options = data.hedge_label;
                $scope.filters.isOpen.options = data.isOpen;

                $scope.updateFiltersFromUrl();
                $rootScope.$broadcast(_TRADES_LOOKUP_DATA_LOADED_, $scope.filters);

            });
        };

        $scope.toggleTradeInformation = function(item, $event) {
            _.each($scope.trades, function(trade) {
                if (trade !== item) {
                    trade.isInformationOpen = false;
                }
            });
            item.isInformationOpen = !item.isInformationOpen;
            $event.stopPropagation();
        };

        $scope.toggleGroupsDisplay = function(item) {
            item.isGroupsOpen = !item.isGroupsOpen;

            _.each(item.groups, function(group) {
                group.isVisible = !group.isVisible;
            });
        };
       
        $scope.getGroupLines = function(item) {
            if ( !! item.groupLines) {
                return item.groupLines;
            }

            item.groupLines = [];

            _.each(item.groups, function(group) {
                _.each(group.lines, function (line, index) {
                   
                    var groupLine = {
                        line: line,
                        group: group,
                        isFirstInGroup: index === 0
                    };
                    item.groupLines.push(groupLine);
                });
            });
          
            return item.groupLines;
        };

        $scope.showLinkedTrades = function (item, $event) {
            var query = TradesUrlBuilder.buildDashboardQuery({   
                showFollowsOnly: $scope.showFollowsOnly,
                showFavouritesOnly: $scope.showFavouritesOnly || $scope.restrictToFavourites
            });
            $location.url('/linked-trades/' + item.trade.trade_id + '?' + $.param(query).replace(/\+/gi, ' '));
            $('body').scrollLeft(0);
            $event.stopPropagation();
        };
        
        $scope.toggleFavouritesOnly = function () {
            $scope.showFavouritesOnly = !$scope.showFavouritesOnly;
            $scope.reloadTrades();
        };
        
        $scope.toggleFollowOnly = function () {
            $scope.showFollowsOnly = !$scope.showFollowsOnly;
            $scope.reloadTrades();
        };
        
        
        $scope.getKeyOrLabel = function(val) {
            return val.key || val.label;
        };

        var copyRouteParam = function(name) {
            if ($routeParams[name] !== undefined) {
                $scope[name] = $routeParams[name];
                if ($scope[name] === 'false') {
                    $scope[name] = false;
                }
            }
        };

        $scope.updateFiltersFromUrl = function() {
            copyRouteParam('showFavouritesOnly');
            copyRouteParam('showFollowsOnly');
            $scope.options.filter = $routeParams.$filter;
            TradesFilter.applyFilter($scope.filters, $scope.options.filter);
        };

        $scope.updateOrderingOptionsFromUrl = function() {
            if ($routeParams.$orderby) {
                $scope.options.orderby = $routeParams.$orderby.replace(/ (desc|asc)$/, '');
                $scope.options.direction = $routeParams.$orderby.match(/ desc$/) ? 'desc' : 'asc';
            } else {
                $scope.options.orderby = 'last_updated';
                $scope.options.direction = 'desc';
            }
        };

      
        $scope.buildIsisQuery = function () {
            var orderByQuery,
                query = {},
                filter;

            orderByQuery = TradesFilter.buildOrderBy($scope.options);

            filter = $scope.options.filter ? $scope.options.filter : '';

            if (!$scope.isLinkTradeView) {
                if ($routeParams.tradeId !== undefined) {
                    filter = 'trade_id eq ' + $routeParams.tradeId;
                } else {
                    filter = (filter ? '(' + filter + ') and ' : '') + 'isClosedFor7DaysOrMore eq false';
                }
            }

            _.extend(query, {
                '$orderby': orderByQuery,
                '$skip': $scope.options.skip,
                '$top': $scope.options.take,
                '$inlinecount': 'allpages',
                '$expand': 'TradeLines,LinkedTrade',                
                showFavouritesOnly: $scope.showFavouritesOnly || $scope.restrictToFavourites,
                showFollowsOnly: $scope.showFollowsOnly
            });
            
            if (filter && filter.length > 0) {
                _.extend(query, {
                    '$filter': filter
                });
            }

            if ($scope.isLinkTradeView) {
                _.extend(query, {
                    linkedTradesId: $routeParams.tradeId 
                });
            }

            return query;
        };


        var loadTrades = function (append) {
            var options;
            $scope.tradesLoading = true;
            if (canceller) {
                canceller.resolve();
            }
            canceller = $q.defer();

            $scope.updateFiltersFromUrl();
            $scope.updateOrderingOptionsFromUrl();

            options = $scope.buildIsisQuery();
            
            _.extend(options, {
                canceller: canceller
            });
              
            Trades.getTransformedTrades(options)
                .then(function (result) {
                    $scope.tradesBaseUrl = result.tradesBaseUrl;
                    $scope.totalCount = result.data.totalCount;                    
                    $scope.showBoundaryLinks = $scope.totalCount / $scope.options.pager.pageSize > 5;
                    $scope.exportTradesUrl = TradesUrlBuilder.buildExportUrl(result.tradesBaseUrl, options);
                    if ($scope.restrictToFavourites) {
                        $scope.$root.$broadcast(_FAVOURITES_TOTAL_COUNT_, $scope.totalCount);
                    }
                    
                    if (append) {
                        $scope.trades.push.apply($scope.trades, result.data.trades);
                    } else {
                        $scope.trades = result.data.trades;
                    }

                    if (!_.isEmpty($scope.trades)) {
                        var title = '', crumbs = [];
                        if (!$scope.isLinkTradeView && $routeParams.tradeId !== undefined) {
                            title = _.first($scope.trades).trade.trade_editorial_label;
                            crumbs = [{ name: 'Trades', link: '/trades' }, { name: _.first($scope.trades).trade.trade_editorial_label }];
                        } else if ($scope.isLinkTradeView && $routeParams.tradeId !== undefined) {
                            title = 'Linked Trades for ' + _.first($scope.trades).trade.parent_trade_editorial_label;
                            crumbs = [{ name: 'Trades', link: '/trades' }, { name: 'Linked Trades for ' + _.first($scope.trades).trade.parent_trade_editorial_label }];
                        }

                        if (title.length > 0) {
                            Page.setTitle(title);
                            var current = _.pluck(Page.getCurrentBreadcrumbs(), 'name');                            
                            if (!_.contains(current, 'Trades')) {
                                Page.setLastBreadcrumbs(crumbs, true);
                            }
                        }
                    }

                    $timeout(function () {
                        TradesColumns.initTradesColumns($scope, initialLoad, append);
                        $scope.$broadcast(_TRADE_SET_HEADER_WIDTHS_);
                        initialLoad = false;
                    }, 200);
                    $scope.tradesLoading = false;
                }, function () {
                    $scope.trades = $scope.trades || [];
                    $scope.tradesLoading = false;
                });

        };
        
        $scope.fetchNextPage = function(pageNumber) {
            if (pageNumber === undefined) {
                if (!$scope.tradesLoading && $scope.options.skip <= $scope.trades.length) {
                    $scope.options.skip += $scope.options.take;
                    loadTrades(true);
                }
            } else {
                $scope.fetchPage(pageNumber);
            }
        };

        $scope.fetchPage = function (pageNumber) {
            $scope.options.skip = pageNumber * $scope.options.take;
            loadTrades(false);
        };

        $scope.locationChanged = function () {
            resetCache();
            loadTrades();
        };

        var resetCache = function() {
            $scope.options.skip = 0;
            $scope.options.pager.currentPage = 1;
        };

        var buildTradesQuery = function(o) {
            var direction;
            var filterExpression = TradesFilter.buildFilter($scope.filters),
                options = {
                    filterExpression: filterExpression,
                    showFollowsOnly: $scope.showFollowsOnly,
                    showFavouritesOnly: $scope.showFavouritesOnly || $scope.restrictToFavourites
                };

            if ($scope.options && o && $scope.options.orderby === o.orderby) {
                direction = $scope.options.direction === 'asc' ? 'desc' : 'asc';
                _.extend(options, {
                    direction: direction
                });
            } else {
                direction = 'asc';
                _.extend(options, {
                    direction: direction
                });
            }

            _.extend(options, o);
            return options;
        };

        $scope.onFiltersChanged = function () {
            $scope.reloadTrades();
        };

        $scope.reloadTrades = function (o) {
            var options = buildTradesQuery(o),
                query = TradesUrlBuilder.buildDashboardQuery(options);
            $location.search(query);
            $scope.exportTradesUrl = TradesUrlBuilder.buildExportUrl($scope.tradesBaseUrl, options);
        };

        $scope.$on(_TRADE_BUILD_EXPORT_URL_, function () {
            var options = $scope.buildIsisQuery();
            $scope.exportTradesUrl = TradesUrlBuilder.buildExportUrl($scope.tradesBaseUrl, options);
        });

        $scope.$root.$on('$routeUpdate', function (event, current, previous) {
            loadTrades(false);
        });
        
        $scope.$watch('options.pager.currentPage', function (newVal) {
            $scope.fetchNextPage(newVal-1);
        });

        $scope.loadLookupData();
    };

    controller.$inject = ['$scope', 'Dates', '$routeParams', 'ODataFilterString', 'FilterValues', '$location', '$q', 'PerspectiveBuilder', 'Perspectives', 'Notifications', '_FAVOURITES_TOTAL_COUNT_', 'LookupData', '$rootScope', '$timeout', 'TradesColumns', '_TRADE_SET_HEADER_WIDTHS_', '_TRADES_LOOKUP_DATA_LOADED_', 'Trades', 'TradesFilter', 'TradesUrlBuilder', '_TRADE_BUILD_EXPORT_URL_', 'Page'];

    return controller;
});