define(['angular', 'masonry', 'underscore'], function (angular, masonry, _) {
    'use strict';

    var directive = function ($cookies) {
        return {
            restrict: 'AEC',
            controller: 'MasonryController',
            link: {
                pre: function (scope, element, attrs, ctrl) {
                    var attrOptions = scope.$eval(attrs.masonry || attrs.masonryOptions);
                    var options = angular.extend(attrOptions || {}, {
                        itemSelector: attrs.itemSelector || '.masonry-brick',
                        columnWidth: '.grid-sizer',
                        gutter: 0,
                        transitionDuration: 0
                    });
                    if ($cookies['transitionDuration'] !== undefined) {
                        _.extend(options, {
                            transitionDuration: $cookies['transitionDuration']
                        });
                    }
                    element.masonry(options);
                    scope.$emit('masonry.created', element);
                    scope.$on('$destroy', ctrl.destroy);
                }
            }
        };
    };

    directive.$inject = ['$cookies'];

    return directive;
});


