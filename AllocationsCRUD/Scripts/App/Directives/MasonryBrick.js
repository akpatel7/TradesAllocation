define(['angular', 'masonry'], function (angular, masonry) {
    'use strict';

    var directive = function ($timeout) {
        return {
            restrict: 'AC',
            require: '^masonry',
            scope: true,
            link: {
                pre: function (scope, element, attrs, ctrl) {
                    var id = scope.$id, index;
                    ctrl.appendBrick(element, id);
                    element.on('$destroy', function () {
                        ctrl.removeBrick(id, element);
                    });
                    scope.$on('masonry.reload', function () {
                        ctrl.reload();
                    });
                    scope.$watch('$index', function () {
                        if (index !== undefined && index !== scope.$index) {
                            ctrl.scheduleMasonryOnce('reloadItems');
                            ctrl.scheduleMasonryOnce('layout');
                        }
                        index = scope.$index;
                    });
                    
                    attrs.$observe('masonrybrick', function (attrValue) {
                        scope.$watch(attrValue, function (value) {
                            ctrl.scheduleMasonryOnce('layout');
                        });
                    });
                }
            }
        };
    };

    directive.$inject = ['$timeout'];

    return directive;
});


