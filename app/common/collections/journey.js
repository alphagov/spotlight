define([
  'extensions/collections/matrix',
  'common/collections/journey_series'
],
function (MatrixCollection, JourneySeriesCollection) {
  var JourneyCollection = MatrixCollection.extend({
    collections: [ JourneySeriesCollection ],

    getDataByTableFormat: function () {
      var options = this.options;

      if (options.axisLabels && options.steps) {
        var allTables = [],
          steps = options.steps;

        allTables.push(_.map(steps, function (item) {
          return item[options.axisLabels.x.key];
        }));

        allTables.push(_.map(this.models[0].attributes.values.models, function (model) {
          return model.get(options.axisLabels.y.key);
        }));

        return allTables;
      }

      return MatrixCollection.prototype.getDataByTableFormat.apply(this, arguments);
    }
  });

  return JourneyCollection;
});
