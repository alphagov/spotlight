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
      var model;

      if (this.collection.first()) {
        model = this.collection.first().get('values').last();
      } else {
        model = null;
      }

      return this.getFormattedValue(model, this.stat);
    },

    getLabel: function () {
      var currentDate;

      if (this.collection.first()) {
        currentDate = this.collection.first().get('values').last();
      } else {
        currentDate = null;
      }

      if (typeof currentDate !== 'undefined' && currentDate !== null) {
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
      if (typeof model !== 'undefined' && model !== null) {
        value = model.get(stat.attr);
      }
      if (value === null) {
        return null;
      }
      if (this.isPercent) {
        value = this.format(value, 'percent');
      } else {
        value = this.format(value, { type: 'number', magnitude: true, pad: true });
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
