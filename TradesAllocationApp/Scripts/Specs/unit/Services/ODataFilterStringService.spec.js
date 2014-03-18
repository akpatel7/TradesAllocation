define(['underscore',
    'App/Helpers/Math',
    'App/Services/ODataFilterStringService',
    'angular',
    'mocks'
], function(_, mathHelper) {
    describe('ODataFilterStringService Service', function() {
        beforeEach(function() {
            module('App.services');
        });
        describe('When passed arrays of filterItems', function() {
            var item1, item2, item3, item4, group1, group2, builder, result;
            beforeEach(inject(function(ODataFilterString) {
                item1 = ODataFilterString.createEqualityFilterItem("myField", "abc");
                item2 = ODataFilterString.createEqualityFilterItem("myField", "cde");
                item3 = ODataFilterString.createEqualityFilterItem("myNumericField", 555);
                item4 = ODataFilterString.createContainsFilterItem("myField", "def");

                group1 = [item1, item2];
                group2 = [item3, item4];
                builder = ODataFilterString.createFilterStringBuilder()
                    .addFilterItemArray(group1)
                    .addFilterItemArray(group2);
            }));
            it('should create a filter string', inject(function(ODataFilterString) {
                result = builder.buildFilterString();
                expect(result).toEqual("(myField eq 'abc' or myField eq 'cde') and (myNumericField eq 555 or (indexof(myField, 'def') gt -1))");
            }));
            describe('where', function() {
                var item5, item6;
                beforeEach(inject(function(ODataFilterString) {
                    item5 = ODataFilterString.createContainsFilterItem("MyTextField", "five");
                    item6 = ODataFilterString.createContainsFilterItem("MyTextField", "six");
                }));
                describe('all the arrays use the OR operator', function() {
                    beforeEach(inject(function(ODataFilterString) {
                        builder.addFilterItemArray([item5, item6], false);
                        result = builder.buildFilterString();
                    }));
                    it('should create a filter string', inject(function(ODataFilterString) {
                        expect(result).toEqual("(myField eq 'abc' or myField eq 'cde') and (myNumericField eq 555 or (indexof(myField, 'def') gt -1)) and ((indexof(MyTextField, 'five') gt -1) or (indexof(MyTextField, 'six') gt -1))");
                    }));
                });
                describe('one of the arrays uses the AND operator instead of OR', function() {
                    beforeEach(inject(function(ODataFilterString) {
                        builder.addFilterItemArray([item5, item6], true);
                        result = builder.buildFilterString();
                    }));
                    it('should create a filter string', inject(function(ODataFilterString) {
                        expect(result).toEqual("(myField eq 'abc' or myField eq 'cde') and (myNumericField eq 555 or (indexof(myField, 'def') gt -1)) and ((indexof(MyTextField, 'five') gt -1) and (indexof(MyTextField, 'six') gt -1))");
                    }));
                });
            });
            describe('where one array has a date filter', function() {
                var item5;
                describe('with an equalTo operator', function() {
                    beforeEach(inject(function(ODataFilterString) {
                        item5 = ODataFilterString.createDateFilterItem("MydateField", new Date("Dec 31, 1975"), mathHelper.equalityOperators.equalTo);
                        builder.addFilterItemArray([item5]);
                        result = builder.buildFilterString();
                    }));
                    it('should create a filter string', inject(function(ODataFilterString) {
                        expect(result).toEqual("(myField eq 'abc' or myField eq 'cde') and (myNumericField eq 555 or (indexof(myField, 'def') gt -1)) and ((MydateField ge datetime'1975-12-31') and (MydateField lt datetime'1976-01-01'))");
                    }));
                });
                describe('with a lessThanOrEqualTo operator', function() {
                    beforeEach(inject(function(ODataFilterString) {
                        item5 = ODataFilterString.createDateFilterItem("MydateField", new Date("Dec 31, 1975"), mathHelper.equalityOperators.lessThanOrEqualTo);
                        builder.addFilterItemArray([item5]);
                        result = builder.buildFilterString();
                    }));
                    it('should create a filter string', inject(function(ODataFilterString) {
                        expect(result).toEqual("(myField eq 'abc' or myField eq 'cde') and (myNumericField eq 555 or (indexof(myField, 'def') gt -1)) and ((MydateField lt datetime'1976-01-01'))");
                    }));
                });
                describe('with a greaterThanOrEqualTo operator', function() {
                    beforeEach(inject(function(ODataFilterString) {
                        item5 = ODataFilterString.createDateFilterItem("MydateField", new Date("Dec 31, 1975"), mathHelper.equalityOperators.greaterThanOrEqualTo);
                        builder.addFilterItemArray([item5]);
                        result = builder.buildFilterString();
                    }));
                    it('should create a filter string', inject(function(ODataFilterString) {
                        expect(result).toEqual("(myField eq 'abc' or myField eq 'cde') and (myNumericField eq 555 or (indexof(myField, 'def') gt -1)) and ((MydateField ge datetime'1975-12-31'))");
                    }));
                });
                describe('with another operator', function() {
                    beforeEach(inject(function(ODataFilterString) {
                        item5 = ODataFilterString.createDateFilterItem("MydateField", new Date("Dec 31, 1975"), mathHelper.equalityOperators.greaterThan);
                        builder.addFilterItemArray([item5]);
                    }));
                    it('should create a filter string', inject(function(ODataFilterString) {
                        expect(builder.buildFilterString).toThrow(new Error("Operator argument must be equalTo, lessThanOrEqualTo or greaterThanOrEqualTo"));
                    }));
                });
            });
        });

        describe('when the property is on a child object', function() {

            var builder;

            beforeEach(inject(function(ODataFilterString) {
                var item1 = ODataFilterString.createEqualityFilterItem("MyChild/myField", "val one");
                var item2 = ODataFilterString.createEqualityFilterItem("MyChild/myField", "val two");
                var item3 = ODataFilterString.createEqualityFilterItem("MyChild/myOtherField", "val other one");

                builder = ODataFilterString.createFilterStringBuilder()
                    .addFilterItemArray([item1, item2])
                    .addFilterItemArray([item3]);
            }));

            it('should build any expressions with variable names unique to the scope of the whole expression', function() {

                var expected = "(MyChild/any(_1MyChild: _1MyChild/myField eq 'val one') or MyChild/any(_2MyChild: _2MyChild/myField eq 'val two'))" +
                    " and (MyChild/any(_3MyChild: _3MyChild/myOtherField eq 'val other one'))";
                expect(builder.buildFilterString()).toEqual(expected);
            });

            it('should build the same expression each time', function() {
                expect(builder.buildFilterString()).toEqual(builder.buildFilterString());
            });
            describe('and free text parameters are present', function() {
                beforeEach(inject(function(ODataFilterString) {
                    var item4 = ODataFilterString.createContainsFilterItem("MyChild/myOtherField", "val four");
                    builder.addFilterItemArray([item4], true);
                }));
                it('should still build any expressions with variable names unique to the scope of the whole expression', function() {
                    var expected = "(MyChild/any(_1MyChild: _1MyChild/myField eq 'val one') or MyChild/any(_2MyChild: _2MyChild/myField eq 'val two'))" +
                        " and (MyChild/any(_3MyChild: _3MyChild/myOtherField eq 'val other one'))" +
                        " and (MyChild/any(_4MyChild: indexof(_4MyChild/myOtherField, 'val four') gt -1))";
                    expect(builder.buildFilterString()).toEqual(expected);
                });
            });
        });

        describe('when passed a non array', function() {
            it('should throw an error', inject(function(ODataFilterString) {
                var builder = ODataFilterString.createFilterStringBuilder();
                expect(function() {
                    builder.addFilterItemArray({});
                }).toThrow("argument must be an array");
            }));
        });

        describe('when passed a array containing an object with no getQueryStringFragment method', function() {
            it('should throw an error', inject(function(ODataFilterString) {
                var builder = ODataFilterString.createFilterStringBuilder();
                expect(function() {
                    builder.addFilterItemArray([{}]);
                }).toThrow("argument must have a function called 'getQueryStringFragment'");
            }));
        });

        describe('when parsing a filter string for free text parameters', function() {

            var params, filterString;

            describe('when the filter has several parameters for the same free-text field', function() {

                describe('and that field is a top level property of a trade', function() {
                    beforeEach(inject(function(ODataFilterString) {
                        filterString = "$filter=(length_type_label eq 'Tactical') and (indexof(instruction_label, '27') gt -1) and (indexof(instruction_label, '26') gt -1)";
                        params = ODataFilterString.getContainsParametersFromFilterString(filterString, 'instruction_label');
                    }));
                    it('should find parameters', function() {
                        expect(params).toEqual(["27", "26"]);
                    });
                });
                describe('and that field is a sub property of a trade', function() {
                    beforeEach(inject(function(ODataFilterString) {
                        filterString = "$filter=(TradeLines/any(_1TradeLines: indexof(_1TradeLines/tradable_thing_label, 'Copper') gt -1) or" +
                            " TradeLines/any(_2TradeLines: indexof(_2TradeLines/tradable_thing_label, 'Gold') gt -1))";
                        params = ODataFilterString.getContainsParametersFromFilterString(filterString, 'tradable_thing_label');
                    }));
                    it('should find parameters', function() {
                        expect(params).toEqual(["Copper", "Gold"]);
                    });
                });
            });

            describe('when the filter has parameters for different free-text fields', function() {
                beforeEach(inject(function(ODataFilterString) {
                    filterString = "$filter=(length_type_label eq 'Tactical') and (indexof(instruction_label, '27') gt -1) and (indexof(trade_editorial_label, '01') gt -1)";
                    params = ODataFilterString.getContainsParametersFromFilterString(filterString, 'instruction_label');
                }));

                it('should find parameters for the required field', function() {
                    expect(params).toEqual(["27"]);
                });
            });

            describe('when a filter parameter contains a single quote', function() {
                beforeEach(inject(function(ODataFilterString) {
                    filterString = "$filter=(length_type_label eq 'Tactical') and (indexof(instruction_label, ''27') gt -1) and (indexof(instruction_label, '26') gt -1)";
                    params = ODataFilterString.getContainsParametersFromFilterString(filterString, 'instruction_label');
                }));

                it('should find contains parameters with single quotes escaped', function() {
                    expect(params).toEqual(["''27", "26"]);
                });
            });

        });

        describe('when parsing a filter string for date parameters', function() {
            var param, filterString;

            describe('where a parameter has an equalTo operator', function() {
                beforeEach(inject(function(ODataFilterString) {
                    filterString = "$filter=(length_type_label eq 'Tactical') and (indexof(instruction_label, '27') gt -1) and ((instruction_entry_date ge datetime'1975-12-31') and (instruction_entry_date lt datetime'1976-01-01'))";
                    param = ODataFilterString.getDateParameterFromFilterString(filterString, 'instruction_entry_date');
                }));
                it('should find a parameter', function() {
                    expect(param.date).toEqual("Dec 31, 1975");
                    expect(param.operator).toEqual(mathHelper.equalityOperators.equalTo);
                });
            });
            describe('where a parameter has an lessThanOrEqualTo operator', function() {
                beforeEach(inject(function(ODataFilterString) {
                    filterString = "$filter=(length_type_label eq 'Tactical') and (indexof(instruction_label, '27') gt -1) and ((instruction_entry_date lt datetime'1976-01-01'))";
                    param = ODataFilterString.getDateParameterFromFilterString(filterString, 'instruction_entry_date');
                }));
                it('should find a parameter', function() {
                    expect(param.date).toEqual("Dec 31, 1975");
                    expect(param.operator).toEqual(mathHelper.equalityOperators.lessThanOrEqualTo);
                });
            });
            describe('where a parameter has an greaterThanOrEqualTo operator', function() {
                beforeEach(inject(function(ODataFilterString) {
                    filterString = "$filter=(length_type_label eq 'Tactical') and (indexof(instruction_label, '27') gt -1) and ((instruction_entry_date ge datetime'1975-12-31'))";
                    param = ODataFilterString.getDateParameterFromFilterString(filterString, 'instruction_entry_date');
                }));
                it('should find a parameter', function() {
                    expect(param.date).toEqual("Dec 31, 1975");
                    expect(param.operator).toEqual(mathHelper.equalityOperators.greaterThanOrEqualTo);
                });
            });
            describe('where a parameter has another operator', function() {
                beforeEach(inject(function(ODataFilterString) {
                    filterString = "$filter=(length_type_label eq 'Tactical') and (indexof(instruction_label, '27') gt -1) and ((instruction_entry_date gt datetime'1975-12-31'))";
                    param = ODataFilterString.getDateParameterFromFilterString(filterString, 'instruction_entry_date');
                }));
                it('should return null', function() {
                    expect(param).toBe(null);
                });
            });
        });

    });
});