define(['App/Controllers/Allocations/AllocationsController',
        'underscore',
        'angular',
        'mocks',
        'App/Services/services',
        'App/Controllers/controllers'
], function (AllocationsController, _, angular) {
    describe('AllocationsController', function () {
        var scope;

        beforeEach(function () {
            module('App.services');
            module('App.controllers');
        });

        describe('Given a AllocationsController', function () {

            beforeEach(inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();

                $controller(AllocationsController, {
                    $scope: scope
                });
            }));
           
        });
    });
});