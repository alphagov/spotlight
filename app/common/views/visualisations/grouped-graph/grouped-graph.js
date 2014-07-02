define([
  'extensions/views/graph/graph',
  'extensions/views/graph/linelabel'
],
function (Graph, LineLabel) {
  return Graph.extend({

    LineLabel: LineLabel,

    components: function () {
      var yAxisOptions, components;

      if (this.isOneHundredPercent()) {
        yAxisOptions = {
          tickFormat: function () {
            return function (d) {
              return d * 100 + '%';
            };
          }
        };
      }

      components = {
        axis: { view: this.sharedComponents.xaxis },
        yaxis: {
          view: this.sharedComponents.yaxis,
          options: yAxisOptions
        },
        lines: {
          view: this.GroupClass,
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
        components.linelabel = {
          view: this.LineLabel
        };
      }

      return components;
    },

    isOneHundredPercent: function () {
      return this.model && this.model.get('one-hundred-percent');
    },

    calcYScale: function () {
      var yScale = Graph.prototype.calcYScale.apply(this, arguments);
      if (this.isOneHundredPercent()) {
        yScale.domain([0, 1]);
      }
      return yScale;
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
    }

  });

});
