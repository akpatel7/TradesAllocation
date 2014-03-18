define(['jquery', 'underscore', 'angular', 'mocks', 'App/Directives/SingleSelect'], function ($) {
    'use strict';

    describe('SingleSelect directive', function () {
        var scope,
            element;

        beforeEach(module('App.filters'));
        beforeEach(module('App.directives'));

        describe('Given a filter with 2 values', function () {
            beforeEach(inject(function($rootScope, $compile) {
                scope = $rootScope.$new();
                scope.filter = {
                    key: 'RecommendationType',
                    value: undefined,
                    values:
                    {
                        'http://data.emii.com/view-recommendation-types/tactical': 'Tactical',
                        'http://data.emii.com/view-recommendation-types/strategic': 'Strategic'
                    }
                };

                element = $compile('<div single-select value="filter"></div>')(scope);
                scope.$root.$digest();
            }));

            it('should have 2 filters', function() {
                expect(element.isolateScope().items.length).toBe(2);
                expect(element.isolateScope().items[0].key).toBe('http://data.emii.com/view-recommendation-types/tactical');
                expect(element.isolateScope().items[0].label).toBe('Tactical');
                expect(element.isolateScope().items[0].isSelected).toBe(false);
                expect(element.isolateScope().items[1].key).toBe('http://data.emii.com/view-recommendation-types/strategic');
                expect(element.isolateScope().items[1].label).toBe('Strategic');
                expect(element.isolateScope().items[1].isSelected).toBe(false);

            });

            it('should render 2 items', function() {
                expect(element.find('ul').length).toBe(1);
                expect(element.find('li').length).toBe(2);
            });

            it('each item should have the filter label as content', function () {               
                expect($(element.find('li')[0]).text().trim()).toBe('Tactical');
                expect($(element.find('li')[1]).text().trim()).toBe('Strategic');
            });

            describe('when an item is selected', function () {
                beforeEach(function () {
                    scope.filter.value = 'http://data.emii.com/view-recommendation-types/strategic';
                    scope.$root.$digest();
                });
                afterEach(function () {
                    scope.filter.value = undefined;
                });
                it('should have the class "selected"', function () {
                    expect($(element.find('li')[0]).hasClass('selected')).toBe(false);
                    expect($(element.find('li')[1]).hasClass('selected')).toBe(true);
                });
                
                it('should have the icon remove', function () {
                    expect($(element.find('i')[0]).hasClass('icon-remove')).toBe(false);
                    expect($(element.find('i')[1]).hasClass('icon-remove')).toBe(true);
                });

                describe('When clicking on the item', function() {
                    beforeEach(function () {
                        $(element.find('a')[1]).trigger('click');
                    });
                    
                    it('should not be selected', function () {
                        expect(scope.filter.value).toBeUndefined();
                    });
                    
                    it('should not have the class "selected" anymore', function () {
                        expect($(element.find('li')[1]).hasClass('selected')).toBe(false);
                    });
                });
            });
            
            describe('when selecting an item', function () {
                beforeEach(function () {
                    expect(scope.filter.value).toBeUndefined();
                    $(element.find('a')[1]).trigger('click');
                });
                it('should have the class "selected"', function() {
                    expect($(element.find('li')[1]).hasClass('selected')).toBe(true);
                });

                it('should be selected', function() {
                    expect(scope.filter.value).toEqual('http://data.emii.com/view-recommendation-types/strategic');
                });
            });

        });

        describe('Given a filter with object values', function () {
            describe('When rendering the values', function() {
                beforeEach(inject(function($rootScope, $compile) {
                    scope = $rootScope.$new();
                    scope.filter = {
                        key: 'LastApplied',
                        value: undefined,
                        values:
                        {
                            LastWeek: {
                                label: 'Last week',
                                count: 0
                            },
                            LastMonth: {
                                label: 'Last month',
                                count: 0
                            },
                            LastQuarter: {
                                label: 'Last quarter',
                                count: 0
                            },
                            LastYear: {
                                label: 'Last year',
                                count: 0
                            }
                        }
                    };
                    element = $compile('<div single-select value="filter"></div>')(scope);
                    scope.$root.$digest();
                }));

                it('should render 4 items', function() {
                    expect(element.find('li').length).toBe(4);
                });

                it('each item should have the filter label as content', function() {
                    expect($(element.find('li')[0]).text().trim()).toBe('Last week');
                    expect($(element.find('li')[1]).text().trim()).toBe('Last month');
                    expect($(element.find('li')[2]).text().trim()).toBe('Last quarter');
                    expect($(element.find('li')[3]).text().trim()).toBe('Last year');
                });
            });

            describe('When showing facet counts', function () {
                beforeEach(inject(function ($rootScope, $compile) {
                    scope = $rootScope.$new();
                    scope.filter = {
                        key: 'LastApplied',
                        value: undefined,
                        values:
                        {
                            LastWeek: {
                                label: 'Last week',
                                count: 10
                            },
                            LastMonth: {
                                label: 'Last month',
                                count: 0
                            },
                            LastQuarter: {
                                label: 'Last quarter',
                                count: 5
                            },
                            LastYear: {
                                label: 'Last year',
                                count: 2
                            }
                        }
                    };
                    element = $compile('<div single-select value="filter" show-facet-count="true"></div>')(scope);
                    scope.$root.$digest();
                }));

                it('should render 4 items', function () {
                    expect(element.find('li').length).toBe(4);
                });

                it('each item should have the filter label as content', function () {
                    expect($(element.find('li')[0]).text().trim()).toBe('Last week (10)');
                    expect($(element.find('li')[1]).text().trim()).toBe('Last month (0)');
                    expect($(element.find('li')[2]).text().trim()).toBe('Last quarter (5)');
                    expect($(element.find('li')[3]).text().trim()).toBe('Last year (2)');
                });
            });

        });
        
        describe('Given a filter with multiple values', function () {
            describe('When rendering the values', function () {
                beforeEach(inject(function ($rootScope, $compile) {
                    scope = $rootScope.$new();

                    scope.filter = { key: 'key', value: undefined, values: {} };
                    for (var i = 0; i < 15; i++) {
                        scope.filter.values[i.toString()] = { label: i.toString(), count: 0 };
                    }

                    element = $compile('<div single-select value="filter"></div>')(scope);
                    scope.$root.$digest();
                }));

                it('should render 15 items', function () {
                    expect(element.find('ul').length).toBe(2);
                    expect(element.find('li').length).toBe(15);

                    var expected = '';
                    for (var i = 0; i < 15; i++) {
                        expected = expected + i.toString() + '  ';
                    }
                    expect(element.find('li a').text()).toBe(expected);
                });
                it('first ul render 10 items', function () {
                    expect(element.find('ul:nth-child(1) li').length).toBe(10);
                });
                it('second ul render 5 items', function () {
                    expect(element.find('ul:nth-child(2) li').length).toBe(5);
                });
            });
        });
        
        describe('Given a filter without values', function () {
            describe('When rendering the values', function () {
                beforeEach(inject(function ($rootScope, $compile) {
                    scope = $rootScope.$new();
                    element = $compile('<div single-select value="filter"></div>')(scope);
                    scope.$root.$digest();
                }));

                it('should render 0 items', function () {
                    expect(element.find('ul').length).toBe(1);
                });
            });
        });
    });
});


