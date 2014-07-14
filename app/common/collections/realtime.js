define([
  'extensions/collections/collection'
],
function (Collection) {
  return Collection.extend({

    comparator: '_timestamp',

    parse: function () {
      var data = Collection.prototype.parse.apply(this, arguments);

      // limit the number of data point to the last <duration> <period>s
      var latestDate = _.max(data, function (model) { return model._timestamp; }, this);
      var timestamp = latestDate._timestamp;
      data = _.filter(data, function (model) {
        return timestamp.diff(model._timestamp, 'hours') <= 24;
      }, this);

      return data;
    },

    isEmpty: function () {
      return this.length < 2;
    }

  });

});
