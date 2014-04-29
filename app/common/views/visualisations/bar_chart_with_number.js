define([
  'stache!common/templates/visualisations/bar_chart_with_number',
  'extensions/views/view',
  'common/views/visualisations/bar-chart/bar-chart',
  'common/views/visualisations/bar-chart/most-recent-number',
  'common/views/visualisations/volumetrics/number',
  'common/views/visualisations/volumetrics/submissions-graph'
],
function (template, View, BarChart, MostRecentNumberView) {
  var BarChartView = View.extend({
    template: template,

    views: function () {
      var valueAttr = this.collection.options.valueAttr;
      return {
        '#most-recent-number': {
          view: MostRecentNumberView,
          options: {
            valueAttr: valueAttr,
            formatType: this.collection.options.format.type
          }
        },
        '#bar': {
          view: BarChart,
          options: {
            valueAttr: valueAttr,
            axisPeriod: this.collection.options.axisPeriod,
            formatType: this.collection.options.format.type
          }
        }
      };

    }

  });

  return BarChartView;
});
