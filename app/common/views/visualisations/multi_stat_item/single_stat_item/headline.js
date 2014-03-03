define([
  'extensions/views/single_stat',
  'Mustache'
],
function (SingleStatView, Mustache) {
  var HeadlineItemView = SingleStatView.extend({
    
    changeOnSelected: true,

    initialize: function (options) {
      SingleStatView.prototype.initialize.apply(this, arguments);

      this.timeAttr = options.timeAttr || '_start_at';
    },
    
    getValue: function() { 
      var model = this.collection.first().get('values').last();
      return this.getFormattedValue(model, this.stat);
    },
    
    getLabel: function() { 
      var current_date = this.collection.first().get('values').last();
      if (typeof current_date !== 'undefined') {
        current_date = current_date.get(this.timeAttr).format('MMM YYYY');
      } else { 
        current_date = '';
      }
      return current_date;
    },
    
    getValueSelected: function(selected) {
      return this.getFormattedValue(selected.selectedModel, this.stat);
    },
    
    getLabelSelected: function(selected) {
      var current_date = selected.selectedModel;
      if (typeof current_date !== 'undefined') {
        current_date = current_date.get(this.timeAttr).format('MMM YYYY');
      } else { 
        current_date = '';
      }
      return current_date;
    },
    
    getFormattedValue: function (model, stat) {
      
      var value = null;
      if (typeof model !== 'undefined') {
        value = model.get(stat.attr);
      }
      if (value == null) {
        return null;
      }
      if (this.isPercent) {
        value = this.formatPercentage(value);
      } else {
        value = this.formatNumericLabel(value);
      }
      if (stat.format) {
        return Mustache.render(
          stat.format,
          { value: value }
        );
      }
      return value;
    }

  });
  return HeadlineItemView;
});