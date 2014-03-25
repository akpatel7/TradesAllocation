// Including bootstrap breake some tests in solution. Use mock instead.

$.fn.affix = function(option) {
    return this.each(function() {
        $(this)
            .addClass('affix')
            .attr('data-offset-top', option.offset.top);
    });
};