define([
  'extensions/views/graph/graph'
],
function (Graph) {
  var ResponseTimeGraph = Graph.extend({

    valueAttr: 'avgresponse:mean',
    numYTicks: 3,

    components: function () {
      return {
        xaxis: {
          view: this.sharedComponents.xaxis
        },
        yaxis: {
          view: this.sharedComponents.yaxis,
          options: {
            tickFormat: function () {
              return _.bind(function (d) {
                return this.format(d, {
                  type: 'duration',
                  unit: 's'
                });
              }, this);
            }
          }
        },
        stack: {
          view: this.sharedComponents.line
        },
        tooltip: {
          view: this.sharedComponents.tooltip,
          options: {
            formatValue: function (value) {
              return this.format(value, {
                type: 'duration',
                unit: 's'
              });
            }
          }
        },
        hover: {
          view: this.sharedComponents.hover
        }
      };
    }

  });

  return ResponseTimeGraph;
});
