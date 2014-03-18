define(['angular', 'App/Helpers/String', 'underscore'], function (angular, stringHelper, _) {
    'use strict';

    var service = function (Dates, View) {
        var dominantServices = [
            {
                "name": "americas",
                "region": ['http://data.emii.com/locations/amer'],
                "serviceRankings": {
                    "Economy": ['HOUSE', 'USIS', 'GIS', 'GISM', 'BCA', 'USBS', 'USES', 'FES', 'GFIS', 'EMS', 'CNE', 'GAA', 'GPS', 'EIS', 'CIS', 'GRES'],
                    "FiscalPolicy": ['HOUSE', 'USIS', 'GIS', 'GISM', 'BCA', 'USBS', 'USES', 'FES', 'GFIS', 'EMS', 'CNE', 'GAA', 'GPS', 'EIS', 'CIS', 'GRES'],
                    "MonetaryPolicy": ['HOUSE', 'USIS', 'GIS', 'GISM', 'BCA', 'USBS', 'USES', 'FES', 'GFIS', 'EMS', 'CNE', 'GAA', 'GPS', 'EIS', 'CIS', 'GRES'],
                    "Inflation": ['HOUSE', 'USIS', 'GIS', 'GISM', 'BCA', 'USBS', 'USES', 'FES', 'GFIS', 'EMS', 'CNE', 'GAA', 'GPS', 'EIS', 'CIS', 'GRES'],
                    "InterestRate": ['HOUSE', 'USIS', 'GIS', 'GISM', 'BCA', 'USBS', 'USES', 'FES', 'GFIS', 'EMS', 'CNE', 'GAA', 'GPS', 'EIS', 'CIS', 'GRES'],
                    "EquityMarket": ['HOUSE', 'USES', 'GIS', 'GISM', 'USIS', 'BCA', 'GAA', 'EMS', 'EIS', 'USB', 'GFIS', 'CIS', 'CNE', 'GPS'],
                    "FixedIncomeMarket": ['HOUSE', 'USBS', 'USIS', 'GIS', 'GISM', 'GFIS', 'BCA', 'FES', 'GAA', 'USES', 'CNE', 'EMS'],
                    "CurrencyMarket": ['HOUSE', 'FES', 'GIS', 'GISM', 'BCA', 'USIS', 'USES', 'USB', 'GFIS', 'GPS', 'GAA', 'EIS', 'CNE', 'EMS', 'CIS'],
                    "Currency": ['HOUSE', 'FES', 'GIS', 'GISM', 'BCA', 'USIS', 'USES', 'USB', 'GFIS', 'GPS', 'GAA', 'EIS', 'CNE', 'EMS', 'CIS'],
                    "CommodityMarket": ['HOUSE', 'CNE', 'GIS', 'GISM', 'USES', 'BCA', 'FES', 'EMS', 'USBS', 'GFIS'],
                    "RealEstateMarket": ['HOUSE', 'GRES', 'USIS', 'USBS', 'USES', 'GIS', 'GISM', 'BCA', 'GFIS', 'CNE']
                }
            },
            {
                "name": "europe",
                "region": ['http://data.emii.com/locations/europe'],
                "serviceRankings": {
                    "Economy": ['HOUSE', 'EIS', 'GIS', 'GISM', 'GFIS', 'BCA', 'FES', 'GPS', 'GAA', 'CNE', 'EMS', 'USES', 'CIS', 'USIS', 'USB', 'GRES'],
                    "FiscalPolicy": ['HOUSE', 'EIS', 'GIS', 'GISM', 'GFIS', 'BCA', 'FES', 'GPS', 'GAA', 'CNE', 'EMS', 'USES', 'CIS', 'USIS', 'USB', 'GRES'],
                    "MonetaryPolicy": ['HOUSE', 'EIS', 'GIS', 'GISM', 'GFIS', 'BCA', 'FES', 'GPS', 'GAA', 'CNE', 'EMS', 'USES', 'CIS', 'USIS', 'USB', 'GRES'],
                    "Inflation": ['HOUSE', 'EIS', 'GIS', 'GISM', 'GFIS', 'BCA', 'FES', 'GPS', 'GAA', 'CNE', 'EMS', 'USES', 'CIS', 'USIS', 'USB', 'GRES'],
                    "InterestRate": ['HOUSE', 'EIS', 'GIS', 'GISM', 'GFIS', 'BCA', 'FES', 'GPS', 'GAA', 'CNE', 'EMS', 'USES', 'CIS', 'USIS', 'USB', 'GRES'],
                    "EquityMarket": ['HOUSE', 'EIS', 'GIS', 'GISM', 'BCA', 'GAA', 'GPS'],
                    "FixedIncomeMarket": ['HOUSE', 'EIS', 'GFIS', 'GIS', 'GISM', 'BCA', 'GAA', 'GPS', 'FES'],
                    "CurrencyMarket": ['HOUSE', 'FES', 'EIS', 'GIS', 'GISM', 'GFIS', 'BCA', 'GPS', 'CNE', 'GAA', 'USES', 'EMS'],
                    "Currency": ['HOUSE', 'FES', 'EIS', 'GIS', 'GISM', 'GFIS', 'BCA', 'GPS', 'CNE', 'GAA', 'USES', 'EMS'],
                    "CommodityMarket": ['HOUSE', 'CNE', 'EIS', 'GIS', 'GISM', 'EMS'],
                    "RealEstateMarket": ['HOUSE', 'GRES', 'EIS', 'GFIS', 'GIS', 'GISM', 'BCA']
                }
            },
            {
                "name": "asia",
                "region": ['http://data.emii.com/locations/asi'],
                "serviceRankings": {
                    "Economy": ['HOUSE', 'EMS', 'GIS', 'GISM', 'CIS', 'CNE', 'FES', 'GAA', 'GPS', 'BCA'],
                    "FiscalPolicy": ['HOUSE', 'EMS', 'GIS', 'GISM', 'CIS', 'CNE', 'FES', 'GAA', 'GPS', 'BCA'],
                    "MonetaryPolicy": ['HOUSE', 'EMS', 'GIS', 'GISM', 'CIS', 'CNE', 'FES', 'GAA', 'GPS', 'BCA'],
                    "Inflation": ['HOUSE', 'EMS', 'GIS', 'GISM', 'CIS', 'CNE', 'FES', 'GAA', 'GPS', 'BCA'],
                    "InterestRate": ['HOUSE', 'EMS', 'GIS', 'GISM', 'CIS', 'CNE', 'FES', 'GAA', 'GPS', 'BCA'],
                    "EquityMarket": ['HOUSE', 'EMS', 'GIS', 'GISM', 'CIS', 'GAA', 'GPS'],
                    "FixedIncomeMarket": ['HOUSE', 'EMS', 'GFIS', 'GIS', 'GISM', 'CIS', 'FES', 'GAA', 'GPS'],
                    "CurrencyMarket": ['HOUSE', 'EMS', 'FES', 'GIS', 'GISM', 'CIS', 'GFIS', 'CNE', 'GAA', 'USES'],
                    "Currency": ['HOUSE', 'EMS', 'FES', 'GIS', 'GISM', 'CIS', 'GFIS', 'CNE', 'GAA', 'USES'],
                    "CommodityMarket": ['HOUSE', 'CNE', 'GIS', 'GISM', 'EMS', 'CIS', 'USES', 'GPS'],
                    "RealEstateMarket": ['HOUSE', 'GRES', 'EMS', 'CIS', 'GIS', 'GISM', 'BCA']
                }
            },
            {
                "name": "other",
                "serviceRankings": {
                    "Economy": ['HOUSE', 'GIS', 'GISM', 'EMS', 'GFIS', 'BCA', 'GAA', 'GPS'],
                    "FiscalPolicy": ['HOUSE', 'GIS', 'GISM', 'EMS', 'GFIS', 'BCA', 'GAA', 'GPS'],
                    "MonetaryPolicy": ['HOUSE', 'GIS', 'GISM', 'EMS', 'GFIS', 'BCA', 'GAA', 'GPS'],
                    "Inflation": ['HOUSE', 'GIS', 'GISM', 'EMS', 'GFIS', 'BCA', 'GAA', 'GPS'],
                    "InterestRate": ['HOUSE', 'GIS', 'GISM', 'EMS', 'GFIS', 'BCA', 'GAA', 'GPS'],
                    "EquityMarket": ['HOUSE', 'GIS', 'GISM', 'EMS', 'BCA', 'GAA'],
                    "FixedIncomeMarket": ['HOUSE', 'GFIS', 'GIS', 'GISM', 'EMS', 'GAA', 'GPS'],
                    "CurrencyMarket": ['HOUSE', 'FES', 'GIS', 'GISM', 'EMS', 'GAA', 'GPS', 'BCA'],
                    "Currency": ['HOUSE', 'FES', 'GIS', 'GISM', 'EMS', 'GAA', 'GPS', 'BCA'],
                    "CommodityMarket": ['HOUSE', 'CNE', 'GIS', 'GISM', 'EMS', 'USES'],
                    "RealEstateMarket": ['HOUSE', 'GRES', 'GIS', 'GISM', 'GFIS']
                }
            }
        ],
            locationPriorityForRelatives = ['http://data.emii.com/locations/usa', 'http://data.emii.com/locations/europe'],
            getLocationsForViewable = function(viewable) {
                var locations = [];
                if (viewable.forLocation) {
                    locations.push(viewable.forLocation['@id']);
                    if (viewable.forLocation.withinLocation) {
                        if (viewable.forLocation.withinLocation['@set']) {
                            _.each(viewable.forLocation.withinLocation['@set'], function(location) {
                                locations.push(location['@id']);
                            });
                        } else if (viewable.forLocation.withinLocation['@id']) {
                            locations.push(viewable.forLocation.withinLocation['@id']);
                        }
                    }
                }
                return locations;
            };
        
        return {
            getServiceRankingForViewable: function (viewable) {
                var viewableServiceRanking,
                    locations = getLocationsForViewable(viewable);
                
                viewableServiceRanking = _.find(dominantServices, function (item) {
                    return _.intersection(locations, item.region).length > 0;
                });

                if (!viewableServiceRanking) {
                    viewableServiceRanking = _.last(dominantServices);
                }

                return viewableServiceRanking.serviceRankings[viewable['@type']];
            },
            getDominantView: function (viewable, restrictToFavourited) {
                var serviceRankings = this.getServiceRankingForViewable(viewable),
                    views = viewable.activeView['@set'];
                
                views = _.filter(views, function(item) {
                    return item.hasPermission;
                });
                if (restrictToFavourited) {
                    views = (viewable.isFavourited && viewable.perspectiveId) ? views : this.filterFavourited(views);
                }

                var firstServiceViews = this.getFilteredViews(views, serviceRankings);
                return this.getDominantViewForService(firstServiceViews);
            },
            getFilteredViews: function (views, serviceRankings) {
                views = _.sortBy(views, function (item) {
                    var index = _.indexOf(serviceRankings, View.getServiceName(item.service));
                    return index === -1 ? 99 : index;
                });

                var groupedServices = _.groupBy(views, function (item) {
                    return item.service['@id'];
                });

                var firstServiceViews;
                if (_.intersection(serviceRankings, _.map(_.keys(groupedServices), function (item) { return View.getServiceName({ '@id': item }); })).length > 0) {
                    firstServiceViews = _.first(_.values(groupedServices));
                } else {
                    firstServiceViews = _.union.apply(_, _.values(groupedServices));
                }
                return firstServiceViews;
            },
            getDominantViewForService: function (views) {
                var groupedByType = _.groupBy(views, function(item) {
                    return View.isViewRelative(item) ? 'relative' : 'absolute';
                });
                if (groupedByType.absolute) {
                    return this.getDominantViewByHorizon(groupedByType.absolute);
                } else if (groupedByType.relative) {
                    return this.getDominantRelativeView(groupedByType.relative);
                } else {
                    return null;
                }
            },
            getDominantViewByHorizon: function (views) {
                return _.first(_.sortBy(views, function(item) {
                    return Dates.parseTimeSpan(item.viewHorizon).months * -1;
                }));
            },
            getDominantRelativeView: function (views) {
                _.each(locationPriorityForRelatives, function (locationUri) {
                    var filteredMarketViews = _.filter(views, function(item) {
                        if (item.viewRelativeTo) {
                            var locations = getLocationsForViewable(item.viewRelativeTo);
                            return _.intersection(locations, [locationUri]).length > 0;
                        }
                        return false;
                    });
                    if (filteredMarketViews.length > 0) {
                        views = filteredMarketViews;
                    }
                });
                return _.first(_.sortBy(views, function(item) {
                    return Dates.toDate(item.horizonStartDate).toDate().getTime() * -1;
                }));
            },
            filterFavourited: function(views) {
                var favouritedViews = _.filter(views, function (view) { return view.isFavourited; });

                if (_.isEmpty(favouritedViews)) {
                    return views || [];
                }

                return favouritedViews;
            }
        };
    };
    service.$inject = ['Dates', 'View'];
    return service;
});