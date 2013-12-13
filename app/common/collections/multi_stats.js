define([
  'extensions/collections/matrix'
],
function (MatrixCollection) {
  var MultiStatsCollection = MatrixCollection.extend({
    
    initialize: function (attrs, options) {
      options = options || {};
      this.stats = options.stats;
      this.period = options.period;
      MatrixCollection.prototype.initialize.apply(this, arguments);
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
      var latestIndexWithValues = -1;
      var data = _.map(response.data, function (item, index) {
        var res = {
          _start_at: item._start_at,
          _end_at: item._end_at
        };
        
        _.each(this.getAttrNames(), function (attr) {
          if (item[attr] && item[attr].length) {
            latestIndexWithValues = index;
            res[attr] = item[attr][0];
          }
        }, this);
        
        return res;
      }, this);

      data = data.slice(0, latestIndexWithValues + 1);
      
      return {
        id: 'multistats',
        title: 'MultiStats',
        values: data
      };
      
    }
    
  });
  return MultiStatsCollection;
});
