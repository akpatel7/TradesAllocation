define(['App/Directives/ReportChartTooltip',
        'angular',
        'mocks'], function () {
            'use strict';

            describe('ReportChartTooltip Directive', function () {
                var scope,
                    element;

                beforeEach(module('App'));

                describe('Given we render an annotation', function () {
                    beforeEach(inject(function ($compile, $rootScope) {
                        scope = $rootScope.$new();
                        scope.annotation = {
                            annotationText: 'here is some annotation text',
                            annotationFor: {
                               title: 'Document to support annotation',
                               publishedIn: {
                                   canonicalLabel: 'European Investment Strategy'
                               },
                               published: '2013-04-05'
                           }
                        };
                        element = $compile('<div report-chart-tooltip annotation="annotation"></div>')(scope);
                        scope.$root.$digest();
                    }));
                    
                    it('should display "Document to support annotation" for the title', function () {
                        expect(element.find('.title').text()).toBe('Document to support annotation');
                    });

                    it('should display April 5th 2013 for the published date', function() {
                        expect(element.find('.published-date').text()).toBe('05 Apr 2013');
                    });
                    
                    it('should display "here is some annotation text" for the snippet', function () {
                        expect(element.find('.snippet').text()).toBe('here is some annotation text');
                    });
                });

            });
        });