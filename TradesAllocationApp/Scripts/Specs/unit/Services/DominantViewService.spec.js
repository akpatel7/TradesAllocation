define(['underscore',
        'angular',
        'mocks',
        'App/Services/services'], function(_) {
            describe('DominantViewService', function() {
                describe('Given we have a DominantViewService', function() {

                    beforeEach(function() {
                        module('App.services');
                    });


                   
                    describe('getServiceRankingForViewable tests:', function () {

                        function createViewable(type, regionId, locationId) {
                            return {
                                '@type': type,
                                'forLocation': {
                                    "@id": locationId || 'http://data.emii.com/locations/deu',
                                    'withinLocation': {
                                        '@set': [
                                            {
                                                 '@id': regionId
                                            }
                                        ]
                                    }
                                }
                            };
                        }

                        describe('When passing viewable for Americas "Fixed Income" type', function () {
                            it('should return array of services for Americas region', inject(function (DominantView) {
                                var viewable = createViewable('FixedIncomeMarket', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/amer');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'USBS', 'USIS', 'GIS', 'GISM', 'GFIS', 'BCA', 'FES', 'GAA', 'USES', 'CNE', 'EMS']);
                            }));
                            it('should return name of the service', inject(function (DominantView) {
                                var viewable = createViewable('FixedIncomeMarket', 'http://data.emii.com/locations/amer', 'http://data.emii.com/locations/usa');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'USBS', 'USIS', 'GIS', 'GISM', 'GFIS', 'BCA', 'FES', 'GAA', 'USES', 'CNE', 'EMS']);
                            }));
                        });
                        describe('When passing viewable for Americas "Economy" type', function () {
                            it('should return array of services for Americas region', inject(function (DominantView) {
                                var viewable = createViewable('Economy', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/amer');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'USIS', 'GIS', 'GISM', 'BCA', 'USBS', 'USES', 'FES', 'GFIS', 'EMS', 'CNE', 'GAA', 'GPS', 'EIS', 'CIS', 'GRES']);
                            }));
                            it('should return array of services for Americas location', inject(function (DominantView) {
                                var viewable = createViewable('Economy', 'http://data.emii.com/locations/amer', 'http://data.emii.com/locations/usa');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'USIS', 'GIS', 'GISM', 'BCA', 'USBS', 'USES', 'FES', 'GFIS', 'EMS', 'CNE', 'GAA', 'GPS', 'EIS', 'CIS', 'GRES']);
                            }));
                        });
                        describe('When passing viewable for Americas "FiscalPolicy" type', function () {
                            it('should return array of services for Americas region', inject(function (DominantView) {
                                var viewable = createViewable('FiscalPolicy', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/amer');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'USIS', 'GIS', 'GISM', 'BCA', 'USBS', 'USES', 'FES', 'GFIS', 'EMS', 'CNE', 'GAA', 'GPS', 'EIS', 'CIS', 'GRES']);
                            }));
                            it('should return array of services for Americas location', inject(function (DominantView) {
                                var viewable = createViewable('FiscalPolicy', 'http://data.emii.com/locations/amer', 'http://data.emii.com/locations/usa');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'USIS', 'GIS', 'GISM', 'BCA', 'USBS', 'USES', 'FES', 'GFIS', 'EMS', 'CNE', 'GAA', 'GPS', 'EIS', 'CIS', 'GRES']);
                            }));
                        });
                        describe('When passing viewable for Americas "MonetaryPolicy" type', function () {
                            it('should return array of services for Americas region', inject(function (DominantView) {
                                var viewable = createViewable('MonetaryPolicy', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/amer');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'USIS', 'GIS', 'GISM', 'BCA', 'USBS', 'USES', 'FES', 'GFIS', 'EMS', 'CNE', 'GAA', 'GPS', 'EIS', 'CIS', 'GRES']);
                            }));
                            it('should return array of services for Americas location', inject(function (DominantView) {
                                var viewable = createViewable('MonetaryPolicy', 'http://data.emii.com/locations/amer', 'http://data.emii.com/locations/usa');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'USIS', 'GIS', 'GISM', 'BCA', 'USBS', 'USES', 'FES', 'GFIS', 'EMS', 'CNE', 'GAA', 'GPS', 'EIS', 'CIS', 'GRES']);
                            }));
                        });
                        describe('When passing viewable for Americas "Inflation" type', function () {
                            it('should return array of services for Americas region', inject(function (DominantView) {
                                var viewable = createViewable('Inflation', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/amer');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'USIS', 'GIS', 'GISM', 'BCA', 'USBS', 'USES', 'FES', 'GFIS', 'EMS', 'CNE', 'GAA', 'GPS', 'EIS', 'CIS', 'GRES']);
                            }));
                            it('should return array of services for Americas location', inject(function (DominantView) {
                                var viewable = createViewable('Inflation', 'http://data.emii.com/locations/amer', 'http://data.emii.com/locations/usa');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'USIS', 'GIS', 'GISM', 'BCA', 'USBS', 'USES', 'FES', 'GFIS', 'EMS', 'CNE', 'GAA', 'GPS', 'EIS', 'CIS', 'GRES']);
                            }));
                        });
                        describe('When passing viewable for Americas "InterestRate" type', function () {
                            it('should return array of services for Americas region', inject(function (DominantView) {
                                var viewable = createViewable('InterestRate', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/amer');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'USIS', 'GIS', 'GISM', 'BCA', 'USBS', 'USES', 'FES', 'GFIS', 'EMS', 'CNE', 'GAA', 'GPS', 'EIS', 'CIS', 'GRES']);
                            }));
                            it('should return array of services for Americas location', inject(function (DominantView) {
                                var viewable = createViewable('InterestRate', 'http://data.emii.com/locations/amer', 'http://data.emii.com/locations/usa');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'USIS', 'GIS', 'GISM', 'BCA', 'USBS', 'USES', 'FES', 'GFIS', 'EMS', 'CNE', 'GAA', 'GPS', 'EIS', 'CIS', 'GRES']);
                            }));
                        });
                        describe('When passing viewable for Americas "EquityMarket" type', function () {
                            it('should return array of services for Americas region', inject(function (DominantView) {
                                var viewable = createViewable('EquityMarket', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/amer');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'USES', 'GIS', 'GISM', 'USIS', 'BCA', 'GAA', 'EMS', 'EIS', 'USB', 'GFIS', 'CIS', 'CNE', 'GPS']);
                            }));
                            it('should return array of services for Americas location', inject(function (DominantView) {
                                var viewable = createViewable('EquityMarket', 'http://data.emii.com/locations/amer', 'http://data.emii.com/locations/usa');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'USES', 'GIS', 'GISM', 'USIS', 'BCA', 'GAA', 'EMS', 'EIS', 'USB', 'GFIS', 'CIS', 'CNE', 'GPS']);
                            }));
                        });
                        describe('When passing viewable for Americas "CurrencyMarket" type', function () {
                            it('should return array of services for Americas region', inject(function (DominantView) {
                                var viewable = createViewable('CurrencyMarket', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/amer');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'FES', 'GIS', 'GISM', 'BCA', 'USIS', 'USES', 'USB', 'GFIS', 'GPS', 'GAA', 'EIS', 'CNE', 'EMS', 'CIS']);
                            }));
                            it('should return array of services for Americas location', inject(function (DominantView) {
                                var viewable = createViewable('CurrencyMarket', 'http://data.emii.com/locations/amer', 'http://data.emii.com/locations/usa');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'FES', 'GIS', 'GISM', 'BCA', 'USIS', 'USES', 'USB', 'GFIS', 'GPS', 'GAA', 'EIS', 'CNE', 'EMS', 'CIS']);
                            }));
                        });
                        describe('When passing viewable for Americas "Currency" type', function () {
                            it('should return array of services for Americas region', inject(function (DominantView) {
                                var viewable = createViewable('Currency', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/amer');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'FES', 'GIS', 'GISM', 'BCA', 'USIS', 'USES', 'USB', 'GFIS', 'GPS', 'GAA', 'EIS', 'CNE', 'EMS', 'CIS']);
                            }));
                            it('should return array of services for Americas location', inject(function (DominantView) {
                                var viewable = createViewable('Currency', 'http://data.emii.com/locations/amer', 'http://data.emii.com/locations/usa');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'FES', 'GIS', 'GISM', 'BCA', 'USIS', 'USES', 'USB', 'GFIS', 'GPS', 'GAA', 'EIS', 'CNE', 'EMS', 'CIS']);
                            }));
                        });
                        describe('When passing viewable for Americas "CommodityMarket" type', function () {
                            it('should return array of services for Americas region', inject(function (DominantView) {
                                var viewable = createViewable('CommodityMarket', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/amer');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'CNE', 'GIS', 'GISM', 'USES', 'BCA', 'FES', 'EMS', 'USBS', 'GFIS']);
                            }));
                            it('should return array of services for Americas location', inject(function (DominantView) {
                                var viewable = createViewable('CommodityMarket', 'http://data.emii.com/locations/amer', 'http://data.emii.com/locations/usa');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'CNE', 'GIS', 'GISM', 'USES', 'BCA', 'FES', 'EMS', 'USBS', 'GFIS']);
                            }));
                        });
                        describe('When passing viewable for Americas "RealEstateMarket" type', function () {
                            it('should return array of services for Americas region', inject(function (DominantView) {
                                var viewable = createViewable('RealEstateMarket', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/amer');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'GRES', 'USIS', 'USBS', 'USES', 'GIS', 'GISM', 'BCA', 'GFIS', 'CNE']);
                            }));
                            it('should return array of services for Americas location', inject(function (DominantView) {
                                var viewable = createViewable('RealEstateMarket', 'http://data.emii.com/locations/amer', 'http://data.emii.com/locations/usa');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'GRES', 'USIS', 'USBS', 'USES', 'GIS', 'GISM', 'BCA', 'GFIS', 'CNE']);
                            }));
                        });
                        
                        describe('When passing viewable for Europe "Fixed Income" type', function () {
                            it('should return array of services for Europe region', inject(function (DominantView) {
                                var viewable = createViewable('FixedIncomeMarket', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/europe');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EIS', 'GFIS', 'GIS', 'GISM', 'BCA', 'GAA', 'GPS', 'FES']);
                            }));
                            it('should return array of services for Europe location', inject(function (DominantView) {
                                var viewable = createViewable('FixedIncomeMarket', 'http://data.emii.com/locations/europe', 'http://data.emii.com/locations/fra');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EIS', 'GFIS', 'GIS', 'GISM', 'BCA', 'GAA', 'GPS', 'FES']);
                            }));
                        });
                        describe('When passing viewable for Europe "Economy" type', function () {
                            it('should return array of services for Europe region', inject(function (DominantView) {
                                var viewable = createViewable('Economy', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/europe');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EIS', 'GIS', 'GISM', 'GFIS', 'BCA', 'FES', 'GPS', 'GAA', 'CNE', 'EMS', 'USES', 'CIS', 'USIS', 'USB', 'GRES']);
                            }));
                            it('should return array of services for Europe location', inject(function (DominantView) {
                                var viewable = createViewable('Economy', 'http://data.emii.com/locations/europe', 'http://data.emii.com/locations/fra');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EIS', 'GIS', 'GISM', 'GFIS', 'BCA', 'FES', 'GPS', 'GAA', 'CNE', 'EMS', 'USES', 'CIS', 'USIS', 'USB', 'GRES']);
                            }));
                        });
                        describe('When passing viewable for Europe "FiscalPolicy" type', function () {
                            it('should return array of services for Europe region', inject(function (DominantView) {
                                var viewable = createViewable('FiscalPolicy', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/europe');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EIS', 'GIS', 'GISM', 'GFIS', 'BCA', 'FES', 'GPS', 'GAA', 'CNE', 'EMS', 'USES', 'CIS', 'USIS', 'USB', 'GRES']);
                            }));
                            it('should return array of services for Europe location', inject(function (DominantView) {
                                var viewable = createViewable('FiscalPolicy', 'http://data.emii.com/locations/europe', 'http://data.emii.com/locations/fra');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EIS', 'GIS', 'GISM', 'GFIS', 'BCA', 'FES', 'GPS', 'GAA', 'CNE', 'EMS', 'USES', 'CIS', 'USIS', 'USB', 'GRES']);
                            }));
                        });
                        describe('When passing viewable for Europe "MonetaryPolicy" type', function () {
                            it('should return array of services for Europe region', inject(function (DominantView) {
                                var viewable = createViewable('MonetaryPolicy', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/europe');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EIS', 'GIS', 'GISM', 'GFIS', 'BCA', 'FES', 'GPS', 'GAA', 'CNE', 'EMS', 'USES', 'CIS', 'USIS', 'USB', 'GRES']);
                            }));
                            it('should return array of services for Europe location', inject(function (DominantView) {
                                var viewable = createViewable('MonetaryPolicy', 'http://data.emii.com/locations/europe', 'http://data.emii.com/locations/fra');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EIS', 'GIS', 'GISM', 'GFIS', 'BCA', 'FES', 'GPS', 'GAA', 'CNE', 'EMS', 'USES', 'CIS', 'USIS', 'USB', 'GRES']);
                            }));
                        });
                        describe('When passing viewable for Europe "Inflation" type', function () {
                            it('should return array of services for Europe region', inject(function (DominantView) {
                                var viewable = createViewable('Inflation', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/europe');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EIS', 'GIS', 'GISM', 'GFIS', 'BCA', 'FES', 'GPS', 'GAA', 'CNE', 'EMS', 'USES', 'CIS', 'USIS', 'USB', 'GRES']);
                            }));
                            it('should return array of services for Europe location', inject(function (DominantView) {
                                var viewable = createViewable('Inflation', 'http://data.emii.com/locations/europe', 'http://data.emii.com/locations/fra');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EIS', 'GIS', 'GISM', 'GFIS', 'BCA', 'FES', 'GPS', 'GAA', 'CNE', 'EMS', 'USES', 'CIS', 'USIS', 'USB', 'GRES']);
                            }));
                        });
                        describe('When passing viewable for Europe "InterestRate" type', function () {
                            it('should return array of services for Europe region', inject(function (DominantView) {
                                var viewable = createViewable('InterestRate', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/europe');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EIS', 'GIS', 'GISM', 'GFIS', 'BCA', 'FES', 'GPS', 'GAA', 'CNE', 'EMS', 'USES', 'CIS', 'USIS', 'USB', 'GRES']);
                            }));
                            it('should return array of services for Europe location', inject(function (DominantView) {
                                var viewable = createViewable('InterestRate', 'http://data.emii.com/locations/europe', 'http://data.emii.com/locations/fra');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EIS', 'GIS', 'GISM', 'GFIS', 'BCA', 'FES', 'GPS', 'GAA', 'CNE', 'EMS', 'USES', 'CIS', 'USIS', 'USB', 'GRES']);
                            }));
                        });
                        describe('When passing viewable for Europe "EquityMarket" type', function () {
                            it('should return array of services for Europe region', inject(function (DominantView) {
                                var viewable = createViewable('EquityMarket', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/europe');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EIS', 'GIS', 'GISM', 'BCA', 'GAA', 'GPS']);
                            }));
                            it('should return array of services for Europe location', inject(function (DominantView) {
                                var viewable = createViewable('EquityMarket', 'http://data.emii.com/locations/europe', 'http://data.emii.com/locations/fra');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EIS', 'GIS', 'GISM', 'BCA', 'GAA', 'GPS']);
                            }));
                        });
                        describe('When passing viewable for Europe "CurrencyMarket" type', function () {
                            it('should return array of services for Europe region', inject(function (DominantView) {
                                var viewable = createViewable('CurrencyMarket', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/europe');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'FES', 'EIS', 'GIS', 'GISM', 'GFIS', 'BCA', 'GPS', 'CNE', 'GAA', 'USES', 'EMS']);
                            }));
                            it('should return array of services for Europe location', inject(function (DominantView) {
                                var viewable = createViewable('CurrencyMarket', 'http://data.emii.com/locations/europe', 'http://data.emii.com/locations/fra');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'FES', 'EIS', 'GIS', 'GISM', 'GFIS', 'BCA', 'GPS', 'CNE', 'GAA', 'USES', 'EMS']);
                            }));
                        });
                        describe('When passing viewable for Europe "Currency" type', function () {
                            it('should return array of services for Europe region', inject(function (DominantView) {
                                var viewable = createViewable('Currency', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/europe');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'FES', 'EIS', 'GIS', 'GISM', 'GFIS', 'BCA', 'GPS', 'CNE', 'GAA', 'USES', 'EMS']);
                            }));
                            it('should return array of services for Europe location', inject(function (DominantView) {
                                var viewable = createViewable('Currency', 'http://data.emii.com/locations/europe', 'http://data.emii.com/locations/fra');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'FES', 'EIS', 'GIS', 'GISM', 'GFIS', 'BCA', 'GPS', 'CNE', 'GAA', 'USES', 'EMS']);
                            }));
                        });
                        describe('When passing viewable for Europe "CommodityMarket" type', function () {
                            it('should return array of services for Europe region', inject(function (DominantView) {
                                var viewable = createViewable('CommodityMarket', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/europe');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'CNE', 'EIS', 'GIS', 'GISM', 'EMS']);
                            }));
                            it('should return array of services for Europe location', inject(function (DominantView) {
                                var viewable = createViewable('CommodityMarket', 'http://data.emii.com/locations/europe', 'http://data.emii.com/locations/fra');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'CNE', 'EIS', 'GIS', 'GISM', 'EMS']);
                            }));
                        });
                        describe('When passing viewable for Europe "RealEstateMarket" type', function () {
                            it('should return array of services for Europe region', inject(function (DominantView) {
                                var viewable = createViewable('RealEstateMarket', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/europe');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'GRES', 'EIS', 'GFIS', 'GIS', 'GISM', 'BCA']);
                            }));
                            it('should return array of services for Europe location', inject(function (DominantView) {
                                var viewable = createViewable('RealEstateMarket', 'http://data.emii.com/locations/europe', 'http://data.emii.com/locations/fra');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'GRES', 'EIS', 'GFIS', 'GIS', 'GISM', 'BCA']);
                            }));
                        });
                        
                        describe('When passing viewable for Asia "Fixed Income" type', function () {
                            it('should return array of services for Asia region', inject(function (DominantView) {
                                var viewable = createViewable('FixedIncomeMarket', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/asi');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EMS', 'GFIS', 'GIS', 'GISM', 'CIS', 'FES', 'GAA', 'GPS']);
                            }));
                            it('should return array of services for Asia location', inject(function (DominantView) {
                                var viewable = createViewable('FixedIncomeMarket', 'http://data.emii.com/locations/asi', 'http://data.emii.com/locations/ind');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EMS', 'GFIS', 'GIS', 'GISM', 'CIS', 'FES', 'GAA', 'GPS']);
                            }));
                        });
                        describe('When passing viewable for Asia "Economy" type', function () {
                            it('should return array of services for Asia region', inject(function (DominantView) {
                                var viewable = createViewable('Economy', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/asi');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EMS', 'GIS', 'GISM', 'CIS', 'CNE', 'FES', 'GAA', 'GPS', 'BCA']);
                            }));
                            it('should return array of services for Asia location', inject(function (DominantView) {
                                var viewable = createViewable('Economy', 'http://data.emii.com/locations/asi', 'http://data.emii.com/locations/ind');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EMS', 'GIS', 'GISM', 'CIS', 'CNE', 'FES', 'GAA', 'GPS', 'BCA']);
                            }));
                        });
                        describe('When passing viewable for Asia "FiscalPolicy" type', function () {
                            it('should return array of services for Asia region', inject(function (DominantView) {
                                var viewable = createViewable('FiscalPolicy', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/asi');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EMS', 'GIS', 'GISM', 'CIS', 'CNE', 'FES', 'GAA', 'GPS', 'BCA']);
                            }));
                            it('should return array of services for Asia location', inject(function (DominantView) {
                                var viewable = createViewable('FiscalPolicy', 'http://data.emii.com/locations/asi', 'http://data.emii.com/locations/ind');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EMS', 'GIS', 'GISM', 'CIS', 'CNE', 'FES', 'GAA', 'GPS', 'BCA']);
                            }));
                        });
                        describe('When passing viewable for Asia "MonetaryPolicy" type', function () {
                            it('should return array of services for Asia region', inject(function (DominantView) {
                                var viewable = createViewable('MonetaryPolicy', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/asi');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EMS', 'GIS', 'GISM', 'CIS', 'CNE', 'FES', 'GAA', 'GPS', 'BCA']);
                            }));
                            it('should return array of services for Asia location', inject(function (DominantView) {
                                var viewable = createViewable('MonetaryPolicy', 'http://data.emii.com/locations/asi', 'http://data.emii.com/locations/ind');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EMS', 'GIS', 'GISM', 'CIS', 'CNE', 'FES', 'GAA', 'GPS', 'BCA']);
                            }));
                        });
                        describe('When passing viewable for Asia "Inflation" type', function () {
                            it('should return array of services for Asia region', inject(function (DominantView) {
                                var viewable = createViewable('Inflation', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/asi');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EMS', 'GIS', 'GISM', 'CIS', 'CNE', 'FES', 'GAA', 'GPS', 'BCA']);
                            }));
                            it('should return array of services for Asia location', inject(function (DominantView) {
                                var viewable = createViewable('Inflation', 'http://data.emii.com/locations/asi', 'http://data.emii.com/locations/ind');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EMS', 'GIS', 'GISM', 'CIS', 'CNE', 'FES', 'GAA', 'GPS', 'BCA']);
                            }));
                        });
                        describe('When passing viewable for Asia "InterestRate" type', function () {
                            it('should return array of services for Asia region', inject(function (DominantView) {
                                var viewable = createViewable('InterestRate', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/asi');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EMS', 'GIS', 'GISM', 'CIS', 'CNE', 'FES', 'GAA', 'GPS', 'BCA']);
                            }));
                            it('should return array of services for Asia location', inject(function (DominantView) {
                                var viewable = createViewable('InterestRate', 'http://data.emii.com/locations/asi', 'http://data.emii.com/locations/ind');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EMS', 'GIS', 'GISM', 'CIS', 'CNE', 'FES', 'GAA', 'GPS', 'BCA']);
                            }));
                        });
                        describe('When passing viewable for Asia "EquityMarket" type', function () {
                            it('should return array of services for Asia region', inject(function (DominantView) {
                                var viewable = createViewable('EquityMarket', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/asi');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EMS', 'GIS', 'GISM', 'CIS', 'GAA', 'GPS']);
                            }));
                            it('should return array of services for Asia location', inject(function (DominantView) {
                                var viewable = createViewable('EquityMarket', 'http://data.emii.com/locations/asi', 'http://data.emii.com/locations/ind');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EMS', 'GIS', 'GISM', 'CIS', 'GAA', 'GPS']);
                            }));
                        });
                        describe('When passing viewable for Asia "CurrencyMarket" type', function () {
                            it('should return array of services for Asia region', inject(function (DominantView) {
                                var viewable = createViewable('CurrencyMarket', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/asi');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EMS', 'FES', 'GIS', 'GISM', 'CIS', 'GFIS', 'CNE', 'GAA', 'USES']);
                            }));
                            it('should return array of services for Asia location', inject(function (DominantView) {
                                var viewable = createViewable('CurrencyMarket', 'http://data.emii.com/locations/asi', 'http://data.emii.com/locations/ind');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EMS', 'FES', 'GIS', 'GISM', 'CIS', 'GFIS', 'CNE', 'GAA', 'USES']);
                            }));
                        });
                        describe('When passing viewable for Asia "Currency" type', function () {
                            it('should return array of services for Asia region', inject(function (DominantView) {
                                var viewable = createViewable('Currency', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/asi');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EMS', 'FES', 'GIS', 'GISM', 'CIS', 'GFIS', 'CNE', 'GAA', 'USES']);
                            }));
                            it('should return array of services for Asia location', inject(function (DominantView) {
                                var viewable = createViewable('Currency', 'http://data.emii.com/locations/asi', 'http://data.emii.com/locations/ind');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'EMS', 'FES', 'GIS', 'GISM', 'CIS', 'GFIS', 'CNE', 'GAA', 'USES']);
                            }));
                        });
                        describe('When passing viewable for Asia "CommodityMarket" type', function () {
                            it('should return array of services for Asia region', inject(function (DominantView) {
                                var viewable = createViewable('CommodityMarket', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/asi');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'CNE', 'GIS', 'GISM', 'EMS', 'CIS', 'USES', 'GPS']);
                            }));
                            it('should return array of services for Asia location', inject(function (DominantView) {
                                var viewable = createViewable('CommodityMarket', 'http://data.emii.com/locations/asi', 'http://data.emii.com/locations/ind');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'CNE', 'GIS', 'GISM', 'EMS', 'CIS', 'USES', 'GPS']);
                            }));
                        });
                        describe('When passing viewable for Asia "RealEstateMarket" type', function () {
                            it('should return array of services for Asia region', inject(function (DominantView) {
                                var viewable = createViewable('RealEstateMarket', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/asi');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'GRES', 'EMS', 'CIS', 'GIS', 'GISM', 'BCA']);
                            }));
                            it('should return array of services for Asia location', inject(function (DominantView) {
                                var viewable = createViewable('RealEstateMarket', 'http://data.emii.com/locations/asi', 'http://data.emii.com/locations/ind');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'GRES', 'EMS', 'CIS', 'GIS', 'GISM', 'BCA']);
                            }));
                        });
                        
                        describe('When passing viewable for Other region "Fixed Income" type', function () {
                            it('should return array of services for Other region', inject(function (DominantView) {
                                var viewable = createViewable('FixedIncomeMarket', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/aus');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'GFIS', 'GIS', 'GISM', 'EMS', 'GAA', 'GPS']);
                            }));
                            it('should return array of services for Other location', inject(function (DominantView) {
                                var viewable = createViewable('FixedIncomeMarket', 'http://data.emii.com/locations/aus', 'http://data.emii.com/locations/perth');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'GFIS', 'GIS', 'GISM', 'EMS', 'GAA', 'GPS']);
                            }));
                        });
                        describe('When passing viewable for Other region "Economy" type', function () {
                            it('should return array of services for Other region', inject(function (DominantView) {
                                var viewable = createViewable('Economy', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/aus');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'GIS', 'GISM', 'EMS', 'GFIS', 'BCA', 'GAA', 'GPS']);
                            }));
                            it('should return array of services for Other location', inject(function (DominantView) {
                                var viewable = createViewable('Economy', 'http://data.emii.com/locations/aus', 'http://data.emii.com/locations/perth');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'GIS', 'GISM', 'EMS', 'GFIS', 'BCA', 'GAA', 'GPS']);
                            }));
                        });
                        describe('When passing viewable for Other region "FiscalPolicy" type', function () {
                            it('should return array of services for Other region', inject(function (DominantView) {
                                var viewable = createViewable('FiscalPolicy', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/aus');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'GIS', 'GISM', 'EMS', 'GFIS', 'BCA', 'GAA', 'GPS']);
                            }));
                            it('should return array of services for Other location', inject(function (DominantView) {
                                var viewable = createViewable('FiscalPolicy', 'http://data.emii.com/locations/aus', 'http://data.emii.com/locations/perth');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'GIS', 'GISM', 'EMS', 'GFIS', 'BCA', 'GAA', 'GPS']);
                            }));
                        });
                        describe('When passing viewable for Other region "MonetaryPolicy" type', function () {
                            it('should return array of services for Other region', inject(function (DominantView) {
                                var viewable = createViewable('MonetaryPolicy', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/aus');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'GIS', 'GISM', 'EMS', 'GFIS', 'BCA', 'GAA', 'GPS']);
                            }));
                            it('should return array of services for Other location', inject(function (DominantView) {
                                var viewable = createViewable('MonetaryPolicy', 'http://data.emii.com/locations/aus', 'http://data.emii.com/locations/perth');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'GIS', 'GISM', 'EMS', 'GFIS', 'BCA', 'GAA', 'GPS']);
                            }));
                        });
                        describe('When passing viewable for Other region "Inflation" type', function () {
                            it('should return array of services for Other region', inject(function (DominantView) {
                                var viewable = createViewable('Inflation', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/aus');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'GIS', 'GISM', 'EMS', 'GFIS', 'BCA', 'GAA', 'GPS']);
                            }));
                            it('should return array of services for Other location', inject(function (DominantView) {
                                var viewable = createViewable('Inflation', 'http://data.emii.com/locations/aus', 'http://data.emii.com/locations/perth');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'GIS', 'GISM', 'EMS', 'GFIS', 'BCA', 'GAA', 'GPS']);
                            }));
                        });
                        describe('When passing viewable for Other region "InterestRate" type', function () {
                            it('should return array of services for Other region', inject(function (DominantView) {
                                var viewable = createViewable('InterestRate', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/aus');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'GIS', 'GISM', 'EMS', 'GFIS', 'BCA', 'GAA', 'GPS']);
                            }));
                            it('should return array of services for Other location', inject(function (DominantView) {
                                var viewable = createViewable('InterestRate', 'http://data.emii.com/locations/aus', 'http://data.emii.com/locations/perth');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'GIS', 'GISM', 'EMS', 'GFIS', 'BCA', 'GAA', 'GPS']);
                            }));
                        });
                        describe('When passing viewable for Other region "EquityMarket" type', function () {
                            it('should return array of services for Other region', inject(function (DominantView) {
                                var viewable = createViewable('EquityMarket', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/aus');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'GIS', 'GISM', 'EMS', 'BCA', 'GAA']);
                            }));
                            it('should return array of services for Other location', inject(function (DominantView) {
                                var viewable = createViewable('EquityMarket', 'http://data.emii.com/locations/aus', 'http://data.emii.com/locations/perth');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'GIS', 'GISM', 'EMS', 'BCA', 'GAA']);
                            }));
                        });
                        describe('When passing viewable for Other region "CurrencyMarket" type', function () {
                            it('should return array of services for Other region', inject(function (DominantView) {
                                var viewable = createViewable('CurrencyMarket', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/aus');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'FES', 'GIS', 'GISM', 'EMS', 'GAA', 'GPS', 'BCA']);
                            }));
                            it('should return array of services for Other location', inject(function (DominantView) {
                                var viewable = createViewable('CurrencyMarket', 'http://data.emii.com/locations/aus', 'http://data.emii.com/locations/perth');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'FES', 'GIS', 'GISM', 'EMS', 'GAA', 'GPS', 'BCA']);
                            }));
                        });
                        describe('When passing viewable for Other region "Currency" type', function () {
                            it('should return array of services for Other region', inject(function (DominantView) {
                                var viewable = createViewable('Currency', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/aus');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'FES', 'GIS', 'GISM', 'EMS', 'GAA', 'GPS', 'BCA']);
                            }));
                            it('should return array of services for Other location', inject(function (DominantView) {
                                var viewable = createViewable('Currency', 'http://data.emii.com/locations/aus', 'http://data.emii.com/locations/perth');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'FES', 'GIS', 'GISM', 'EMS', 'GAA', 'GPS', 'BCA']);
                            }));
                        });
                        describe('When passing viewable for Other region "CommodityMarket" type', function () {
                            it('should return array of services for Other region', inject(function (DominantView) {
                                var viewable = createViewable('CommodityMarket', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/aus');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'CNE', 'GIS', 'GISM', 'EMS', 'USES']);
                            }));
                            it('should return array of services for Other location', inject(function (DominantView) {
                                var viewable = createViewable('CommodityMarket', 'http://data.emii.com/locations/aus', 'http://data.emii.com/locations/perth');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'CNE', 'GIS', 'GISM', 'EMS', 'USES']);
                            }));
                        });
                        describe('When passing viewable for Other region "RealEstateMarket" type', function () {
                            it('should return array of services for Other region', inject(function (DominantView) {
                                var viewable = createViewable('RealEstateMarket', 'http://data.emii.com/locations/deved', 'http://data.emii.com/locations/aus');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'GRES', 'GIS', 'GISM', 'GFIS']);
                            }));
                            it('should return array of services for Other location', inject(function (DominantView) {
                                var viewable = createViewable('RealEstateMarket', 'http://data.emii.com/locations/aus', 'http://data.emii.com/locations/perth');
                                var result = DominantView.getServiceRankingForViewable(viewable);
                                expect(result).toEqual(['HOUSE', 'GRES', 'GIS', 'GISM', 'GFIS']);
                            }));
                        });
                    });
                    describe('getFilteredViews tests:', function () {

                        function createView(id, service) {
                            return {
                                "@id": id,
                                "service": {
                                    "@id": "http://data.emii.com/bca/services/" + service
                                }
                            };
                        }

                        describe('When passing two views from two services, where both are specified in ranking table', function () {

                            it('should return array contains view from service with higher ranking ', inject(function (DominantView) {
                                var views = [createView('view1', 'cis'), createView('view2', 'GIS', 'GISM')];
                                var result = DominantView.getFilteredViews(views, ['HOUSE', 'GIS', 'GISM', 'EIS', 'CIS']);
                                expect(result.length).toBe(1);
                                expect(result[0]['@id']).toBe('view2');
                            }));
                        });
                        describe('When passing two views from two services, where one is specified in ranking table', function () {
                            it('should return array contains view from service specified in ranking', inject(function (DominantView) {
                                var views = [createView('view1', 'cis'), createView('view2', 'GIS', 'GISM')];
                                var result = DominantView.getFilteredViews(views, ['HOUSE', 'GIS', 'GISM', 'EIS']);
                                expect(result.length).toBe(1);
                                expect(result[0]['@id']).toBe('view2');
                            }));
                        });
                        describe('When passing three views from two services, where none is specified in ranking table', function () {
                            it('should return array contains all three views', inject(function (DominantView) {
                                var views = [createView('view1', 'cis'), createView('view2', 'GIS', 'GISM'), createView('view3', 'GIS', 'GISM')];
                                var result = DominantView.getFilteredViews(views, ['HOUSE', 'GAA', 'EMS']);
                                expect(result.length).toBe(3);
                                expect(result[0]['@id']).toBe('view1');
                                expect(result[1]['@id']).toBe('view2');
                                expect(result[2]['@id']).toBe('view3');
                            }));
                        });
                    });
                    describe('getDominantViewByHorizon tests:', function () {

                        function createView(id, horizon) {
                            return {
                                "@id": id,
                                "viewHorizon": horizon
                            };
                        }

                        describe('When passing two views with different horizon', function () {

                            it('should return view with longer horizon', inject(function (DominantView) {
                                var views = [createView('view1', 'P3M'), createView('view2', 'P6M')];
                                var result = DominantView.getDominantViewByHorizon(views);
                                expect(result['@id']).toBe('view2');
                            }));
                        });
                    });
                    describe('getDominantRelativeView tests:', function () {

                        function createView(id, startDate, region, location) {
                            return {
                                "@id": id,
                                horizonStartDate: startDate,
                                viewWeighting: { "canonicalLabel": "relative" },
                                viewRelativeTo: {
                                    "forLocation": {
                                        "@id": location,
                                        "withinLocation": {
                                            "@id": region
                                        }
                                    }
                                }
                            };
                        }

                        describe('When passing two relative views, one for US market and one for other', function () {
                            it('should return view for US market location', inject(function (DominantView) {
                                var views = [createView('view1', '2013-06-01', 'http://data.emii.com/locations/aus', 'http://data.emii.com/locations/perth'),
                                    createView('view2', '2013-06-01', 'http://data.emii.com/locations/usa', 'http://data.emii.com/locations/denv')];
                                var result = DominantView.getDominantRelativeView(views);
                                expect(result['@id']).toBe('view2');
                            }));
                            it('should return view for US market region', inject(function (DominantView) {
                                var views = [createView('view1', '2013-06-01', 'http://data.emii.com/locations/aus', 'http://data.emii.com/locations/perth'),
                                    createView('view2', '2013-06-01', 'http://data.emii.com/locations/amer', 'http://data.emii.com/locations/usa')];
                                var result = DominantView.getDominantRelativeView(views);
                                expect(result['@id']).toBe('view2');
                            }));
                        });
                        describe('When passing two relative views, one for US market and one for Europe', function () {
                            it('should return view for US market region', inject(function (DominantView) {
                                var views = [createView('view1', '2013-06-01', 'http://data.emii.com/locations/europe', 'http://data.emii.com/locations/svk'),
                                    createView('view2', '2013-06-01', 'http://data.emii.com/locations/usa', 'http://data.emii.com/locations/denv')];
                                var result = DominantView.getDominantRelativeView(views);
                                expect(result['@id']).toBe('view2');
                            }));
                            it('should return view for US market location', inject(function (DominantView) {
                                var views = [createView('view1', '2013-06-01', 'http://data.emii.com/locations/svk', 'http://data.emii.com/locations/europe'),
                                    createView('view2', '2013-06-01', 'http://data.emii.com/locations/dev', 'http://data.emii.com/locations/usa')];
                                var result = DominantView.getDominantRelativeView(views);
                                expect(result['@id']).toBe('view2');
                            }));
                        });
                        describe('When passing two relative views, one for Europe and one for other', function () {
                            it('should return view for Europe region', inject(function (DominantView) {
                                var views = [createView('view1', '2013-06-01', 'http://data.emii.com/locations/aus', 'http://data.emii.com/locations/perth'),
                                    createView('view2', '2013-06-01', 'http://data.emii.com/locations/europe', 'http://data.emii.com/locations/svk')];
                                var result = DominantView.getDominantRelativeView(views);
                                expect(result['@id']).toBe('view2');
                            }));
                            it('should return view for Europe location', inject(function (DominantView) {
                                var views = [createView('view1', '2013-06-01', 'http://data.emii.com/locations/aus', 'http://data.emii.com/locations/perth'),
                                    createView('view2', '2013-06-01', 'http://data.emii.com/locations/devd', 'http://data.emii.com/locations/europe')];
                                var result = DominantView.getDominantRelativeView(views);
                                expect(result['@id']).toBe('view2');
                            }));
                        });
                        describe('When passing three relative views, two for Europe and one for other', function () {

                            it('should return the latest updated view for Europe', inject(function (DominantView) {
                                var views = [createView('view1', '2013-06-01', 'http://data.emii.com/locations/aus', 'http://data.emii.com/locations/perth'),
                                    createView('view2', '2013-07-01', 'http://data.emii.com/locations/devd', 'http://data.emii.com/locations/europe'),
                                    createView('view3', '2013-05-01', 'http://data.emii.com/locations/devd', 'http://data.emii.com/locations/europe')];
                                var result = DominantView.getDominantRelativeView(views);
                                expect(result['@id']).toBe('view2');
                            }));
                        });
                        describe('When passing three relative views for other region', function () {
                            it('should return the latest updated view', inject(function (DominantView) {
                                var views = [createView('view1', '2013-06-01', 'http://data.emii.com/locations/aus', 'http://data.emii.com/locations/perth'),
                                    createView('view2', '2013-07-01', 'http://data.emii.com/locations/aus', 'http://data.emii.com/locations/perth'),
                                    createView('view3', '2013-05-01', 'http://data.emii.com/locations/aus', 'http://data.emii.com/locations/perth')];
                                var result = DominantView.getDominantRelativeView(views);
                                expect(result['@id']).toBe('view2');
                            }));
                        });
                    });
                    
                    describe('getDominantViewForService tests:', function () {

                        function createView(id, p1, p2) {
                            var view = { "@id": id };
                            view[p1] = {};
                            if (p2) {
                                view[p2] = {};
                            }
                            return view;
                        }

                        describe('When passing absolute and relative view', function () {
                            it('should return absolute view', inject(function (DominantView) {
                                var views = [
                                    createView('view1', 'viewWeighting', 'viewRelativeTo'),
                                    createView('view2', 'economicPosition'),
                                    createView('view3', 'trendPosition', 'viewBenchmark')
                                ];
                                var result = DominantView.getDominantViewForService(views);
                                expect(result['@id']).toBe('view2');
                            }));
                        });
                        describe('When passing two relative views', function () {
                            it('should return relative one view', inject(function (DominantView) {
                                var views = [createView('view1', 'viewRelativeTo'),
                                    createView('view2', 'viewRelativeTo'),
                                    createView('view3', 'viewBenchmark')];
                                var result = DominantView.getDominantViewForService(views);
                                expect(result['@id']).toBe('view1');
                            }));
                        });
                    });
                    
                    describe('filterFavourited tests:', function () {

                        describe('Filter 5 views from which 3 are favourited', function () {
                            var views = [{ '@id': 'view1', isFavourited: true },
                                { '@id': 'view2', isFavourited: true },
                                { '@id': 'view3', isFavourited: false },
                                { '@id': 'view4' },
                                { '@id': 'view5', isFavourited: true }
                            ];
                            
                            it('should return 3 views', inject(function (DominantView) {
                                var result = DominantView.filterFavourited(views);
                                expect(result.length).toBe(3);
                                expect(result[0]['@id']).toBe('view1');
                                expect(result[1]['@id']).toBe('view2');
                                expect(result[2]['@id']).toBe('view5');
                            }));
                        });
                        describe('When no views are defined', function () {
                            it('should return empty array', inject(function (DominantView) {
                                var views = null;
                                var result = DominantView.filterFavourited(views);
                                expect(result.length).toBe(0);
                            }));
                            it('should return empty array', inject(function (DominantView) {
                                var views;
                                var result = DominantView.filterFavourited(views);
                                expect(result.length).toBe(0);
                            }));
                        });
                        
                        describe('When no views are favourited in a list', function () {
                            var views;
                            beforeEach(function () {
                                views = [{ '@id': 'view1' }, { '@id': 'view2' }, { '@id': 'view3' }, { '@id': 'view4' }, { '@id': 'view5' }];
                            });
                            it('should return original array', inject(function (DominantView) {
                                var result = DominantView.filterFavourited(views);
                                expect(result.length).toBe(5);
                            }));
                        });
                    });
                });
            });
        });
            