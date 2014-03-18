define(['angular', 'mocks', 'App/Directives/ViewPosition', 'underscore'], function (angular, mocks, viewPosition, _) {
    'use strict';

    describe('View Posision directive', function() {
        var scope,
            graphicElement;

        var positionValues = {
            economicPosition: {
                name: "economicPosition",
                values: ['Weaker', 'Flat', 'Stronger']
            },
            viewDirection: {
                name: "viewDirection",
                values: ['Short', 'Neutral', 'Long']
            },
            viewWeighting: {
                name: "viewWeighting",
                values: ['Underweight', 'Neutral', 'Overweight']
            },
            trendPosition: {
                name: "viewWeighting",
                values: ['fall', 'flat', 'rise']
            },
            monetaryPolicyPosition: {
                name: "viewWeighting",
                values: ['contract', 'no-change', 'expand']
            },
            fiscalPolicyPosition: {
                name: "viewWeighting",
                values: ['tighten', 'no-change', 'ease']
            }
        };

        var positionBoxNames = ['.minus', '.neutral', '.plus'];

        function createView(propertyName, value) {
            var returnValue = {};
            returnValue[propertyName] = { 'canonicalLabel': value, '@id': 'http://data/' + value };
            return returnValue;
        }

        beforeEach(module('App.services'));
        beforeEach(module('App.directives'));
        
        beforeEach(inject(function($rootScope, $compile) {
            scope = $rootScope;            
            graphicElement = $compile('<div class="test-class" view-position view="view" previous-view="previousView"></div>')(scope);
        }));
        
        describe('class is combined in compiled directive with replace', function () {
            it('should display an empty string', function () {
                scope.$root.$digest();
                expect(graphicElement.hasClass('test-class')).toBe(true);
                expect(graphicElement.hasClass('view-position')).toBe(true);
            });
        });
        
        describe('Position is undefined', function () {
            it('should display an empty string', function () {
                scope.$root.$digest();
                expect(graphicElement.find('.view-position-icon').hasClass('view-position-icon-')).toBe(true);
            });
        });

        describe('Economy strong position is defined', function () {
            it('should display "Stronger"', function () {
                scope.view = createView(positionValues.economicPosition.name, positionValues.economicPosition.values[2]);
                scope.$root.$digest();
                expect(graphicElement.attr('data-canonical-label')).toEqual('STRONGER');
                expect(graphicElement.find('.view-position-icon').hasClass('view-position-icon-2')).toBe(true);
            });
        });
        
        describe('Absolute Neutral position is defined', function () {
            it('should display "Neutral"', function () {
                scope.view = createView(positionValues.viewDirection.name, positionValues.viewDirection.values[1]);
                scope.$root.$digest();
                expect(graphicElement.attr('data-canonical-label')).toEqual('NEUTRAL');
                expect(graphicElement.find('.view-position-icon').hasClass('view-position-icon-1')).toBe(true);
            });
        });

        describe('Relative Underweight position is defined', function () {
            it('should display "Underweight"', function () {
                scope.view = createView(positionValues.viewWeighting.name, positionValues.viewWeighting.values[0]);
                scope.$root.$digest();
                expect(graphicElement.attr('data-canonical-label')).toEqual('UNDERWEIGHT');
                expect(graphicElement.find('.view-position-icon').hasClass('view-position-icon-0')).toBe(true);
            });
        });

        _.each(positionValues, function (viewPositionValue) {
            _.each(viewPositionValue.values, function (positionValue, positionValueIndex) {
                describe(viewPositionValue.name + ' position is defined as ' + positionValue, function () {
                    it('should select the ' + positionBoxNames[positionValueIndex], function () {
                        scope.view = createView(viewPositionValue.name, positionValue);
                        scope.$root.$digest();
                        expect(graphicElement.attr('data-canonical-label')).toEqual(positionValue.toUpperCase());
                        expect(graphicElement.find('.view-position-icon').hasClass('view-position-icon-' + positionValueIndex)).toBe(true);
                    });
                });
            });
        });

        describe('View position increases from previous view', function () {
            it('should display a correctly positioned and sized right arrow', function () {
                scope.view = createView(positionValues.viewWeighting.name, positionValues.viewWeighting.values[2]);
                scope.previousView = createView(positionValues.viewWeighting.name, positionValues.viewWeighting.values[1]);
                scope.$root.$digest();
                expect(graphicElement.find('.position-change').hasClass('view-position-change-icon-1-2')).toBe(true);
            });
        });

        describe('View position decreases from previous view', function () {
            it('should display a correctly positioned and sized left arrow', function () {
                scope.view = createView(positionValues.viewWeighting.name, positionValues.viewWeighting.values[0]);
                scope.previousView = createView(positionValues.viewWeighting.name, positionValues.viewWeighting.values[2]);
                scope.$root.$digest();
                expect(graphicElement.find('.position-change').hasClass('view-position-change-icon-2-0')).toBe(true);
            });
        });

        describe('View position is unchanged from previous view', function () {
            it('should display a correctly positioned dot', function () {
                scope.view = createView(positionValues.viewWeighting.name, positionValues.viewWeighting.values[2]);
                scope.previousView = createView(positionValues.viewWeighting.name, positionValues.viewWeighting.values[2]);
                scope.$root.$digest();
                expect(graphicElement.find('.position-change').hasClass('view-position-change-icon-2-2')).toBe(true);
            });
        });

        describe('There was not a previous view position', function () {
            it('should not display an arrow nor a dot', function () {
                scope.viewConviction = { canonicalLabel: 'High' };
                scope.$root.$digest();
                expect(graphicElement.find('.position-change').length).toBe(0);
            });
        });


    });
});


