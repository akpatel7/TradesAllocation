define(['angular', 'underscore', 'App/Helpers/String', 'moment', 'highcharts'], function (angular, _, string, moment) {
    'use strict';


    var directive = function ($compile, Analytics, StrategicViewUri, TacticalViewUri, redirectService, UrlProvider, HighCharts, View) {
        var barHeight = 40;

        return {
            restrict: 'EA',
            template: '<div>' +
                        '<div class="options">' +
                            '<ul class="nav nav-pills">' +
                                '<li>Showing:</li>' +
                                '<li class="dropdown view-types">' +
                                    '<a href="#" class="dropdown-toggle" data-toggle="dropdown">{{selectedViewType}} <b class="icon-caret-down"></b></a>' +
                                    '<ul class="dropdown-menu">' +
                                       '<li ng-if="settings.viewType.tactical.enabled"><a ng-class="{ \'selected\': settings.viewType.tactical.visible }" href="" ng-click="toggleTactical()"><i ng-show="settings.viewType.tactical.visible" class="icon-ok"></i> {{settings.viewType.tactical.label}}</a></li>' +
                                       '<li ng-if="settings.viewType.strategic.enabled"><a ng-class="{ \'selected\': settings.viewType.strategic.visible }" href="" ng-click="toggleStrategic()"><i ng-show="settings.viewType.strategic.visible" class="icon-ok"></i> {{settings.viewType.strategic.label}}</a></li>' +
                                    '</ul>' +
                                '</li>' +
                                '<li class="dropdown view-status">' +
                                    '<a href="#" class="dropdown-toggle" data-toggle="dropdown" ng-switch="settings.viewStatus.all.visible">' +
                                        '<span ng-switch-when="false">{{settings.viewStatus.active.label}} </span>' +
                                        '<span ng-switch-when="true">{{settings.viewStatus.all.label}} </span>' +
                                    '<b class="icon-caret-down"></b>' +
                                    '</a>' +
                                    '<ul class="dropdown-menu">' +
                                       '<li><a href="" ng-click="settings.viewStatus.all.visible = !settings.viewStatus.all.visible"><i ng-show="!settings.viewStatus.all.visible" class="icon-ok"></i> {{settings.viewStatus.active.label}}</a></li>' +
                                       '<li><a href="" ng-click="settings.viewStatus.all.visible = !settings.viewStatus.all.visible"><i ng-show="settings.viewStatus.all.visible" class="icon-ok"></i> {{settings.viewStatus.all.label}}</a></li>' +
                                    '</ul>' +
                                '</li>' +
                                '<li class="dropdown reports" ng-if="settings.report.enabled">' +
                                    '<a href="#" class="dropdown-toggle" data-toggle="dropdown"><span ng-if="!settings.report.visible">No </span>{{settings.report.label}} <b class="icon-caret-down"></b></a>' +
                                    '<ul class="dropdown-menu">' +
                                       '<li><a href="" ng-click="settings.report.visible = !settings.report.visible"><i ng-show="settings.report.visible" class="icon-ok"></i> {{settings.report.label}}</a></li>' +
                                    '</ul>' +
                                '</li>' +
                                '<li class="dropdown export-dropdown pull-right" >' +
                                    '<a href="" class="dropdown-toggle" data-toggle="dropdown"><i class="icon-external-link"></i> EXPORT <b class="caret"></b></a>' +
                                    '<ul class="dropdown-menu"> ' +
                                        '<li><a href="{{ excelExportUrl }}">DATA</a></li>' +
                                    '</ul>' +
                                '</li>' +
                            '</ul>' +
                             '<a bs-popover="\'Templates/ViewEvolutionChart/ModalAddServiceViews.html\'" href="" data-placement="right" auto-close-popover data-title="ADD SERVICE VIEWS">' +
                                        '<button class="bca-btn-blue btn-add-service-views">' +
                                        '<i class="icon-plus" title="Add Service Views"></i>' +
                                        '</button>' +
                            '</a>' +
                        '</div>' +
                       
                        '<div class="chart-container"></div>' +
                       
                    '</div>',
            scope: {
                views: '=',
                viewableId: '=',
                viewableDominantView: '=',
                chartCreatedCallback: '&',
                customSettings: '=',
                forceRedraw: '='
            },
            transclude: true,
            replace: true,
            link: function (scope, element, attrs) {
                var bindLabels = function() {
                    element.children().find('.service-label').on('click', function () {
                        var categoryName = this.attributes['data-category'].value,
                            viewableUri = this.attributes['data-viewable'].value,
                            category;

                        category = _.find(scope.categories, function (c) {
                            return c.name === categoryName && c.viewable['@id'] === viewableUri;
                        });

                        if (category !== undefined && category !== null && !category.isDominantViewCategory) {
                            scope.$apply(function () {
                                category.visible = false;
                            });
                        }
                    });
                };
                scope.categories = [];
                scope.serviceViews = [];
                scope.settings = {
                    viewType: {
                        tactical: {
                            visible: true,
                            enabled: true,
                            label: 'Tactical'
                        },
                        strategic: {
                            visible: true,
                            enabled: true,
                            label: 'Strategic'
                        }
                    },
                    report: {
                        visible: true,
                        enabled: true,
                        label: 'Report Indicators'
                    },
                    viewStatus: {
                        all: {
                            label: 'Active & Expired',
                            visible: false
                        },
                        active: {
                            label: 'Active'
                        }
                    },
                    viewsTogglable: {
                        enabled: true
                    }
                };
                scope.$watch('settings.viewType', function() {
                    if (scope.settings.viewType.strategic.visible && scope.settings.viewType.tactical.visible) {
                        scope.selectedViewType = scope.settings.viewType.tactical.label + ' & ' + scope.settings.viewType.strategic.label;
                    } else if (scope.settings.viewType.strategic.visible) {
                        scope.selectedViewType = scope.settings.viewType.strategic.label;
                    } else if (scope.settings.viewType.tactical.visible) {
                        scope.selectedViewType = scope.settings.viewType.tactical.label;
                    } else {
                        scope.selectedViewType = '-';
                    }
                
                }, true);
                scope.toggleTactical = function() {
                    scope.settings.viewType.tactical.visible = !scope.settings.viewType.tactical.visible;
                    if (!scope.settings.viewType.tactical.visible && !scope.settings.viewType.strategic.visible) {
                        scope.settings.viewType.strategic.visible = true;
                    }
                };
                scope.toggleStrategic = function () {
                    scope.settings.viewType.strategic.visible = !scope.settings.viewType.strategic.visible;
                    if (!scope.settings.viewType.tactical.visible && !scope.settings.viewType.strategic.visible) {
                        scope.settings.viewType.tactical.visible = true;
                    }
                };
                scope.applyFilters = function (options) {
                    var series = [],
                        setVisible = function(s, value) {
                            if (s.hasOwnProperty('setVisible')) {
                                s.setVisible(value, false);
                            } else {
                                s.visible = value;
                            }
                        };
                    if (options) {
                        series = options.series;
                    } else if (scope.chart !== undefined) {
                        series = scope.chart.series;
                    }
                    _.each(series, function (currentSeries) {
                        var s = currentSeries.userOptions,
                            visible;
                        if (s === undefined) {
                            s = currentSeries;
                        }
                        if (s.view.viewRecommendationType['@id'] === StrategicViewUri) {
                            if (s.annotation !== undefined) {
                                // strategic annotation
                                visible = scope.settings.report.visible && scope.settings.viewType.strategic.visible;
                            } else {
                                // strategic view
                                visible = (scope.settings.viewType.strategic.visible === true);
                                //currentSeries.options.pointWidth = barHeight;
                            }
                        } else {
                            if (s.annotation !== undefined) {
                                // tactical annotation
                                visible = scope.settings.report.visible && scope.settings.viewType.tactical.visible;
                            } else {
                                // tactical view
                                visible = (scope.settings.viewType.tactical.visible === true);
                            }
                        }
                        setVisible(currentSeries, visible);
                    });
                };
                
                scope.$watch('settings.viewType', function (newVal) {
                    if (scope.chart !== undefined) {
                        scope.applyFilters();
                        scope.chart.redraw();
                    }
                }, true);
             
                scope.setExportUrl = function () {
                    var recommendationType = [],
                        visibleCategories,
                        categoryFilters,
                        viewables = [];
                    if (scope.settings.viewType.strategic.visible) {
                        recommendationType.push(StrategicViewUri);
                    }

                    if (scope.settings.viewType.tactical.visible) {
                        recommendationType.push(TacticalViewUri);
                    }
                    
                    visibleCategories = _.filter(scope.categories, function(c) { return c.visible; });
                    categoryFilters = _.map(visibleCategories, function(c) {
                        var viewIsRelativeTo = HighCharts.getRelativeView(c);
                        return { service: c.service['@id'], viewRelativeTo: (viewIsRelativeTo ? viewIsRelativeTo['@id'] : '') };
                    });
                    viewables = _.uniq(_.map(scope.views.views, function (view) {
                        return view.viewOn['@id'];
                    }));
                    
                    UrlProvider.getViewHistoryExcelExportUrl(viewables, recommendationType, categoryFilters, scope.settings.viewStatus.all.visible).then(function (url) {
                        scope.excelExportUrl = url;
                    });
                };

                var options = {
                    chart: {
                        type: attrs.type,
                        inverted: true,
                        renderTo: $('.chart-container', element)[0],
                        width: attrs.width,
                        marginTop: 50,
                        zoomType: 'y',
                        events: {
                            load: function () {
                                scope.setExportUrl();
                                scope.$eval(scope.chartCreatedCallback);
                                if (scope.settings.viewsTogglable.enabled) {
                                    bindLabels();
                                }
                            },
                            redraw: function () {
                                if (scope.settings.viewsTogglable.enabled) {
                                    bindLabels();
                                }
                            }
                        }                       
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: attrs.title || ''
                    },
                    legend: {
                        enabled: false
                    },
                    xAxis: {
                        minRange: 1, // useful if there is only one single tactical view being rendered
                        labels: {
                            useHTML: true,
                            formatter: function () {
                                if (this.value.hasOwnProperty('serviceName')) {
                                    var serviceLabel = this.value.serviceName,
                                        description = '',
                                        template = '<div class="service-label" data-category="{{category}}" data-viewable="{{viewable}}"> <div class="label {{colorClass}}"">';
                                    if (this.value.name !== scope.dominantViewCategory && scope.settings.viewsTogglable.enabled) {
                                       template += '<i class="icon-remove pull-right"></i>';
                                    }
                                    template += '{{serviceLabel}}</div>';
                                  
                                    if (this.value.serviceName === 'BCAH') {
                                        serviceLabel = '<i class="icon-home"></i> BCA';
                                    }
                                    if (this.value.description !== undefined && this.value.description.length > 0) {
                                        description = this.value.description;
                                        template += '<div class="sublabel">{{description}}</div>';
                                    }
                                    template += '</div>';
                                    template = template.replace('{{category}}', this.value.name);
                                    template = template.replace('{{viewable}}', this.value.viewable !== undefined ? this.value.viewable['@id'] : '');
                                    template = template.replace('{{serviceLabel}}', serviceLabel);
                                    template = template.replace('{{description}}', string.wrap(description, 15));
                                    template = template.replace('{{colorClass}}', (this.value.viewable !== undefined && this.value.viewable['@id'] === scope.viewableId) ? 'main-viewable-color' : 'related-viewable-color');
                                    return template;
                                }
                                return '';
                            }
                        }
                    },
                    yAxis: {
                        title: {
                            text: attrs.yAxisTitle || ''
                        },
                        type: 'datetime',
                        labels: {
                            useHTML: true,
                            formatter: function () {
                                var date = moment(this.value);
                                if (date.month() === 0) {
                                    return '<div class="label-main-date">' + date.format('MMM').toUpperCase() + '<br />' + date.format('YYYY') + '</div>';
                                } else {
                                    return '<div class="label-date">' + date.format('MMM').toUpperCase() + '</div>';
                                }
                            }
                        }
                    },
                    navigation: {
                        buttonOptions: {
                            theme: {
                                fill: '#093981',
                                stroke: '#093981',
                                style: {
                                    color: 'white'
                                },
                                states: {
                                    hover: {
                                        style: {
                                            color: '#093981'
                                        },
                                        fill: 'white',
                                        stroke: '#093981'
                                    },
                                    select: {
                                        style: {
                                            color: '#093981'
                                        },
                                        fill: 'white',
                                        stroke: '#093981'
                                    }
                                }
                            }
                        }
                    },
                    exporting: {
                        buttons: {
                            contextButton: {
                                enabled: false
                            }
                        }
                    },
                    tooltip: {
                        useHTML: true,
                        formatter: function () {
                            var tooltipScope = scope.$new(),
                                tooltipElement;
                            if (this.series.type === 'columnrange') {
                                tooltipScope.view = this.series.userOptions.view;
                                tooltipElement = $compile('<div view-chart-tooltip view="view"></div>')(tooltipScope);
                                tooltipScope.$digest();
                                return tooltipElement.html();
                            } else if (this.series.type === 'scatter') {
                                tooltipScope.annotation = this.series.userOptions.annotation;
                                tooltipElement = $compile('<div report-chart-tooltip annotation="annotation"></div>')(tooltipScope);
                                tooltipScope.$digest();
                                return tooltipElement.html();
                            }
                            return '';
                        },
                        height: 100,
                        borderRadius: 0,
                        backgroundColor: null,
                        borderColor: null,
                        shadow: false,
                        borderWidth: 0,
                        positioner: function (boxWidth, boxHeight, point) {
                            var x,
                                y;
                            x = point.plotX - 20;
                            y = (point.plotY / 10) * 10 - boxHeight + 40;

                            if (x < 0) {
                                x = 0;
                            }
                            return {
                                x: x,
                                y: y
                            };
                        }
                    },
                    plotOptions: {
                        series: {
                            animation: false,
                            borderWidth: 1,
                            borderColor: 'white',
                            tooltip: {
                                followPointer: true
                            },
                            events: {
                                legendItemClick: function (event) {
                                },
                                click: function (event) {
                                    if (event.currentTarget.userOptions.annotation !== undefined) {
                                        var url = UrlProvider.getLiveReportUrl(event.currentTarget.userOptions.annotation.annotationFor['@id']),
                                            reportTitle = event.currentTarget.userOptions.annotation.annotationFor.title;
                                        Analytics.registerClick('accessreport_' + reportTitle.replace(' ', '_').toUpperCase());
                                        redirectService.redirectTo(url);
                                    } else if (event.currentTarget.userOptions.view.viewRecommendationType['@id'] === StrategicViewUri) {
                                        var seriesOptions;
                                        var reset = function (currentSeries) {
                                            seriesOptions = {
                                                data: [[currentSeries.userOptions.data[0][0], currentSeries.userOptions.data[0][1], currentSeries.userOptions.seriesEndDate]],
                                                zIndex: currentSeries.userOptions.view.viewRecommendationType['@id'] === StrategicViewUri ? 0 : 2
                                            };
                                            _.extend(seriesOptions, currentSeries.userOptions.states.unselect);
                                            currentSeries.update(seriesOptions, false);
                                        };
                                        if (event.currentTarget.userOptions.selected === undefined || event.currentTarget.userOptions.selected === false) {
                                            // reset others
                                            var selectedSeries = _.filter(event.currentTarget.chart.series, function (currentSeries) {
                                                return currentSeries.userOptions.selected !== undefined && currentSeries.userOptions.selected === true;
                                            });
                                            _.each(selectedSeries, function (currentSeries) {
                                                reset(currentSeries);
                                                currentSeries.userOptions.selected = false;
                                            });

                                            _.extend(event.currentTarget.userOptions, {
                                                selected: true
                                            });

                                            seriesOptions = {
                                                data: [[event.currentTarget.userOptions.data[0][0], event.currentTarget.userOptions.data[0][1], event.currentTarget.userOptions.selectedSeriesEndDate]],
                                                zIndex: event.currentTarget.userOptions.view.viewRecommendationType['@id'] === StrategicViewUri ? 1 : 3
                                            };
                                            _.extend(seriesOptions, event.currentTarget.userOptions.states.select);
                                            event.currentTarget.update(seriesOptions, false);
                                        } else {
                                            reset(event.currentTarget);
                                           
                                            event.currentTarget.userOptions.selected = false;
                                        }
                                        event.currentTarget.chart.redraw();
                                    }
                                }
                            },
                            allowPointSelect: true
                        }
                    }
                };

                scope.createChart = function (views) {
                    var barPadding = 10,
                        tacticalSeries,
                        strategicSeries,
                        reportSeries,
                        newOptions,
                        chartOptions;
                    chartOptions = HighCharts.processViews(views);

                    newOptions = {
                        chart: {
                            height: options.chart.marginTop + (barHeight + barPadding) * (1 + chartOptions.xAxis.categories.length),
                            renderTo: $('.chart-container', element),
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }
                    };
                    
                    $.extend(true, newOptions, options, chartOptions);
               
                    tacticalSeries = _.filter(chartOptions.series, function (current) {
                        return current.view.viewRecommendationType['@id'] !== StrategicViewUri && current.annotation === undefined;
                    });
                    strategicSeries = _.filter(chartOptions.series, function (current) {
                        return current.view.viewRecommendationType['@id'] === StrategicViewUri && current.annotation === undefined;
                    });
                    reportSeries = _.filter(chartOptions.series, function (current) {
                        return current.annotation !== undefined;
                    });
                    if (tacticalSeries.length === 0) {
                        scope.settings.viewType.tactical.enabled = scope.settings.viewType.tactical.visible = false;
                    } else {
                        scope.settings.viewType.tactical.enabled = true;
                    }
                    if (strategicSeries.length === 0) {
                        scope.settings.viewType.strategic.enabled = scope.settings.viewType.strategic.visible = false;
                    } else {
                        scope.settings.viewType.strategic.enabled = true;
                    }
                    if (reportSeries.length === 0) {
                        scope.settings.report.enabled = scope.settings.report.visible = false;
                    }
                    
                    if (scope.chart !== undefined) {
                        scope.chart.destroy();
                    }
                    
                    scope.applyFilters(newOptions);
                   

                    scope.chart = new Highcharts.Chart(newOptions);
                };
                
                scope.$watch('views', function (newVal, oldVal) {
                    if (newVal) {
                        
                        if (scope.viewableDominantView) {
                            scope.dominantViewCategory = HighCharts._getCategory(scope.viewableDominantView);
                        }

                        var categories = _.map(scope.views.views, function (view) {
                            var viewIsRelativeTo = HighCharts.getRelativeView(view),
                                category = HighCharts._getCategory(view),
                                title = HighCharts._getServiceName(view) + (viewIsRelativeTo ? ' / ' + viewIsRelativeTo.canonicalLabel : ''),
                                viewableUri = view.viewOn['@id'];
                            return {
                                name: category,
                                title: string.wrap(title, 15),
                                visible: true,
                                isDominantViewCategory: scope.dominantViewCategory && scope.dominantViewCategory === category,
                                service: view.service,
                                viewRelativeTo: viewIsRelativeTo,
                                viewableUri: viewableUri,
                                viewable: view.viewOn,
                                cssClass: viewableUri === scope.viewableId ? 'bca-btn-blue' : 'bca-btn-purple'
                            };
                        });
                        categories = _.uniq(categories, function(c) {
                            return c.name + c.viewableUri;
                        });
                        categories = _.sortBy(categories, function(c) {
                            return c.name;
                        });
                        var serviceViews = _.groupBy(categories, function(c) {
                            return c.viewable.canonicalLabel;
                        });
                        scope.serviceViews = _.map(serviceViews, function(item, key) {
                            return {
                                key: key,
                                values: item
                            };
                        });
                        scope.categories = categories;

                        // apply custom settings
                        if (scope.customSettings !== undefined) {
                            $.extend(true, scope.settings, scope.customSettings);
                        }
                    }
                }, true);

                scope.$watch(function() {
                    return {
                        categoriesLength: scope.categories.length,
                        categories: _.pluck(scope.categories, 'visible'),
                        views: scope.views.views !== undefined ? scope.views.views.length : 0,
                        activeViews: scope.settings.viewStatus.all.visible,
                        strategicView: scope.settings.viewType.strategic.visible,
                        tacticalView: scope.settings.viewType.tactical.visible,
                        report: scope.settings.report.visible,
                        forceRedraw: scope.forceRedraw
                    };
                }, function (newVal) {
                    if (newVal && newVal.views > 0) {
                        var views = [];
                        
                        _.each(scope.views.views, function (view) {
                            var category = HighCharts._getCategory(view),
                                visible;
                            var foundCategory = _.find(scope.categories, function (c) {
                                return c.name === category && c.viewableUri === view.viewOn['@id'];
                            });
                            if (foundCategory !== undefined && foundCategory !== null) {
                                visible = foundCategory.visible;
                            }
                            if (visible) {
                                views.push(view);
                            }
                        });
                        scope.createChart(!scope.settings.viewStatus.all.visible ? View.getActiveViews(views) : views);
                    }
                }, true);

                scope.$on('$destroy', function() {
                    if (scope.chart) {
                        scope.chart.destroy();
                    }
                });
            }
        };

    };

    directive.$inject = ['$compile', 'Analytics', 'StrategicViewUri', 'TacticalViewUri', 'redirectService', 'UrlProvider', 'HighCharts', 'View'];

    return directive;
});

