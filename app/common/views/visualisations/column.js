define([
  'extensions/views/view',
  'common/views/visualisations/most-recent-number'
],
function (View, MostRecentNumberView) {
  var ColumnView = View.extend({

    maxBars: 10,

    initialize: function () {
      View.prototype.initialize.apply(this, arguments);

      this.pinTo = this.collection.options.pinTo;
      this.pinCollection();
    },

    pinCollection: function () {
      var isPinned = false;
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

        this.collection.remove(this.collection.slice(this.maxBars, this.collection.length));
        isPinned = true;
      }
      this.addCollectionLabels(isPinned);
    },

    addCollectionLabels: function (isPinned) {
      var lastItem = this.collection.last();

      this.collection.models.forEach(function (model) {
        model.set('title', model.get(this.pinTo).toString());
      }, this);

      if (isPinned) {
        lastItem.set('title', lastItem.get('title') + '+');
      }
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

  return ColumnView;
});
