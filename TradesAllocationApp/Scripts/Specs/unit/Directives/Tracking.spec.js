define(['angular', 'mocks', 'App/Directives/Tracking'], function () {
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
                var element = compile('<a href="#" click-tracking="somekey" tracking-resource="someresource"></a>')(scope);
                spyOn(Analytics, 'registerClick');
                element.trigger('click');
                expect(Analytics.registerClick).toHaveBeenCalledWith("somekey", "someresource");
            }));
        });
    });
});


