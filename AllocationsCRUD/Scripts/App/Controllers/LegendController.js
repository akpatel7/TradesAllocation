define(['angular'], function (angular) {
    'use strict';

    var legendController = function ($scope) {
        $scope.viewPosition0 = { economicPosition: { '@id': 'http://data/weaker', canonicalLabel: 'Weaker' } };
        $scope.viewPosition1 = { economicPosition: { '@id': 'http://data/flat', canonicalLabel: 'Flat' } };
        $scope.viewPosition2 = { economicPosition: { '@id': 'http://data/stronger', canonicalLabel: 'Stronger' } };
        
        $scope.convictionLow = { canonicalLabel: 'Low' };
        $scope.convictionMedium = { canonicalLabel: 'Medium' };
        $scope.convictionHigh = { canonicalLabel: 'High' };

    };
    
    legendController.$inject = ['$scope'];

    return legendController;
});