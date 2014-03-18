define(['App/Services/AnalyticsService', 'mocks'], function (AnalyticsService) {
    describe('AnalyticsService', function () {
        
        angular.module('AnalyticsService.Spec', []).factory('UserService', function () {
            return {
               getCurrentUser: function() {
                   return {
                       then: function(expression) {
                           return expression({
                               _id: 'rohit.modi'
                           });
                       }
                   };
               }
            };
        });


        beforeEach(function () {
            module('App.services');
            module('AnalyticsService.Spec');
        });
        
        describe('Given we visit the home page', function() {
            it('should track pageload_HomePage', inject(function (Analytics) {
                spyOn(Analytics, 'logUsage').andCallFake(function () {
                });
                Analytics.registerPageTrack('HomePage');
                expect(Analytics.logUsage).toHaveBeenCalled();
                expect(Analytics.logUsage.argsForCall[0][0]).toBe('pageload');
                expect(Analytics.logUsage.argsForCall[0][1]).toBe('HomePage');
            }));
        });

        describe('Given we click on a link', function () {
            it('should track "someLink", "clickedResource', inject(function (Analytics) {
                spyOn(Analytics, 'registerClick').andCallFake(function () {
                });
                Analytics.registerClick('someLink', 'clickedResource');
                expect(Analytics.registerClick).toHaveBeenCalledWith('someLink', 'clickedResource');
            }));
        });

        describe('Given we log usage', function () {
            var receivedParams,
                originalWebTrends,
                fakeDCSext;

            beforeEach(inject(function ($window, Analytics, $location) {
                originalWebTrends = $window.WebTrends;
                $window.WebTrends = {
                    multiTrack: function (p) {
                        receivedParams = p;
                        if (p.hasOwnProperty('finish')) {
                            p.finish({
                                DCSext: fakeDCSext
                            });
                        }
                    }
                };
                $location.path('/#Views');
            }));
            afterEach(inject(function($window) {
                $window.WebTrends = originalWebTrends;
            }));
            
            it('should call webtrends with the right parameters', inject(function (Analytics) {
                Analytics.logUsage('pageLoad', 'HomePage', 'targetUri', { param1Key: 'param1Value' });
                
                expect(receivedParams.args['DCSext.action-target-uri']).toBe('targetUri');
                expect(receivedParams.args['DCSext.dcssip']).toBe('server');
                expect(receivedParams.args['DCSext.em-user-id']).toBe('rohit.modi');
                expect(receivedParams.args['DCSext.pageLoad']).toBe('1');
                expect(receivedParams.args['DCS.dcsuri']).toBe('/#Views');
                expect(receivedParams.args['param1Key']).toBe('param1Value');
            }));

            it('should clear out variable assigments after the beacon request has been sent', inject(function (Analytics) {
                fakeDCSext = {
                    'key1': 'value1'
                };
                Analytics.logUsage('pageLoad', 'HomePage', 'targetUri', { param1Key: 'param1Value' });
                expect(fakeDCSext['key1']).toBe('');
            }));
        });
    });
});