define([
  'extensions/collections/collection'
],
function (Collection) {

  return Collection.extend({
    initialize: function (models, options) {
      if(options !== undefined){
        options.flattenEverything = false;
      }
      return Collection.prototype.initialize.apply(this, arguments);
    },

    parse: function () {
      var data = Collection.prototype.parse.apply(this, arguments);
      var lines = this.options.axes.y;
      var hasOther = _.findWhere(lines, { groupId: 'other' });

      if (this.options.groupMapping) {
        _.each(this.options.groupMapping, function (to, from) {
          from = new RegExp(from + ':' + this.valueAttr);
          _.each(data, function (model) {
            var toAttr = to + ':' + this.valueAttr;
            var sum = 0;

            _.each(model, function (val, key) {
              if (key.match(from)) {
                if (val) {
                  sum += val;
                }
                delete model[key];
              }
            });

            if (model[toAttr] === undefined) {
              model[toAttr] = 0;
            }
            model[toAttr] += sum;

          }, this);
        }, this);
      }

      _.each(data, function (model) {
        var total = null,
          other = null;

        _.each(model, function (val, key) {
          var index = key.indexOf(this.valueAttr);
          if (index > 1 && model[key]) {
            // get the prefix value
            var group = key.replace(':' + this.valueAttr, '');
            var axis = _.findWhere(lines, { groupId: group });
            if (axis || hasOther) {
              total += model[key];
            }
            if (!axis) {
              other += model[key];
              delete model[key];
            }
          }
        }, this);

        model['other:' + this.valueAttr] = other;
        model['total:' + this.valueAttr] = total;

        _.each(lines, function (line) {
          var prop = (line.key || line.groupId) + ':' + this.valueAttr;
          var value = model[prop];
          if (value === undefined) {
            value = model[prop] = null;
          }

          if (model['total:' + this.valueAttr]) {
            model[prop + ':percent'] = value / model['total:' + this.valueAttr];
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
