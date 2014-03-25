define(['angular'], function (angular) {
    'use strict';

    var directive = function (Suggest, $location) {
        return {
            replace: true,
            restrict: 'EA',
            template: '<div class="search-box">' +
                        '<i class="icon-search"></i>' +
                        '<input type="text" placeholder="{{placeholder}}" ng-model="selected" typeahead="item.canonicalLabel for item in getSuggestedItems($viewValue)" typeahead-on-select="selectSuggestedItem($item, $event)" typeahead-wait-ms="500">' +
                        '<i class="icon-caret-right"></i>' +
                '</div>',
            scope: {
                type: '@',
                placeholder: '@'
            },
            link: function (scope, element, attrs) {
                scope.selected = '';
                scope.getSuggestedItems = function (value) {
                    return Suggest.suggest({
                        q: value,
                        type: attrs.type
                    });
                };

                scope.selectSuggestedItem = function (item) {
                    $location.search({ uri: item['@id'] });
                    scope.selected = '';
                    return false;
                };
            }
        };
    };
    directive.$inject = ['Suggest', '$location'];
    return directive;
});

