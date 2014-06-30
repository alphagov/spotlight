define([
  './line'
],
function (Line) {
  return Line.extend({

    y0: function (index) {
      var val = this.graph.getY0Pos(index, this.valueAttr);
      return this.scales.y(val);
    },

    render: function () {
      Line.prototype.render.apply(this, arguments);
      this.renderArea();
    },

    renderArea: function () {
      var getX = _.bind(function (model, index) { return this.x(index); }, this);
      var getY = _.bind(function (model, index) { return this.y(index); }, this);
      var getY0 = _.bind(function (model, index) { return this.y0(index); }, this);
      var area = d3.svg.area()
          .x(getX)
          .y1(getY)
          .y0(getY0)
          .defined(function (model, index) { return getY(model, index) !== null; });

      var path = this.componentWrapper.insert('g', ':first-child').attr('class', 'group')
        .append('path').attr('class', 'stack ' + this.className);
      path.datum(this.collection.toJSON())
          .attr('d', area);
    },

    select: function (index) {
      this.componentWrapper.select('path.stack').classed('selected', true).classed('not-selected', false);
      if (this.drawCursorLine || true) {
        this.renderCursorLine(this.x(index));
      }
      Line.prototype.select.apply(this, arguments);
    },

    // put line into dis-emphasised state when other lines are selected
    deselect: function () {
      Line.prototype.deselect.apply(this, arguments);
      this.componentWrapper.select('path.stack').classed('selected', false).classed('not-selected', true);
      this.componentWrapper.select('line.cursorLine').remove();
    },

    // put line into default state when no lines are selected
    unselect: function () {
      Line.prototype.unselect.apply(this, arguments);
      this.componentWrapper.select('path.stack').classed('selected', false).classed('not-selected', false);
      this.componentWrapper.select('line.cursorLine').remove();
    },

    renderCursorLine: function (x) {
      this.componentWrapper.select('line.cursorLine').remove();
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
