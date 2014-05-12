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
    barMarginFraction: 0.05,
    align: 'left',

    offsetText: -6,

    classed: 'bar',

    x: function (group, groupIndex, model, index) {
      var blockWidth = this.blockWidth.apply(this, arguments);
      var blockMargin = this.blockMarginFraction * blockWidth / 2;

      var barWidth = this.barWidth.apply(this, arguments);
      var numBarSpaces = this.collection.length - 1;
      if (numBarSpaces > 0) {
        barWidth += this.barMarginFraction * blockWidth / numBarSpaces;
      }

      return blockMargin + blockWidth * index + barWidth * groupIndex;
    },

    y0: function () {
      return 0;
    },

    barWidth: function () {
      var numGroups = this.collection.length;
      var numBarSpaces = numGroups - 1;
      var blockWidth = this.blockWidth.apply(this, arguments);

      var allBarMargins = numBarSpaces > 0 ? this.barMarginFraction * blockWidth : 0;
      var allBlockMargins = this.blockMarginFraction * blockWidth;

      return (blockWidth - allBlockMargins - allBarMargins) / numGroups;
    },

    render: function () {
      Component.prototype.render.apply(this, arguments);

      var selection = this.componentWrapper.selectAll('g.group')
          .data(this.collection.models);
      selection.exit().remove();

      selection.enter().append('g').attr('class', 'group');

      var that = this;
      selection.each(function (group, groupIndex) {
        var segmentSelection = that.d3.select(this).selectAll('g.segment')
            .data(group.get('values').models);
        var enterSegmentSelection = segmentSelection.enter().append('g').attr('class', 'segment');

        enterSegmentSelection.append('rect');
        enterSegmentSelection.append('line');
        if (that.text) {
          enterSegmentSelection.append('text');
        }

        segmentSelection.each(function (model, i) {
          that.updateSegment.call(that, groupIndex, d3.select(this), model, i);
        }, this);
      });
    },

    getStrokeWidth: function (selection) {
      return this.graph.pxToValue($(selection.node()).css('stroke-width'));
    },

    updateSegment: function (groupIndex, segment, model, index) {
      var group = this.collection.at(groupIndex);

      var width = this.barWidth(group, groupIndex, model, index);
      var blockWidth = _.isFunction(this.blockWidth) ? this.blockWidth(group, groupIndex, model, index) : width;

      var x = this.x(group, groupIndex, model, index);

      var xLeft = x;
      var align = this.align;
      if (align === 'right') {
        xLeft -= blockWidth;
      } else if (align !== 'left') {
        xLeft -= blockWidth / 2;
      }

      var xRect = xLeft;
      var y = this.scales.y(this.graph.getYPos(groupIndex, index));
      var yRect = y;
      var yRect0 = this.scales.y(this.y0(groupIndex, index));
      var widthRect = width;

      if (this.strokeAlign === 'inner') {
        var strokeWidth = this.getStrokeWidth(segment.select('rect'));
        xRect += strokeWidth / 2;
        yRect += strokeWidth / 2;
        yRect0 -= strokeWidth / 2;
        widthRect -= strokeWidth;
      }

      segment.select('rect').attr({
        'class': 'stack' + groupIndex,
        x: xRect,
        y: yRect,
        width: widthRect,
        height: Math.max(0, yRect0 - yRect)
      });

      segment.select('line').attr({
        'class': 'line' + groupIndex,
        x1: xLeft,
        y1: y,
        x2: xLeft + width,
        y2: y
      });

      if (this.text) {
        segment.select('text').attr({
          'class': 'text' + groupIndex,
          x: xLeft + width / 2,
          y: y + this.offsetText
        }).text(this.text(model, index));
      }
    },

    onChangeSelected: function (groupSelected, groupIndexSelected, modelSelected, indexSelected) {
      this.componentWrapper.selectAll('g.segment').classed('selected', false);

      if (indexSelected === null) {
        return;
      }

      var group = d3.select(this.componentWrapper.selectAll('g.group')[0][groupIndexSelected]);
      var segment = d3.select(group.selectAll('g.segment')[0][indexSelected]);
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

      this.collection.each(function (group, groupIndex) {
        group.get('values').each(function (model, index) {
          var barX = this.x(group, groupIndex, model, index);
          var barWidth = this.barWidth(group, groupIndex, model, index);
          var barCentre = barX + barWidth / 2;
          var dist = Math.abs(barCentre - e.x);
          var isNewBest = dist < best.dist;
          if (isNewBest) {
            best = {
              dist: dist,
              group: group,
              groupIndex: groupIndex,
              model: model,
              index: index
            };
          }
        }, this);
      }, this);

      if (e.toggle) {
        this.collection.selectItem(best.groupIndex, best.index, { toggle: true });
      } else {
        this.collection.selectItem(best.groupIndex, best.index);
      }
    }

  });

  return InterleavedBar;
});