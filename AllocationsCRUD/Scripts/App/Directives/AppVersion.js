define(['angular'], function () {
    'use strict';
    var dir = function(version) {
        return function(scope, elm, attrs) {
            elm.text(version);
        };
    };
    dir.$inject = ['version'];
    return dir;
});

