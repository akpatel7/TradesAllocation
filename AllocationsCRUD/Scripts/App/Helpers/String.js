define(function() {
    'use strict';

    return {
        trim: function(value) {
            return value.replace(/^\s+|\s+$/g, '');
        },
        capitalize: function(value) {
            return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        },
        wrap: function(value, length) {
            var wrappedContent = '';
            if (value.length > length) {
                wrappedContent = value.substring(0, length) + '...';
            } else {
                wrappedContent = value;
            }
            return wrappedContent;
        },
        stripIllegalHtmlAttributeCharacters: function(text) {
            //this is a slightly more restrictive validation than the W3 specifies - they allow for some complex quote usage
            //http://www.w3.org/TR/html401/intro/sgmltut.html#attributes
            return text.replace(/[^a-zA-Z0-9-_.; ]/g, '');
        },
        trimEnd: function(input, c) {
            if (input.substring(input.length - 1) === c) {
                return input.substring(0, input.length - 1);
            }
            return input;
        },
        padDigits: function(number, noOfDigits) {
            return new Array(Math.max(noOfDigits - String(number).length + 1, 0)).join(0) + number;
        }
    };

});