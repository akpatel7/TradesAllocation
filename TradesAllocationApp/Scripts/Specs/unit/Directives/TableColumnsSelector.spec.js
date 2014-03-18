define(['jquery', 'angular', 'mocks', 'App/Directives/TableColumnsSelector'], function ($) {
    'use strict';

    describe('TableColumnsSelector directive', function () {
        var scope,
            element,
            expectRowValues;

        beforeEach(module('App.directives'));
        beforeEach(module('App.services'));
        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope.$new();

            scope.columns = {
                ServiceCode: {
                    key: 'ServiceCode',
                    label: 'Service',
                    isMoveable: false,
                    isHideable: false,
                    isDisabled: true,
                    isSelected: true,
                    ordinal: 0
                },
                Instrument: {
                    key: 'Instrument',
                    label: 'Instrument / Object',
                    isMoveable: false,
                    isHideable: false,
                    isDisabled: true,
                    isSelected: true,
                    ordinal: 1
                },
                CurrentAllocation: {
                    key: 'CurrentAllocation',
                    label: 'Current Allocation / Weighting',
                    isMoveable: true,
                    isHideable: true,
                    isDisabled: false,
                    isSelected: false,
                    ordinal: 2
                },
                PreviousAllocation: {
                    key: 'PreviousAllocation',
                    label: 'Previous Allocation / Weighting',
                    isMoveable: true,
                    isHideable: true,
                    isDisabled: false,
                    isSelected: false,
                    ordinal: 3
                }                
            };

            scope.onSelected = angular.noop;
            spyOn(scope, 'onSelected').andCallThrough();
            
            scope.onMoved = angular.noop;
            spyOn(scope, 'onMoved').andCallThrough();

            element = $compile('<ul table-columns-selector columns="columns" select-callback="onSelected(column)" move-callback="onMoved(args)"></ul>')(scope);
            scope.$root.$digest();
        }));

        describe('Given we have a list of columns for a displayed table', function() {
            it('Should display them in a menu', function() {
                expect(element.find('li').length).toBe(5);
                expect(element.find('li.disabled').length).toBe(2);
                expect($(element.find('li')[0]).hasClass('selected')).toBe(true);
                expect($(element.find('li')[0]).hasClass('disabled')).toBe(true);
                
                expect($(element.find('li')[2]).hasClass('selected')).toBe(false);
                expect($(element.find('li')[2]).hasClass('disabled')).toBe(false);                
            });

            describe('And we select a column', function() {
                it('Should fire the column selected callback', function() {
                    var isolateScope = element.isolateScope();
                    spyOn(isolateScope, 'selectCallback').andCallThrough();

                    isolateScope.onChange(isolateScope.sortedColumns[0]);
                    isolateScope.$apply();
                    
                    expect(isolateScope.selectCallback).toHaveBeenCalled();
                    expect(scope.onSelected).toHaveBeenCalled();
                });
            });

            describe('And we move a column', function() {
                it('Should fire the column moved callback', function() {
                    var isolateScope = element.isolateScope();
                    spyOn(isolateScope, 'moveCallback').andCallThrough();
                    
                    //simulate moving
                    isolateScope.sortableOptions.update({}, {
                        item: {
                            scope: function () {
                                return {
                                    item: isolateScope.sortedColumns[0]
                                };
                            }
                        }
                    });

                    isolateScope.sortedColumns = isolateScope.sortedColumns.reverse();
                    isolateScope.$apply();

                    expect(isolateScope.moveCallback).toHaveBeenCalled();
                    expect(scope.onMoved).toHaveBeenCalled();
                });
            });
        });        
    });
});


