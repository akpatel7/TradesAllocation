function Controller($scope) {
    $scope.master = {};

    $scope.update = function (portofolio) {
        $scope.master = angular.copy(portofolio);
    };

    $scope.reset = function () {
        $scope.portofolio = angular.copy($scope.master);
    };

    $scope.reset();
}