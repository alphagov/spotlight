define([
  'extensions/views/graph/graph',
  'extensions/views/graph/stacked-linelabel'
],
function (Graph, LineLabel) {
  var StackedGraph = Graph.extend({

    interactiveFunction: function (e) {
      if (this.graph.lineLabelOnTop()) {
        return e.slice >= 3;
      } else {
        return e.slice % 3 !== 2;
      }
    },

    render: function () {
      var valueAttr = this.valueAttr;
      var stack = this.d3.layout.stack()
        .values(function (group) {
          return group.get('values').models;
        })
        .y(function (model) {
          return model.get(valueAttr);
        });

      if (this.isOneHundredPercent()) {
        stack.offset(function (data) {
          var lineCount = data.length,
              lineLength = data[0].length,
              i, j, sumOfYValues, y0 = [];

          for (j = 0; j < lineLength; ++j) {
            sumOfYValues = 0;
            for (i = 0; i < lineCount; i++) {
              sumOfYValues += data[i][j][1];
            }
            for (i = 0; i < lineCount; i++) {
              if (sumOfYValues) {
                data[i][j][1] = data[i][j][1] / sumOfYValues;
              } else {
                data[i][j][1] = null;
              }
            }
          }
          for (j = 0; j < lineLength; ++j) {
            y0[j] = 0;
          }
          return y0;
        });
      }

      if (this.outStack) {
        stack.out(_.bind(this.outStack, this));
      }

      this.layers = stack(this.collection.models.slice().reverse());

      Graph.prototype.render.apply(this, arguments);
    },

    components: function () {
      var labelComponent, labelOptions, stackOptions, yAxisOptions, tooltipFormat;

      if (this.showLineLabels()) {
        labelComponent = LineLabel;
        labelOptions = {
          showValues: true,
          showValuesPercentage: true,
          showSummary: true,
          showTimePeriod: true,
          attachLinks: this.model.get('line-label-links')
        };
        stackOptions = {
          selectGroup: true,
          encompassStack: true,
          drawCursorLine: true,
          interactive: this.interactiveFunction
        };
      } else {
        labelComponent = this.sharedComponents.callout;
      }

      if (this.model && this.model.get('one-hundred-percent')) {
        yAxisOptions = {
          tickFormat: function () {
            return function (d) {
              return d * 100 + '%';
            };
          }
        };
        tooltipFormat = function (d) {
          return Math.round(d * 100) + '%';
        };
      } else {
        tooltipFormat = function (d) {
          return this.format(d, { type: 'number', magnitude: true, pad: true });
        };
      }

      return {
        xaxis: { view: this.sharedComponents.xaxis },
        yaxis: { view: this.sharedComponents.yaxis, options: yAxisOptions },
        stack: { view: this.sharedComponents.stack, options: stackOptions },
        label: { view: labelComponent, options: labelOptions },
        hover: { view: this.sharedComponents.hover },
        tooltip: {
          view: this.sharedComponents.tooltip,
          options: {
            formatValue: tooltipFormat,
            encompassStack: true,
            noTotal: true
          }
        }
      };
    },

    encompassStack: true,

    getYPos: function (groupIndex, modelIndex) {
      if (!this.collection.at(groupIndex)) {
        if (this.collection.at(groupIndex - 1) && this.encompassStack) {
          return 0;
        } else {
          return null;
        }
      }
      var model = this.collection.at(groupIndex).get('values').at(modelIndex);
      var yProperty = this.stackYProperty || 'y';
      if (model[yProperty] === null) {
        return null;
      }
      var y0Property = this.stackY0Property || 'y0';
      return model[y0Property] + model[yProperty];
    },
    getY0Pos: function (groupIndex, modelIndex) {
      var y0Property = this.stackY0Property || 'y0';
      var model = this.collection.at(groupIndex).get('values').at(modelIndex);
      return model[y0Property];
    },
    calcYScale: function () {
      var valueAttr = this.valueAttr;

      var max = this.collection.max(valueAttr);
      var yScale = this.d3.scale.linear();
      var tickValues = this.calculateLinearTicks([0, Math.max(max, this.minYDomainExtent)], this.numYTicks);
      if (this.isOneHundredPercent()) {
        yScale.domain([0, 1]);
      } else {
        yScale.domain(tickValues.extent);
      }
      yScale.rangeRound([this.innerHeight, 0]);
      yScale.tickValueList = tickValues.values;
      return yScale;
    }
  });

  return StackedGraph;
});
