define([
  'extensions/views/view',
  'common/views/visualisations/multi_stat_item/single_stat_item/headline',
  'common/views/visualisations/multi_stat_item/single_stat_item/delta',
  'common/views/visualisations/multi_stat_item/sparkline',
  'stache!common/templates/visualisations/multi_stat_item',
  'Mustache'
],
function (View, HeadlineItemView, DeltaItemView, SparklineView, template) {
  var MultiStatItemView = View.extend({

    template: template,
    templateContext: function() { 
      
      var currentDate = null, startDate = null, timePeriodValue = null, timePeriod = null;
      if (this.collection.first().get('values').length > 1) {
        currentDate = this.collection.first().get('values').last().get('_start_at');
        startDate = this.collection.first().get('values').first().get('_start_at');
        if (currentDate.diff(startDate, 'days') > 365) {
          timePeriodValue = 'year';
        } else if (currentDate.diff(startDate, 'days') > 31) { 
          timePeriodValue = 'month';
        } else { 
          timePeriodValue = 'day';
        }   
        timePeriod = currentDate.diff(startDate, timePeriodValue);   
        timePeriodValue += (timePeriod > 1) ? "s" : "";  
      }
   
      return _.extend(
        View.prototype.templateContext.apply(this, arguments),
        { 
          title: this.stat.title, 
          timePeriod: timePeriod, 
          timePeriodValue: timePeriodValue
        }
      );
    },
    
    views: {
      '.sparkline-graph': {
        view: SparklineView,
        options: function () {
          return {
            valueAttr: this.stat.attr
          };
        }
      },
      '.single-stat-headline': {
        view: HeadlineItemView,
        options: function () {
          return {
            stat: this.stat,
            valueAttr: this.stat.attr
          };
        }
      },
      '.single-stat-delta': {
        view: DeltaItemView,
        options: function () {
          return {
            stat: this.stat,
            collection: this.collection,
            valueAttr: this.stat.attr
          };
        }
      }
    }

  });
  return MultiStatItemView;
});