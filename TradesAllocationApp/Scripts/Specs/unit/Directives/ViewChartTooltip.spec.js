define(['App/Directives/ViewChartTooltip',
        'angular',
        'mocks'], function () {
            'use strict';

            describe('ViewChartTooltip Directive', function () {
                var scope,
                    element;

                beforeEach(module('App'));

                describe('Given we render a view', function () {
                    beforeEach(inject(function ($compile, $rootScope) {
                        scope = $rootScope.$new();
                        scope.view = {
                            horizonStartDate: '2013-06-01',
                            viewHorizon: 'P6M',
                            viewConviction: {
                                canonicalLabel: 'medium'
                            },
                            viewDirection: {
                                canonicalLabel: 'long',
                                '@id': 'http://data/long'
                            }
                        };
                        element = $compile('<div view-chart-tooltip view="view"></div>')(scope);
                        scope.$root.$digest();
                    }));

                    it('should display June 1st 2013 for the horizon start date', function() {
                        expect(element.find('.horizon-start-date').text()).toBe('01 Jun 2013');
                    });
                    
                    it('should display 6 months for the horizon', function () {
                        expect(element.find('.horizon').text()).toBe('6 months');
                    });
                    
                    it('should display medium conviction', function () {
                        expect(element.find('.view-conviction').find('.view-conviction-icon').hasClass('view-conviction-icon-1')).toBe(true);
                    });
                    
                    it('should display long position', function () {
                        expect(element.find('.view-position-icon').hasClass('view-position-icon-2')).toBe(true);
                    });
                });

            });
        });