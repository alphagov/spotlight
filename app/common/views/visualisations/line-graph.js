define([
  'extensions/views/graph/graph'
],
function (Graph) {
  var LineGraph = Graph.extend({

    components: function () {
      var labelOptions, yAxisOptions;

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

      return {
        axis: { view: this.sharedComponents.xaxis },
        yaxis: {
          view: this.sharedComponents.yaxis,
          options: yAxisOptions
        },
        linelabel: {
          view: this.sharedComponents.linelabel,
          options: labelOptions
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
    }

  });

  return LineGraph;
});
