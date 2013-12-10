define([
  'extensions/views/view',
  'common/views/visualisations/single_stat/sparkline',
  'stache!common/templates/visualisations/single_stat',
  'Mustache'
],
function (View, SparklineView, template, Mustache) {
  var SingleStatsView = View.extend({

    tagName: 'li',
    template: template,
    views: {
      '.sparkline-graph': {
        view: SparklineView,
        options: function () {
          return {
            valueAttr: this.stat.attr
          };
        }
      }
    },
    
    templateContext: function () {
    

      var stats = [];
      var change = this.getChange(this.collection, this.stat.attr);
      var start_date = this.collection.first().get('values').first().get('_start_at');
      var current_date = this.collection.first().get('values').last().get('_start_at');
      var extendedStat = _.extend(this.stat, {
         current: this.getFormattedValue(this.collection, this.stat),
         date: current_date.format('MMM YYYY'), 
         previousDate: change.previousDate,
         percentChange: change.percentChange,
         trend: change.trend
       });
       extendedStat.hasValue = (extendedStat.current != null);
       
       if (current_date.diff(start_date, 'days') > 730) {
         extendedStat.timePeriodValue = 'years';
       } else if (current_date.diff(start_date, 'days') > 60) { 
         extendedStat.timePeriodValue = 'months';
       } else { 
         extendedStat.timePeriodValue = 'days';
       }
       extendedStat.timePeriod = current_date.diff(start_date, extendedStat.timePeriodValue);    
      
      return _.extend(
        View.prototype.templateContext.apply(this, arguments),
        extendedStat
      );
    },
    
    getFormattedValue: function (collection, stat) {
      
      var value = collection.first().get('values').last().get(stat.attr);
      if (value == null) {
        return null;
      }
      value = this.formatNumericLabel(value);
      if (stat.format) {
        return Mustache.render(
          stat.format,
          { value: value }
        );
      }
      return value;
    },
    
    getChange: function (collection, attr) {
      
      var current = collection.first().get('values').last().get(attr);
      var previous = null, previousDate = null, trend = null, percentChange;
      var collection_length = collection.first().get('values').length;
      var numMonths = 13; // TODO: Make length of comparison configurable. 
      if (collection_length > 1) {
        previous = collection.first().get('values').at(collection_length-numMonths).get(attr);  
        if (_.isNumber(current) &&_.isNumber(previous) && (previous !== 0)){
          previousDate = collection.first().get('values').at(collection_length-numMonths).get('_start_at').format('MMM YYYY');  
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
    }

  });
  return SingleStatsView;
});