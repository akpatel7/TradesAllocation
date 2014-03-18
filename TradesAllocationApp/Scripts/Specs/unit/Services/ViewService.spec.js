define(['underscore',
        'moment',
        'App/Services/ViewService',
        'angular',
        'mocks',
        'App/Services/services'], function (_, moment) {
            describe('ViewService', function () {
                describe('Given we have a ViewService', function() {

                    beforeEach(function() {
                        module('App.services');
                    });

                    describe('When themes are available', function() {
                        var singleThemeItem = {
                            "@type": "Theme",
                            "@id": "http://data.emii.com/bca/themes/c2px1vnk1zbw",
                            "canonicalLabel": "Equities will outperform bonds over a medium-term horizon"
                        },
                            multipleThemesItem = {
                                "@set": [
                                    {
                                        "@type": "Theme",
                                        "@id": "http://data.emii.com/bca/themes/c2px1vnk1zbt",
                                        "canonicalLabel": "China will experience a soft-landing"
                                    },
                                    {
                                        "@type": "Theme",
                                        "@id": "http://data.emii.com/bca/themes/c2px1vnk1zd3",
                                        "canonicalLabel": "Europe’s Saints versus Sinners Narrative is Flawed"
                                    },
                                    {
                                        "@type": "Theme",
                                        "@id": "http://data.emii.com/bca/themes/c2px1vnk1zbw",
                                        "canonicalLabel": "Equities will outperform bonds over a medium-term horizon"
                                    }
                                ]
                            };

                        it('should return return array of themes with just single theme', inject(function(View) {
                            var result = View.mapThemes(singleThemeItem);
                            expect(result.length).toBe(1);
                        }));

                        it('should return return array of themes with just multiple themes', inject(function(View) {
                            var result = View.mapThemes(multipleThemesItem);
                            expect(result.length).toBe(3);
                        }));

                        it('should return return empty array if themes are undefined', inject(function(View) {
                            var result = View.mapThemes(undefined);
                            expect(result.length).toBe(0);
                        }));
                    });

                    describe('When getting the relative view label for a view', function() {
                        describe('Given a relative view', function () {
                            var relativeView = {
                                'viewWeighting': {},
                                'viewRelativeTo': {
                                    'canonicalLabel': 'label text'
                                }
                            };
                            it('label should start with "Vs: "', inject(function (View) {
                                var result = View.getRelativeViewLabel(relativeView);
                                expect(result).toBe('Vs: label text');
                            }));
                        });

                        describe('Given a relative view with benchmark', function () {
                            var relativeViewWithViewBenchmark = {
                                'viewBenchmark': { 'canonicalLabel': 'label text' }
                            };

                            it('label should be the cannonicalLabel', inject(function (View) {
                                var result = View.getRelativeViewLabel(relativeViewWithViewBenchmark);
                                expect(result).toBe('label text');
                            }));
                        });

                        describe('Given a relative view with default benchmark', function () {
                            var relativeViewWithViewDefaultBenchmark = {
                                'viewRelativeTo': {
                                    '@id': 'http://data.emii.com/benchmarks/default-benchmark',
                                    'canonicalLabel': 'Benchmark'
                                }
                            };

                            it('label should be Relative to Benchmark ', inject(function (View) {
                                var result = View.getRelativeViewLabel(relativeViewWithViewDefaultBenchmark);
                                expect(result).toBe('Relative to Benchmark');
                            }));
                        });


                        describe('Given a relative view without label', function () {
                            var relativeViewWithoutLabel = {
                                'viewWeighting': {}
                            };
                            it('label should be Relative', inject(function (View) {
                                var result = View.getRelativeViewLabel(relativeViewWithoutLabel);
                                expect(result).toBe('Relative');
                            }));
                        });

                        describe('Given an absolute view ', function () {
                            var absoluteView = {};
                            it('label should be Absolute', inject(function (View) {
                                var result = View.getRelativeViewLabel(absoluteView);
                                expect(result).toBe('Absolute');
                            }));
                        });

                        describe('Given an absolute view with relative view property', function () {
                            var absoluteViewWithRelativeViewProperty = {
                                'economicPosition': {},
                                'viewRelativeTo': {
                                    'canonicalLabel': 'label text'
                                }
                            };
                            it('label should be Absolute', inject(function (View) {
                                var result = View.getRelativeViewLabel(absoluteViewWithRelativeViewProperty);
                                expect(result).toBe('Absolute');
                            }));
                        });
                      
                    });

                    describe('Get service name', function() {

                        describe('When passing valid "uses" service', function() {
                            it('should return name of the service', inject(function(View) {
                                var service = { "@id": "http://data.emii.com/bca/services/uses" };
                                var result = View.getServiceName(service);
                                expect(result).toBe('USES');
                            }));
                        });
                        describe('When passing valid "bcah" service', function() {
                            it('should return name of the service', inject(function(View) {
                                var service = { "@id": "http://data.emii.com/bca/services/bcah" };
                                var result = View.getServiceName(service);
                                expect(result).toBe('HOUSE');
                            }));
                        });
                    });

                    describe('Get position', function() {
                        describe('for economic position', function() {
                            var view;
                            beforeEach(function() {
                                view = {
                                    economicPosition: {
                                    }
                                };
                            });

                            describe('Given a view has an economic position of flat', function() {
                                it('Should have a position of 0', inject(function(View) {
                                    view.economicPosition.canonicalLabel = 'Flat';
                                    view.economicPosition['@id'] = 'http://data.emii.com/economic-positions/flat';
                                    expect(View.getPosition(view)).toBe(0);
                                }));
                            });

                            describe('Given a view has an economic position of weaker', function() {
                                it('Should have a position of -1', inject(function(View) {
                                    view.economicPosition.canonicalLabel = 'weaker';
                                    view.economicPosition['@id'] = 'http://data.emii.com/economic-positions/weaker';
                                    expect(View.getPosition(view)).toBe(-1);
                                }));
                            });

                            describe('Given a view has an economic position of stronger', function() {
                                it('Should have a position of 1', inject(function(View) {
                                    view.economicPosition.canonicalLabel = 'stronger';
                                    view.economicPosition['@id'] = 'http://data.emii.com/economic-positions/stronger';
                                    expect(View.getPosition(view)).toBe(1);
                                }));
                            });
                        });

                        describe('for view direction', function() {
                            var view;
                            beforeEach(function() {
                                view = {
                                    viewDirection: {
                                    }
                                };
                            });

                            describe('Given a view has a direction of short', function() {
                                it('Should have a position of -1', inject(function(View) {
                                    view.viewDirection.canonicalLabel = 'Short';
                                    view.viewDirection['@id'] = 'http://data.emii.com/ontologies/bca/viewDirection/short';
                                    expect(View.getPosition(view)).toBe(-1);
                                }));
                            });

                            describe('Given a view has a direction of neutral', function() {
                                it('Should have a position of 0', inject(function(View) {
                                    view.viewDirection.canonicalLabel = 'Neutral';
                                    view.viewDirection['@id'] = 'http://data.emii.com/ontologies/bca/viewDirection/neutral';
                                    expect(View.getPosition(view)).toBe(0);
                                }));
                            });

                            describe('Given a view has a direction of long', function() {
                                it('Should have a position of 1', inject(function(View) {
                                    view.viewDirection.canonicalLabel = 'Long';
                                    view.viewDirection['@id'] = 'http://data.emii.com/ontologies/bca/viewDirection/long';
                                    expect(View.getPosition(view)).toBe(1);
                                }));
                            });
                        });

                        describe('for view weighting', function() {
                            var view;
                            beforeEach(function() {
                                view = {
                                    viewWeighting: {
                                    }
                                };
                            });

                            describe('Given a view has a weighting of underweight', function() {
                                it('Should have a position of -1', inject(function(View) {
                                    view.viewWeighting.canonicalLabel = 'underweight';
                                    view.viewWeighting['@id'] = 'http://data.emii.com/view-weightings/underweight';
                                    expect(View.getPosition(view)).toBe(-1);
                                }));
                            });

                            describe('Given a view has a direction of overweight', function() {
                                it('Should have a position of 1', inject(function(View) {
                                    view.viewWeighting.canonicalLabel = 'overweight';
                                    view.viewWeighting['@id'] = 'http://data.emii.com/view-weightings/overweight';
                                    expect(View.getPosition(view)).toBe(1);
                                }));
                            });
                        });
                        
                        describe('for trend position', function () {
                            var view;
                            beforeEach(function () {
                                view = {
                                    trendPosition: {
                                    }
                                };
                            });

                            describe('Given a view has a trend position of rise', function () {
                                it('Should have a position of 1', inject(function (View) {
                                    view.trendPosition.canonicalLabel = 'rise';
                                    view.trendPosition['@id'] = 'http://data.emii.com/trend-positions/rise';
                                    expect(View.getPosition(view)).toBe(1);
                                }));
                            });

                            describe('Given a view has a trend position of fall', function () {
                                it('Should have a position of -1', inject(function (View) {
                                    view.trendPosition.canonicalLabel = 'fall';
                                    view.trendPosition['@id'] = 'http://data.emii.com/trend-positions/fall';
                                    expect(View.getPosition(view)).toBe(-1);
                                }));
                            });
                            
                            describe('Given a view has a trend position of flat', function () {
                                it('Should have a position of 0', inject(function (View) {
                                    view.trendPosition.canonicalLabel = 'flat';
                                    view.trendPosition['@id'] = 'http://data.emii.com/trend-positions/flat';
                                    expect(View.getPosition(view)).toBe(0);
                                }));
                            });
                        });
                        
                        describe('for monetary policy position', function () {
                            var view;
                            beforeEach(function () {
                                view = {
                                    monetaryPolicyPosition: {
                                    }
                                };
                            });

                            describe('Given a view has a monetary policy position of expand', function () {
                                it('Should have a position of 1', inject(function (View) {
                                    view.monetaryPolicyPosition.canonicalLabel = 'expand';
                                    view.monetaryPolicyPosition['@id'] = 'http://data.emii.com/monetary-policy-positions/expand';
                                    expect(View.getPosition(view)).toBe(1);
                                }));
                            });
                            
                            describe('Given a view has a monetary policy position of no-change', function () {
                                it('Should have a position of 0', inject(function (View) {
                                    view.monetaryPolicyPosition.canonicalLabel = 'no-change';
                                    view.monetaryPolicyPosition['@id'] = 'http://data.emii.com/monetary-policy-positions/no-change';
                                    expect(View.getPosition(view)).toBe(0);
                                }));
                            });

                            describe('Given a view has a monetary policy position of contract', function () {
                                it('Should have a position of -1', inject(function (View) {
                                    view.monetaryPolicyPosition.canonicalLabel = 'contract';
                                    view.monetaryPolicyPosition['@id'] = 'http://data.emii.com/monetary-policy-positions/contract';
                                    expect(View.getPosition(view)).toBe(-1);
                                }));
                            });
                        });
                        
                        describe('for fiscal policy position', function () {
                            var view;
                            beforeEach(function () {
                                view = {
                                    fiscalPolicyPosition: {
                                    }
                                };
                            });

                            describe('Given a view has a fiscal policy position of ease', function () {
                                it('Should have a position of 1', inject(function (View) {
                                    view.fiscalPolicyPosition.canonicalLabel = 'ease';
                                    view.fiscalPolicyPosition['@id'] = 'http://data.emii.com/fiscal-policy-positions/ease';
                                    expect(View.getPosition(view)).toBe(1);
                                }));
                            });

                            describe('Given a view has a fiscal policy position of no-change', function () {
                                it('Should have a position of 0', inject(function (View) {
                                    view.fiscalPolicyPosition.canonicalLabel = 'no-change';
                                    view.fiscalPolicyPosition['@id'] = 'http://data.emii.com/fiscal-policy-positions/no-change';
                                    expect(View.getPosition(view)).toBe(0);
                                }));
                            });

                            describe('Given a view has a fiscal policy position of tighten', function () {
                                it('Should have a position of 0', inject(function (View) {
                                    view.fiscalPolicyPosition.canonicalLabel = 'tighten';
                                    view.fiscalPolicyPosition['@id'] = 'http://data.emii.com/fiscal-policy-positions/tighten';
                                    expect(View.getPosition(view)).toBe(-1);
                                }));
                            });

                        });
                    });

                    describe('Get conviction', function() {
                        describe('And viewConviction is flat', function() {
                            it('should return 1', inject(function (View) {
                                var view = {
                                        viewConviction: {
                                            canonicalLabel: 'fLat'
                                        }
                                    },
                                    result = View.getConviction(view);
                                expect(result).toBe(1);
                            }));
                        });
                        
                        describe('And viewConviction is low', function () {
                            it('should return 0', inject(function (View) {
                                var view = {
                                    viewConviction: {
                                        canonicalLabel: 'lOw'
                                    }
                                },
                                    result = View.getConviction(view);
                                expect(result).toBe(0);
                            }));
                        });
                        
                        describe('And viewConviction is high', function () {
                            it('should return 2', inject(function (View) {
                                var view = {
                                    viewConviction: {
                                        canonicalLabel: 'High'
                                    }
                                },
                                    result = View.getConviction(view);
                                expect(result).toBe(2);
                            }));
                        });

                        describe('And viewConviction is undefined', function() {
                            it('should return 1', inject(function(View) {
                                var view = {
                                    viewConviction: undefined
                                },
                                    result = View.getConviction(view);
                                expect(result).toBe(1);
                            }));
                        });
                    });

                    describe('When filtering active views', function () {
                        describe('When a view with a horizon end date in the past', function () {
                            it('should return not return the view', inject(function (View) {
                                var views = [
                                    {
                                        '@id': 'view-1',
                                        'viewOrigin': { '@id': 'view-1' },
                                        horizonStartDate: moment().add('years', -1).format('YYYY-MM-DD'),
                                        horizonEndDate: moment().add('months', -1).format('YYYY-MM-DD')
                                    }
                                ];
                                var activeViews = View.getActiveViews(views);
                                expect(activeViews.length).toBe(0);
                            }));
                        });
                        describe('When a view with a horizon end date in the future', function () {
                            it('should return not return the view', inject(function (View) {
                                var views = [
                                    {
                                        '@id': 'view-1',
                                        'viewOrigin': { '@id': 'view-1' },
                                        horizonStartDate: moment().add('months', -1).format('YYYY-MM-DD'),
                                        horizonEndDate: moment().add('years', 1).format('YYYY-MM-DD')
                                    }
                                ];
                                var activeViews = View.getActiveViews(views);
                                expect(activeViews.length).toBe(1);
                            }));
                        });
                        describe('When a view with a horizon end date is today', function () {
                            it('should return return the view', inject(function (View) {
                                var views = [
                                    {
                                        '@id': 'view-1',
                                        'viewOrigin': { '@id': 'view-1' },
                                        horizonStartDate: moment().add('months', -1).format('YYYY-MM-DD'),
                                        horizonEndDate: moment().format('YYYY-MM-DD')
                                    }
                                ];
                                var activeViews = View.getActiveViews(views);
                                expect(activeViews.length).toBe(1);
                            }));
                        });
                        describe('When multiple views with the same view origin', function () {
                            it('should return a single view whose horizon start date is furthest into the future', inject(function (View) {
                                var views = [
                                    {
                                        '@id': 'view-1',
                                        'viewOrigin': { '@id': 'view-1' },
                                        horizonStartDate: moment().add('months', -1).format('YYYY-MM-DD'),
                                        horizonEndDate: moment().add('years', 1).format('YYYY-MM-DD')
                                    },
                                    {
                                        '@id': 'view-2',
                                        'viewOrigin': { '@id': 'view-1' },
                                        horizonStartDate: moment().add('years', 1).format('YYYY-MM-DD'),
                                        horizonEndDate: moment().add('years', 2).format('YYYY-MM-DD')
                                    }
                                ];
                                var activeViews = View.getActiveViews(views);
                                expect(activeViews.length).toBe(1);
                                expect(activeViews[0]['@id']).toBe('view-2');
                            }));
                        });
                    });

                    describe('Is view relative benchmark', function () {

                        describe('Relative ', function () {
                            it('should be relative when view is relative and has viewWeighting defined', inject(function (View) {
                                expect(View.isViewRelative({viewWeighting: {} })).toBe(true);
                            }));
                            it('should be relative when it has viewRelativeTo defined', inject(function (View) {
                                expect(View.isViewRelative({ viewWeighting: {}, viewRelativeTo: {} })).toBe(true);
                            }));
                            it('should be relative when view isinflation and has viewBenchmark defined', inject(function (View) {
                                expect(View.isViewRelative({ trendPosition: {}, viewBenchmark: {} })).toBe(true);
                            }));
                        });
                        
                        describe('Absolute ', function () {
                            it('should be absolute when view is economy and has economicPosition defined', inject(function (View) {
                                expect(View.isViewRelative({ economicPosition: {} })).toBe(false);
                            }));
                            it('should be absolute when view is economy and has economicPosition defined even if viewRelativeTo is defined', inject(function (View) {
                                expect(View.isViewRelative({ economicPosition: {}, viewRelativeTo: {} })).toBe(false);
                            }));
                            it('should be absolute when view is absolute and has viewDirection defined', inject(function (View) {
                                expect(View.isViewRelative({ viewDirection: {} })).toBe(false);
                            }));
                            it('should be absolute when view is inflation and has trendPosition defined', inject(function (View) {
                                expect(View.isViewRelative({ trendPosition: {} })).toBe(false);
                            }));
                            it('should be absolute when view is interest rate and has trendPosition defined', inject(function (View) {
                                expect(View.isViewRelative({ trendPosition: {} })).toBe(false);
                            }));
                            it('should be absolute when view is monetary policy and has monetaryPolicyPosition defined', inject(function (View) {
                                expect(View.isViewRelative({ monetaryPolicyPosition: {} })).toBe(false);
                            }));
                            it('should be absolute when view is fiscal policy and has fiscalPolicyPosition defined', inject(function (View) {
                                expect(View.isViewRelative({ fiscalPolicyPosition: {} })).toBe(false);
                            }));
                            it('should be absolute for inflation views', inject(function (View) {
                                expect(View.isViewRelative({
                                    viewType: {
                                        '@id': 'http://data.emii.com/view-types/inflation'
                                    },
                                    viewBenchmark: {
                                        '@id': 'http://data.emii.com/economies/eu'
                                    },
                                    trendPosition: {
                                        '@id': 'http://data.emii.com/trend-positions/rise'
                                    }
                                })).toBe(false);
                            }));
                        });
                    });
                });
            });
    });