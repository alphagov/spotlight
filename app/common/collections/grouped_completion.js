define([
  'common/collections/completion_rate',
  'extensions/collections/collection'
], function (CompletionCollection, Collection) {
    return CompletionCollection.extend({

      parse: function (response) {

        var data = response.data;

        var groups = _.groupBy(data, function (d) {
          return d[this.options.category].trim();
        }, this);

        data = _.map(groups, function (group, key) {
          var o = {};
          o[this.options.category] = key;
          return _.extend({
            values: this.calculateCompletion(group)
          }, o);
        }, this);

        data = _.filter(data, function (d) {
          return d[this.options.category];
        }, this);

        return Collection.prototype.parse.call(this, { data: data });

      }

    });
  });