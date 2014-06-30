define([
  'extensions/views/graph/component'
],
function (Component) {

  var Line = Component.extend({

    interactive: true,
    x: function (index) {
      var xPos = this.graph.getXPos(index);
      return xPos === null ? null : Math.floor(this.scales.x(xPos)) + 0.5;
    },
    y: function (index) {
      var yPos = this.graph.getYPos(index, this.valueAttr);
      return yPos === null ? null : this.scales.y(yPos);
    },

    className: '',

    /**
     * Renders a line for each group in the collection.
     */
    render: function () {
      Component.prototype.render.apply(this, arguments);

      this.componentWrapper.selectAll('g.group').remove();
      this.renderLine();
      this.renderTerminators();
    },

    renderLine: function () {
      var getX = _.bind(function (model, index) { return this.x(index); }, this);
      var getY = _.bind(function (model, index) { return this.y(index); }, this);
      var line = d3.svg.line()
          .x(getX)
          .y(getY)
          .defined(function (model, index) { return getY(model, index) !== null; });

      var path = this.componentWrapper.append('g').attr('class', 'group')
        .append('path').attr('class', 'line ' + this.className);
      path.datum(this.collection.toJSON())
          .attr('d', line);
    },

    renderTerminators: function () {
      var getX = _.bind(function (model, index) { return this.x(index); }, this);
      var getY = _.bind(function (model, index) { return this.y(index); }, this);

      this.componentWrapper.selectAll('.terminator').remove();

      this.collection.each(function (model, index) {
        var hasCurrentPoint = (getY(null, index) !== null),
            missingPreviousPoint = (index > 0 && getY(null, index - 1) === null),
            missingNextPoint = (index < this.collection.size() - 1 && getY(null, index + 1) === null),
            showTerminator = hasCurrentPoint && (missingPreviousPoint || missingNextPoint);

        if (showTerminator) {
          this.componentWrapper.select('g.group')
            .append('circle')
            .attr('class', 'terminator line ' + this.className)
            .attr('cx', getX(null, index))
            .attr('cy', getY(null, index))
            .attr('r', 1.5);
        }
      }, this);
    },

    onChangeSelected: function (model, index, options) {
      options = options || {};
      if (model) {
        if (options.valueAttr && this.valueAttr !== options.valueAttr) {
          this.deselect();
        } else {
          this.select(index);
        }
      } else {
        this.unselect();
      }
    },

    select: function (index) {
      if (this.y(index) !== null) {
        this.moveToFront();
        this.componentWrapper.select('path.line').classed('selected', true).classed('not-selected', false);
        var x = this.x(index);
        var y = this.y(index);
        this.renderSelectionPoint(x, y);
      }
    },

    // put line into dis-emphasised state when other lines are selected
    deselect: function () {
      this.componentWrapper.selectAll('.selectedIndicator').remove();
      this.componentWrapper.select('path.line').classed('selected', false).classed('not-selected', true);
    },

    // put line into default state when no lines are selected
    unselect: function () {
      this.componentWrapper.selectAll('.selectedIndicator').remove();
      this.componentWrapper.select('path.line').classed('selected', false).classed('not-selected', false);
    },

    renderSelectionPoint: function (x, y) {
      this.componentWrapper.selectAll('.selectedIndicator').remove();
      var className = 'selectedIndicator line ' + this.className;
      this.componentWrapper.append('circle').attr({
        'class': className,
        cx: x,
        cy: y,
        r: 4
      });
    },

    onHover: function (e) {
      var diff = Infinity;
      var index;
      // Find closest point of closest group
      this.collection.each(function (model, i) {
        var x = this.x(i);
        if (Math.abs(x - e.x) < diff) {
          diff = Math.abs(x - e.x);
          index = i;
        }
      }, this);

      this.collection.selectItem(index);
    }


  });

  return Line;
});
