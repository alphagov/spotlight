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

    x: function (model, index) {
      var xPos = this.graph.getXPos(index);
      return this.scales.x(xPos);
    },

    y: function (model, index) {
      var yPos = this.graph.getYPos(index);
      return this.scales.y(yPos);
    },

    textWidth: function (selection) {
      return selection.node().getBBox().width;
    },

    getValue: function (model, index) {
      if (_.isArray(model)) {
        var noData = true;
        var sum = _.reduce(model, function (sum, model) {
          var value = model.get(this.graph.valueAttr);
          if (value !== null) {
            noData = false;
          }
          return sum += model.get(this.graph.valueAttr);
        }, 0, this);
        //this is a hack based on a bug in getDistanceAndClosestModel
        //which manifests in grouped_timeseries displayed as stack.
        //it causes the total rather than the stack value to be displayed
        //when hovering to the right of the last value.
        //in the case of stacked_graph this is not desired
        //(though we still want '(no data)' labels)
        //and so we show nothing if noTotal is true and the sum isn't null
        if (noData) {
          sum = null;
        } else if (this.noTotal) {
          sum = LABELS_OFF;
        }
        return sum;
      } else {
        if (this.graph.model && this.graph.model.get('one-hundred-percent')) {
          // TODO
        } else if (model) {
          return model.get(this.graph.valueAttr);
        }
      }
      return null;
    },

    formatValue: function (value) {
      return value;
    },

    formatMissingValue: function () {
      return '(no data)';
    },

    onChangeSelected: function (model, index) {
      var unselected = model === null;
      var selection = this.componentWrapper.selectAll('text');

      if (unselected) {
        selection.data([]).exit().remove();
        return;
      }

      var value = this.getValue(model, index);

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
        x: this.x(model, index),
        y: this.y(model, index)
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
