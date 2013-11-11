define([
  'extensions/views/graph/component',
  'extensions/mixins/pivot'
],
function (Component, Pivot) {
  var Tooltip = Component.extend({

    classed: 'tooltip',
    constrainToBounds: true,
    horizontal: 'right',
    vertical: 'bottom',
    textHeight: 11,
    xOffset: -7,
    yOffset: -7,

    x: function (group, groupIndex, model, index) {
      var xPos = this.graph.getXPos(groupIndex, index);
      return this.scales.x(xPos);
    },

    y: function (group, groupIndex, model, index) {
      var yPos = this.graph.getYPos(groupIndex, index);
      return this.scales.y(yPos);
    },

    textWidth: function (selection) {
      return selection.node().getBBox().width;
    },

    getValue: function (group, groupIndex, model, index) {
      return model.get(this.graph.valueAttr);
    },

    formatValue: function (value) {
      return value;
    },

    formatMissingValue: function () {
      return '(no data)';
    },

    onChangeSelected: function (group, groupIndex, model, index) {
      var unselected = model == null;
      var selection = this.componentWrapper.selectAll('text');

      if (unselected) {
        selection.data([]).exit().remove();
        return;
      }

      var value = this.getValue(group, groupIndex, model, index);

      if (value == null) {
        value = this.formatMissingValue();
      } else {
        value = this.formatValue(value);
      }

      selection = selection.data([value, value]);
      selection.exit().remove();
      selection.enter().append("text").attr('class', function (d, index) {
        return index === 0 ? 'tooltip-stroke' : 'tooltip-text';
      }).attr('dy', this.textHeight);

      selection.text(value);

      var basePos = {
        x: this.x(group, groupIndex, model, index),
        y: this.y(group, groupIndex, model, index)
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
    }

  });

  _.extend(Tooltip.prototype, Pivot);

  return Tooltip;
});
