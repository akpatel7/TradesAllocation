define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var icons = [
         '<span class="up">' +
            '<i icon state="upState" on-icon="icon-thumbs-up icon-on" off-icon="icon-thumbs-up icon-off" title="{{upTitle}}"><span ng-if="showCount">{{sum(likeCount, countChange.like)}}</span></i>' +
        '</span>',
        '<span class="down">' +
            '<i icon state="downState" on-icon="icon-thumbs-down icon-on" off-icon="icon-thumbs-down icon-off" title="{{downTitle}}"><span ng-if="showCount">{{sum(dislikeCount, countChange.dislike)}}</span></i>' +
        '</span>'
    ];
    var directive = function (Like) {
        var neutralVoteValue = 'neutral',
            likeVoteValue = 'like',
            dislikeVoteValue = 'dislike';

        function getCountChange(previousState, currentState) {
            var likeChange = 0,
                dislikeChange = 0;
            if (previousState === likeVoteValue) {
                if (currentState !== likeVoteValue) {
                    likeChange = -1;
                }
            } else if (previousState === dislikeVoteValue) {
                if (currentState !== dislikeVoteValue) {
                    dislikeChange = -1;
                }
            }
            if (currentState === likeVoteValue) {
                if (previousState !== likeVoteValue) {
                    likeChange = +1;
                }
            } else if (currentState === dislikeVoteValue) {
                if (previousState !== dislikeVoteValue) {
                    dislikeChange = +1;
                }
            }
            return { like: likeChange, dislike: dislikeChange };
        }

        return {
            replace: true,
            restrict: 'EA',
            template: '' +
                '<div ng-switch="disabled">' +
                '    <span ng-switch-default>' +
                '        <div ng-switch="upState">' +
                '            <a ng-switch-when="true"  href="" ng-click="vote(\'like\', upState, $event)" click-tracking="DCSext.unselectagree_{{resourceType}}" tracking-resource="{{resourceId}}">' + icons[0] + '</a>' +
                '            <a ng-switch-when="false" href="" ng-click="vote(\'like\', upState, $event)" click-tracking="DCSext.selectagree_{{resourceType}}" tracking-resource="{{resourceId}}">' + icons[0] + '</a>' +
                '        </div>' +
                '        <div ng-switch="downState">' +
                '            <a ng-switch-when="true"  href="" ng-click="vote(\'dislike\', downState, $event)" click-tracking="DCSext.unselectdisagree_{{resourceType}}" tracking-resource="{{resourceId}}">' + icons[1] + '</a>' +
                '            <a ng-switch-when="false" href="" ng-click="vote(\'dislike\', downState, $event)" click-tracking="DCSext.selectdisagree_{{resourceType}}" tracking-resource="{{resourceId}}">' + icons[1] + '</a>' +
                '        </div>' +
                '    </span>' +
                '    <span ng-switch-when="true"><div>' + icons[0] + '</div><div>' + icons[1] + '</div></span>' +
                '</div>',
            scope: {
                state: '=',
                resourceType: '@',
                resourceId: '=',
                likeCount: '=',
                dislikeCount: '=',
                disabled: '=',
                showCount: '@'
            },
            link: function (scope, element, attrs) {
                scope.$watch('state', function(value) {
                    scope.upTitle = "Vote up";
                    scope.downTitle = "Vote down";
                    scope.upState = value === likeVoteValue;
                    scope.downState = value === dislikeVoteValue;

                    if (scope.initialState === undefined) {
                        scope.initialState = value;
                    }
                    
                    scope.countChange = getCountChange(scope.initialState, value);
                });

                scope.vote = function (value, currentState, e) {
                    var newValue;
                    
                    if (value === likeVoteValue) {
                        newValue = (scope.state === likeVoteValue ? neutralVoteValue : likeVoteValue);
                    } else if (value === dislikeVoteValue) {
                        newValue = (scope.state === dislikeVoteValue ? neutralVoteValue : dislikeVoteValue);
                    } else {
                        newValue = value;
                    }

                    Like.like(scope.resourceType, scope.resourceId, newValue)
                        .then(function (result) {
                            scope.id = result;
                            scope.state = newValue;
                        });
                    e.stopPropagation();
                };

                scope.sum = function (a, b) {
                    var result = a === undefined || b === undefined ? 0 : Number(a) + Number(b);
                    if (result < 0) {
                        result = 0;
                    }
                    return result;
                };
            }
        };
    };
    
    directive.$inject = ['Like'];
    return directive;
});

