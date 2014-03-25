define(['angular'], function (angular) {
    var directive = function (Analytics) {
        return function (scope, element, attr) {
            element.bind('click', function () {
                Analytics.registerClick(attr['clickTracking'], attr['trackingResource']);
            });
        };
    };

    directive.$inject = ['Analytics'];
    return directive;
});