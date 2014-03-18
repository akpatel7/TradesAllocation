define(['angular', 'mocks', 'App/Directives/Highchart'], function () {
    'use strict';

    describe('Highchart directive', function () {
        var scope,
            element,
            controller;


        beforeEach(module('App.directives'));
        
        beforeEach(inject(function ($rootScope, $compile) {

            scope = $rootScope.$new();
            
            scope.testConfig = {
                minDate: 0,
                maxDate: 0,
                chart : {
                }
            };
                        
            element = $compile('<div highchart config="testConfig"></div>')(scope);
            controller = element.controller('highchart');
            
        }));

        describe('when supplying proper config', function () {
            it('should display chart', function() {
                scope.testConfig = {
                    chart : {
                        test: 'hello'
                    },
                    minDate: 0,
                    maxDate: 0

                };
                
                //scope.$root.$digest();

                var renderToElement = $(".performanceChart", element);
                //expect(('.highcharts-container', element).length).toBe(1);
                
                //expect(scope.testConfig.chart.renderTo).toBe(renderToElement[0]);
                //expect(scope.testConfig.chart.events).toNotBe(null);
                //expect(scope.testConfig.chart.test).toBe('hello');
            });
        });
        
        
        describe('when changing range to 1M', function () {
            
            it('chart date will be set to', function () {
                scope.range = "1M";
             
               // scope.$root.$digest();
                
                // spyOn(element.isolateScope().chart.xAxis[0], 'setExtremes');
                
//                element.isolateScope().changeRange();
                                
//                expect(element.isolateScope().chart.xAxis[0].setExtremes).toHaveBeenCalled();                
            });

        });

    });
});


