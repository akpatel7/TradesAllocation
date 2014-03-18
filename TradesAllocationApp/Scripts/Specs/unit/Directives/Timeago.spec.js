define(['angular', 'mocks', 'App/Directives/Timeago'], function (angular, mocks, timeagoDirective) {
    describe('Timeago directive', function () {
        var scope, element;

        beforeEach(module('App'));

        describe('When rendered', function () {
            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope.$new();
                element = $compile('<span timeago="timestamp"></span>')(scope);
            }));
            
            it('should render time-ago text', inject(function () {
                var date = new Date();
                scope.timestamp = date;
                scope.$root.$digest();

                expect(element.text()).toBe("a few seconds ago");
            }));
            
            it('should render real time as a tooltip', inject(function () {
                var date = new Date('Jan 02 2000 03:04:05 GMT+0000');
                scope.timestamp = date;
                scope.$root.$digest();

                expect(element.attr('title')).toBe('03:04:05 02/01/2000');
                expect(element.attr('data-timestamp')).toBeDefined();
            }));
        });
    });
});


