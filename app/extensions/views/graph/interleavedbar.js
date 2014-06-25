define([
  'require',
  './component'
],
function (require, Component) {
  /**
   * Renders multiple data series as blocks of 'interleaved' bars. Each block
   * contains one value from each series.
   */
  var InterleavedBar = Component.extend({

    blockMarginFraction: 0.2,
    align: 'left',

    offsetText: -6,

    classed: 'bar',

    x: function (model, index) {
      var blockWidth = this.blockWidth.apply(this, arguments);
      var blockMargin = this.blockMarginFraction * blockWidth / 2;

      var barWidth = this.barWidth.apply(this, arguments);
      var numBarSpaces = this.collection.length - 1;
      if (numBarSpaces > 0) {
        barWidth += this.barMarginFraction * blockWidth / numBarSpaces;
      }

      return blockMargin + blockWidth * index;
    },

    y0: function () {
      return 0;
    },

    blockWidth: function () {
      var x0 = this.scales.x(this.graph.getXPos(0, 0));
      var x1 = this.scales.x(this.graph.getXPos(0, 1));
      return x1 - x0;
    },

    barWidth: function () {
      var blockWidth = this.blockWidth.apply(this, arguments);
      var allBlockMargins = this.blockMarginFraction * blockWidth;
      return (blockWidth - allBlockMargins);
    },

    render: function () {
      Component.prototype.render.apply(this, arguments);

      var selection = this.componentWrapper.selectAll('g.group');
      selection.remove();

      var container = this.componentWrapper.append('g').attr('class', 'group');

      this.collection.each(function (model, i) {
        var segment = container.append('g').attr('class', 'segment');
        this.updateSegment(segment, model, i);
      }, this);
    },

    getStrokeWidth: function (selection) {
      return this.graph.pxToValue($(selection.node()).css('stroke-width'));
    },

    updateSegment: function (segment, model, index) {

      var width = this.barWidth();

      var x = this.x(model, index);

      var xLeft = x;
      var align = this.align;
      if (align === 'right') {
        xLeft -= width;
      } else if (align !== 'left') {
        xLeft -= width / 2;
      }

      var xRect = xLeft;
      var y = this.scales.y(this.graph.getYPos(index));
      var yRect = y;
      var yRect0 = this.scales.y(this.y0(index));
      var widthRect = width;

      var rect = segment.append('rect').attr('class', 'stack');

      if (this.strokeAlign === 'inner') {
        var strokeWidth = this.getStrokeWidth(segment.select('rect'));
        xRect += strokeWidth / 2;
        yRect += strokeWidth / 2;
        yRect0 -= strokeWidth / 2;
        widthRect -= strokeWidth;
      }

      rect.attr({
        x: xRect,
        y: yRect,
        width: widthRect,
        height: Math.max(0, yRect0 - yRect)
      });

      segment.append('line').attr({
        'class': 'line',
        x1: xLeft,
        y1: y,
        x2: xLeft + width,
        y2: y
      });

      if (this.text) {
        segment.append('text').attr({
          'class': 'text',
          x: xLeft + width / 2,
          y: y + this.offsetText
        }).text(this.text(model, index));
      }
    },

    onChangeSelected: function (modelSelected, indexSelected) {
      this.componentWrapper.selectAll('g.segment').classed('selected', false);

      if (indexSelected === null) {
        return;
      }

      var segment = d3.select(this.componentWrapper.selectAll('g.segment')[0][indexSelected]);
      segment.classed('selected', true);
    },

    /**
     * Selects an item for a given position. Searches for the bar whose
     * horizontal centre is closest to the current position.
     * @param {Object} e Hover event details
     * @param {Number} e.x Hover x position
     * @param {Number} e.y Hover y position
     * @param {Boolean} [e.toggle=false] Unselect if the new selection is the current selection
     */
    onHover: function (e) {
      var best = {
        dist: Infinity
      };

      this.collection.each(function (model, index) {
        var barX = this.x(model, index);
        var barWidth = this.barWidth(model, index);
        var barCentre = barX + barWidth / 2;
        var dist = Math.abs(barCentre - e.x);
        var isNewBest = dist < best.dist;
        if (isNewBest) {
          best = {
            dist: dist,
            model: model,
            index: index
          };
        }
      }, this);

      if (e.toggle) {
        this.collection.selectItem(best.index, { toggle: true });
      } else {
        this.collection.selectItem(best.index);
      }
    }

  });

  return InterleavedBar;
});