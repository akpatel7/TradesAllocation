define(['angular', 'masonry', 'underscore'], function(angular, masonry, _) {
    'use strict';

    var controller = function ($scope, $element, $timeout) {
       
        var schedule = [],
            destroyed = false,
            self = this,
            timeout = null;
        $scope.bricks = [];
        this.scheduleMasonryOnce = function() {
            var args = arguments;

            var found = _.filter(schedule, function(item) {
                return item[0] === args[0];
            }).length > 0;
            if (!found) {
                this.scheduleMasonry.apply(null, arguments);
            }
        };
        this.scheduleMasonry = function() {
            if (timeout) {
                $timeout.cancel(timeout);
            }
            schedule.push([].slice.call(arguments));

            timeout = $timeout(function() {
                if (destroyed) {
                    return;
                }
              
                _.each(schedule, function (args) {
                    $element.masonry.apply($element, args);
                });
                schedule = [];
            }, 30);
        };

        this.appendBrick = function(element, id) {
            if (destroyed) {
                return;
            }

            function append() {
                if (_.keys($scope.bricks).length === 0) {
                    $element.masonry('resize');
                }
                if ($scope.bricks[id] === undefined) {
                    $scope.bricks[id] = true;
                    $element.masonry('appended', element, true);
                    //self.scheduleMasonryOnce('reloadItems');
                    //self.scheduleMasonryOnce('layout');
                }
            }

            append();
        };
        this.removeBrick = function(id, element) {
            if (destroyed) {
                return;
            }
            delete $scope.bricks[id];
            $element.masonry('remove', element);
            this.scheduleMasonryOnce('layout');
        };
        this.destroy = function() {
            destroyed = true;
            if ($element.data('masonry')) {
                $element.masonry('destroy');
            }
            $scope.$emit('masonry.destroyed');
            $scope.bricks = [];
        };
        this.reload = function() {
            $element.masonry();
            $scope.$emit('masonry.reloaded');
        };
    };

    controller.$inject = ['$scope', '$element', '$timeout'];
    
    return controller;
});


