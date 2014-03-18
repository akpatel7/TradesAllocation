define(['angular', 'moment'], function (angular, moment) {
    var directive = function (DateService) {
        return {
            restrict: 'A',
            scope: {
                timeago: '='
            },
            template: '{{ timeago | timeFromNow }}',
            link: function (scope, element, attrs) {
                scope.$watch('timeago', function (newVal, oldValue) {
                    var date = moment(newVal);
                    element.attr('title', date.format('HH:mm:ss DD/MM/YYYY'));
                    element.attr('data-timestamp', newVal);
                });
            }
        };
    };

    directive.$inject = ['Dates'];
    return directive;
});