define([
  'extensions/views/view',
  'common/views/visualisations/bar-chart/bar-chart',
  'common/views/visualisations/bar-chart/most-recent-number'
],
function (View, BarChart, MostRecentNumberView) {
  var BarChartView = View.extend({

    maxBars: 6,

    render: function () {
      while (this.collection.length > this.maxBars) {
        this.collection.shift();
      }
      View.prototype.render.apply(this, arguments);
    },

    views: function () {
      var valueAttr = this.collection.options.valueAttr;
      var formatOptions = this.collection.options.format;
      return {
        '.most-recent-number': {
          view: MostRecentNumberView,
          options: {
            valueAttr: valueAttr,
            formatOptions: _.extend({}, formatOptions, { abbr: true })
          }
        },
        '.bar': {
          view: BarChart,
          options: {
            valueAttr: valueAttr,
            axisPeriod: this.collection.options.axisPeriod,
            formatOptions: formatOptions
          }
        }
      };

    }

  });

  return BarChartView;
});
