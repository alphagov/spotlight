define([
  'extensions/collections/matrix',
  'common/collections/journey_series'
],
function (MatrixCollection, JourneySeriesCollection) {
  var JourneyCollection = MatrixCollection.extend({
    collections: [ JourneySeriesCollection ],

    getDataByTableFormat: function (valueAttr) {
      var options = this.options;

      if (options.axes) {
        var allTables = [],
          steps = options.axes.y;

        allTables.push(_.map(steps, function (item) {
          return item.label;
        }));

        allTables.push(_.map(this.models[0].attributes.values.models, function (model, i) {
          return model.get(options.axes.y[i].key || valueAttr);
        }));

        return allTables;
      }

      return MatrixCollection.prototype.getDataByTableFormat.apply(this, arguments);
    }
  });

  return JourneyCollection;
});
