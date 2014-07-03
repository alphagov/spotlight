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

      if (this.options.groupMapping) {
        _.each(data, function (model) {
          _.each(this.options.groupMapping, function (to, from) {
            if (model[from + ':' + this.valueAttr]) {
              model[to + ':' + this.valueAttr] += model[from + ':' + this.valueAttr];
            }
            delete model[from + ':' + this.valueAttr];
          }, this);
        }, this);
      }

      _.each(data, function (model) {
        model['total:' + this.valueAttr] = _.reduce(lines, function (sum, line) {
          var prop = line.key || line.groupId;
          var value = model[prop + ':' + this.valueAttr];
          if (value === undefined) {
            value = model[prop + ':' + this.valueAttr] = null;
          }
          if (prop !== 'total' && value !== null) {
            sum += value;
          }
          return sum;
        }, null, this);
        _.each(lines, function (line) {
          var prop = (line.key || line.groupId) + ':' + this.valueAttr;
          if (model['total:' + this.valueAttr]) {
            model[prop + ':percent'] = model[prop] / model['total:' + this.valueAttr];
          } else {
            model[prop + ':percent'] = null;
          }
        }, this);
      }, this);

      return data;
    },

    getYAxes: function () {
      var axes = Collection.prototype.getYAxes.apply(this, arguments);
      _.each(this.options.groupMapping, function (to, from) {
        axes.push({ groupId: from });
      });
      return axes;
    }

  });

});
