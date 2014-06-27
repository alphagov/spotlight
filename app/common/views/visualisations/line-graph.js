define([
  'extensions/views/graph/graph',
  'extensions/views/graph/line-set'
],
function (Graph, LineSet) {
  var LineGraph = Graph.extend({

    components: function () {
      var labelOptions = {
          isLineGraph: true
        },
        yAxisOptions, lineGraphComponents;

      if (this.isOneHundredPercent()) {
        _.extend(labelOptions, {
          showValues: true,
          showValuesPercentage: true,
          showOriginalValues: true,
          showSummary: false
        });

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

    isOneHundredPercent: function () {
      return this.model && this.model.get('one-hundred-percent');
    },

    getLines: function () {
      return _.map(this.model.get('axes').y, function (line) {
        line = _.clone(line);
        line.key = line.key || (line.categoryId + ':' + this.valueAttr);
        if (this.isOneHundredPercent()) {
          line.key += ':percent';
        }
        return line;
      }, this);
    },

    maxValue: function () {
      return _.reduce(this.getLines(), function (max, line) {
        return Math.max(max, this.collection.max(line.key) || 0);
      }, 0, this);
    }

  });

  return LineGraph;
});
