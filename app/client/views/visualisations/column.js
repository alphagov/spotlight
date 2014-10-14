define([
  'common/views/visualisations/column',
  'client/views/visualisations/bar-chart/bar-chart'
],
function (View, BarChart) {
  var ColumnView = View.extend({

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

  return ColumnView;
});
