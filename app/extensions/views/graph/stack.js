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

    renderBaseLine: function () {
      if (this.grouped) {
        this.componentWrapper.selectAll('.baseline').remove();
        var baseline = _.bind(function (model, index) {
          if (model[this.valueAttr] === null) {
            return null;
          } else {
            return this.y0(index);
          }
        }, this);
        this.renderLine(baseline).classed('baseline', true);
      }
    },

    renderCursorLine: function (index) {
      Line.prototype.renderCursorLine.apply(this, arguments);
      if (this.grouped) {
        var x = this.x(index);
        var y = this.y(index);
        if (y !== null) {
          this.componentWrapper.append('line').attr({
            'class': 'cursorLine line selected ' + this.className,
            x1: x,
            y1: this.y0(index),
            x2: x,
            y2: y
          });
        }
      }
    },

    renderSelectionPoint: function (index) {
      Line.prototype.renderSelectionPoint.apply(this, arguments);
      if (this.grouped) {
        var x = this.x(index);
        var y = this.y0(index);
        var className = 'selectedIndicator line ' + this.className;
        this.componentWrapper.append('circle').attr({
          'class': className,
          cx: x,
          cy: y,
          r: 4
        });
      }
    },

    select: function () {
      this.componentWrapper.select('path.stack').classed('selected', true).classed('not-selected', false);
      this.renderBaseLine();
      Line.prototype.select.apply(this, arguments);
    },

    // put line into dis-emphasised state when other lines are selected
    deselect: function () {
      this.componentWrapper.selectAll('.baseline').remove();
      Line.prototype.deselect.apply(this, arguments);
      this.componentWrapper.select('path.stack').classed('selected', false).classed('not-selected', true);
    },

    // put line into default state when no lines are selected
    unselect: function () {
      this.componentWrapper.selectAll('.baseline').remove();
      Line.prototype.unselect.apply(this, arguments);
      this.componentWrapper.select('path.stack').classed('selected', false).classed('not-selected', false);
    }

  });
});
