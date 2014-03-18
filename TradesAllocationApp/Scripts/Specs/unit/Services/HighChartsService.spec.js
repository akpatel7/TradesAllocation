define(['underscore',
        'App/Services/HighChartsService',
        'angular',
        'mocks'], function (_) {
            describe('HighCharts Service', function () {
                describe('Given we have a HighCharts Service', function () {

                    beforeEach(function () {
                        module('App.services');
                    });

                    describe('Given we have 2 evolved views from 2 different services, and 2 tactical views', function () {
                        // CES: medium/long -- medium/long
                        // GIS: low/short -> medium/short -> high/short
                        // USIS: tactical
                        describe('When processing the views', function () {
                            var data;
                            beforeEach(function () {
                                data = [
                                    {
                                        '@id': 'http://data.emii.com/gis-view-1',
                                        viewOrigin: {
                                            '@id': 'http://data.emii.com/gis-view-1'
                                        },
                                        viewType: {
                                            '@id': 'http://data.emii.com/view-types/absolute'
                                        },
                                        service: {
                                            '@id': 'http://data.emii.com/bca/services/gis'
                                        },
                                        horizonStartDate: '2012-12-31',
                                        horizonEndDate: '2013-06-30',
                                        viewConviction: {
                                            canonicalLabel: 'low'
                                        },
                                        viewDirection: {
                                            canonicalLabel: 'short',
                                            '@id': 'http://data.emii.com/ontologies/bca/viewDirection/short'
                                        },
                                        viewRecommendationType: {
                                            '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                        },
                                        viewOn: {
                                            '@id': 'http://data.emii.com/economy/us',
                                            canonicalLabel: 'US Economy'
                                        },
                                        annotations: [
                                            {
                                                key: 'http://data.emii.com/annotation-types/support',
                                                values: []
                                            },
                                            {
                                                key: 'http://data.emii.com/annotation-types/scenario',
                                                values: []
                                            }
                                        ]
                                    },
                                    {
                                        '@id': 'http://data.emii.com/gis-view-3',
                                        viewOrigin: {
                                            '@id': 'http://data.emii.com/gis-view-1'
                                        },
                                        viewType: {
                                            '@id': 'http://data.emii.com/view-types/absolute'
                                        },
                                        service: {
                                            '@id': 'http://data.emii.com/bca/services/gis'
                                        },
                                        horizonStartDate: '2013-05-01',
                                        horizonEndDate: '2015-05-01',
                                        viewConviction: {
                                            canonicalLabel: 'high'
                                        },
                                        viewDirection: {
                                            canonicalLabel: 'short',
                                            '@id': 'http://data.emii.com/ontologies/bca/viewDirection/short'
                                        },
                                        viewRecommendationType: {
                                            '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                        },
                                        viewOn: {
                                            '@id': 'http://data.emii.com/economy/us',
                                            canonicalLabel: 'US Economy'
                                        },
                                        annotations: [
                                            {
                                                key: 'http://data.emii.com/annotation-types/support',
                                                values: []
                                            },
                                            {
                                                key: 'http://data.emii.com/annotation-types/scenario',
                                                values: []
                                            }
                                        ]
                                    },
                                    {
                                        '@id': 'http://data.emii.com/gis-view-2',
                                        viewOrigin: {
                                            '@id': 'http://data.emii.com/gis-view-1'
                                        },
                                        viewType: {
                                            '@id': 'http://data.emii.com/view-types/absolute'
                                        },
                                        service: {
                                            '@id': 'http://data.emii.com/bca/services/gis'
                                        },
                                        horizonStartDate: '2013-02-01',
                                        horizonEndDate: '2013-08-30',
                                        viewConviction: {
                                            canonicalLabel: 'medium'
                                        },
                                        viewDirection: {
                                            canonicalLabel: 'short',
                                            '@id': 'http://data.emii.com/ontologies/bca/viewDirection/short'
                                        },
                                        viewRecommendationType: {
                                            '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                        },
                                        viewOn: {
                                            '@id': 'http://data.emii.com/economy/us',
                                            canonicalLabel: 'US Economy'
                                        },
                                        annotations: [
                                            {
                                                key: 'http://data.emii.com/annotation-types/support',
                                                values: [
                                                    {
                                                        '@id': 'urn:annotation:bca.gis.support1',
                                                        references: {
                                                            '@id': 'http://data.emii.com/gis-view-2'
                                                        },
                                                        annotationFor: {
                                                            published: '2013-04-20T09:00:00Z',
                                                            '@id': 'urn:document:bca.gis_sr_2013_04_20'
                                                        }
                                                    }
                                                ]
                                            },
                                            {
                                                key: 'http://data.emii.com/annotation-types/scenario',
                                                values: [
                                                    {
                                                        '@id': 'urn:annotation:bca.gis.scenario1',
                                                        references: {
                                                            '@id': 'http://data.emii.com/gis-view-2'
                                                        },
                                                        annotationFor: {
                                                            published: '2013-04-20T09:00:00Z',
                                                            '@id': 'urn:document:bca.gis_sr_2013_04_20'
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        '@id': 'http://data.emii.com/ces-view-1',
                                        viewOrigin: {
                                            '@id': 'http://data.emii.com/ces-view-1'
                                        },
                                        viewType: {
                                            '@id': 'http://data.emii.com/view-types/absolute'
                                        },
                                        service: {
                                            '@id': 'http://data.emii.com/bca/services/ces'
                                        },
                                        horizonStartDate: '2013-01-01',
                                        horizonEndDate: '2014-01-01',
                                        viewConviction: {
                                            canonicalLabel: 'medium'
                                        },
                                        viewDirection: {
                                            '@id': 'http://data.emii.com/ontologies/bca/viewDirection/long',
                                            canonicalLabel: 'long'
                                        },
                                        viewRecommendationType: {
                                            '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                        },
                                        viewOn: {
                                            '@id': 'http://data.emii.com/economy/us',
                                            canonicalLabel: 'US Economy'
                                        },
                                        annotations: [
                                            {
                                                key: 'http://data.emii.com/annotation-types/support',
                                                values: []
                                            },
                                            {
                                                key: 'http://data.emii.com/annotation-types/scenario',
                                                values: []
                                            }
                                        ]
                                    },
                                    {
                                        '@id': 'http://data.emii.com/ces-view-2',
                                        viewOrigin: {
                                            '@id': 'http://data.emii.com/ces-view-1'
                                        },
                                        viewType: {
                                            '@id': 'http://data.emii.com/view-types/absolute'
                                        },
                                        service: {
                                            '@id': 'http://data.emii.com/bca/services/ces'
                                        },
                                        horizonStartDate: '2013-06-01',
                                        horizonEndDate: '2015-06-01',
                                        viewConviction: {
                                            canonicalLabel: 'medium'
                                        },
                                        viewDirection: {
                                            '@id': 'http://data.emii.com/ontologies/bca/viewDirection/long',
                                            canonicalLabel: 'long'
                                        },
                                        viewRecommendationType: {
                                            '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                        },
                                        viewOn: {
                                            '@id': 'http://data.emii.com/economy/us',
                                            canonicalLabel: 'US Economy'
                                        },
                                        annotations: [
                                            {
                                                key: 'http://data.emii.com/annotation-types/support',
                                                values: []
                                            },
                                            {
                                                key: 'http://data.emii.com/annotation-types/scenario',
                                                values: []
                                            }
                                        ]
                                    },
                                    {
                                        '@id': 'http://data.emii.com/tactical-view',
                                        viewRecommendationType: {
                                            '@id': 'http://data.emii.com/view-recommendation-types/tactical'
                                        },
                                        viewType: {
                                            '@id': 'http://data.emii.com/view-types/absolute'
                                        },
                                        horizonStartDate: '2013-07-01',
                                        horizonEndDate: '2014-01-01',
                                        viewDirection: {
                                            '@id': 'http://data.emii.com/ontologies/bca/viewDirection/long',
                                            canonicalLabel: 'long'
                                        },
                                        viewOn: {
                                            '@id': 'http://data.emii.com/economy/us',
                                            canonicalLabel: 'US Economy'
                                        },
                                        annotations: [
                                           {
                                               key: 'http://data.emii.com/annotation-types/support',
                                               values: [
                                                   {
                                                       '@id': 'urn:annotation:bca.tactical.gis.support1',
                                                       references: {
                                                           '@id': 'http://data.emii.com/tactical-view'
                                                       },
                                                       annotationFor: {
                                                           published: '2013-04-20T09:00:00Z',
                                                           '@id': 'urn:document:bca.gis_sr_2013_04_20'
                                                       }
                                                   }
                                               ]
                                           }
                                        ],
                                        service: {
                                            '@id': 'http://data.emii.com/bca/services/usis'
                                        }
                                    },
                                    {
                                        '@id': 'http://data.emii.com/tactical-view-2',
                                        viewRecommendationType: {
                                            '@id': 'http://data.emii.com/view-recommendation-types/tactical'
                                        },
                                        viewType: {
                                            '@id': 'http://data.emii.com/view-types/absolute'
                                        },
                                        horizonStartDate: '2013-08-01',
                                        horizonEndDate: '2014-01-01',
                                        viewDirection: {
                                            '@id': 'http://data.emii.com/ontologies/bca/viewDirection/long',
                                            canonicalLabel: 'long'
                                        },
                                        service: {
                                            '@id': 'http://data.emii.com/bca/services/usis'
                                        },
                                        viewOn: {
                                            '@id': 'http://data.emii.com/economy/us',
                                            canonicalLabel: 'US Economy'
                                        }
                                    }
                                ];
                            });
                            it('should return 7 series of type "columnrange"', inject(function (HighCharts) { // there is 1 series per origin
                                var result = HighCharts.processViews(data);
                                var columnRangeSeries = _.filter(result.series, function (currentSeries) {
                                    return currentSeries.type === 'columnrange';
                                });
                                expect(columnRangeSeries.length).toBe(7);
                            }));

                            it('strategic series should be ordered by the oldest first', inject(function (HighCharts) {
                                var result = HighCharts.processViews(data);
                                expect(result.series[0].view['@id']).toBe('http://data.emii.com/gis-view-1'); // 31/12/2012
                                expect(result.series[1].view['@id']).toBe('http://data.emii.com/ces-view-1'); // 01/01/2013
                                expect(result.series[2].view['@id']).toBe('http://data.emii.com/gis-view-2'); // 01/02/2013
                                expect(result.series[3].view['@id']).toBe('http://data.emii.com/gis-view-3'); // 01/05/2013
                                expect(result.series[4].view['@id']).toBe('http://data.emii.com/ces-view-2'); // 01/06/2013
                            }));

                            it('tactical series should be added after the strategic views', inject(function (HighCharts) {
                                var result = HighCharts.processViews(data);
                                expect(result.series[5].view['@id']).toBe('http://data.emii.com/tactical-view');
                                expect(result.series[6].view['@id']).toBe('http://data.emii.com/tactical-view-2');
                            }));

                            it('series should only have one data points list', inject(function (HighCharts) {
                                var result = HighCharts.processViews(data);
                                expect(result.series[0].data.length).toBe(1);
                                expect(result.series[1].data.length).toBe(1);
                                expect(result.series[2].data.length).toBe(1);
                                expect(result.series[3].data.length).toBe(1);
                                expect(result.series[4].data.length).toBe(1);
                                expect(result.series[5].data.length).toBe(1); // tactical view
                            }));

                            it('CES series index should be 0', inject(function (HighCharts) {
                                var result = HighCharts.processViews(data);
                                expect(result.series[1].data[0][0]).toBe(0);
                                expect(result.series[4].data[0][0]).toBe(0);
                            }));

                            it('CES series legend index should be 0', inject(function (HighCharts) {
                                var result = HighCharts.processViews(data);
                                expect(result.series[1].legendIndex).toBe(0);
                                expect(result.series[4].legendIndex).toBe(0);
                            }));

                            it('GIS series index should be 1', inject(function (HighCharts) {
                                var result = HighCharts.processViews(data);
                                expect(result.series[0].data[0][0]).toBe(1);
                                expect(result.series[2].data[0][0]).toBe(1);
                                expect(result.series[3].data[0][0]).toBe(1);
                            }));

                            it('GIS series legend index should be 1', inject(function (HighCharts) {
                                var result = HighCharts.processViews(data);
                                expect(result.series[0].legendIndex).toBe(1);
                                expect(result.series[2].legendIndex).toBe(1);
                                expect(result.series[3].legendIndex).toBe(1);
                            }));

                            it('USIS series index should be 2', inject(function (HighCharts) {
                                var result = HighCharts.processViews(data);
                                expect(Math.round(result.series[5].data[0][0])).toBe(2);
                            }));

                            it('USIS series legend index should be 2', inject(function (HighCharts) {
                                var result = HighCharts.processViews(data);
                                expect(result.series[5].legendIndex).toBe(2);
                            }));

                            it('CES series should have the name CES', inject(function (HighCharts) {
                                var result = HighCharts.processViews(data);
                                expect(result.series[1].name).toBe('CES');
                                expect(result.series[4].name).toBe('CES');
                            }));

                            it('GIS views should have the name GIS', inject(function (HighCharts) {
                                var result = HighCharts.processViews(data);
                                expect(result.series[0].name).toBe('GIS');
                                expect(result.series[2].name).toBe('GIS');
                                expect(result.series[3].name).toBe('GIS');
                            }));

                            it('USIS series should have the name USIS', inject(function (HighCharts) {
                                var result = HighCharts.processViews(data);
                                expect(result.series[5].name).toBe('USIS');
                            }));

                            it('gis-view-1 should have the right dates', inject(function (HighCharts) {
                                var result = HighCharts.processViews(data);
                                expect(result.series[0].data[0][1]).toEqual(1356912000000); // 2012-12-31
                                expect(result.series[0].data[0][2]).toEqual(1359676800000); // 2013-02-01
                                expect(result.series[0].seriesEndDate).toEqual(1359676800000); // 2013-02-01
                                expect(result.series[0].selectedSeriesEndDate).toEqual(1372550400000); // 2013-06-30
                            }));

                            it('gis-view-2 should have the right dates', inject(function (HighCharts) {
                                var result = HighCharts.processViews(data);
                                expect(result.series[2].data[0][1]).toEqual(1359676800000); // 2013-02-01
                                expect(result.series[2].data[0][2]).toEqual(1367366400000); // 2013-05-01
                                expect(result.series[2].seriesEndDate).toEqual(1367366400000); // 2013-05-01
                                expect(result.series[2].selectedSeriesEndDate).toEqual(1377820800000); // 2013-08-30
                            }));

                            it('gis-view-3 should have the right dates', inject(function (HighCharts) {
                                var result = HighCharts.processViews(data);
                                expect(result.series[3].data[0][1]).toEqual(1367366400000); // 2013-05-01
                                expect(result.series[3].data[0][2]).toEqual(1430438400000); // 2015-05-01
                                expect(result.series[3].seriesEndDate).toEqual(1430438400000); // 2015-05-01
                                expect(result.series[3].selectedSeriesEndDate).toEqual(1430438400000); // 2015-05-01
                            }));

                            it('ces-view-1 should have the right dates', inject(function (HighCharts) {
                                var result = HighCharts.processViews(data);
                                expect(result.series[1].data[0][1]).toEqual(1356998400000); // 2013-01-01
                                expect(result.series[1].data[0][2]).toEqual(1370044800000); // 2013-06-01
                                expect(result.series[1].seriesEndDate).toEqual(1370044800000); // 2013-06-01
                                expect(result.series[1].selectedSeriesEndDate).toEqual(1388534400000); // 2014-01-01
                            }));

                            it('ces-view-2 should have the right dates', inject(function (HighCharts) {
                                var result = HighCharts.processViews(data);
                                expect(result.series[4].data[0][1]).toEqual(1370044800000); // 2013-06-01
                                expect(result.series[4].data[0][2]).toEqual(1433116800000); // 2015-06-01
                                expect(result.series[4].data[0][2]).toEqual(1433116800000); // 2015-06-01
                                expect(result.series[4].seriesEndDate).toEqual(1433116800000); // 2015-06-01
                                expect(result.series[4].selectedSeriesEndDate).toEqual(1433116800000); // 2015-06-01
                            }));

                            it('tactical-view should have the right dates', inject(function (HighCharts) {
                                var result = HighCharts.processViews(data);
                                expect(result.series[5].data[0][1]).toEqual(1372636800000); // 2013-07-01
                                expect(result.series[5].data[0][2]).toEqual(1388534400000); // 2014-01-01
                                expect(result.series[5].data[0][2]).toEqual(1388534400000); // 2014-01-01
                                expect(result.series[5].seriesEndDate).toEqual(1388534400000); // 2014-01-01
                                expect(result.series[5].selectedSeriesEndDate).toEqual(1388534400000); // 2014-01-01
                            }));

                            it('GiS series should have the right colours', inject(function (HighCharts) {
                                var result = HighCharts.processViews(data);
                                expect(result.series[0].color).toBe('#F9C2CB');
                                expect(result.series[2].color).toBe('#F28696');
                                expect(result.series[3].color).toBe('#EB3D58');
                            }));

                            it('CES series should have the right colours', inject(function (HighCharts) {
                                var result = HighCharts.processViews(data);
                                expect(result.series[1].color).toBe('#B0E297');
                                expect(result.series[4].color).toBe('#B0E297');
                            }));

                            it('USIS series should have the right colours', inject(function (HighCharts) {
                                var result = HighCharts.processViews(data);
                                expect(result.series[5].color).toBe('#B0E297');
                            }));

                            it('should have 3 categories', inject(function (HighCharts) {
                                var result = HighCharts.processViews(data);
                                expect(_.pluck(result.xAxis.categories, 'name')).toEqual(['CES', 'GIS', 'USIS']);
                            }));

                            it('categories should have the viewable associated with it', inject(function (HighCharts) {
                                var result = HighCharts.processViews(data);
                                expect(result.xAxis.categories[0].viewable).toBeDefined();
                                expect(result.xAxis.categories[0].viewable['@id']).toBe('http://data.emii.com/economy/us');
                            }));
                            
                            it('categories should have the serviceName and description associated with it', inject(function (HighCharts) {
                                var result = HighCharts.processViews(data);
                                expect(result.xAxis.categories[0].serviceName).toBeDefined();
                                expect(result.xAxis.categories[0].description).toBeDefined();
                            }));
                            
                            it('should return 2 series of type "scatter"', inject(function (HighCharts) {
                                var result = HighCharts.processViews(data);
                                var scatterSeries = _.filter(result.series, function (currentSeries) {
                                    return currentSeries.type === 'scatter';
                                });
                                expect(scatterSeries.length).toBe(2);
                            }));

                            it('report series for GIS View 1 should have an index of 0.7', inject(function (HighCharts) {
                                var result = HighCharts.processViews(data);
                                expect(result.series[7].data).toEqual([[0.7, 1366416000000]]); // 2013-04-20
                            }));

                            it('report series for USIS Tactical View should have an index of 2.3', inject(function (HighCharts) {
                                var result = HighCharts.processViews(data);
                                expect(result.series[8].data).toEqual([[2.3, 1366416000000]]); // 2013-04-20
                            }));

                            it('report series for GIS View 1 should have the name GIS', inject(function (HighCharts) {
                                var result = HighCharts.processViews(data);
                                expect(result.series[7].name).toBe('GIS');
                            }));

                            it('report series for GIS View 1 should have the annotation', inject(function (HighCharts) {
                                var result = HighCharts.processViews(data);
                                expect(result.series[7].annotation['@id']).toBe('urn:annotation:bca.gis.support1');
                            }));

                            it('report series for USIS Tactical View should have the name USIS', inject(function (HighCharts) {
                                var result = HighCharts.processViews(data);
                                expect(result.series[8].name).toBe('USIS');
                            }));

                        });
                    });

                    describe('Given we have a single tactical view', function() {
                        describe('When processing the views', function() {
                            var views;
                            
                            beforeEach(function() {
                                views = [
                                    {
                                        viewRecommendationType: {
                                            '@type': 'ViewRecommendationType',
                                            '@id': 'http://data.emii.com/view-recommendation-types/tactical',
                                            'canonicalLabel': 'Tactical'
                                        },
                                        viewOn: {
                                            '@type': 'CurrencyMarket',
                                            '@id': 'http://data.emii.com/currency-pairs/gbp-usd',
                                            'canonicalLabel': 'GBP/USD'
                                        },
                                        viewType: {
                                            '@type': 'ViewType',
                                            '@id': 'http://data.emii.com/view-types/absolute',
                                            'canonicalLabel': 'Absolute'
                                        },
                                        canonicalLabel: 'FES GBP/USD 3 months (2014/01/13) short(A)',
                                        service: {
                                            '@type': 'Service',
                                            'description': 'Forecasts, trading recommendations and technical indicators that highlight intermediate and primary trends for all major currencies.',
                                            '@id': 'http://data.emii.com/bca/services/fes',
                                            'canonicalLabel': 'Foreign Exchange Strategy'
                                        },
                                        viewOrigin: {
                                            '@id': 'http://data.emii.com/bca/views/fes-view0'
                                        },
                                        '@id': 'http://data.emii.com/bca/views/fes-view0'
                                    }
                                ];
                            });
                         

                            it('should return 1 series of type "columnrange"', inject(function (HighCharts) {
                                var result = HighCharts.processViews(views),
                                    columnRangeSeries = _.filter(result.series, function (currentSeries) {
                                    return currentSeries.type === 'columnrange';
                                });
                                expect(result.series.length).toBe(1);
                                expect(columnRangeSeries.length).toBe(1);
                            }));
                            
                            it('should have 1 category', inject(function (HighCharts) {
                                var result = HighCharts.processViews(views);
                                expect(_.pluck(result.xAxis.categories, 'name')).toEqual(['FES']);
                            }));
                            
                            it('categories should have the viewable associated with it', inject(function (HighCharts) {
                                var result = HighCharts.processViews(views);
                                expect(result.xAxis.categories[0].viewable).toBeDefined();
                                expect(result.xAxis.categories[0].viewable['@id']).toBe('http://data.emii.com/currency-pairs/gbp-usd');
                            }));
                        });
                    });
                    
                    describe('Series index map', function () {
                        describe('Given we have 3 views with the 2 having the same viewOrigin', function () {
                            describe('When creating the map', function () {
                                var views;
                                beforeEach(function () {
                                    views = [
                                     {
                                         viewType: {
                                             '@id': 'http://data.emii.com/view-types/absolute'
                                         },
                                         service: {
                                             '@id': 'http://data.emii.com/bca/services/ces'
                                         },
                                         viewOrigin: {
                                             '@id': 'http://data.emii.com/view1'
                                         },
                                         viewRecommendationType: {
                                             '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                         },
                                         viewOn: {
                                             '@id': 'http://data.emii.com/economy/us',
                                             canonicalLabel: 'US Economy'
                                         }
                                     },
                                     {
                                         viewType: {
                                             '@id': 'http://data.emii.com/view-types/absolute'
                                         },
                                         service: {
                                             '@id': 'http://data.emii.com/bca/services/ces'
                                         },
                                         viewOrigin: {
                                             '@id': 'http://data.emii.com/view1'
                                         },
                                         viewRecommendationType: {
                                             '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                         },
                                         viewOn: {
                                             '@id': 'http://data.emii.com/economy/us',
                                             canonicalLabel: 'US Economy'
                                         }
                                     },
                                     {
                                         viewType: {
                                             '@id': 'http://data.emii.com/view-types/absolute'
                                         },
                                         service: {
                                             '@id': 'http://data.emii.com/bca/services/ces'
                                         },
                                         viewOrigin: {
                                             '@id': 'http://data.emii.com/view2'
                                         },
                                         viewRecommendationType: {
                                             '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                         },
                                         viewOn: {
                                             '@id': 'http://data.emii.com/economy/us',
                                             canonicalLabel: 'US Economy'
                                         }
                                     }
                                    ];
                                });
                                it('should return 2 indexes', inject(function (HighCharts) {
                                    var result = HighCharts._createSeriesIndexMap(views);
                                    expect(result.length).toBe(2);
                                }));
                                
                                it('indexes have the service "CES"', inject(function (HighCharts) {
                                    var result = HighCharts._createSeriesIndexMap(views);
                                    expect(result[0].value.serviceName).toBe('CES');
                                    expect(result[1].value.serviceName).toBe('CES');
                                }));
                                
                                it('indexes should have empty description', inject(function (HighCharts) {
                                    var result = HighCharts._createSeriesIndexMap(views);
                                    expect(result[0].value.description).toBe('');
                                    expect(result[1].value.description).toBe('');
                                }));
                            });
                        });

                        describe('Given we 2 strategic absolute views, and 1 absolute tactical view from the same service', function () {
                            describe('When creating the map', function () {
                                var views;
                                beforeEach(function () {
                                    views = [
                                         {
                                             viewType: {
                                                 '@id': 'http://data.emii.com/view-types/absolute'
                                             },
                                             viewRecommendationType: {
                                                 '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                             },
                                             service: {
                                                 '@id': 'http://data.emii.com/bca/services/ces'
                                             },
                                             viewOrigin: {
                                                 '@id': 'http://data.emii.com/view1'
                                             },
                                             '@id': {
                                                 '@id': 'http://data.emii.com/view1'
                                             },
                                             viewOn: {
                                                 '@id': 'http://data.emii.com/economy/us',
                                                 canonicalLabel: 'US Economy'
                                             }

                                         },
                                         {
                                             viewType: {
                                                 '@id': 'http://data.emii.com/view-types/absolute'
                                             },
                                             viewRecommendationType: {
                                                 '@id': 'http://data.emii.com/view-drecommendation-types/strategic'
                                             },
                                             service: {
                                                 '@id': 'http://data.emii.com/bca/services/ces'
                                             },
                                             viewOrigin: {
                                                 '@id': 'http://data.emii.com/view1'
                                             },
                                             '@id': {
                                                 '@id': 'http://data.emii.com/view2'
                                             },
                                             viewOn: {
                                                 '@id': 'http://data.emii.com/economy/us',
                                                 canonicalLabel: 'US Economy'
                                             }

                                         },
                                         {
                                             viewType: {
                                                 '@id': 'http://data.emii.com/view-types/absolute'
                                             },
                                             service: {
                                                 '@id': 'http://data.emii.com/bca/services/ces'
                                             },
                                             viewRecommendationType: {
                                                 '@id': 'http://data.emii.com/view-recommendation-types/tactical'
                                             },
                                             '@id': {
                                                 '@id': 'http://data.emii.com/view3'
                                             },
                                             viewOn: {
                                                 '@id': 'http://data.emii.com/economy/us',
                                                 canonicalLabel: 'US Economy'
                                             }
                                         }
                                    ];
                                });
                                it('should return 1 index', inject(function (HighCharts) {
                                    var result = HighCharts._createSeriesIndexMap(views);
                                    expect(result.length).toBe(1);
                                }));

                                it('should have the view origin view1 for key', inject(function (HighCharts) {
                                    var result = HighCharts._createSeriesIndexMap(views);
                                    expect(result[0].key).toBe('http://data.emii.com/view1 / http://data.emii.com/economy/us');
                                }));

                                it('should have the category "CES"', inject(function (HighCharts) {
                                    var result = HighCharts._createSeriesIndexMap(views);
                                    expect(result[0].value.category).toBe('CES');
                                }));

                                it('view1 should have the key "http://data.emii.com/view1"', inject(function (HighCharts) {
                                    HighCharts._createSeriesIndexMap(views);
                                    expect(views[0].key).toBe('http://data.emii.com/view1 / http://data.emii.com/economy/us');
                                }));

                                it('view2 should have the key "http://data.emii.com/view1"', inject(function (HighCharts) {
                                    HighCharts._createSeriesIndexMap(views);
                                    expect(views[1].key).toBe('http://data.emii.com/view1 / http://data.emii.com/economy/us');
                                }));

                                it('view3 should have the key "http://data.emii.com/view1"', inject(function (HighCharts) {
                                    HighCharts._createSeriesIndexMap(views);
                                    expect(views[2].key).toBe('http://data.emii.com/view1 / http://data.emii.com/economy/us');
                                }));
                            });
                        });

                        describe('Given we 1 strategic relative view, and 1 tactical relative view from the same service, relative to the same thing', function () {
                            describe('When creating the map', function () {
                                var views;
                                beforeEach(function () {
                                    views = [
                                         {
                                             viewType: {
                                                 '@id': 'http://data.emii.com/view-types/relative'
                                             },
                                             viewRecommendationType: {
                                                 '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                             },
                                             service: {
                                                 '@id': 'http://data.emii.com/bca/services/ces'
                                             },
                                             viewRelativeTo: {
                                                 '@id': 'http://data.emii.com/equity-markets/jpn',
                                                 canonicalLabel: 'Japan'
                                             },
                                             '@id': {
                                                 '@id': 'http://data.emii.com/view1'
                                             },
                                             viewOrigin: {
                                                 '@id': 'http://data.emii.com/view1'
                                             },
                                             viewOn: {
                                                 '@id': 'http://data.emii.com/economy/us',
                                                 canonicalLabel: 'US Economy'
                                             }

                                         },
                                         {
                                             viewType: {
                                                 '@id': 'http://data.emii.com/view-types/relative'
                                             },
                                             viewRecommendationType: {
                                                 '@id': 'http://data.emii.com/view-recommendation-types/tactical'
                                             },
                                             viewRelativeTo: {
                                                 '@id': 'http://data.emii.com/equity-markets/jpn',
                                                 canonicalLabel: 'Japan'
                                             },
                                             service: {
                                                 '@id': 'http://data.emii.com/bca/services/ces'
                                             },
                                             '@id': {
                                                 '@id': 'http://data.emii.com/view2'
                                             },
                                             viewOn: {
                                                 '@id': 'http://data.emii.com/economy/us',
                                                 canonicalLabel: 'US Economy'
                                             }
                                         }
                                    ];
                                });
                                it('should return 1 index', inject(function (HighCharts) {
                                    var result = HighCharts._createSeriesIndexMap(views);
                                    expect(result.length).toBe(1);
                                }));

                                it('should have the view origin view1 for key', inject(function (HighCharts) {
                                    var result = HighCharts._createSeriesIndexMap(views);
                                    expect(result[0].key).toBe('http://data.emii.com/view1 / http://data.emii.com/economy/us');
                                }));

                                it('should have the category "CES / Japan"', inject(function (HighCharts) {
                                    var result = HighCharts._createSeriesIndexMap(views);
                                    expect(result[0].value.category).toBe('CES / Japan');
                                }));

                                it('view1 should have the key "http://data.emii.com/view1 / http://data.emii.com/economy/us"', inject(function (HighCharts) {
                                    HighCharts._createSeriesIndexMap(views);
                                    expect(views[0].key).toBe('http://data.emii.com/view1 / http://data.emii.com/economy/us');
                                }));

                                it('view2 should have the key "http://data.emii.com/view1 / http://data.emii.com/economy/us"', inject(function (HighCharts) {
                                    HighCharts._createSeriesIndexMap(views);
                                    expect(views[1].key).toBe('http://data.emii.com/view1 / http://data.emii.com/economy/us');
                                }));
                                
                                it('index should have the description "Japan"', inject(function (HighCharts) {
                                    var result = HighCharts._createSeriesIndexMap(views);
                                    expect(result[0].value.description).toBe('Japan');
                                }));
                            });
                        });

                        describe('Given we 1 strategic relative view, and 1 tactical relative view from the same service, relative to different things', function () {
                            describe('When creating the map', function () {
                                var views;
                                beforeEach(function () {
                                    views = [
                                         {
                                             viewType: {
                                                 '@id': 'http://data.emii.com/view-types/relative'
                                             },
                                             viewRecommendationType: {
                                                 '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                             },
                                             service: {
                                                 '@id': 'http://data.emii.com/bca/services/ces'
                                             },
                                             viewRelativeTo: {
                                                 '@id': 'http://data.emii.com/equity-markets/jpn',
                                                 canonicalLabel: 'Japan'
                                             },
                                             '@id': {
                                                 '@id': 'http://data.emii.com/view1'
                                             },
                                             viewOrigin: {
                                                 '@id': 'http://data.emii.com/view1'
                                             },
                                             viewOn: {
                                                 '@id': 'http://data.emii.com/economy/us',
                                                 canonicalLabel: 'US Economy'
                                             }

                                         },
                                         {
                                             viewType: {
                                                 '@id': 'http://data.emii.com/view-types/relative'
                                             },
                                             viewRecommendationType: {
                                                 '@id': 'http://data.emii.com/view-recommendation-types/tactical'
                                             },
                                             viewRelativeTo: {
                                                 '@id': 'http://data.emii.com/currency/usd',
                                                 canonicalLabel: 'USD'
                                             },
                                             service: {
                                                 '@id': 'http://data.emii.com/bca/services/ces'
                                             },
                                             '@id': {
                                                 '@id': 'http://data.emii.com/view2'
                                             },
                                             viewOn: {
                                                 '@id': 'http://data.emii.com/economy/us',
                                                 canonicalLabel: 'US Economy'
                                             }
                                         }
                                    ];
                                });
                                it('should return 2 indexes', inject(function (HighCharts) {
                                    var result = HighCharts._createSeriesIndexMap(views);
                                    expect(result.length).toBe(2);
                                }));

                                it('view1 should have the key "http://data.emii.com/view1 / http://data.emii.com/economy/us"', inject(function (HighCharts) {
                                    HighCharts._createSeriesIndexMap(views);
                                    expect(views[0].key).toBe('http://data.emii.com/view1 / http://data.emii.com/economy/us');
                                }));

                                it('view2 should have the key "http://data.emii.com/bca/services/ces / http://data.emii.com/economy/us / http://data.emii.com/economy/us"', inject(function (HighCharts) {
                                    HighCharts._createSeriesIndexMap(views);
                                    expect(views[1].key).toBe('http://data.emii.com/bca/services/ces / http://data.emii.com/currency/usd / http://data.emii.com/economy/us');
                                }));

                                it('view1 should have the category "CES / Japan"', inject(function (HighCharts) {
                                    var result = HighCharts._createSeriesIndexMap(views);
                                    expect(result[0].value.category).toBe('CES / Japan');
                                }));

                                it('view2 should have the category "CES / USD"', inject(function (HighCharts) {
                                    var result = HighCharts._createSeriesIndexMap(views);
                                    expect(result[1].value.category).toBe('CES / USD');
                                }));

                            });
                        });

                        describe('Given we 2 absolute tactical views', function () {
                            describe('When creating the map', function () {
                                var views;
                                beforeEach(function () {
                                    views = [
                                         {
                                             viewType: {
                                                 '@id': 'http://data.emii.com/view-types/absolute'
                                             },
                                             viewRecommendationType: {
                                                 '@id': 'http://data.emii.com/view-recommendation-types/tactical'
                                             },
                                             service: {
                                                 '@id': 'http://data.emii.com/bca/services/ces'
                                             },
                                             '@id': {
                                                 '@id': 'http://data.emii.com/view1'
                                             },
                                             viewOn: {
                                                 '@id': 'http://data.emii.com/economy/us',
                                                 canonicalLabel: 'US Economy'
                                             }
                                         },
                                         {
                                             viewType: {
                                                 '@id': 'http://data.emii.com/view-types/absolute'
                                             },
                                             viewRecommendationType: {
                                                 '@id': 'http://data.emii.com/view-recommendation-types/tactical'
                                             },
                                             service: {
                                                 '@id': 'http://data.emii.com/bca/services/ces'
                                             },
                                             '@id': {
                                                 '@id': 'http://data.emii.com/view2'
                                             },
                                             viewOn: {
                                                 '@id': 'http://data.emii.com/economy/us',
                                                 canonicalLabel: 'US Economy'
                                             }
                                         }
                                    ];
                                });
                                it('should return 1 index', inject(function (HighCharts) {
                                    var result = HighCharts._createSeriesIndexMap(views);
                                    expect(result.length).toBe(1);
                                }));
                            });
                        });

                        describe('Given we have 2 strategic views from 2 different viewables', function () {
                            describe('When creating the map', function () {
                                var views;
                                beforeEach(function () {
                                    views = [
                                        {
                                            viewType: {
                                                '@id': 'http://data.emii.com/view-types/absolute'
                                            },
                                            service: {
                                                '@id': 'http://data.emii.com/bca/services/ces'
                                            },
                                            viewOrigin: {
                                                '@id': 'http://data.emii.com/view-a'
                                            },
                                            viewRecommendationType: {
                                                '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                            },
                                            viewOn: {
                                                '@id': 'http://data.emii.com/economy/us',
                                                canonicalLabel: 'US Economy'
                                            }
                                        },
                                        {
                                            viewType: {
                                                '@id': 'http://data.emii.com/view-types/absolute'
                                            },
                                            service: {
                                                '@id': 'http://data.emii.com/bca/services/ces'
                                            },
                                            viewOrigin: {
                                                '@id': 'http://data.emii.com/view-b'
                                            },
                                            viewRecommendationType: {
                                                '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                            },
                                            viewOn: {
                                                '@id': 'http://data.emii.com/economy/jpn',
                                                canonicalLabel: 'Japan Economy'
                                            }
                                        }
                                    ];
                                });
                                it('should return 2 indexes', inject(function (HighCharts) {
                                    var result = HighCharts._createSeriesIndexMap(views);
                                    expect(result.length).toBe(2);
                                }));
                            });
                        });

                        describe('Given we have 2 tactical views from 2 different viewables', function () {
                            describe('When creating the map', function () {
                                var views;
                                beforeEach(function () {
                                    views = [
                                        {
                                            viewType: {
                                                '@id': 'http://data.emii.com/view-types/absolute'
                                            },
                                            service: {
                                                '@id': 'http://data.emii.com/bca/services/ces'
                                            },
                                            viewRecommendationType: {
                                                '@id': 'http://data.emii.com/view-recommendation-types/tactical'
                                            },
                                            viewOn: {
                                                '@id': 'http://data.emii.com/economy/us',
                                                canonicalLabel: 'US Economy'
                                            }
                                        },
                                        {
                                            viewType: {
                                                '@id': 'http://data.emii.com/view-types/absolute'
                                            },
                                            service: {
                                                '@id': 'http://data.emii.com/bca/services/ces'
                                            },
                                            viewRecommendationType: {
                                                '@id': 'http://data.emii.com/view-recommendation-types/tactical'
                                            },
                                            viewOn: {
                                                '@id': 'http://data.emii.com/economy/jpn',
                                                canonicalLabel: 'Japan Economy'
                                            }
                                        }
                                    ];
                                });
                                it('should return 2 indexes', inject(function (HighCharts) {
                                    var result = HighCharts._createSeriesIndexMap(views);
                                    expect(result.length).toBe(2);
                                }));
                            });
                        });
                        
                        describe('Given we have 1 tactical view', function() {
                            describe('When creating the map', function () {
                                var views;
                                beforeEach(function () {
                                    views = [
                                        {
                                            viewRecommendationType: {
                                                '@type': 'ViewRecommendationType',
                                                '@id': 'http://data.emii.com/view-recommendation-types/tactical',
                                                'canonicalLabel': 'Tactical'
                                            },
                                            viewOn: {
                                                '@type': 'CurrencyMarket',
                                                '@id': 'http://data.emii.com/currency-pairs/gbp-usd',
                                                'canonicalLabel': 'GBP/USD'
                                            },
                                            viewType: {
                                                '@type': 'ViewType',
                                                '@id': 'http://data.emii.com/view-types/absolute',
                                                'canonicalLabel': 'Absolute'
                                            },
                                            canonicalLabel: 'FES GBP/USD 3 months (2014/01/13) short(A)',
                                            service: {
                                                '@type': 'Service',
                                                'description': 'Forecasts, trading recommendations and technical indicators that highlight intermediate and primary trends for all major currencies.',
                                                '@id': 'http://data.emii.com/bca/services/fes',
                                                'canonicalLabel': 'Foreign Exchange Strategy'
                                            },
                                            viewOrigin: {
                                                '@id': 'http://data.emii.com/bca/views/fes-view0'
                                            },
                                            '@id': 'http://data.emii.com/bca/views/fes-view0'
                                        }
                                    ];
                                });
                                it('should return 1 index', inject(function (HighCharts) {
                                    var result = HighCharts._createSeriesIndexMap(views);
                                    expect(result.length).toBe(1);
                                }));
                                
                                it('service name should be FES', inject(function (HighCharts) {
                                    var result = HighCharts._createSeriesIndexMap(views);
                                    expect(result[0].value.serviceName).toBe('FES');
                                }));
                                
                                it('description should be empty', inject(function (HighCharts) {
                                    var result = HighCharts._createSeriesIndexMap(views);
                                    expect(result[0].value.description).toBe('');
                                }));
                                
                                it('views should contain the tactical view', inject(function (HighCharts) {
                                    var result = HighCharts._createSeriesIndexMap(views);
                                    expect(result[0].value.views.length).toBe(1);
                                    expect(result[0].value.views[0]['@id']).toBe('http://data.emii.com/bca/views/fes-view0');
                                }));
                            });
                        });

                    });

                    describe('View key', function() {
                        describe('Given we have a strategic view', function() {
                            it('should have the key viewOrigin / viewableId', inject(function (HighCharts) {
                                var view = {
                                        '@id': 'http://data.emii.com/bca/view2',
                                        viewOn: {
                                            '@id': 'http://data.emii.com/economy/us'
                                        },
                                        viewRecommendationType: {
                                            '@id': 'http://data.emii.com/view-recommendation-types/strategic'
                                        },
                                        viewOrigin: {
                                            '@id': 'http://data.emii.com/bca/view1'
                                        }
                                    },
                                    result = HighCharts._getKey(view);

                                expect(result).toBe('http://data.emii.com/bca/view1 / http://data.emii.com/economy/us');
                            }));
                        });
                        
                        describe('Given we have an absolute tactical view', function () {
                            it('should have the key service / viewableId', inject(function (HighCharts) {
                                var view = {
                                    '@id': 'http://data.emii.com/bca/view2',
                                    viewOn: {
                                        '@id': 'http://data.emii.com/economy/us'
                                    },
                                    viewRecommendationType: {
                                        '@id': 'http://data.emii.com/view-recommendation-types/tactical'
                                    },
                                    viewOrigin: {
                                        '@id': 'http://data.emii.com/bca/view1'
                                    },
                                    service: {
                                        '@id': 'http://data.emii.com/bca/ces'
                                    },
                                    viewType: {
                                        '@id': 'http://data.emii.com/view-types/absolute'
                                    }
                                },
                                    result = HighCharts._getKey(view);

                                expect(result).toBe('http://data.emii.com/bca/ces / http://data.emii.com/economy/us');
                            }));
                        });
                        
                        describe('Given we have a relative tactical view', function () {
                            it('should have the key service / relativeTo / viewableId', inject(function (HighCharts) {
                                var view = {
                                    '@id': 'http://data.emii.com/bca/view2',
                                    viewOn: {
                                        '@id': 'http://data.emii.com/economy/us'
                                    },
                                    viewRecommendationType: {
                                        '@id': 'http://data.emii.com/view-recommendation-types/tactical'
                                    },
                                    viewOrigin: {
                                        '@id': 'http://data.emii.com/bca/view1'
                                    },
                                    service: {
                                        '@id': 'http://data.emii.com/bca/ces'
                                    },
                                    viewType: {
                                        '@id': 'http://data.emii.com/view-types/relative'
                                    },
                                    viewRelativeTo: {
                                        '@id': 'http://data.emii.com/economy/uk'
                                    }
                                },
                                    result = HighCharts._getKey(view);

                                expect(result).toBe('http://data.emii.com/bca/ces / http://data.emii.com/economy/uk / http://data.emii.com/economy/us');
                            }));

                            describe('And the viewRelativeTo property is missing', function() {
                                it('should have the key service / / viewableId', inject(function (HighCharts) {
                                    var view = {
                                        '@id': 'http://data.emii.com/bca/view2',
                                        viewOn: {
                                            '@id': 'http://data.emii.com/economy/us'
                                        },
                                        viewRecommendationType: {
                                            '@id': 'http://data.emii.com/view-recommendation-types/tactical'
                                        },
                                        viewOrigin: {
                                            '@id': 'http://data.emii.com/bca/view1'
                                        },
                                        service: {
                                            '@id': 'http://data.emii.com/bca/ces'
                                        },
                                        viewType: {
                                            '@id': 'http://data.emii.com/view-types/relative'
                                        }
                                    },
                                        result = HighCharts._getKey(view);

                                    expect(result).toBe('http://data.emii.com/bca/ces /  / http://data.emii.com/economy/us');
                                }));
                            });
                        });
                        
                        describe('Given we have a relative Inflation view', function () {
                            it('should have the key service / relativeTo / viewableId', inject(function (HighCharts) {
                                var view = {
                                    '@id': 'http://data.emii.com/bca/view2',
                                    viewOn: {
                                        '@id': 'http://data.emii.com/economy/us'
                                    },
                                    viewRecommendationType: {
                                        '@id': 'http://data.emii.com/view-recommendation-types/tactical'
                                    },
                                    viewOrigin: {
                                        '@id': 'http://data.emii.com/bca/view1'
                                    },
                                    service: {
                                        '@id': 'http://data.emii.com/bca/ces'
                                    },
                                    viewType: {
                                        '@id': 'http://data.emii.com/view-types/inflation'
                                    },
                                    viewBenchmark: {
                                        '@id': 'http://data.emii.com/economy/uk'
                                    },
                                    trendPosition: { '@id': 'http://data.emii.com/trend-positions/rise' }
                                },
                                    result = HighCharts._getKey(view);

                                expect(result).toBe('http://data.emii.com/bca/ces / http://data.emii.com/economy/uk / http://data.emii.com/economy/us');
                            }));
                        });
                    });
                });
            });
        });