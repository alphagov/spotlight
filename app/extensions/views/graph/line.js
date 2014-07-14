define([
  'extensions/views/graph/component'
],
function (Component) {

  var Line = Component.extend({

    interactive: true,

    timeshift: false,

    x: function (index) {
      var xPos = this.graph.getXPos(index);
      return xPos === null ? null : Math.floor(this.scales.x(xPos)) + 0.5;
    },
    y: function (index) {
      var yPos = this.graph.getYPos(index, this.valueAttr);
      return !_.isNumber(yPos) ? null : this.scales.y(yPos);
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

    renderLine: function (getY) {
      var getX = _.bind(function (model, index) { return this.x(index); }, this);
      getY = getY || _.bind(function (model, index) { return this.y(index); }, this);
      var line = d3.svg.line()
          .x(getX)
          .y(getY)
          .defined(function (model, index) { return getY(model, index) !== null; });

      var group = this.componentWrapper.append('g').attr('class', 'group');
      var path = group.append('path').attr('class', 'line ' + this.className);
      path.classed('timeshift', this.timeshift);
      path.datum(this.collection.toJSON())
          .attr('d', line);
      return group;
    },

    renderTerminators: function () {

      this.componentWrapper.selectAll('.terminator').remove();

      this.collection.each(function (model, index) {
        var hasCurrentPoint = this.y(index) !== null,
            missingPreviousPoint = (index > 0 && this.y(index - 1) === null),
            missingNextPoint = index === this.collection.length - 1 || this.y(index + 1) === null,
            showTerminator = hasCurrentPoint && (missingPreviousPoint || missingNextPoint);

        if (showTerminator) {
          this.componentWrapper.select('g.group')
            .append('circle')
            .attr('class', 'terminator line ' + this.className)
            .attr('cx', this.x(index))
            .attr('cy', this.y(index))
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
        this.renderCursorLine(index);
        this.renderSelectionPoint(index);
        this.componentWrapper.selectAll('path.line').classed('selected', true).classed('not-selected', false);
        this.componentWrapper.selectAll('circle.terminator').classed('selected', true).classed('not-selected', false);
      } else {
        this.unselect();
        this.renderCursorLine(index);
      }
    },

    // put line into dis-emphasised state when other lines are selected
    deselect: function () {
      this.componentWrapper.selectAll('.selectedIndicator').remove();
      this.componentWrapper.selectAll('path.line').classed('selected', false).classed('not-selected', true);
      this.componentWrapper.selectAll('circle.terminator').classed('selected', false).classed('not-selected', true);
      this.componentWrapper.selectAll('line.cursorLine').remove();
    },

    // put line into default state when no lines are selected
    unselect: function () {
      this.componentWrapper.selectAll('.selectedIndicator').remove();
      this.componentWrapper.selectAll('path.line').classed('selected', false).classed('not-selected', false);
      this.componentWrapper.selectAll('circle.terminator').classed('selected', false).classed('not-selected', false);
      this.componentWrapper.selectAll('line.cursorLine').remove();
    },

    renderSelectionPoint: function (index) {
      var x = this.x(index);
      var y = this.y(index);
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
      // Find closest point
      this.collection.each(function (model, i) {
        var x = this.x(i);
        if (Math.abs(x - e.x) < diff) {
          diff = Math.abs(x - e.x);
          index = i;
        }
      }, this);

      this.collection.selectItem(index);
    },

    renderCursorLine: function (index) {
      var x = this.x(index);
      this.componentWrapper.selectAll('line.cursorLine').remove();
      this.componentWrapper.append('line').attr({
        'class': 'cursorLine',
        x1: x,
        y1: 0,
        x2: x,
        y2: this.graph.innerHeight
      });
    }


  });

  return Line;
});
