define([
  'extensions/views/graph/graph'
],
function (Graph) {
  var ResponseTimeGraph = Graph.extend({

    valueAttr: 'avgresponse',
    numYTicks: 3,

    getConfigNames: function () {
      return ['stack', this.collection.query.get('period')];
    },

    components: function () {
      return [
        { view: this.sharedComponents.xaxis },
        { view: this.sharedComponents.yaxis, options: {
            tickFormat: function () {
              return function (d) {
                return ResponseTimeGraph.prototype.formatDuration(d, 4);
              };
            }
          }
        },
        {
          view: this.sharedComponents.stack,
          options: {
            drawCursorLine: true,
            allowMissingData: true
          }
        },
        {
          view: this.sharedComponents.tooltip,
          options: {
            formatValue: function (value) {
              return this.formatDuration(value, 4);
            }
          }
        },
        { view: this.sharedComponents.hover }
      ];
    }, 

    prepareGraphArea: function () {

      var graphWrapper = this.graphWrapper = $('<div class="graph-wrapper"></div>');
      graphWrapper.appendTo(this.$el);

      this.innerEl = $('<div class="inner"></div>');
      this.innerEl.appendTo(graphWrapper);
      
      var svg = this.svg = this.d3.select(graphWrapper[0]).append('svg');
      
      this.wrapper = svg.append('g')
        .classed('wrapper', true);
    }

  });

  return ResponseTimeGraph;
});
