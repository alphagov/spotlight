define([
  'extensions/collections/matrix',
  'extensions/collections/collection',
  'extensions/models/group'
],
function (MatrixCollection, Collection, Group) {

  var BarChartWithNumberCollection = MatrixCollection.extend({

    model: Group,

    initialize: function (models, options) {
      this.valueAttr = options.valueAttr || 'uniqueEvents:sum';
      this.axisPeriod = options.axisPeriod || 'week';

      MatrixCollection.prototype.initialize.apply(this, arguments);
    },

    parse: function(response) {

      var MAX_LENGTH = 5;
      if (response.data.length > MAX_LENGTH) {
        response.data = response.data.slice(-MAX_LENGTH);
      }

      _.each(response.data, function(d) {
        if (!d._start_at) {
          d._start_at = d['_' + this.axisPeriod + '_start_at'];
        }
      }, this);

      var collectionAttrs = {
        values: new Collection(response.data).models
      };

      return collectionAttrs;
    }

  });

  return BarChartWithNumberCollection;
});
