define(['angular', 'underscore', 'App/app'], function (angular, _, app) {
    'use strict';
    var directive;
    app.run(['$templateCache', function ($templateCache) {
            $templateCache.put('AllocationMoreInfo.html',
                '<div class="indent{{level}}">' +
                    ' <div ng-switch="selectedTab" ng-init="selectedTab=\'researchTab\'" class="resetGrid">'+
                        '<ul class="nav nav-tabs">' +
                       
                            '<li ng-class="{active: selectedTab === \'researchTab\'}">            '+
                                '<a href="" ng-click=" selectedTab=\'researchTab\'  "><i class="icon-file"></i>&nbsp;Research</a>' +
                            '</li>'+
                            '<li ng-class="{active: selectedTab === \'themeTab\'}">'+
                                '<a href=""  ng-click=" selectedTab=\'themeTab\' "><i class="icon-globe"></i>&nbsp;Themes</a>' +
                            '</li>'+
                            '<li ng-class="{active: selectedTab === \'viewTab\'}">'+
                                '<a href="" ng-click=" selectedTab=\'viewTab\' "><i class="icon-compass"></i>&nbsp;Views</a>'+
                            '</li>'+
                            '<li ng-show="level > 1" ng-class="{active: selectedTab === \'historyTab\'}">'+
                                '<a href="" ng-click=" selectedTab=\'historyTab\' "><i class="icon-time"></i>&nbsp;History</a>'+
                            '</li>'+
                            '<li ng-class="{active: selectedTab === \'commentsTab\'}">'+
                                '<a href="" ng-click=" selectedTab=\'commentsTab\' "><i class="icon-comment"></i>&nbsp;Comments</a>'+
                            '</li>'+
                            '<li ng-class="{active: selectedTab === \'performanceTab\'}">'+
                                '<a href="" ng-click=" selectedTab=\'performanceTab\' "><i class="icon-dashboard"></i>&nbsp;Performance</a>'+
                            '</li>'+
                            '<li ng-class="{active: selectedTab === \'sharingTab\'}">'+
                                '<a href="" ng-click=" selectedTab=\'sharingTab\' "><i class="icon-share"></i>&nbsp;Sharing</a>'+
                            '</li>'+
                        '</ul>'+
                        '<div ng-switch-when="researchTab"><div ng-include src="\'/Templates/Allocations/RelatedReports.html\'"></div></div>' +
                        '<div ng-switch-when="themeTab"><div ng-include src="\'/Templates/Allocations/RelatedThemes.html\'"></div></div>'+
                        '<div ng-switch-when="viewTab"><div ng-include src="\'/Templates/Allocations/RelatedViews.html\'"></div></div>'+
                        '<div ng-show="level > 1" ng-switch-when="historyTab"><div ng-include src="\'/Templates/Allocations/History.html\'"></div></div>' +
                        '<div ng-switch-when="commentsTab"><div ng-include src="\'/Templates/Allocations/Comments.html\'"></div></div>' +
                        '<div ng-switch-when="performanceTab"><div ng-include src="\'/Templates/Trades/Performance.html\'"></div></div>'+
                        '<div ng-switch-when="sharingTab"></div>'+
                    '</div>' +
                 '</div>'
            );
        }]);

    directive = function () {


        return {
            restrict: 'EA',
            templateUrl: 'AllocationMoreInfo.html',
            link: function (scope, element, attrs) {
                scope.level = scope.row.Level + 1;
                scope.item = {
                    id: scope.row.originalId,
                    uri: scope.row.Uri,
                    performanceType: scope.row.isPortfolio ? 'p' : 'a',
                    isPortfolio: scope.row.isPortfolio,
                    isInformationOpen: true
                };
            }

        };

    };
    directive.$inject = [];

    return directive;
});

