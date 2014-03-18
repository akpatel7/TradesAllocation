define(['angular', 'jquery'], function(angular, $) {
    'use strict';

    var directive = function (_WINDOW_SCROLLED_) {
        return {
            restrict: 'A',
            transclude: false,
            template: '<a href="javascript:void(0)" class="scroll-to-top" ng-click="scrollToTop()" ng-show="isScrolled()"><span><i class="icon-double-angle-up"/> {{linkText}}</span></a>',
            link: function(scope, element, attrs) {

                scope.linkText = "";

                scope.isScrolled = function() {
                    return ($('body').scrollTop() > 0);
                };

                scope.scrollToTop = function() {
                    $("html, body").animate({
                        scrollTop: 0
                    }, 100);
                };

                scope.$on(_WINDOW_SCROLLED_, function () {
                    scope.isScrolled();
                    scope.$apply();
                });

                $(".scroll-to-top").hover(function(){
                    $(".scroll-to-top").addClass("is-hovering",200);
                    scope.linkText = "Top";
                    scope.$apply();
                }, function(){
                    $(".scroll-to-top").removeClass("is-hovering",200);
                    scope.linkText = "";
                    scope.$apply();
                });
            }
        };
    };
    directive.$inject = ['_WINDOW_SCROLLED_'];

    return directive;
});