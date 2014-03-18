define([
        'angular'
    ], function(angular) {
        'use strict';

        var service = function (View) {
            return {                
                setPositionAndConvictionValues: function(scope) {
                    if (scope.view) {
                        if (scope.view.hasPermission === false) {
                            scope.positionValue = '';
                            scope.convictionValue = '';
                        }
                        else {
                            scope.positionValue = View.getPosition(scope.view) + 1;
                            if (scope.view.hasPermission === false) {
                                scope.convictionValue = '';
                            } else {
                                scope.convictionValue = View.getConviction(scope.view);
                            }
                        }
                    }
                }
            };
        };

        service.$inject = ['View'];
        return service;
    });

