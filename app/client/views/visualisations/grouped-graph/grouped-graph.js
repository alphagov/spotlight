define([
  'client/views/graph/graph',
  'client/views/graph/linelabel'
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

    hasTotalLine: function () {
      return _.any(this.model.get('axes').y, function (line) {
        return line.groupId === 'total';
      });
    },

    calcYScale: function () {
      var yScale = Graph.prototype.calcYScale.apply(this, arguments);
      if (this.isOneHundredPercent()) {
        if (this.maxValue() < 0.5) {
          yScale.domain([0, 0.5]);
        } else {
          yScale.domain([0, 1]);
        }
      }
      return yScale;
    },

    getLines: function () {
      return _.map(this.model.get('axes').y, function (line) {
        line = _.clone(line);
        var key = (line.groupId + ':' + this.valueAttr);
        if (line.timeshift) {
          key = 'timeshift' + line.timeshift + ':' + key;
        }
        line.key = line.key || key;
        if (this.isOneHundredPercent()) {
          line.key += ':percent';
        }
        return line;
      }, this);
    },

    hasData: function () {
      return _.any(this.getLines(), function (line) {
        return this.collection.defined(line.key).length > 0;
      }, this);
    },

    hasTotalLabel: function () {
      return _.isUndefined(this.showTotalLabel) ? true : this.showTotalLabel;
    }

  });

});
