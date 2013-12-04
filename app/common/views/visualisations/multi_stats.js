define([
  'extensions/views/view',
  'stache!common/templates/visualisations/multi_stats',
  'Mustache'
],
function (View, template, Mustache) {
  var MultiStatsView = View.extend({

    template: template,
    
    getFormattedValue: function (stat) {
      var value = this.formatNumericLabel(this.collection.last().get(stat.attr));
      if (stat.format) {
        return Mustache.render(
          stat.format,
          { value: value }
        );
      }
      return value;
    },
    
    
    getChange: function (collection, attr) {
      var current = collection.last().get(attr);
      var previous = null, previousDate = null, trend = null, percentChange;
      if (collection.length > 1) {
        previous = collection.at(collection.length-2).get(attr);  
        if ((_.isNumber(previous)) && (previous !== 0)){ 
          previousDate = collection.at(collection.length-2).get('_start_at').format('MMM YYYY');  
          percentChange = this.formatPercentage((current-previous) / previous, 2, true);
          if (current > previous) {
            trend = 'increase';
          } else if (current < previous) { 
            trend = 'decrease';
          } else { 
            trend = 'no-change';
          }
        }
      }
      return {
        previousDate: previousDate, 
        percentChange: percentChange, 
        trend: trend
      };
    },

    templateContext: function () {

      var stats = [];
      if (this.collection.length) {
        stats = _.map(this.model.get('stats'), function (stat) {
          var change = this.getChange(this.collection, stat.attr);
          return _.extend({}, stat, {
            current: this.getFormattedValue(stat),
            date: this.collection.last().get('_start_at').format('MMM YYYY'),
            previousDate: change.previousDate,
            percentChange: change.percentChange,
            trend: change.trend
          });
        }, this);
      } 
      
      return _.extend(
        View.prototype.templateContext.apply(this, arguments),
        { statsWithValue: stats }
      );
    }
  });
  return MultiStatsView;
});