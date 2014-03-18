define(['angular', 'mocks', 'underscore', 'App/Directives/DominantView', 'App/Directives/Date'], function (angular, mocks, _, dominantViewConviction, Dates) {
    'use strict';

    describe('DominantView directive', function () {
        var scope,
            htmlElement,
            viewableInEurope,
            absolute = 'absolute',
            economy = 'economy',
            relativeOther = 'other',
            relativeNoLocation = '',
            relativeEurope = 'http://data.emii.com/locations/europe',
            relativeUS = 'http://data.emii.com/locations/usa',
            horizonShort = 'P6M',
            horizonMedium = 'P9M',
            horizonLong = 'P18M';

        beforeEach(module('App.services'));

        function combineViews(viewable, views) {
            _.each(views, function (item) {
                viewable.activeView["@set"].push(item);
            });
            return viewable;
        }
        function createViewable(type, regionId, locationId) {
            return {
                "@type": type,
                "forLocation": {
                    "@id": locationId || "http://data.emii.com/locations/deu",
                    "@type": "Location",
                    "canonicalLabel": "Germany",
                    "withinLocation": {
                        '@set': [
                            {
                                "@id": regionId,
                                "@type": "Region",
                                "canonicalLabel": "Europe"
                            }
                        ]
                    } 
                },
                "activeView": {
                    "@set": []
                }
            };
        }
        function createView(id, service, type, horizon, startDate) {
            var viewTemplate = {
                "@id": id,
                "hasPermission": true,
                "service": {
                    "@id": "http://data.emii.com/bca/services/" + service,
                    "@type": "Service"
                },
                "viewHorizon": horizon,
                "horizonStartDate": startDate || "2013-06-01"
            };
            if (type === absolute) {
                viewTemplate.viewDirection = { "canonicalLabel": "absolute" };
            } else if (type ===economy) {
                viewTemplate.economicPosition = { "canonicalLabel": "economy" };
            } else {
                viewTemplate.viewWeighting = { "canonicalLabel": "relative" };
                if (type !== relativeNoLocation) {
                    viewTemplate.viewRelativeTo = {
                        "@type": "Currency",
                        "@id": "http://data.emii.com/currencies/accept-test/currency2",
                        "canonicalLabel": "Currency 2",
                        "forLocation": {
                            "@id": type,
                            "@type": "Location",
                            "canonicalLabel": "United States",
                            "withinLocation": {
                                "@set": {
                                    "@id": "http://data.emii.com/locations/na",
                                    "@type": "Region",
                                    "canonicalLabel": "North Americas"
                                }
                            }
                        }
                    };
                } else {
                    viewTemplate.viewRelativeTo = {};
                }
            }
            return viewTemplate;
        }

        beforeEach(function () {
            viewableInEurope = createViewable('CurrencyMarket', 'http://data.emii.com/locations/europe');
        });
        beforeEach(module('App.directives'));
        beforeEach(inject(function($rootScope, $compile) {
            scope = $rootScope.$new();
            htmlElement = $compile('<div dominant-view viewable="viewable"></div>')(scope);
        }));

        describe('Dominant service in Europe with one view', function () {
            beforeEach(function () {
                scope.viewable = combineViews(viewableInEurope, [createView('abc','cis', absolute, horizonShort)]);
                scope.$root.$digest();
            });
            it('should display the view', function () {
                expect(htmlElement.find('.dominant-view').length === 1).toBe(true);
            });
        });
        describe('Dominant service in Europe with no active view', function () {
            beforeEach(function () {
                scope.viewable = combineViews(viewableInEurope, []);
                scope.$root.$digest();
            });
            it('should not display the view', function () {
                expect(htmlElement.find('.dominant-view').children().length === 0).toBe(true);
            });
        });
        describe('Dominant service in Europe with relative and absolute view', function () {
            beforeEach(function () {
                scope.viewable = combineViews(viewableInEurope, [createView('whatever', 'cis', relativeUS, horizonShort), createView('dominant', 'cis', absolute, horizonLong)]);
                scope.$root.$digest();
            });
            it('should display the absolute view', function () {
                expect(htmlElement.find('.dominant-view').length === 1).toBe(true);
                expect(htmlElement.find('.dominant-view').attr('data-dominant-view-id')).toBe('dominant');
            });
        });
        describe('Dominant service in Europe with two absolute views with diferrent horizons', function () {
            beforeEach(function () {
                scope.viewable = combineViews(viewableInEurope, [createView('whatever', 'cis', absolute, horizonShort), createView('dominant', 'cis', absolute, horizonLong)]);
                scope.$root.$digest();
            });
            it('should display the view with longer horizon', function () {
                expect(htmlElement.find('.dominant-view').length === 1).toBe(true);
                expect(htmlElement.find('.dominant-view').attr('data-dominant-view-id')).toBe('dominant');
            });
        });
        describe('Dominant service in Europe with two relative views for two diferrent regions', function () {
            beforeEach(function () {
                scope.viewable = combineViews(viewableInEurope, [createView('whatever', 'cis', relativeEurope, horizonShort),
                    createView('dominant', 'cis', relativeUS, horizonLong)]);
                scope.$root.$digest();
            });
            it('should display the view for US Market/Benchmark', function () {
                expect(htmlElement.find('.dominant-view').length === 1).toBe(true);
                expect(htmlElement.find('.dominant-view').attr('data-dominant-view-id')).toBe('dominant');
            });
        });
        describe('Dominant service in Europe with three relative views for two diferrent regions', function () {
            beforeEach(function () {
                scope.viewable = combineViews(viewableInEurope, [createView('whatever', 'cis', relativeEurope, horizonShort),
                    createView('usshort', 'cis', relativeUS, horizonShort, "2013-06-01"),
                    createView('dominant', 'cis', relativeUS, horizonShort, "2013-07-01")]);
                scope.$root.$digest();
            });
            it('should display the view for US Market/Benchmark', function () {
                expect(htmlElement.find('.dominant-view').length === 1).toBe(true);
                expect(htmlElement.find('.dominant-view').attr('data-dominant-view-id')).toBe('dominant');
            });
        });
        describe('Dominant service in Europe with two relative views for two diferrent regions', function () {
            beforeEach(function () {
                scope.viewable = combineViews(viewableInEurope, [createView('whatever', 'cis', relativeOther, horizonShort),
                    createView('dominant', 'cis', relativeEurope, horizonLong)]);
                scope.$root.$digest();
            });
            it('should display the view for European Market/Benchmark if US Market is not present', function () {
                expect(htmlElement.find('.dominant-view').length === 1).toBe(true);
                expect(htmlElement.find('.dominant-view').attr('data-dominant-view-id')).toBe('dominant');
            });
        });
        describe('Dominant service in Europe with three relative views for same region', function () {
            beforeEach(function () {
                scope.viewable = combineViews(viewableInEurope, [createView('whatever', 'gis', relativeNoLocation, horizonShort, '2013-07-01'),
                     createView('dominant', 'fes', relativeNoLocation, horizonShort, '2013-07-01'),
                     createView('other', 'ems', relativeNoLocation, horizonShort, '2013-07-01')]);
                scope.$root.$digest();
            });
            it('should display the most recently updated view if none of them are relative to US and EU markets', function () {
                expect(htmlElement.find('.dominant-view').length === 1).toBe(true);
                expect(htmlElement.find('.dominant-view').attr('data-dominant-view-id')).toBe('dominant');
            });
        });
        describe('Dominant service in Europe with two views for services with no user\'s subscripion', function () {
            beforeEach(function () {
                scope.viewable = combineViews(viewableInEurope, [{
                        "hasPermission": false,
                        "horizonStartDate": '2013-07-01',
                        "service": 'GIS',
                        "@id": 'view1'
                    },
                    {
                        "hasPermission": false,
                        "horizonStartDate": '2013-07-01',
                        "service": 'CIS',
                        "@id": 'view2'
                    }]
                );
                scope.$root.$digest();
            });
            it('should not display dominant view', function () {
                expect(htmlElement.find('.dominant-view').children().length === 0).toBe(true);
            });
        });
        describe('Service Rankings Test:', function () {
            describe('Dominant service for viewable for Americas with three views', function () {
                beforeEach(function () {
                    scope.viewable = combineViews(createViewable('Currency', 'http://data.emii.com/locations/amer'),
                        [createView('first', 'gaa', absolute, horizonShort, '2013-07-01'),
                        createView('second', 'usb', absolute, horizonShort, '2013-07-01'),
                        createView('dominant', 'bca', absolute, horizonShort, '2013-07-01')]);
                    scope.$root.$digest();
                });
                it('should not display dominant view', function () {
                    expect(htmlElement.find('.dominant-view').length === 1).toBe(true);
                    expect(htmlElement.find('.dominant-view').attr('data-dominant-view-id')).toBe('dominant');
                });
            });
            describe('Dominant service for viewable for Americas with three views', function () {
                beforeEach(function () {
                    scope.viewable = combineViews(createViewable('Currency', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/amer'),
                        [createView('first', 'gaa', absolute, horizonShort, '2013-07-01'),
                        createView('second', 'usb', absolute, horizonShort, '2013-07-01'),
                        createView('dominant', 'bca', absolute, horizonShort, '2013-07-01')]);
                    scope.$root.$digest();
                });
                it('should not display dominant view', function () {
                    expect(htmlElement.find('.dominant-view').length === 1).toBe(true);
                    expect(htmlElement.find('.dominant-view').attr('data-dominant-view-id')).toBe('dominant');
                });
            });
            describe('Dominant service for viewable for Europe with three views', function () {
                beforeEach(function () {
                    scope.viewable = combineViews(createViewable('FixedIncomeMarket', 'http://data.emii.com/locations/europe'),
                        [createView('first', 'bca', absolute, horizonShort, '2013-07-01'),
                        createView('second', 'gps', absolute, horizonShort, '2013-07-01'),
                        createView('dominant', 'eis', absolute, horizonShort, '2013-07-01')]);
                    scope.$root.$digest();
                });
                it('should not display dominant view', function () {
                    expect(htmlElement.find('.dominant-view').length === 1).toBe(true);
                    expect(htmlElement.find('.dominant-view').attr('data-dominant-view-id')).toBe('dominant');
                });
            });
            describe('Dominant service for viewable for Asia with three views', function () {
                beforeEach(function () {
                    scope.viewable = combineViews(createViewable('Economy', 'http://data.emii.com/locations/asi'),
                        [createView('first', 'gis', absolute, horizonShort, '2013-07-01'),
                            createView('dominant', 'ems', absolute, horizonShort, '2013-07-01'),
                            createView('second', 'cis', absolute, horizonShort, '2013-07-01')
                        ]);
                    scope.$root.$digest();
                });
                it('should not display dominant view', function () {
                    expect(htmlElement.find('.dominant-view').length === 1).toBe(true);
                    expect(htmlElement.find('.dominant-view').attr('data-dominant-view-id')).toBe('dominant');
                });
            });
            describe('Dominant service for viewable for Other regions with three views', function () {
                beforeEach(function () {
                    scope.viewable = combineViews(createViewable('RealEstateMarket', 'http://data.emii.com/locations/other'),
                        [createView('first', 'gres', absolute, horizonShort, '2013-07-01'),
                        createView('second', 'gis', absolute, horizonShort, '2013-07-01'),
                        createView('dominant', 'bcah', absolute, horizonShort, '2013-07-01')]);
                    scope.$root.$digest();
                });
                it('should not display dominant view', function () {
                    expect(htmlElement.find('.dominant-view').length === 1).toBe(true);
                    expect(htmlElement.find('.dominant-view').attr('data-dominant-view-id')).toBe('dominant');
                });
            });
            describe('Dominant service for viewable of Economy type for Other regions with three views with different horizons', function () {
                beforeEach(function () {
                    scope.viewable = combineViews(createViewable('Economy', 'http://data.emii.com/locations/other'),
                        [createView('first', 'cis', absolute, horizonMedium, '2013-07-01'),
                        createView('second', 'cis', absolute, horizonShort, '2013-07-01'),
                        createView('dominant', 'eis', absolute, horizonLong, '2013-07-01')]);
                    scope.$root.$digest();
                });
                it('should not display dominant view', function () {
                    expect(htmlElement.find('.dominant-view').length === 1).toBe(true);
                    expect(htmlElement.find('.dominant-view').attr('data-dominant-view-id')).toBe('dominant');
                });
            });
        });
        describe('Dominant service in undefined region', function () {
            beforeEach(function () {
                scope.viewable = combineViews(createViewable('Economy', 'http://data.emii.com/locations/other'),
                    [createView('first', 'usis', absolute, horizonShort, '2013-07-01'),
                    createView('dominant economy', 'gis', absolute, horizonShort, '2013-07-01'),
                    createView('third', 'ems', absolute, horizonShort, '2013-07-01'),
                    createView('fourth', 'eis', absolute, horizonShort, '2013-07-01')]);
                scope.viewable.forLocation = undefined;
                scope.$root.$digest();
            });
            it('should not display dominant view from the last order definition table', function () {
                expect(htmlElement.find('.dominant-view').length === 1).toBe(true);
                expect(htmlElement.find('.dominant-view').attr('data-dominant-view-id')).toBe('dominant economy');
            });
        });
        describe('When dominantView field is specified', function () {
            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope.$new();
                scope.view = createView('dominant view', 'ems', absolute, horizonShort, '2013-07-01');
                htmlElement = $compile('<div dominant-view="view"></div>')(scope);
                scope.$root.$digest();
            }));
            it('it should use the specified view', function () {
                expect(htmlElement.find('.dominant-view').length === 1).toBe(true);
                expect(htmlElement.find('.dominant-view').children().length > 0).toBe(true);
                expect(htmlElement.find('.dominant-view').attr('data-dominant-view-id')).toBe('dominant view');
            });
        });
        describe('When dominantView field is not available', function () {
            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope.$new();
                htmlElement = $compile('<div dominant-view></div>')(scope);
                scope.$root.$digest();
            }));
            it('it should use the specified view', function () {
                expect(htmlElement.find('.dominant-view').length === 1).toBe(true);
                expect(htmlElement.find('.dominant-view').children().length === 0).toBe(true);
            });
        });
    });
});


