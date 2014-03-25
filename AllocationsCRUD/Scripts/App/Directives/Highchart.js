define([
        'angular', 'underscore', 'moment', 'jquery-ui', 'highcharts'
], function (angular, _, moment) {
    'use strict';

    var directive = function($timeout) {

        return {
            restrict: 'EA',            
            scope: {
                config: "="
            },
            controller: function ($scope) {

                $scope.usingZoom = false;
                $scope.startDate = $scope.config.minDate;
                $scope.endDate = $scope.config.maxDate;
                $scope.minEndDate = moment.utc($scope.startDate).add('d', 1);
                $scope.maxStartDate = moment.utc($scope.endDate).subtract('d', 1);
                $scope.startOpen = false;
                $scope.endOpen = false;
                
                $scope.resetRange = function () {
                    $scope.range = "0";
                };

                $scope.openStart = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope.startOpen = true;
                };
                
                $scope.openEnd = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope.endOpen = true;
                };
                
                $scope.changeDateRange = function () {
                    $scope.usingZoom = true;
                    $scope.chart.xAxis[0].setExtremes($scope.startDate, $scope.endDate);
                };
               
                $scope.hasRange = function (month) {
                    var date = moment().subtract(month, 'M');
                    return date.isBefore(moment.utc($scope.config.maxDate));
                };

                $scope.hasYTDRange = function () {
                    return $scope.hasRange(moment().month() + 1);
                };
                                                
                $scope.range = $scope.hasRange(12) ? "1Y" : "ALL";
                               
                $scope.changeRange = function () {

                    if ($scope.range !== "0") {
                        var sDate = new Date();
                        var eDate = new Date();

                        // ALL
                        // start and end range
                        if ($scope.range === 'ALL') {
                            sDate = $scope.config.minDate;
                            eDate = $scope.config.maxDate;
                        } else {
                            switch ($scope.range) {
                            case '1M':
                            case '3M':
                            case '6M':
                                var month = parseInt($scope.range[0], 10);
                                sDate.setMonth(sDate.getMonth() - month);
                                break;
                            case 'YTD':
                                sDate.setMonth(0);
                                sDate.setDate(1);
                                break;
                            case '1Y':
                                sDate.setYear(sDate.getFullYear() - 1);
                                break;
                            }
                        }                        

                        $scope.startDate = sDate;
                        $scope.endDate = eDate;                        

                        $scope.changeDateRange();
                    }

                };
                
            },
            template: '<div class="rangeSelector" class="clearfix">' +
                      '<span class="dates"><strong>Date Range:</strong><span>&nbsp;From:</span><span class="input-prepend">' +
                      '<i class="icon-calendar add-on" ng-click="openStart($event)"></i>' +
                      '<input type="text" ng-model="startDate" min="config.minDate" max="maxStartDate" datepicker-popup="dd MMM yy" is-open="startOpen" datepicker-options="datepickerOptions" class="start range-selector" ng-change="changeDateRange()"></span> To: <span class="input-prepend">' +
                      '<i class="icon-calendar add-on" ng-click="openEnd($event)"></i>' +
                      '<input type="text" ng-model="endDate" min="minEndDate" max="config.maxDate" datepicker-popup="dd MMM yy" is-open="endOpen" datepicker-options="datepickerOptions" class="end range-selector" ng-change="changeDateRange()"></span></span>' +
                      '<span class="zoom">&nbsp;<strong>Zoom:</strong> <select ng-change="changeRange()" ng-model="range">' +
                      '<option value="0">Select range</option>' +
                      '<option ng-disabled="!hasRange(1)">1M</option>' +
                      '<option ng-disabled="!hasRange(3)">3M</option>' +
                      '<option ng-disabled="!hasRange(6)">6M</option>' +
                      '<option ng-disabled="!hasYTDRange()">YTD</option>' +
                      '<option ng-disabled="!hasRange(12)" ng-disabled="">1Y</option>' +
                      '<option>ALL</option></select></span>' +
                      
                  '</div>' +
                   '<div class="performanceChart"></div>',
            link: function (scope, element) {
               

                scope.datepickerOptions = {
                    dateFormat: 'd M yy',
                    changeMonth: true,
                    changeYear: true
                };

                var updateDates = function (e) {
                    
                    if (!scope.usingZoom) {
                        scope.range = "0";
                        scope.startDate = e.target.xAxis[0].min;
                        scope.endDate = e.target.xAxis[0].max;
                    }

                    scope.minEndDate = moment(scope.startDate).add('d', 2);
                    scope.maxStartDate = moment(scope.endDate).subtract('d', 2);

                    scope.usingZoom = false;
                };
                
                scope.config.chart = _.extend(scope.config.chart, {                  
                    events: {
                        redraw: function (e) {                            
                            $timeout(function() { updateDates(e); }, 0);

                        }
                    }
                });
                
                scope.config.chart.renderTo = $('.performanceChart', element[0])[0];

                if (scope.config.isStockChart) {
                    scope.chart = new Highcharts.StockChart(scope.config);
                } else {
                    scope.chart = new Highcharts.Chart(scope.config);
                }
                
                scope.changeRange();
            }
        };
    };

    directive.$inject = ['$timeout'];
    
    return directive;
});


