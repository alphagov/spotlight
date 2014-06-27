define([
  'extensions/views/graph/component',
  'extensions/mixins/pivot'
],
function (Component, Pivot) {
  var LABELS_OFF = 'no labels';

  var Tooltip = Component.extend({
    classed: 'tooltip',
    constrainToBounds: true,
    horizontal: 'right',
    vertical: 'bottom',
    textHeight: 11,
    xOffset: -7,
    yOffset: -7,

    x: function (index) {
      var xPos = this.graph.getXPos(index);
      return this.scales.x(xPos);
    },

    y: function (index, attr) {
      var yPos = this.graph.getYPos(index, attr);
      return this.scales.y(yPos);
    },

    textWidth: function (selection) {
      return selection.node().getBBox().width;
    },

    getValue: function (model, index, attr) {
      attr = attr || this.graph.valueAttr;
      return model.get(attr);
    },

    formatValue: function (value) {
      var format = this.graph.currency ? 'currency' : 'number';
      if (this.graph.isOneHundredPercent()) {
        format = 'percent';
      }
      return this.format(value, { type: format, magnitude: true, pad: true });
    },

    formatMissingValue: function () {
      return '(no data)';
    },

    onChangeSelected: function (model, index, options) {
      options = options || {};
      var unselected = model === null;
      var selection = this.componentWrapper.selectAll('text');

      if (unselected) {
        selection.data([]).exit().remove();
        return;
      }

      var value = this.getValue(model, index, options.valueAttr);

      if (value === LABELS_OFF) {
        selection.data([]).exit().remove();
        return;
      }

      if (value === null) {
        value = this.formatMissingValue();
      } else {
        value = this.formatValue(value);
      }

      selection = selection.data([value, value]);
      selection.exit().remove();
      selection.enter().append('text').attr('class', function (d, index) {
        return index === 0 ? 'tooltip-stroke' : 'tooltip-text';
      }).attr('dy', this.textHeight);

      selection.text(value);

      var basePos = {
        x: this.x(index),
        y: this.y(index, options.valueAttr)
      };

      var pos = this.applyPivot(basePos, {
        horizontal: this.horizontal,
        vertical: this.vertical,
        xOffset: this.xOffset,
        yOffset: this.yOffset,
        constrainToBounds: this.constrainToBounds,
        width: this.textWidth(selection),
        height: this.textHeight
      }, {
        width: this.graph.innerWidth,
        height: this.graph.innerHeight
      });

      selection.attr('transform', 'translate(' + pos.x + ', ' + pos.y + ')');
      this.moveToFront();
    }

  });

  _.extend(Tooltip.prototype, Pivot);

  return Tooltip;
});
