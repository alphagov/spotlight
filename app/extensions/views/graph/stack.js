define([
  './line'
],
function (Line) {
  return Line.extend({

    render: function () {
      Line.prototype.render.apply(this, arguments);
      this.renderArea();
    },

    renderArea: function () {
      var getX = _.bind(function (model, index) { return this.x(index); }, this);
      var getY = _.bind(function (model, index) { return this.y(index); }, this);
      var yScale = this.scales.y;
      var area = d3.svg.area()
          .x(getX)
          .y1(getY)
          .y0(function () { return yScale(0); })
          .defined(function (model, index) { return getY(model, index) !== null; });

      var path = this.componentWrapper.insert('g', ':first-child').attr('class', 'group')
        .append('path').attr('class', 'stack');
      path.datum(this.collection.toJSON())
          .attr('d', area);
    },

    onChangeSelected: function (model, index) {
      this.componentWrapper.selectAll('.cursorLine').remove();
      if (model && this.drawCursorLine) {
        this.renderCursorLine(this.x(index));
      }
      Line.prototype.onChangeSelected.apply(this, arguments);
      this.componentWrapper.select('path.stack').classed('selected', !!model);
    },

    renderCursorLine: function (x) {
      this.componentWrapper.append('line').attr({
        'class': 'cursorLine',
        x1: x,
        y1: 0,
        x2: x,
        y2: this.graph.innerHeight
      });
    }

  });
});
