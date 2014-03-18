define(['jquery', 'angular', 'mocks', 'App/Directives/MultiSelect'], function ($) {
    'use strict';

    describe('MultiSelect directive', function () {
        var scope,
            element;

        beforeEach(module('App.filters'));
        beforeEach(module('App.directives'));

        describe('When rendering 4 filters', function() {
            var filters = [
                {
                    key: 'BCAH',
                    label: 'HOUSE',
                    uri: 'http://data.emii.com/bca/services/bcah',
                    isSelected: false
                },
                {
                    key: 'BCA',
                    label: 'The Bank Credit Analyst',
                    uri: 'http://data.emii.com/bca/services/bca',
                    isSelected: false
                },
                {
                    key: 'CIS',
                    label: 'China Investment Strategy',
                    uri: 'http://data.emii.com/bca/services/cis',
                    isSelected: false
                },
                {
                    key: 'CES',
                    label: 'Commodity & Energy Strategy',
                    uri: 'http://data.emii.com/bca/services/ces',
                    isSelected: false
                }];
            beforeEach(inject(function($rootScope, $compile) {
                scope = $rootScope.$new();
                scope.filters = filters;
                element = $compile('<div multi-select values="filters"></div>')(scope);
                scope.$root.$digest();
            }));

            it('should render 4 items', function() {
                expect(element.find('ul').length).toBe(1);
                expect(element.find('li').length).toBe(4);
            });

            it('each item should have the filter label as content', function() {
                expect($(element.find('li')[0]).text().trim()).toBe('HOUSE');
                expect($(element.find('li')[1]).text().trim()).toBe('The Bank Credit Analyst');
                expect($(element.find('li')[2]).text().trim()).toBe('China Investment Strategy');
                expect($(element.find('li')[3]).text().trim()).toBe('Commodity & Energy Strategy');
            });

            describe('when an item is selected', function() {
                beforeEach(function() {
                    scope.filters[1].isSelected = true;
                    scope.$root.$digest();
                });
                afterEach(function() {
                    scope.filters[1].isSelected = false;
                });
                it('should have the class "selected"', function() {
                    expect($(element.find('li')[0]).hasClass('selected')).toBe(false);
                    expect($(element.find('li')[1]).hasClass('selected')).toBe(true);
                    expect($(element.find('li')[2]).hasClass('selected')).toBe(false);
                    expect($(element.find('li')[3]).hasClass('selected')).toBe(false);
                });

                describe('When clicking on the item', function() {
                    beforeEach(function() {
                        expect(scope.filters[1].isSelected).toBe(true);
                        $(element.find('a')[1]).trigger('click');
                    });
                    afterEach(function() {
                        scope.filters[1].isSelected = true;
                    });
                    it('should not be selected', function() {
                        expect(scope.filters[1].isSelected).toBe(false);
                    });

                    it('should not have the class "selected" anymore', function() {
                        expect($(element.find('li')[1]).hasClass('selected')).toBe(false);
                    });
                });
            });

            describe('when selecting an item', function() {
                beforeEach(function() {
                    expect(scope.filters[1].isSelected).toBe(false);
                    $(element.find('a')[1]).trigger('click');
                });
                afterEach(function() {
                    scope.filters[1].isSelected = false;
                });
                it('should have the class "selected"', function() {
                    expect($(element.find('li')[1]).hasClass('selected')).toBe(true);
                });

                it('should be selected', function() {
                    expect(scope.filters[1].isSelected).toBe(true);
                });
            });


            describe('when an item is selected', function() {
                beforeEach(function() {
                    scope.filters[1].isSelected = true;
                    scope.$root.$digest();
                });
                afterEach(function() {
                    scope.filters[1].isSelected = false;
                });
                it('should have the class "selected"', function() {
                    expect($(element.find('li')[0]).hasClass('selected')).toBe(false);
                    expect($(element.find('li')[1]).hasClass('selected')).toBe(true);
                    expect($(element.find('li')[2]).hasClass('selected')).toBe(false);
                    expect($(element.find('li')[3]).hasClass('selected')).toBe(false);
                });

                it('should have the icon remove', function() {
                    expect($(element.find('i')[0]).hasClass('icon-remove')).toBe(false);
                    expect($(element.find('i')[1]).hasClass('icon-remove')).toBe(true);
                    expect($(element.find('i')[2]).hasClass('icon-remove')).toBe(false);
                    expect($(element.find('i')[3]).hasClass('icon-remove')).toBe(false);
                });

                describe('When clicking on the item', function() {
                    beforeEach(function() {
                        expect(scope.filters[1].isSelected).toBe(true);
                        $(element.find('a')[1]).trigger('click');
                    });

                    it('should not be selected', function() {
                        expect(scope.filters[1].isSelected).toBe(false);
                    });

                    it('should not have the class "selected" anymore', function() {
                        expect($(element.find('li')[1]).hasClass('selected')).toBe(false);
                    });
                });
            });
        });
        
        describe('When rendering facet counts', function () {
            var filters = [
                {
                    key: 'BCAH',
                    label: 'HOUSE',
                    uri: 'http://data.emii.com/bca/services/bcah',
                    isSelected: false,
                    count: 10
                },
                {
                    key: 'BCA',
                    label: 'The Bank Credit Analyst',
                    uri: 'http://data.emii.com/bca/services/bca',
                    isSelected: false,
                    count: 0
                },
                {
                    key: 'CIS',
                    label: 'China Investment Strategy',
                    uri: 'http://data.emii.com/bca/services/cis',
                    isSelected: false,
                    count: 5
                },
                {
                    key: 'CES',
                    label: 'Commodity & Energy Strategy',
                    uri: 'http://data.emii.com/bca/services/ces',
                    isSelected: false,
                    count: 2
                }];
            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope.$new();
                scope.filters = filters;
                element = $compile('<div multi-select values="filters" show-facet-count="true"></div>')(scope);
                scope.$root.$digest();
            }));

            it('should render the facet counts', function () {
                expect($(element.find('li')[0]).text().trim()).toBe('HOUSE (10)');
                expect($(element.find('li')[1]).text().trim()).toBe('The Bank Credit Analyst (0)');
                expect($(element.find('li')[2]).text().trim()).toBe('China Investment Strategy (5)');
                expect($(element.find('li')[3]).text().trim()).toBe('Commodity & Energy Strategy (2)');
            });

          
        });
        
        describe('Given a filter with multiple values', function () {
            describe('When rendering the values', function () {
                beforeEach(inject(function ($rootScope, $compile) {
                    scope = $rootScope.$new();

                    scope.filters = [];
                    for (var i = 0; i < 15; i++) {
                        scope.filters[i] = {
                            key: i.toString(),
                            label: i.toString(),
                            uri: 'http://data.emii.com/' + i.toString(),
                            isSelected: false
                        };
                    }

                    element = $compile('<div multi-select values="filters"></div>')(scope);
                    scope.$root.$digest();
                }));

                it('should render 15 items', function () {
                    expect(element.find('ul').length).toBe(1);
                    expect(element.find('li').length).toBe(15);
                    
                    var expected = '';
                    for (var i = 0; i < 15; i++) {
                        expected = expected + i.toString() + '  ';
                    }
                    expect(element.find('li a').text()).toBe(expected);
                });
                
            });
        });
        
        describe('Given a filter without values', function () {
            describe('When rendering the values', function () {
                beforeEach(inject(function ($rootScope, $compile) {
                    scope = $rootScope.$new();
                    element = $compile('<div multi-select values="filters"></div>')(scope);
                    scope.$root.$digest();
                }));

                it('should render 1 container', function () {
                    expect(element.find('ul').length).toBe(1);
                });
            });
        });
    });
});


