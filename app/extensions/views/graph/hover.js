define([
  'extensions/views/graph/component'
],
function (Component) {

  /**
   * Graph component that intercepts and normalises user interaction events
   */
  var Hover = Component.extend({

    rightHandGracePixels: 16,

    events: function () {
      if (this.modernizr.touch) {
        return {
          'touchstart .hover': 'onTouchStart'
        };
      } else {
        return {
          'mousemove .hover': 'onMouseMove'
        };
      }
    },

    dispose: function () {
      if (this.modernizr.touch) {
        $('body').off('touchstart', this.onTouchStartBody);
      }
      Component.prototype.dispose.apply(this, arguments);
    },

    render: function () {
      if (!this.hoverEl) {
        this.hoverEl = $('<div></div>').addClass('hover').appendTo(this.graph.graphWrapper);
      }
    },

    attachBodyListener: function (eventName) {
      if (this.bodyListener) {
        return;
      }
      this.bodyListener = true;
      var that = this;
      $('body').one(eventName, function () {
        that.bodyListener = false;
        that.collection.selectItem(null, null);
      });
    },

    onMouseMove: _.throttle(function (e) {
      var offset = this.graph.graphWrapper.offset();
      var scaleFactor = this.graph.scaleFactor();
      var x = (e.pageX - offset.left) / scaleFactor - this.margin.left;
      var y = (e.pageY - offset.top) / scaleFactor - this.margin.top;

      this.attachBodyListener('mousemove');
      this.selectPoint(x, y);
      return false;
    }, 40),

    onTouchStart: function (e) {
      var touch = e.originalEvent.touches[0];
      var offset = this.graph.graphWrapper.offset();
      var scaleFactor = this.graph.scaleFactor();
      var x = (touch.pageX - offset.left) / scaleFactor - this.margin.left;
      var y = (touch.pageY - offset.top) / scaleFactor - this.margin.top;

      this.attachBodyListener('touchstart');
      this.selectPoint(x, y, {
        toggle: true
      });
      return false;
    },

    /**
     * Triggers a graph 'hover' event for a specific coordinate.
     */
    selectPoint: function (x, y, options) {
      var slice = this.getSlice(x, y);
      this.graph.trigger('hover', _.extend({
        x: x,
        y: y,
        slice: slice
      }, options));
    },

    /**
     * Finds 'slice' of the graph for a specific coordinate.
     * The graph area is divided into 9 slices counted in reading direction:
     * 0-2: top; 3-5: middle; 6-8: bottom.
     * 0,3,6: left; 1,4,7: centre; 2,5,8: right.
     * The main graph area therefore is slice 4.
     */
    getSlice: function (x, y) {
      return (y >= this.graph.innerHeight ? 6 : y < 0 ? 0 : 3) +
             (x >= (this.graph.innerWidth + this.rightHandGracePixels) ? 2 : x < 0 ? 0 : 1);
    }

  });

  return Hover;
});
