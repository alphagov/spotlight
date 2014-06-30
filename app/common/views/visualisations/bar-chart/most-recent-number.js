define([
  'extensions/views/single_stat'
],
function (SingleStatView) {
  var MostRecentNumberView = SingleStatView.extend({

    changeOnSelected: true,

    getValue: function () {
      var firstMatch = _.last(this.collection.defined(this.valueAttr));

      var value = firstMatch ? firstMatch.get(this.valueAttr) : null;
      return this.format(value, this.formatOptions);
    },

    getLabel: function () {
      var firstMatch = _.last(this.collection.defined(this.valueAttr));
      return firstMatch ? this.formatPeriod(firstMatch, this.getPeriod()) : '';
    },

    getValueSelected: function (selection) {
      var val;
      if (selection.selectedModel) {
        val = selection.selectedModel.get(this.valueAttr);
      } else {
        val = null;
      }
      return this.format(val, this.formatOptions);
    },

    getLabelSelected: function (selection) {
      if (selection.selectedModel) {
        return this.formatPeriod(selection.selectedModel, this.getPeriod());
      } else {
        return '';
      }
    },

    getPeriod: function () {
      return this.model.get('axis-period') || 'week';
    }
  });

  return MostRecentNumberView;
});
