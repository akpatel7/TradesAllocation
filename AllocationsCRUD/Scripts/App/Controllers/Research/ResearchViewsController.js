define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var ResearchViewsController = function ($scope) {

        $scope.views = [];
        var allViews;

        $scope.$watch('viewable', function (viewable) {
            if (viewable && viewable.activeView) {
                if (viewable.activeView['@set']) {
                    allViews = _.sortBy(viewable.activeView['@set'], function (v) { return (v.lastUpdatedDate ? v.lastUpdatedDate : '0000-00-00') + '_' + v['@id']; });
                    allViews.reverse();
                }
                else {
                    allViews = [viewable.activeView];
                }
            }
            else {
                allViews = [];
            }

            $scope.pagesShown = 0;
            $scope.showMore();
            $scope.loaded = true;
        });

        $scope.$watch('showAuthorisedContentOnly', function () {
            $scope.pagesShown = 0;
            $scope.showMore();
        });

        $scope.showMore = function () {

            $scope.pagesShown++;

            var views = allViews, countToDisplay = $scope.pageSize * $scope.pagesShown;

            if ($scope.showAuthorisedContentOnly) {
                views = _.filter(views, function (view) { return view.hasPermission; });
            }

            $scope.views = _.first(views, countToDisplay);
            $scope.canShowMore = views.length > countToDisplay;
        };
    };
    ResearchViewsController.$inject = ['$scope'];

    return ResearchViewsController;
});