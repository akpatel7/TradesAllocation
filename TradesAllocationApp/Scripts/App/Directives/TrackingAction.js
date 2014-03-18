define(['angular'], function (angular) {
    var directive = function (Analytics) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('click', function () {
                    Analytics.logUsage(attrs['trackingAction'], attrs['trackingResource']);
                });
            }
        };
    };

    directive.$inject = ['Analytics'];
    return directive;
});