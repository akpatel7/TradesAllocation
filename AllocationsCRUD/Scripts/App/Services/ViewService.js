define(['angular', 'App/Helpers/String', 'underscore'], function (angular, stringHelper, _) {
    'use strict';

    var viewService = function (Dates, InflationViewTypeUri) {
        var positionValues = [
                ['WEAKER', 'SHORT', 'UNDERWEIGHT', 'FALL', 'CONTRACT', 'TIGHTEN'],
                ['FLAT', 'NEUTRAL', 'NO-CHANGE'],
                ['STRONGER', 'LONG', 'OVERWEIGHT', 'RISE', 'EXPAND', 'EASE']
            ],
            convictionValues = [
                ['LOW'], ['MEDIUM'], ['HIGH']
            ];
        
        function getPositionWithName(view) {
            var viewPosition = '',
                properties = ['economicPosition', 'viewDirection', 'viewWeighting', 'trendPosition', 'monetaryPolicyPosition', 'fiscalPolicyPosition'],
                property = _.find(properties, function (p) {
                    return view.hasOwnProperty(p);
                });

            if (property !== undefined && view[property]['@id']) {
                viewPosition = _.last(view[property]['@id'].split('/')).toUpperCase();
            }

            if (_.contains(positionValues[0], viewPosition)) {
                return { value: -1, name: viewPosition };
            }
            else if (_.contains(positionValues[1], viewPosition)) {
                return { value: 0, name: viewPosition };
            }
            else if (_.contains(positionValues[2], viewPosition)) {
                return { value: 1, name: viewPosition };
            }
            else {
                return { value: 0, name: null };
            }
        }

        function isViewRelative(view) {
            if (view.viewType && view.viewType['@id'] === InflationViewTypeUri) {
                return false;
            }
            if (view.viewWeighting || (view.viewWeighting && view.viewRelativeTo) || (view.trendPosition && view.viewBenchmark)) {
                return true;
            }
            return false;
        }

        return {
            mapThemes: function (informedByTheme) {
                if (!informedByTheme) {
                    return [];
                }
                if (informedByTheme['@set']) {
                    return informedByTheme['@set'];
                } else {
                    return [informedByTheme];
                }
            },
            
            isViewRelative: isViewRelative,
            
            getRelativeViewLabel: function (view) {
                if (view.viewRelativeTo && view.viewRelativeTo['@id'] === 'http://data.emii.com/benchmarks/default-benchmark') {
                    return 'Relative to Benchmark';
                }
                if (view.viewWeighting) {
                    return view.viewRelativeTo ? 'Vs: ' + view.viewRelativeTo.canonicalLabel : 'Relative';
                }
                if (view.viewBenchmark) {
                    return view.viewBenchmark.canonicalLabel;
                }
                return 'Absolute';
            },
            
            getServiceName: function (service) {
                var servicePrefix = 'http://data.emii.com/bca/services/';
                var serviceName = stringHelper.trim(service['@id'].replace(servicePrefix, '').toUpperCase());
                if (serviceName === 'BCAH') {
                    serviceName = 'HOUSE';
                }
                return serviceName;
            },
            
            // -1: underweight
            //  0: neutral
            //  1: overweight
            getPosition: function (view) {
                return getPositionWithName(view).value;
            },
                
            getPositionWithName: getPositionWithName,
                
            getConviction: function (view) {
                var viewConviction = '';
            
                if (view.viewConviction && view.viewConviction.canonicalLabel) {
                    viewConviction = view.viewConviction.canonicalLabel.toUpperCase();
                }
                viewConviction = viewConviction.toUpperCase();

                if (_.contains(convictionValues[0], viewConviction)) {
                    return 0;
                }
                else if (_.contains(convictionValues[1], viewConviction)) {
                    return 1;
                }
                else if (_.contains(convictionValues[2], viewConviction)) {
                    return 2;
                }
                else {
                    return 1;
                }
            },
            
            getActiveViews: function (views) {
                var activeViews = [], now = Dates.now();
                var viewsByViewOrigin = _.groupBy(views, function (v) { return v.viewOrigin ? v.viewOrigin['@id'] : v['@id']; });
                _.each(viewsByViewOrigin, function (viewsForOrigin) {
                    var viewsByStartDate = _.sortBy(viewsForOrigin, 'horizonStartDate');
                    var activeView = viewsByStartDate[viewsByStartDate.length - 1];
                    
                    if (activeView.horizonEndDate >= now) {
                        activeViews.push(activeView);
                    }
                });

                return activeViews;
            }
        };      
    };
    viewService.$inject = ['Dates', 'InflationViewTypeUri'];
    return viewService;
});