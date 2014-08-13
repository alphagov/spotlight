define([
  'common/views/visualisations/bar_chart_with_number',
  'client/views/visualisations/bar-chart/bar-chart'
],
function (View, BarChart) {
  var BarChartView = View.extend({

    views: function () {
      var valueAttr = this.collection.options.valueAttr;
      var formatOptions = this.collection.options.format;
      var views = View.prototype.views.apply(this, arguments);
      return _.extend(views, {
        '.bar': {
          view: BarChart,
          options: {
            valueAttr: valueAttr,
            axisPeriod: this.collection.options.axisPeriod,
            formatOptions: formatOptions
          }
        }
      });

    }

  });

  return BarChartView;
});
