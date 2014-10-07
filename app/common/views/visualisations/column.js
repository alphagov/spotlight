define([
  'extensions/views/view',
  'common/views/visualisations/most-recent-number'
],
function (View, MostRecentNumberView) {
  var BarChartView = View.extend({

    maxBars: 10,

    initialize: function () {
      View.prototype.initialize.apply(this, arguments);

      this.pinCollection();
      this.addCollectionLabels();
    },

    pinCollection: function () {
      var valueAttr = this.collection.options.valueAttr;
      var groupedItem = this.collection.at(this.maxBars - 1);
      var itemToAddValue;
      var update;

      this.collection.each(function (element, index) {
        if (index >= this.maxBars) {
          itemToAddValue = this.collection.at(index).get(valueAttr);

          update = {};
          update[valueAttr] = groupedItem.get(valueAttr) + itemToAddValue;

          groupedItem.set(update);

        }
      }, this);

      var handlingTime = groupedItem.get('handling_time') + '+';
      groupedItem.set({'handling_time': handlingTime});

      this.collection.remove(this.collection.slice(this.maxBars, this.collection.length));
    },

    addCollectionLabels: function () {
      this.collection.models.forEach(function (model) {
        model.set('title', model.get('handling_time'));
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
