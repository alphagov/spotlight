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

    getValue: function () {
      var model = this.collection.first().get('values').last();
      return this.getFormattedValue(model, this.stat);
    },

    getLabel: function () {
      var currentDate = this.collection.first().get('values').last();
      if (typeof currentDate !== 'undefined') {
        currentDate = currentDate.get(this.timeAttr).format('MMM YYYY');
      } else {
        currentDate = '';
      }
      return currentDate;
    },

    getValueSelected: function (selected) {
      return this.getFormattedValue(selected.selectedModel, this.stat);
    },

    getLabelSelected: function (selected) {
      var currentDate = selected.selectedModel;
      if (typeof currentDate !== 'undefined') {
        currentDate = currentDate.get(this.timeAttr).format('MMM YYYY');
      } else {
        currentDate = '';
      }
      return currentDate;
    },

    getFormattedValue: function (model, stat) {

      var value = null;
      if (typeof model !== 'undefined') {
        value = model.get(stat.attr);
      }
      if (value === null) {
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