define(['angular', 'App/app'], function (angular, app) {
    'use strict';
    app
       .run(function ($templateCache) {
           $templateCache.put('house-view.html',
               '<div class="clearfix houseView" data-view-id="{{view.id}}" >' +
                   '<div class="top conviction-{{convictionValue}} position-{{positionValue}}">' +
                   '<div class="relative-view-label">{{view.relativeViewLabel}}</div>' +
                   '<span view-position view="view" mode="graphic"></span>' +
                   '<span conviction view-conviction="view.viewConviction" mode="graphic"></span>' +
                   '<span view-horizon="view.viewHorizon"></span>' +
                   '<span class="latest-update date"><span class="latest-update-label date-label">latest update</span><b><span date="view.lastUpdated"></span></b></span>' +
                   '</div>' +
                   '<div ng-show="isExpanded" class="description">' +
                   '<div>' +
                   '<span view-position view="view" mode="text"></span> <span conviction view-conviction="view.viewConviction" mode="text" class=""></span>' +
                   '</div>' +
                   '<div>{{view.description}}</div>' +
                   '</div>' +
                   '</div>');
       });
    
    var directive = function (PositionConvictionValue) {
        return {
            restrict: 'EA',
            scope: { view: '=', expanded: '@' },
            templateUrl: 'house-view.html',
            link: function (scope) {
                PositionConvictionValue.setPositionAndConvictionValues(scope);
                scope.isExpanded = false;
                scope.$watch('expanded', function (value) {
                    if (value !==  undefined) {
                        scope.isExpanded = value === 'true';
                    }
                });
            }
        };
    };

    directive.$inject = ['PositionConvictionValue'];
    
    return directive;
});

