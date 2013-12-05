define([
  'extensions/collections/collection'
],
function (Collection) {
  var MultiStatsCollection = Collection.extend({
    
    initialize: function (attrs, options) {
      options = options || {};
      this.stats = options.stats;
      this.period = options.period;
      Collection.prototype.initialize.apply(this, arguments);
    },
    
    getAttrNames: function() {
      return _.map(this.stats, function (stat) {
       return stat.attr; 
      });
    },
    
    queryParams: function () {
      return {
        period: this.period,
        collect: this.getAttrNames()
      };
    },

    parse: function (response) {
      return _.map(response.data, function (item) {
        var res = {
          _start_at: item._start_at,
          _end_at: item._end_at
        };
        
        _.each(this.getAttrNames(), function (attr) {
          res[attr] = item[attr][0];
        }, this);
        
        return res;
      }, this);
    }
    
  });
  return MultiStatsCollection;
});
