define([
  'extensions/collections/collection'
],
function (Collection) {
  
  var Timeseries = Collection.extend({
    
    /**
     * Keep sorted chronologically
     */
    comparator: function(model) {
      return +model.get('_start_at');
    }
    
  });
  
  return Timeseries;
});
