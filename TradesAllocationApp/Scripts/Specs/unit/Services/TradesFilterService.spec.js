define(['underscore',
        'App/Services/TradesFilterService',
        'angular',
        'mocks'], function (_) {
            describe('TradesFilterService', function () {
               
                beforeEach(function () {
                    module('App.services');
                });

                describe('Build filters', function() {
                    describe('When we filter a fixed list', function () {
                        var filters;
                        beforeEach(inject(function () {
                            filters = {
                                'TradeLines/tradable_thing_class_editorial_label': {
                                    selected: ['Commodity'],
                                    options: [
                                        {
                                            "name": "Commodity",
                                            "label": "Commodity"
                                        },
                                        {
                                            "name": "Currency",
                                            "label": "Currency"
                                        },
                                        {
                                            "name": "Equity",
                                            "label": "Equity"
                                        },
                                        {
                                            "name": "Fixed Income",
                                            "label": "Fixed Income"
                                        }
                                    ]
                                }
                            };
                        }));

                        it('should return (TradeLines/any(_1TradeLines: _1TradeLines/tradable_thing_class_editorial_label eq \'Commodity\'))', inject(function (TradesFilter) {
                            var result = TradesFilter.buildFilter(filters);
                            expect(result).toEqual('(TradeLines/any(_1TradeLines: _1TradeLines/tradable_thing_class_editorial_label eq \'Commodity\'))');
                        }));
                    });


                    describe('When we filter a free text filter', function () {
                        var filters;
                        beforeEach(inject(function () {
                            filters = {
                                trade_editorial_label: {
                                    "isFreeText": true,
                                    "options": [],
                                    "selected": ['trade']
                                }
                            };
                        }));

                        it('should return ((indexof(trade_editorial_label, \'trade\') gt -1))', inject(function (TradesFilter) {
                            var result = TradesFilter.buildFilter(filters);
                            expect(result).toEqual('((indexof(trade_editorial_label, \'trade\') gt -1))');
                        }));
                    });

                    describe('When we filter a date', function () {
                        var filters;
                        beforeEach(inject(function () {
                            filters = {
                                instruction_entry_date: {
                                    "isDate": true,
                                    "date": '2014-02-12',
                                    "operator": "="
                                }
                            };
                        }));

                        it('should return ((indexof(trade_editorial_label, \'trade\') gt -1))', inject(function (TradesFilter) {
                            var result = TradesFilter.buildFilter(filters);
                            expect(result).toEqual('((instruction_entry_date ge datetime\'2014-02-12\') and (instruction_entry_date lt datetime\'2014-02-13\'))');
                        }));
                    });              
                });

                describe('Build order by', function() {
                    describe('When we order by ascending structure_type_label', function () {
                        it('should order by structure_type_label first', inject(function (TradesFilter) {
                            var result = TradesFilter.buildOrderBy({
                                orderby: 'structure_type_label',
                                direction: 'asc'
                            });
                            expect(result).toBe('structure_type_label asc,last_updated desc,trade_editorial_label');
                        }));
                    });

                    describe('When we order by ascending trade_editorial_label', function () {
                        it('should order by trade_editorial_label', inject(function (TradesFilter) {
                            var result = TradesFilter.buildOrderBy({
                                orderby: 'trade_editorial_label',
                                direction: 'asc'
                            });
                            expect(result).toBe('trade_editorial_label asc,last_updated desc');
                        }));
                    });
                });

                describe('Apply filter', function() {
                    describe('When we filter a fixed list', function () {
                        var filters;
                        beforeEach(inject(function () {
                            filters = {
                                'TradeLines/tradable_thing_class_editorial_label': {
                                    selected: ['Commodity'],
                                    options: [
                                        {
                                            "name": "Commodity",
                                            "label": "Commodity"
                                        },
                                        {
                                            "name": "Currency",
                                            "label": "Currency"
                                        },
                                        {
                                            "name": "Equity",
                                            "label": "Equity"
                                        },
                                        {
                                            "name": "Fixed Income",
                                            "label": "Fixed Income"
                                        }
                                    ]
                                }
                            };
                        }));
                        it('should mark the filter as selected', inject(function(TradesFilter) {
                            TradesFilter.applyFilter(filters, "(TradeLines/any(_1TradeLines: _1TradeLines/tradable_thing_class_editorial_label eq 'Currency'))");
                            expect(filters['TradeLines/tradable_thing_class_editorial_label'].selected).toEqual(['Currency']);
                        }));
                    });
                    
                    describe('When we filter a free text filter', function () {
                        var filters;
                        beforeEach(inject(function () {
                            filters = {
                                trade_editorial_label: {
                                    "isFreeText": true,
                                    "options": [],
                                    "selected": null
                                }
                            };
                        }));

                        it('should mark the filter as selected', inject(function(TradesFilter) {
                            TradesFilter.applyFilter(filters, "$filter=((indexof(trade_editorial_label, 'trade') gt -1))");
                            expect(filters['trade_editorial_label'].selected).toEqual(['trade']);
                        }));
                    });
                    
                    describe('When we filter a date', function () {
                        var filters;
                        beforeEach(inject(function () {
                            filters = {
                                instruction_entry_date: {
                                    "isDate": true,
                                    "date": '2014-02-12',
                                    "operator": "="
                                }
                            };
                        }));

                        it('should return ((indexof(trade_editorial_label, \'trade\') gt -1))', inject(function (TradesFilter) {
                            TradesFilter.applyFilter(filters, "((instruction_entry_date ge datetime'2014-02-12') and (instruction_entry_date lt datetime'2014-02-13'))");
                            expect(filters['instruction_entry_date'].date).toEqual('Feb 12, 2014');
                            expect(filters['instruction_entry_date'].operator).toEqual('=');
                        }));
                    });

                });

                describe('Build trade id filter', function() {
                    describe('When filtering by multiple trades', function() {
                        it('should build the right filter', inject(function(TradesFilter) {
                            var trades = [{ id: 'trade1' }, { id: 'trade2' }];
                            var result = TradesFilter.buildTradeIdFilter(trades);
                            expect(result).toBe('trade_id eq trade1 or trade_id eq trade2');
                        }));
                    });
                });
            });
        });
