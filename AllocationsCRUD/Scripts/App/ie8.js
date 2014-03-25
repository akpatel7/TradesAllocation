define(['App/Helpers/String', 'underscore'], function (string, _) {
    if (typeof String.prototype.trim !== 'function') {
        String.prototype.trim = function () {
            return string.trim(this);
        };
    }
});