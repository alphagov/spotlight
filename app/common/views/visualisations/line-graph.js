define([
  'extensions/views/graph/graph',
  'extensions/views/graph/line-set'
],
function (Graph, LineSet) {
  var LineGraph = Graph.extend({

    components: function () {
      var labelOptions, yAxisOptions, lineGraphComponents;

      if (this.isOneHundredPercent()) {
        labelOptions = {
          showValues: true,
          showValuesPercentage: true,
          isLineGraph: true,
          showOriginalValues: true,
          showSummary: false
        };

        yAxisOptions = {
          tickFormat: function () {
            return function (d) {
              return d * 100 + '%';
            };
          }
        };
      }

      lineGraphComponents = {
        axis: { view: this.sharedComponents.xaxis },
        yaxis: {
          view: this.sharedComponents.yaxis,
          options: yAxisOptions
        },
        lines: {
          view: LineSet,
          options: {
            interactive: true
          }
        },
        callout: {
          view: this.sharedComponents.callout,
          options: {
            showPercentage: this.isOneHundredPercent()
          }
        },
        hover: { view: this.sharedComponents.hover }
      };

      if (this.showLineLabels()) {
        lineGraphComponents.linelabel = {
          view: this.sharedComponents.linelabel,
          options: labelOptions
        };
      }

      return lineGraphComponents;
    },

    getLines: function () {
      return _.map(this.model.get('axes').y, function (line) {
        return line.categoryId + ':' + this.valueAttr;
      }, this);
    },

    maxValue: function () {
      return _.reduce(this.getLines(), function (max, attr) {
        return Math.max(max, this.collection.max(attr) || 0);
      }, 0, this);
    }

  });

  return LineGraph;
});
