define([
  'extensions/collections/collection'
],
function (Collection) {

  return Collection.extend({
    queryParams: function () {
      return {
        collect: this.options.valueAttr,
        period: this.options.period,
        start_at: this.options.startAt,
        end_at: this.options.endAt,
        group_by: this.options.category,
        filter_by: this.options.filterBy ? this.options.filterBy : [],
        duration: this.options.duration ? this.options.duration : null
      };
    },

    parse: function () {
      var data = Collection.prototype.parse.apply(this, arguments);
      var lines = this.options.axes.y;

      _.each(data, function (model) {
        model['total:' + this.valueAttr] = _.reduce(lines, function (sum, line) {
          var prop = line.key || line.categoryId;
          if (prop !== 'total') {
            sum += model[prop + ':' + this.valueAttr];
          }
          return sum;
        }, 0, this);
        _.each(lines, function (line) {
          var prop = (line.key || line.categoryId) + ':' + this.valueAttr;
          model[prop + ':' + 'percent'] = model[prop] / model['total:' + this.valueAttr];
        }, this);
      }, this);

      return data;
    }

  });

});
