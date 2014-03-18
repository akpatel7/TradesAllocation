define(['angular', 'mocks', 'App/Directives/TrackingAction'], function () {
    describe('Tracking directive', function () {
        var scope, compile;

        beforeEach(module('App')); 
        describe('When clicked', function () {
            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope;
                compile = $compile;
                window.Tracking = {
                    logUsage: function() { 
                    }
                };
            }));
            it('should trigger tracking for clicks on itself', inject(function (Analytics) {
                var element = compile('<a href="#" data-tracking-action="someAction" tracking-resource="someResource" ></a>')(scope);
                spyOn(Analytics, 'logUsage');
                element.trigger('click');
                expect(Analytics.logUsage).toHaveBeenCalledWith("someAction", "someResource");
            }));
        });
    });
});


