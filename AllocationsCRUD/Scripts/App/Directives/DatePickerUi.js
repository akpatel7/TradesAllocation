define(['angular', 'math.uuid'], function(angular, uuid) {
    'use strict';

    var directive = function (_SET_DATE_) {

        return {
            restrict: 'A',
            require: 'ngModel',
            transclude: false,
            scope: {
                dateChangedCallback: '='
            },
            link: function(scope, element, attrs) {

                //to expose for testing
                scope.element = element;

                //jquery-ui datepicker requires a unique id, but we can't get this from angular binding - jquery-ui can't parse {{column}}
                //so we set one ourselves
                element.attr("id", Math.uuidFast());

                element.datepicker({
                    dateFormat: 'M dd, yy',
                    onSelect: function(date) {
                        scope.$apply(function() {
                            scope.dateChangedCallback(date);
                        });
                    }
                });

                //datepicker links have href of '#' - not desired in a single-page app
                //this is called for each use of the directive - not perfect. does a more general config file exist?
                $('.ui-datepicker-calendar a').click(function(event) {
                    event.preventDefault();
                });

                scope.$on(_SET_DATE_, function (event, date) {
                    element.datepicker("setDate", date);
                    scope.dateChangedCallback(date);
                });

            }
        };
    };
    directive.$inject = ['_SET_DATE_'];
    return directive;
});