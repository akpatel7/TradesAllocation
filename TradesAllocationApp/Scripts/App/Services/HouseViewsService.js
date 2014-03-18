define(['angular', 'underscore', 'App/Helpers/String'], function(angular, _, stringHelper) {
    'use strict';

    var service = function($resource, $q, DataEndpoint, Dates, HouseViewServiceUri, View) {
        return {
            getViews: function () {
                var deferred = $q.defer(),
                    self = this;
                
                DataEndpoint.getTemplatedEndpoint('viewables', [
                    { key: 'service', value: HouseViewServiceUri },
                    { key: 'includeFacetsCount', value: false },
                    { key: 'page', value: 0 },
                    { key: 'pageSize', value: 100 }
                ]).then(function (result) {
                        $resource(result, {}, {
                            get: {
                                method: 'GET',
                                isArray: false
                            }
                        }
                        ).get({}, function(data) {
                            var items = [];                            

                            _.each(data.viewables, function (viewable) {
                                var houseViews = _.filter(viewable.activeView["@set"], function(view) {
                                    return view.service['@id'] === HouseViewServiceUri;
                                });
                                var sorted = _.sortBy(houseViews, function (sortItem) {
                                        return sortItem.horizonEndDate;
                                    }),
                                    label;
                                
                                _.each(houseViews, function (view) {
                                    angular.extend(view, {
                                        id: view['@id'],
                                        themes: View.mapThemes(view['informedByTheme']),
                                        relativeViewLabel: View.getRelativeViewLabel(view),
                                        lastUpdated: view.horizonStartDate
                                    });
                                });
                                
                                if (viewable['@type'].toLowerCase() === 'economy') {                                    
                                    label = stringHelper.trim(viewable.canonicalLabel.replace(new RegExp('(economy$)', 'gi'), ''));
                                } else {
                                    label = viewable.canonicalLabel;
                                }

                                items.push({
                                    label: label,
                                    type: viewable['@type'],
                                    activeViews: viewable.activeView['@set'].length,
                                    key: viewable['@id'],
                                    url: '/#/research?uri=' + encodeURIComponent(viewable["@id"]),
                                    views: self._findViews(sorted.reverse())
                                });
                            });
                            
                            items = self._sortViews(items);

                            deferred.resolve(items);
                        });
                    });
                return deferred.promise;
            },
            _sortViews: function(items) {
                var viewOrder = [];
                viewOrder['Economy'] = 1;
                viewOrder['EquityMarket'] = 2;
                viewOrder['FixedIncome'] = 3;
                viewOrder['Currency'] = 4;
                viewOrder['CommodityMarket'] = 5;
                viewOrder['RealEstate'] = 6;
                viewOrder['undefined'] = 99;

                var result = _.sortBy(items, function(item) {
                    return viewOrder[item.type ? item.type : 'undefined'];
                });
                return result;
            },           
            _findViews: function(items) {
                var findView = function(expression) {
                    return _.filter(items, function(item) {
                        return expression(Dates.parseTimeSpan(item.viewHorizon));
                    });
                };
                var result = {
                    shortTermViews: findView(function(duration) {
                        return duration.months <= 6;
                    }),
                    longTermViews: findView(function(duration) {
                        return duration.months > 6;
                    })
                };

                result.hasShortTermView = function () {
                    return result.shortTermViews.length > 0;
                };
                result.hasLongTermView = function() {
                    return result.longTermViews.length > 0;
                };

                return result;
            }
        };
    };
    service.$inject = ['$resource', '$q', 'DataEndpoint', 'Dates', 'HouseViewServiceUri', 'View'];
    return service;
});