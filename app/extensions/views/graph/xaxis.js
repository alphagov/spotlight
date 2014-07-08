define([
  'd3loader!',
  './axis'
],
function (d3, Axis) {

  var XAxis = Axis.extend({

    d3: d3,

    classed: 'x-axis',
    position: 'bottom',
    orient: 'bottom',
    offsetY: 8,
    tickPadding: 6,
    render: function () {
      Axis.prototype.render.apply(this, arguments);
      if (this.useEllipses) {
        this.ellipsifyaxes();
      }
    },

    ellipsifyaxes: function () {
      // Manually add ellipses to x-axis labels if they are longer than the
      // space allocated for each data item.
      // We do this by hand with D3, because SVG text elements don't support
      // CSS ellipsis styles or line breaks.
      var labels = this.wrapper.selectAll('.x-axis .tick text');
      var svgWidth = $(this.wrapper[0]).parent().width();
      var blockWidth = svgWidth / this.collection.length;

      labels.each(function () {

        if (d3.select(this).attr('original-text') === null) {
          d3.select(this).attr('original-length-px', this.getComputedTextLength());
          d3.select(this).attr('original-text', d3.select(this).text());
        }

        var textLength = d3.select(this).attr('original-length-px');
        var text = d3.select(this).attr('original-text');

        if (textLength > (blockWidth)) {
          var percentTooLong = blockWidth / textLength;
          var lastChar = (text.length * percentTooLong) - 3;
          d3.select(this).text(text.substring(0, lastChar) + '…');
        } else {
          d3.select(this).text(text);
        }

      });
    },

    getScale: function () {
      return this.scales.x;
    },

    onChangeSelected: function (modelSelected, indexSelected) {
      var ticks = this.componentWrapper.selectAll('.tick');
      ticks.classed('selected', false);

      if (_.isNumber(indexSelected)) {
        d3.select(ticks[0][indexSelected]).classed('selected', true);
      }
    },

    ticks: function () {
      var period = this.graph.getPeriod();
      if (this.configs[period]) {
        return this.configs[period].ticks.call(this);
      }
    },

    tickFormat: function () {
      var period = this.graph.getPeriod();
      if (this.configs[period]) {
        return this.configs[period].tickFormat.call(this);
      }
    },

    configs: {
      hour: {
        ticks: function () {
          return [this.d3.time.hour.utc, 6];
        },
        tickFormat: function () {
          return _.bind(function (d) {
            var date = this.getMoment(d);
            if (date.hours() === 0) {
              return 'midnight';
            } else if (date.hours() === 12) {
              return 'midday';
            } else {
              return this.getMoment(d).format('ha');
            }
          }, this);
        }
      },
      day: {
        ticks: function () {
          return [this.d3.time.mondays.utc, 1];
        },
        tickFormat: function () {
          return _.bind(function (d) {
            return this.getMoment(d).format('D MMM');
          }, this);
        }
      },
      week: {
        ticks: function () {
          return [this.d3.time.mondays.utc, 1];
        },
        tickFormat: function () {
          return _.bind(function (d) {
            return this.getMoment(d).subtract('days', 1).format('D MMM');
          }, this);
        }
      },
      month: {
        ticks: function () {
          return [this.d3.time.month.utc, 1];
        },
        tickFormat: function () {
          return _.bind(function (d) {
            var val = this.getMoment(d).format('MMM');
            if (d.getMonth() === 0) {
              val += ' ' + this.getMoment(d).format('YYYY');
            }
            return val;
          }, this);
        }
      }
    }
  });

  return XAxis;
});
