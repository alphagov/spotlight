define([
  'common/views/visualisations/applications',
  'client/views/visualisations/bar-chart/simple-bar-chart'
],
function (View, BarChart) {
  var ApplicationsView = View.extend({

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

  return ApplicationsView;
});
