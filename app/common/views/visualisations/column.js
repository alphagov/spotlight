define([
  'extensions/views/view',
  'common/views/visualisations/most-recent-number'
],
function (View, MostRecentNumberView) {
  var BarChartView = View.extend({

    maxBars: 10,

    initialize: function () {
      View.prototype.initialize.apply(this, arguments);

      var xAxisKey = this.collection.options.axes.x.key;

      this.pinCollection(xAxisKey);
      this.addCollectionLabels(xAxisKey);
    },

    pinCollection: function (xAxisKey) {
      if (this.maxBars < this.collection.length) {
        var valueAttr = this.collection.options.valueAttr;
        var groupedItem = this.collection.at(this.maxBars - 1);
        var itemToAddValue;

        this.collection.each(function (element, index) {
          if (index >= this.maxBars) {
            itemToAddValue = this.collection.at(index).get(valueAttr);

            groupedItem.set(valueAttr, groupedItem.get(valueAttr) + itemToAddValue);
          }
        }, this);

        groupedItem.set(xAxisKey, groupedItem.get(xAxisKey) + '+');

        this.collection.remove(this.collection.slice(this.maxBars, this.collection.length));
      }
    },

    addCollectionLabels: function (xAxisKey) {
      this.collection.models.forEach(function (model) {
        model.set('title', model.get(xAxisKey).toString());
      });
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
