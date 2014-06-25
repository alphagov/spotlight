define([
  'extensions/collections/collection'
],
function (Collection) {
  return Collection.extend({

    parse: function () {
      var data = Collection.prototype.parse.apply(this, arguments);

      // limit the number of data point to the last <duration> <period>s
      var latestDate = _.max(data, function (model) { return model._timestamp; }, this);
      var timestamp = latestDate._timestamp;
      data = _.filter(data, function (model) {
        return timestamp.diff(model._timestamp, this.options.period) < this.options.duration;
      }, this);

      data = data.sort(function (a, b) {
        return (a._timestamp < b._timestamp) ? -1 : 1;
      });

      return data;
    },

    isEmpty: function () {
      return this.length < 2;
    }

  });

});