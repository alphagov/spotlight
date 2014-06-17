define([
  'extensions/views/view',
  'common/views/visualisations/bar-chart/bar-chart',
  'common/views/visualisations/bar-chart/most-recent-number'
],
function (View, BarChart, MostRecentNumberView) {
  var BarChartView = View.extend({

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
