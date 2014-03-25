define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var ResearchViewEvolutionsController = function ($scope, $timeout) {
        $scope.minimisedSettings = {
            viewType: {
                tactical: {
                    visible: false
                },
                strategic: {
                    visible: true
                }
            },
            viewStatus: {
                all: {
                    visible: true
                }
            },
            report: {
                visible: false
            },
            viewsTogglable: {
                enabled: false
            }
        };
        
        $scope.maximisedSettings = {
            viewType: {
                tactical: {
                    visible: false
                },
                strategic: {
                    visible: true
                }
            },
            viewStatus: {
                all: {
                    visible: true
                }
            },
            report: {
                visible: false
            },
            viewsTogglable: {
                enabled: true
            }
        };

        $scope.$watch('isMaximised', function() {
            $timeout(function() {
                $scope.redrawChart = Math.random();
            }, 200);
        }, true);
    };
    ResearchViewEvolutionsController.$inject = ['$scope', '$timeout'];

    return ResearchViewEvolutionsController;
});