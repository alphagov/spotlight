define([
  'extensions/collections/collection'
],
function (Collection) {

  var Timeseries = Collection.extend({

    /**
     * Keep sorted chronologically
     */
    comparator: function (model) {
      var startAt = model.get('_start_at');

      return +((startAt !== undefined) ? startAt : model.get('_timestamp'));
    }

  });

  return Timeseries;
});
