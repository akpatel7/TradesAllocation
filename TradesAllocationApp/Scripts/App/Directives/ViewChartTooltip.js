define(['angular', 'moment'], function (angular, moment) {
    'use strict';

    return function () {
        return {
            restrict: 'EA',
            template: '<div class="tooltip-container chart-tooltip">' +
                        '<div class="tooltip-body">' +
                            '<div class="pull-left" style="width:130px;">' +
                                '<span class="date-label">Start: </span>' +
                                '<span class="date horizon-start-date" date="view.horizonStartDate"></span><br />' +
                                '<span class="date-label">Position</span>' +
                                '<div class="conviction-{{convictionValue}} position-{{positionValue}}" position-conviction-color style="width: 0px"><div class="position " view-position view="view" mode="graphic"></div></div>' +
                            '</div>' +
                            '<div class="pull-right" style="width:130px;">' +
                                '<span class="date-label">Horizon: </span>' +
                                '<span class="date horizon" view-horizon="view.viewHorizon"></span><br />' +
                                '<span class="date-label">Conviction</span><br />' +
                                '<div conviction view-conviction="view.viewConviction" mode="graphic"></div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="arrow-down"></div>' +
                    '</div>',
            scope: { view: '=' },
            link: function (scope, element, attrs) {
            }
        };
    };
});

