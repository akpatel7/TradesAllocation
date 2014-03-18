define(['angular'], function (angular) {
    'use strict';

    var directive = function (HouseViewServiceUri, View) {
        return {
            restrict: 'EA',
            template: '<div ng-if="isHouseView">HOUSE <i class="icon-home"></i></div>' +
                      '<div ng-if="!isHouseView">{{name}}</div>',
            scope: {
                service: '=',
                useShortName: '='
            },
            link: function (scope, element, attrs) {
                scope.$watch('service', function(value) {
                    scope.isHouseView = value['@id'] === HouseViewServiceUri;
                    scope.name = scope.useShortName ? View.getServiceName(value) : value.canonicalLabel;
                });
            }
        };
    };

    directive.$inject = ['HouseViewServiceUri', 'View'];
    
    return directive;
});

