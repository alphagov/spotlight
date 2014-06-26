define([
  'extensions/collections/collection'
],
function (Collection) {

  var BarChartWithNumberCollection = Collection.extend({

    initialize: function (models, options) {
      this.valueAttr = options.valueAttr || 'uniqueEvents:sum';
      this.axisPeriod = options.axisPeriod || 'week';

      Collection.prototype.initialize.apply(this, arguments);
    },

    parse: function () {
      var data = Collection.prototype.parse.apply(this, arguments);
      if (data.length > this.constructor.MAX_LENGTH) {
        data = data.slice(-this.constructor.MAX_LENGTH);
      }

      _.each(data, function (d) {
        if (!d._start_at) {
          d._start_at = d['_' + this.axisPeriod + '_start_at'];
        }
      }, this);
      return data;
    }

  }, { 'MAX_LENGTH': 6});

  return BarChartWithNumberCollection;
});
