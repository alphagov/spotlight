define([
  'common/collections/list'
],
function (ListCollection) {
  return ListCollection.extend({

    parse: function () {
      var data = ListCollection.prototype.parse.apply(this, arguments);

      // limit the number of data point to the last <duration> <period>s
      var latestDate = _.max(data.values, function (model) { return model._timestamp; });
      var timestamp = this.moment(latestDate._timestamp);

      data.values = _.filter(data.values, function (model) {
        return timestamp.diff(model._timestamp, this.options.period) <= this.options.duration;
      }, this);

      return data;
    },

    isEmpty: function () {
      return ListCollection.prototype.isEmpty.call(this) || this.first().get('values').length < 2;
    }

  });

});