define(['angular'], function (angular) {
    'use strict';

    return function () {
        return {
            restrict: 'EA',
            scope: {
                config: "="
            },
            template: '<div  ng-if="!config.isPerformanceEmpty">' +
                  '<div class="pull-left axis-label leftAxis relative" ng-if="config.relativePerformanceLabel !== undefined">' +
                      '<div class="relative">{{config.relativePerformanceLabel}}</div>' +
                      '<div class="versus">{{config.versusLabel}}</div>' +
                  '</div>' +
                  '<div ng-if="config.absoluteLabel !== undefined && config.relativePerformanceLabel === undefined" class="pull-left axis-label leftAxis absolute">{{config.absoluteLabel}}</div>' +
                  '<div class="pull-left"><div highchart config="config"></div></div>' +
                  '<div class="pull-left axis-label rightAxis absolute">{{config.absoluteLabel}}</div>' +
                  '<div class="pull-left axis-label rightAxis relative" ng-if="config.relativePerformanceLabel !== undefined && config.absoluteLabel === undefined">' +
                      '<div class="relative">{{config.relativePerformanceLabel}}</div>' +
                      '<div class="versus">{{config.versusLabel}}</div>' +
                  '</div>' +
              '</div>' +
              '<div class="empty" ng-if="config.isPerformanceEmpty">There is no performance information</div>',
            link: function (scope, element, attrs) {             
            }
        };
    };
});

