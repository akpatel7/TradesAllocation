define(['angular'], function () {
    'use strict';
    // http://www.bennadel.com/blog/2420-Mapping-AngularJS-Routes-Onto-URL-Parameters-And-Client-Side-Events.htm
    var appController = function ($scope, $route, $routeParams, Analytics, Page) { // IMPORTANT!  $route, $routeParams need to be injected
        $scope.page = Page;
       
        $scope.$on('$routeChangeStart', function (event, current, last) {
            if (current) {
                var renderAction = current.action,
                renderPath = [];

                if (current.action) {
                    renderPath = renderAction.split('.');
                }

                $scope.renderTitle = current.title;
                $scope.renderAction = renderAction;
                $scope.renderPath = renderPath;
                $scope.renderTemplateKey = current.templateKey;
                $scope.isFavouritePage = renderAction !== undefined && renderAction.indexOf('favourites') >= 0;
                if (!$scope.renderTemplateKey) {
                    $scope.renderTemplateKey = renderPath[1];
                }

                if (current.title !== undefined) {
                    var page = current.title.replace(' ', '');
                    Analytics.registerPageTrack(page);
                }
            }
            
        });

    };
    appController.$inject = ['$scope', '$route', '$routeParams', 'Analytics', 'Page'];
    return appController;
});