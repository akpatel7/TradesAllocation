define(['underscore',
        'App/Services/TradesUrlBuilder',
        'angular',
        'mocks'], function (_) {
            describe('TradesUrlBuilder', function () {
               
                beforeEach(function () {
                    module('App.services');
                });

                describe('When building dashboard query', function() {
                    describe('for favourites', function() {
                        it('should add the showFavouritesOnly flag', inject(function (TradesUrlBuilder) {
                            var options = {
                                showFollowsOnly: false,
                                showFavouritesOnly: true
                            };
                            var result = TradesUrlBuilder.buildDashboardQuery(options);
                            expect(result).toEqual({
                                showFollowsOnly: false,
                                showFavouritesOnly: true,
                                $orderby: 'last_updated desc'
                            });
                        }));
                    });
                    
                    describe('for follows', function () {
                        it('should add the showFollowsOnly flag', inject(function (TradesUrlBuilder) {
                            var options = {
                                showFollowsOnly: true,
                                showFavouritesOnly: false
                            };
                            var result = TradesUrlBuilder.buildDashboardQuery(options);
                            expect(result).toEqual({
                                showFollowsOnly: true,
                                showFavouritesOnly: false,
                                $orderby: 'last_updated desc'
                            });
                        }));
                    });
                    
                    describe('and ordering by structure_type_label', function () {
                        it('should combine order by and direction', inject(function (TradesUrlBuilder) {
                            var options = {
                                showFollowsOnly: true,
                                showFavouritesOnly: false,
                                orderby: 'structure_type_label',
                                direction: 'asc'
                            };
                            var result = TradesUrlBuilder.buildDashboardQuery(options);
                            expect(result).toEqual({
                                showFollowsOnly: true,
                                showFavouritesOnly: false,
                                $orderby: 'structure_type_label asc'
                            });
                        }));
                    });
                });

                describe('When build trades export URL', function() {
                    it('Should return the correct URL', inject(function(UrlProvider, TradesColumns, TradesUrlBuilder) {
                        spyOn(TradesColumns, 'getColumns').andReturn([
                            {
                                isSelected: true,
                                isExportable: true,
                                key: 'SomeColumn'
                            },
                            {
                                isSelected: true,
                                isExportable: true,
                                key: 'TradeLines/SomeColumn2'
                            },
                            {
                                isSelected: false,
                                isExportable: true,
                                key: 'SomethingElse'
                            },
                            {
                                isSelected: true,
                                isExportable: false,
                                key: 'SomethingElse2'
                            }
                        ]);

                        spyOn(UrlProvider, 'getTradesExportUrl').andReturn('http://someapi/trades/export?$filter=somefilter');

                        var options = {
                            '$filter': 'somefilter'
                        }, baseUrl = 'http://someapi/trades';

                        var result = TradesUrlBuilder.buildExportUrl(baseUrl, options);

                        expect(result).toBe('http://someapi/trades/export?$filter=somefilter');
                        expect(TradesColumns.getColumns).toHaveBeenCalled();
                        expect(UrlProvider.getTradesExportUrl).toHaveBeenCalledWith(baseUrl, options, ['SomeColumn', 'SomeColumn2']);
                    }));
                });
            });
        });
