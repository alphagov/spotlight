define([
  'extensions/views/view',
  'common/views/visualisations/most-recent-number'
],
function (View, MostRecentNumberView) {
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
        }
      };

    }

  });

  return BarChartView;
});
