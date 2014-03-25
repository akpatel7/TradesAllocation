define(['outlayer/item'], function (Item) {
    var translate = function (x, y) {
          return 'translate(' + x + 'px, ' + y + 'px)';
      };
    
    Item.prototype.getPosition = function() {

    };
    
    Item.prototype.moveTo = function (x, y) {
        this.getPosition();
        // get current x & y from top/left
        var curX = this.position.x;
        var curY = this.position.y;

        var compareX = parseInt(x, 10);
        var compareY = parseInt(y, 10);
        var didNotMove = compareX === this.position.x && compareY === this.position.y;

        // save end position
        this.setPosition(x, y);

        // if did not move and not transitioning, just go to layout
        if (didNotMove && !this.isTransitioning) {
            return;
        }

        var transX = x - curX;
        var transY = y - curY;
        var transitionStyle = {};
        // flip cooridinates if origin on right or bottom
        var layoutOptions = this.layout.options;
        transX = layoutOptions.isOriginLeft ? transX : -transX;
        transY = layoutOptions.isOriginTop ? transY : -transY;
        transitionStyle.transform = translate(transX, transY);

        this.transition({
            to: transitionStyle,
            onTransitionEnd: {
                transform: this.layoutPosition
            },
            isCleaning: true
        });
    };
});