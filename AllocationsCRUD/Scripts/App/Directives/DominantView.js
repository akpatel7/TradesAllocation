define([
        'angular'
    ], function(angular) {
        'use strict';

        var directiveDefinition = function(Dates, DominantView, View) {
            return {
                restrict: 'EA',
                scope: { viewable: '=', dominantView: '=' },
                template:
                    '<div ng-switch="hasDominantView">' +
                        '<span class="dominant-view" ng-switch-when="true" data-dominant-view-id={{view["@id"]}}> ' +
                        //'<div class="relative-view-label">{{view.relativeViewLabel}}</div>' +
                            '<span view-position view="view" previous-view="view.previousView" mode="graphic"></span>' +
                            '<span conviction view-conviction="view.viewConviction" previous-conviction="view.previousView.viewConviction" mode="graphic"></span>' +
                            '<span ng-class="{ \'horizon-with-previous\' : view.previousView.viewHorizon && view.viewHorizon != view.previousView.viewHorizon }">' +
                                '<div view-horizon="view.viewHorizon"></div>' +
                                '<div ng-show="view.previousView.viewHorizon && view.viewHorizon != view.previousView.viewHorizon" class="previous-horizon"></div>' +
                            '</span>' +
                            '<span class="service-label" service-label service="view.service"></span>' +
                        '</span>' +
                        '<span ng-switch-default class="dominant-view"></span>' +
                    '</div>',
                link: function(scope, element, attrs) {

                    function setDominantView(view) {
                        scope.view = view;
                        scope.hasDominantView = scope.view !== null;
                        if (scope.hasDominantView) {
                            scope.serviceLabel = View.getServiceName(scope.view.service);
                        }
                    }

                    scope.$watch('viewable', function () {
                        if (!scope.dominantView && scope.viewable && scope.viewable.activeView) {
                            setDominantView(DominantView.getDominantView(scope.viewable));
                        }
                    });

                    scope.$watch('dominantView', function(newValue) {
                        if (newValue) {
                            setDominantView(newValue);
                        }
                    });
                }
            };
        };

        directiveDefinition.$inject = ['Dates', 'DominantView', 'View'];
        return directiveDefinition;
    });
