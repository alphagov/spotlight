define([
  'extensions/views/graph/component'
],
function (Component) {
  var Axis = Component.extend({
    
    position: 'bottom',
    tickPadding: 0,
    orient: 'bottom',
    classed: null,
    
    // Not implemented; override in configuration or subclass
    getScale: function () {
      throw('No scale defined.');
    },
    
    render: function () {
      Component.prototype.render.apply(this, arguments);
      
      var scale = this.getScale();
      
      var axis = this.d3.svg.axis()
        .scale(scale)
        .orient(this.orient);

      
      _.each(['ticks', 'tickValues', 'tickFormat', 'tickPadding', 'tickSize'], function (id) {
        if (this[id] != null) {
          axis[id](_.isFunction(this[id]) ? this[id]() : this[id]);
        }
      }, this);

      this.componentWrapper
        .attr("transform", this.getTransform())
        .call(axis);

      // re-order elements to ensure odd/even CSS logic behaves as expected
      this.componentWrapper.selectAll('.tick').sort(function (a, b) {
        return a < b ? -1 : a > b ? 1 : 0;
      });
    },
    
    getTransform: function () {
      var offsetX = this.offsetX || 0;
      var offsetY = this.offsetY || 0;
      
      if (this.position == 'right') {
        offsetX += this.graph.innerWidth;
      } else if (this.position === 'bottom') {
        offsetY += this.graph.innerHeight;
      }
      
      return "translate(" + offsetX + "," + offsetY + ")";
    }

  });

  return Axis;
});
