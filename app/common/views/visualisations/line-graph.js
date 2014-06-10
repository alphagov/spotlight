define([
  'extensions/views/graph/graph',
  'extensions/views/graph/linelabel'
],
function (Graph, LineLabel) {
  var LineGraph = Graph.extend({

    components: function () {
      var labelComponent, labelOptions, yAxisOptions;
      if (this.isOneHundredPercent()) {
        labelComponent = LineLabel;
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
      } else {
        labelComponent = this.sharedComponents.linelabel;
      }

      labelComponent = this.sharedComponents.linelabel;

      return {
        axis: { view: this.sharedComponents.xaxis },
        yaxis: {
          view: this.sharedComponents.yaxis,
          options: yAxisOptions
        },
        linelabel: {
          view: labelComponent,
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
