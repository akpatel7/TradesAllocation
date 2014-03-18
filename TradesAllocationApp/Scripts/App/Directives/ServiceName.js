define(['angular'], function (angular) {
    'use strict';

    var serviceName = function (View) {
        return {
            restrict: 'EA',
            template: '{{name}}',
            scope: { service: '=' },
            link: function (scope, element, attrs) {
                scope.$watch('service', function (newVal) {
                    if (newVal !== undefined) {
                        scope.name = View.getServiceName(newVal);
                    }
                    
                });
            }
        };
    };
    
    serviceName.$inject = ['View'];
    
    return serviceName;

});

