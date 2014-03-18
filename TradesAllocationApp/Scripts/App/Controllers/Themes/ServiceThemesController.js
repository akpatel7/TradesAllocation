define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var themeController = function ($scope, Annotations) {
        var initAnnotations = function() {
            if ($scope.theme && $scope.theme.parentTheme === undefined) {
                if ($scope.theme.childTheme === undefined) {
                    $scope.annotations = $scope.theme.annotations;
                }
            }
        };
        $scope.allThemes = [];
        $scope.showAnnotations = true;
        initAnnotations();
        
        $scope.options = [
            { label: 'Supports' },
            { label: 'Counters' },
            { label: 'Scenarios' },
            { label: 'Mentions' }
        ];
        
        $scope.$watch('theme', function (theme) {
            if (theme) {
                var childThemes = [];
                if (theme.childTheme !== undefined) {
                    _.each(theme.childTheme['@set'], function(childTheme) {
                        childThemes.push(childTheme);
                    });
                } else {
                    $scope.showAnnotations = theme.hasPermission;
                }
                
                $scope.allThemes = theme.childTheme !== undefined ? theme.childTheme['@set'] : [theme];
                
                if (theme.annotations === undefined && $scope.showAnnotations) {
                    Annotations.getAnnotations({
                        onlyOneAnnotationPerDocument: true,
                        conceptUri: _.pluck($scope.allThemes, '@id')
                    }).then(function(result) {
                            _.each($scope.allThemes, function(currentTheme) {
                                var annotations;

                                annotations = result[currentTheme['@id']];

                                _.extend(currentTheme, {
                                    annotations: annotations
                                });
                               
                            });
                            
                            initAnnotations();
                        });

                }
            }
            
        });

    };

    themeController.$inject = ['$scope', 'Annotations'];

    return themeController;
});