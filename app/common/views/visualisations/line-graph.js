define([
  'extensions/views/graph/graph'
],
function (Graph) {
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
        line: {
          view: this.sharedComponents.line,
          options: {
            interactive: function (e) {
              return e.slice % 3 !== 2;
            }
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
    }

  });

  return LineGraph;
});
