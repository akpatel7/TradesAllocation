define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var highcharts = function (Dates, View, StrategicViewUri, AbsoluteViewUri, Color) {
        var colorMatrix = [
            ['#F9C2CB', '#FED5BD', '#D8F0CB'],
            ['#F28696', '#FDA470', '#B0E297'],
            ['#EB3D58', '#FC8139', '#7ACE4F']
        ];

        function getRelativeView(view) {
            return view.viewRelativeTo || view.viewBenchmark;
        }

        return {
            _getKey: function (view) {
                var viewable = view.viewOn !== undefined ? view.viewOn['@id'] : '',
                    key = '';
                if (view.viewRecommendationType !== undefined && view.viewRecommendationType['@id'] === StrategicViewUri) {
                    key = view.viewOrigin['@id'];
                } else if (view.viewType['@id'] === AbsoluteViewUri) {
                    key = view.service['@id'];
                } else {
                    key = view.service['@id'] + ' / ' + (getRelativeView(view) !== undefined ? getRelativeView(view)['@id'] : '');
                }
                key += ' / ' + viewable;
                return key;
            },
            _getServiceName: function(view) {
                return  _.last(view.service['@id'].split('/')).toUpperCase();
            },
            _getCategory: function (view) {
                var category = this._getServiceName(view);
                if (view.viewType['@id'] !== AbsoluteViewUri) {
                    category += ' / ' + (getRelativeView(view) ? getRelativeView(view).canonicalLabel : '');
                }
                return category;
            },
            _createSeriesIndexMap: function (views) {
                var seriesIndexMap,
                    uniqEvolutionsOrderedByService,
                    uniqEvolutions,
                    strategicViews,
                    tacticalViews,
                    that = this;

                strategicViews = _.filter(views, function(view) {
                    return view.viewRecommendationType['@id'] === StrategicViewUri;
                });
                
                // map the strategic views first
                uniqEvolutions = _.uniq(strategicViews, function (view) {
                    return view.viewOrigin['@id'];
                });
                
                uniqEvolutionsOrderedByService = _.sortBy(uniqEvolutions, function (view) {
                    return view.service['@id'];
                });
                
                seriesIndexMap = _.map(uniqEvolutionsOrderedByService, function (view) {
                    var viewEvolution = _.sortBy(_.filter(strategicViews, function(strategicView) {
                            return strategicView.viewOrigin['@id'] === view.viewOrigin['@id'];
                        }), 'horizonStartDate'),
                        key = that._getKey(view);
                    _.each(viewEvolution, function(currentView) {
                        _.extend(currentView, {
                            key: key
                        });
                    });
                   
                    return {
                        key: key,
                        value: {
                            index: _.indexOf(uniqEvolutionsOrderedByService, view),
                            category: that._getCategory(view),
                            serviceName: that._getServiceName(view),
                            description: getRelativeView(view) ? getRelativeView(view).canonicalLabel : '',
                            views: viewEvolution
                        } 
                    };
                });
                
                // add the tactial views
                tacticalViews = _.filter(views, function (view) {
                    return view.viewRecommendationType['@id'] !== StrategicViewUri;
                });

                _.each(tacticalViews, function (view) {
                    var similarView = _.find(uniqEvolutions, function(strategicView) {
                        if (strategicView.viewOn['@id'] === view.viewOn['@id'] && strategicView.service['@id'] === view.service['@id'] && strategicView.viewType['@id'] === view.viewType['@id']) {
                            if (getRelativeView(strategicView) !== undefined && getRelativeView(view) !== undefined && getRelativeView(strategicView)['@id'] !== getRelativeView(view)['@id']) {
                                return false;
                            }
                            return true;
                        }
                        return false;
                        });
                   
                    if (similarView === undefined || similarView === null) {
                        var key = that._getKey(view),
                            similarTactical;
                        _.extend(view, {
                            key: key
                        });
                        similarTactical = _.find(seriesIndexMap, function(index) {
                            return index.key === key;
                        });
                        if (similarTactical === undefined) {
                            seriesIndexMap.push({
                                key: key,
                                value: {
                                    index: seriesIndexMap.length,
                                    category: that._getCategory(view),
                                    serviceName: that._getServiceName(view),
                                    description: getRelativeView(view) ? getRelativeView(view).canonicalLabel : '',
                                    views: [view]
                                }
                            });
                        }
                       
                    } else {
                        _.extend(view, {
                            key: similarView.key
                        });
                    }
                });
              
                return seriesIndexMap;
            },
            getRelativeView: getRelativeView,
            processViews: function (views) {
                var series = [],
                    seriesIndexMap,
                    getViewEvolutionSeriesIndex,
                    strategicViews,
                    tacticalViews,
                    addReportSeries,
                    addSeries;
                
                addSeries = function (view, options) {
                    var conviction,
                        position,
                        data,
                        serviceLabel,
                        color,
                        index,
                        hoverColor,
                        seriesData,
                        seriesIndex,
                        endDate = Dates.toUTCDate(view.horizonEndDate);
                    
                    index = getViewEvolutionSeriesIndex(view);
                    
                    seriesIndex = _.find(seriesIndexMap, function (current) {
                        return current.key === view.key;
                    });
                    
                    if (view.viewRecommendationType['@id'] === StrategicViewUri) {
                        var viewIndex = _.indexOf(seriesIndex.value.views, view);
                        var followingView = seriesIndex.value.views[viewIndex + 1];
                        if (followingView !== undefined && followingView !== null) {
                            var nextDate = Dates.toUTCDate(followingView.horizonStartDate);
                            if (nextDate < endDate) {
                                endDate = nextDate;
                            }
                        }
                    }
                    
                    conviction = View.getConviction(view),
                    position = View.getPosition(view) + 1;
                    serviceLabel = _.last(view.service['@id'].split('/')).toUpperCase();

                    if (view.viewRecommendationType['@id'] !== StrategicViewUri) {
                         index -= (position - 1) / 13;
                    }
                    
                    data = [index, Dates.toUTCDate(view.horizonStartDate), endDate];
                    color = colorMatrix[conviction][position];
                    hoverColor = Color.hex2rgb(color);

                    
                    seriesData = {
                        type: 'columnrange',
                        view: view,
                        category: seriesIndex.value.category,
                        legendIndex: seriesIndex.value.index,
                        selectedSeriesEndDate: Dates.toUTCDate(view.horizonEndDate),
                        seriesEndDate: endDate,
                        name: serviceLabel,
                        color: color,
                        data: [data],
                        allowPointSelect: true,
                        states: {
                            unselect: {
                                color: color,
                                borderWidth: 1,
                                borderColor: 'white'
                            },
                            select: {
                                borderWidth: 1.5,
                                borderColor: '#093981',
                                color: 'rgba(' + hoverColor.red + ',' + hoverColor.green + ',' + hoverColor.blue + ', 0.87)'
                            }
                        }
                    };
                    _.extend(seriesData, options);
                    series.push(seriesData);
                };
                
                views = _.sortBy(views, function (view) {
                    return view.service['@id'];
                });

                seriesIndexMap = this._createSeriesIndexMap(views);

                getViewEvolutionSeriesIndex = function (view) {
                    var result = _.find(seriesIndexMap, function (index) {
                        return index.key === view.key;
                    });
                    if (result !== undefined && result !== null) {
                        return result.value.index;
                    }
                    throw {
                        message: 'Index not found for view' + view.canonicalLabel
                    };
                };

                // render strategic views
                strategicViews = _.filter(views, function (view) {
                    return view.viewRecommendationType !== undefined && view.viewRecommendationType['@id'] === StrategicViewUri;
                });
              
                _.each(strategicViews, function (view, index) {
                    addSeries(view, {
                        grouping: false,
                        pointPadding: 0.1,
                        groupPadding: 0,
                        zIndex: 0
                    }, strategicViews[index + 1]);
                });

                series = _.sortBy(series, function (currentSeries) {
                    return currentSeries.view.horizonStartDate;
                });

                // render tactical views
                tacticalViews = _.filter(views, function (view) {
                    return view.viewRecommendationType !== undefined && view.viewRecommendationType['@id'] !== StrategicViewUri;
                });

                _.each(tacticalViews, function (view) {
                    addSeries(view, {
                        borderWidth: 1.1,
                        grouping: true,
                        pointPlacement: 'on',
                        pointPadding: 1,
                        groupPadding: 0.5,
                        zIndex: 2
                    });
                });

                addReportSeries = function (view) {
                    var index = getViewEvolutionSeriesIndex(view),
                        seriesIndex,
                        annotations = [],
                        listOfAnnotations,
                        uniqAnnotations,
                        serviceLabel = _.last(view.service['@id'].split('/')).toUpperCase();
                    
                    seriesIndex = _.find(seriesIndexMap, function (current) {
                        return current.key === view.key;
                    });
                    
                    if (view.viewRecommendationType['@id'] === StrategicViewUri) {
                        index -= 0.3; // move the market down a bit
                    } else {
                        index += 0.3;
                    }
                    listOfAnnotations = _.pluck(view.annotations, 'values');
                    _.each(listOfAnnotations, function (current) {
                        annotations = _.union(annotations, current);
                    });

                    uniqAnnotations = _.uniq(annotations, function (annotation) {
                        return annotation.annotationFor['@id'];
                    });
                    
                    _.each(uniqAnnotations, function (annotation) {
                        var date = Dates.toUTCDate(annotation.annotationFor.published);
                        series.push(
                            {
                                annotation: annotation,
                                name: serviceLabel,
                                category: seriesIndex.value.category,
                                legendIndex: seriesIndex.value.index,
                                type: 'scatter',
                                data: [[index, date]],
                                marker: {
                                    radius: 4,
                                    symbol: view.viewRecommendationType['@id'] === StrategicViewUri ? 'square' : 'diamond'
                                },
                                color: '#093981',
                                zIndex: 4,
                                view: view
                            });
                    });
                };
                
                // render views reports
                _.each(views, function (view) {
                    addReportSeries(view);
                });
               
                return {
                    series: series,
                    xAxis: {
                        categories: _.map(seriesIndexMap, function (current) {
                            var first = _.first(current.value.views),
                                viewable;
                            if (first !== undefined && first !== null) {
                                viewable = first.viewOn;
                            }
                            return {
                                name: current.value.category,
                                serviceName: current.value.serviceName,
                                description: current.value.description,
                                viewable: viewable
                            };
                        })
                    }
                };
            }
        };
    };

    highcharts.$inject = ['Dates', 'View', 'StrategicViewUri', 'AbsoluteViewUri', 'Color'];
    return highcharts;
});