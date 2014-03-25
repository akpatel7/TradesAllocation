define(['jquery'], function ($) {
    return function (elem) {
        var width, height;
        
        if ($(elem).hasClass('masonry-brick')) {
            if (!($(elem).hasClass('brick-selected') || $(elem).hasClass('brick-expanded'))) {
                width = 252;
                height = 177;
            }
        }
        
        if (width === undefined) {
            width = elem.offsetWidth;
        }
        
        if (height === undefined) {
            height = elem.offsetHeight;
        }
        var size = {
            'paddingLeft': 0,
            'paddingRight': 0,
            'paddingTop': 0,
            'paddingBottom': 0,
            'marginLeft': 0,
            'marginRight': 0,
            'marginTop': 0,
            'marginBottom': 0,
            'borderLeftWidth': 0,
            'borderRightWidth': 0,
            'borderTopWidth': 0,
            'borderBottomWidth': 0,
            width: width,
            height: height,
            innerWidth: width,
            innerHeight: height,
            outerWidth: width,
            outerHeight: height + 10
        };

        return size;
    };
})