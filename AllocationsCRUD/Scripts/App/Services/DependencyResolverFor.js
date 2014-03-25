define(['angular', 'underscore'], function (angular, _) {
    return function (dependencies) {
        var loaded = false;
        var definition =
        {
            resolver: ['$q', '$rootScope', '$timeout', function ($q, $rootScope, $timeout) {
                var deferred = $q.defer();
                if (!loaded) {
                    require(dependencies, function () {
                        loaded = true;
                        $rootScope.$apply(function () {
                            deferred.resolve();
                        });
                    });
                } else {
                    $timeout(function () {
                        deferred.resolve();
                    }, 0);

                }

                return deferred.promise;
            }]
        };

        return definition;
    };
});