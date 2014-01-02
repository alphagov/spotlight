define([
  'extensions/views/single_stat'
],
function (SingleStatView) {
  var NumberView = SingleStatView.extend({

    changeOnSelected: true,
    labelPrefix: '',

    formatValue: function(value) {
      return this.formatNumericLabel(value);
    },

    getValue: function () {
      return this.formatValue(this.collection.at(0).get(this.valueAttr));
    },

    getLabel: function () {
      var weeks = this.collection.at(0).get('weeks'),
          unavailableWeeks = weeks.total - weeks.available,
          label = [
            this.labelPrefix,
            'last',
            weeks.total,
            this.pluralise('week', weeks.total)
          ];

      if (unavailableWeeks > 0) {
        label = label.concat([
          "<span class='unavailable'>(" + unavailableWeeks,
          this.pluralise('week', unavailableWeeks),
          "unavailable)</span>"
        ]);
      }

      return label.join(' ');
    },

    getValueSelected: function (selection) {
      return this.formatValue(selection.selectedModel.get(this.selectionValueAttr));
    },

    getLabelSelected: function (selection) {
      return this.formatPeriod(selection.selectedModel, 'week');
    }
  });

  return NumberView;
});
